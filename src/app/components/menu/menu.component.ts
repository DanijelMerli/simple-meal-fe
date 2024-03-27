import { Component, OnInit, ViewChild, HostListener  } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import {WeeklyMenuDTO, DailyMenuDTO } from '../../dtos/MenuDTO';
import {MatTableDataSource} from "@angular/material/table";
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  displayedColumns: string[] = ['date', 'regularMeal', 'fitMeal', 'extra-soup', 'extra-dessert'];
  dataSource: MatTableDataSource<DailyMenuDTO> = new MatTableDataSource<DailyMenuDTO>();
  totalElements: number = 0;
  menu: DailyMenuDTO[] = [];
  today: Date = new Date();
  screenWidth!: number;
  cards: boolean = false;
  startDateStr!: string;
  startDate!: Date;
  endDateStr!: string;
  endDate!: Date;
  selectForm!: FormGroup;
  dates: any[] = ['None'];
  cardsCurrentDate: string = "";
  cardsCurrentMeals: any;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: MenuService, private snackBar: MatSnackBar) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth > 750) {
      this.cards = false;
    } else {
      this.cards = true;
    }
  }

  ngOnInit(): void {
    this.getAll();
    this.selectForm = new FormGroup( {
      dateMenu: new FormControl('', Validators.required),
    })
    this.selectForm.get('dateMenu')?.valueChanges.subscribe(selectedValue => {
      this.selectChange(selectedValue);
    });
    this.screenWidth = window.innerWidth;
  }

  async getAll(): Promise<void> {
    try {
      let result = await this.service.getMenu().toPromise();
      if (result != undefined) {
        let dailyMenuList = result.dailyMenu;
        dailyMenuList.sort((a: DailyMenuDTO, b: DailyMenuDTO) => this.convertDate(a.dateMenu).getTime() - this.convertDate(b.dateMenu).getTime());
        this.menu = dailyMenuList;
        this.startDateStr = result.startDate;
        this.startDate = this.convertDate(this.startDateStr);
        this.endDate = this.calculateEndDate(this.startDate);
        this.endDateStr = this.formatDate(this.endDate);
      } else {
        this.menu = [];
      }
      if (!this.cards) {
        this.totalElements = this.menu.length;
        this.dataSource = new MatTableDataSource<DailyMenuDTO>(this.menu);
        this.dataSource.sort = this.sort;
      } else {
        this.menu.forEach(element => {
          this.dates.push(element.dateMenu);
        });
      }
    }
   catch (error) {
    this.snackBar.open('An error occurred', undefined, {
      duration: 2000,
    });
  }
  }

  order(obj: WeeklyMenuDTO) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth > 750) {
      this.cards = false;
      this.totalElements = this.menu.length;
      this.dataSource = new MatTableDataSource<DailyMenuDTO>(this.menu);
      this.dataSource.sort = this.sort;
    } else {
      this.cards = true;
      this.dates.splice(0);
      this.menu.forEach(element => {
        this.dates.push(element.dateMenu);
      });
    }
  }

  convertDate(dateStr: string) {
    let parts = dateStr.split('.');
    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10) - 1;
    let year = parseInt(parts[2], 10);

    let date = new Date(year, month, day);
    return date;
  }

  calculateEndDate(date: Date) {
    date.setDate(date.getDate() + 6);
    return date;
  }

  formatDate(date: Date) {
      let day = date.getDate();
      let dayStr = day.toString();
      let month = date.getMonth() + 1;
      let monthStr = month.toString();
      let year = date.getFullYear();

      if (day < 10) {
        dayStr = '0' + day.toString();
      }
      if (month < 10) {
        monthStr = '0' + month;
      }
  
      return dayStr + '.' + monthStr + '.' + year + '.';
  }

  selectChange(selectedValue: any) {
    if (selectedValue == 'None') {
      this.cardsCurrentDate = "";
    } else {
      this.cardsCurrentDate = selectedValue;
      this.menu.forEach(daily => {
        if (daily.dateMenu == selectedValue) {
          this.cardsCurrentMeals = daily;
        }
      });
    }
  }
}