import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { MealService } from '../../services/meal.service';
import { ExtraDTO, FitMealDTO, RegularMealDTO, WeeklyMenuAdminDTO, DailyMenuAdminDTO, WeeklyMenuDTO, DailyMenuDTO } from '../../dtos/MenuDTO';
import {CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {provideNativeDateAdapter} from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-weekly-menu',
  templateUrl: './create-weekly-menu.component.html',
  styleUrl: './create-weekly-menu.component.css',
  providers: [provideNativeDateAdapter()],
})
export class CreateWeeklyMenuComponent implements OnInit {
  selectForm!: FormGroup;
  mealTypes: any[] = ["Regular", "Fit", "Soup", "Dessert"];
  selectedMealType: string = "";
  cardsCurrentMeals: any;
  regulars!: RegularMealDTO[];
  fits!: FitMealDTO[];
  soups!: ExtraDTO[];
  desserts!: ExtraDTO[];

  @ViewChild('regularList') regularList!: CdkDropList<RegularMealDTO>;
  @ViewChild('fitList') fitList!: CdkDropList<FitMealDTO>;
  @ViewChild('soupList') soupList!: CdkDropList<ExtraDTO>;
  @ViewChild('dessertList') dessertList!: CdkDropList<ExtraDTO>;


  selectedDate!: Date;

  mealTypeObj = [
    { key: 'regular', title: 'Regulars' },
    { key: 'fit', title: 'Fits' },
    { key: 'soup', title: 'Soups' },
    { key: 'dessert', title: 'Desserts' }
  ];

  days = ['Monday']; 
  dates!: string[];
  weekStart!: string;

  chosenMeals: { [day: string]: { [mealType: string]: any[] } } = {};

  picForm!: FormGroup;
  filePreview: string | ArrayBuffer | null = null;
  selectedFile!: File;

  currentMenu!: DailyMenuDTO[];
  currentMenuId!: number;

  action!: string;

  errors: { [day: string]: string } = {};

  constructor(private mealService : MealService, private route: ActivatedRoute, private menuService: MenuService, private snackBar: MatSnackBar) {
    let currentMenu;
    this.route.queryParams.subscribe(params => {
      let week = params['week'];
      this.action = params['action'];
      if (week == "this") {
        this.getDatesForRestOfWeek();
      } else {
        this.getDatesForNextWeek();
      }
    });

    this.days.forEach(day => {
      this.chosenMeals[day] = {};
      this.mealTypeObj.forEach(mealTypeObj => {
          this.chosenMeals[day][mealTypeObj.key] = [];
      });
    });

    if (this.action == 'edit') {
      currentMenu = this.getMenus().then(menuArray => {
          this.populateChosenMeals(menuArray);
      });
    }
  }

  ngOnInit(): void {
    this.selectForm = new FormGroup( {
      mealType: new FormControl('Regular', Validators.required),
      datePicker: new FormControl('', Validators.required),
    })
    this.selectForm.get('mealType')?.valueChanges.subscribe(selectedValue => {
      this.selectChange(selectedValue);
    });
    this.selectedMealType = 'Regular'
    this.getAll();
    this.picForm = new FormGroup({
      }
    );

    this.errors["Monday"] = "";
    this.errors["Tuesday"] = "";
    this.errors["Wednesday"] = "";
    this.errors["Thursday"] = "";
    this.errors["Friday"] = "";
  }

  selectChange(selectedValue: any) {
    this.selectedMealType = selectedValue;
  }


  async getAll(): Promise<void> {
    try {
      let result = await this.mealService.getMeals().toPromise();
      if (result != undefined) {
        this.regulars = result.regularMeals;
        this.fits = result.fitMeals;
        this.soups = result.extras.filter((m: { extraType: string }) => m.extraType === "SOUP");
        this.desserts = result.extras.filter((m: { extraType: string }) => m.extraType === "DESSERT");
      } else {
        console.log(":-(")
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  dropMeal(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const itemToMove = { ...event.previousContainer.data[event.previousIndex] };
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      event.previousContainer.data.splice(event.previousIndex, 0, itemToMove);
    }
  }

  dropBack(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      event.previousContainer.data.splice(event.previousIndex, 1);
    }
  }

  saveMenu() {
    this.errors["Monday"] = "";
    this.errors["Tuesday"] = "";
    this.errors["Wednesday"] = "";
    this.errors["Thursday"] = "";
    this.errors["Friday"] = "";
    let dailyMenus: DailyMenuAdminDTO[] = [];
    let hasErrors: boolean = false;
    for (let i = 0; i < this.days.length; i++) {
      let day = this.days[i];
      let date = this.dates[i];
      let meals = this.chosenMeals[day];
      let regular: RegularMealDTO = meals['regular']?.[meals['regular']?.length - 1];
      let fit: FitMealDTO = meals['fit']?.[meals['fit']?.length - 1];
      let soup: ExtraDTO = meals['soup']?.[meals['soup']?.length - 1];
      let dessert: ExtraDTO = meals['dessert']?.[meals['dessert']?.length - 1];
      if ((regular && !fit) || (!regular && fit)) {
        this.errors[day] += "Regular and fit meals always go together! ";
        hasErrors = true;
      }

      if ((!regular || !fit) && (soup || dessert)) {
        this.errors[day] += "Extras have to have regular and fit meals with them! ";
        hasErrors = true;
      } 

      if (hasErrors) {
        this.snackBar.open('Please look for any possible errors that occurred', undefined, {
          duration: 5000,
        });
        hasErrors = false;
        return;
      } 
      
      console.log("validiran");

      let newDailyMenu: DailyMenuAdminDTO = {
        dateMenu: date,
        regularMealId: regular?.id,
        fitMealId: fit?.id,
        soupId: soup?.id,
        dessertId: dessert?.id
      }
      dailyMenus.push(newDailyMenu);
    }

    let newWeeklyMenu: WeeklyMenuAdminDTO = {
      dailyMenus: dailyMenus,
      startDate: this.weekStart
    }

    console.log(newWeeklyMenu);
    if (this.action == 'create') {
      this.menuService.saveWeeklyMenu(newWeeklyMenu).subscribe({
        next: (result: any) => {
          console.log(result);
          console.log(result.id);
          this.uploadFile(result.id);
        },
        error: (error: any) => {
          console.error(error)
        }
      });
    } else if (this.action == 'edit') {
      this.menuService.updateWeeklyMenu(newWeeklyMenu).subscribe({
        next: (result: any) => {
          this.uploadFile(this.currentMenuId);
        },
        error: (error: any) => {
          console.error(error)
        }
      });
    }
  }

  getDatesForRestOfWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    let dates = [];
    let allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let datesStr = [];

    const startOfWeek = new Date(today); 
    startOfWeek.setDate(today.getDate() - dayOfWeek); // Sunday

    // (from tomorrow to Friday)
    for (let i = dayOfWeek + 1; i <= 5; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const formattedDate = `${this.addZeros(date.getDate())}-${this.addZeros(date.getMonth() + 1)}-${date.getFullYear()}`;
        dates.push(formattedDate);
        datesStr.push(allDays[i]);
    }

    startOfWeek.setDate(today.getDate() - dayOfWeek + 1); // Monday
    this.weekStart = `${this.addZeros(startOfWeek.getDate())}-${this.addZeros(startOfWeek.getMonth() + 1)}-${startOfWeek.getFullYear()}`;
    this.days = datesStr;
    this.dates = dates;
  }

  getDatesForNextWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    let dates = [];
    let allDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let datesStr = [];

    const startOfWeek = new Date(today); 
    startOfWeek.setDate(today.getDate() - dayOfWeek + 7); // Next Sunday
    
    // (from Monday to Friday)
    for (let i = 1; i <= 5; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const formattedDate = `${this.addZeros(date.getDate())}-${this.addZeros(date.getMonth() + 1)}-${date.getFullYear()}`;
        dates.push(formattedDate);
        datesStr.push(allDays[i]);
    }

    startOfWeek.setDate(today.getDate() - dayOfWeek + 7 + 1); // Next Monday
    this.weekStart = `${this.addZeros(startOfWeek.getDate())}-${this.addZeros(startOfWeek.getMonth() + 1)}-${startOfWeek.getFullYear()}`;
    this.days = datesStr;
    this.dates = dates;
  }

  addZeros(num: any) {
    return num.toString().padStart(2, '0');
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewFile();
  }

  previewFile() {
    if (this.selectedFile) {
      const reader = new FileReader();
  
      reader.onload = () => {
        this.filePreview = reader.result;
      };
  
      reader.readAsDataURL(this.selectedFile);
    }
  }

  private async convertFileToByteArray(file: File): Promise<string> {
    return new Promise<string> ((resolve,reject)=> {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString().replace(/^data:(.*,)?/, '') || '');
      reader.onerror = error => reject(error);
  })
  }

  uploadFile(id: number) {
    if (this.selectedFile) {
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile);
      this.menuService.uploadFile(formData, id).subscribe({
        next: (result: any) => {
          console.log(result)
        },
        error: (error: any) => {
          console.error(error)
        }
      });
    }
  }

  async getMenus(): Promise<WeeklyMenuDTO> {
    let week;
    this.route.queryParams.subscribe(params => {
      week = params['week']
    });
    let result;
    if (week == "next") {
      result = await this.menuService.getNextMenu().toPromise();
    } else {
      result = await this.menuService.getMenu().toPromise();
    }
    this.currentMenu = result.dailyMenu;
    this.currentMenuId = result.idWeeklyMenu;
    return result;
  }

  populateChosenMeals(currentMenu: any) {
    let dailyMenus = currentMenu.dailyMenu;
    for (let i = this.days.length - 1; i >= 0; i--) {
      let date = this.dates[i].replaceAll('-', '.') + '.';
      let menu = dailyMenus.filter((m: { dateMenu: string }) => m.dateMenu === date)[0];
      this.mealTypeObj.forEach(mealType => {
        this.chosenMeals[this.days[i]][mealType.key].push(menu[mealType.key]);
      });
    }
  }
}

