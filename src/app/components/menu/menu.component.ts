import { Component, OnInit, ViewChild, HostListener  } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import {WeeklyMenuDTO, DailyMenuDTO } from '../../dtos/MenuDTO';
import {MatTableDataSource} from "@angular/material/table";
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

// import {MatPaginator, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  // displayedColumns: string[] = ['description', 'price', 'size', 'type', 'special' /*, 'order'*/];
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

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: MenuService) {
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
        // console.log(result);
        this.menu = result.dailyMenu;
        this.startDateStr = result.startDate;
        this.startDate = this.convertDate(this.startDateStr);
        this.endDate = this.calculateEndDate(this.startDate);
        this.endDateStr = this.formatDate(this.endDate);
      } else {
        console.log(":-(")
        this.menu = [];
      }
      if (!this.cards) {
        this.totalElements = this.menu.length;
        this.dataSource = new MatTableDataSource<DailyMenuDTO>(this.menu);
        // this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        // console.log(this.menu)
        this.menu.forEach(element => {
          // console.log(element.dateMenu);
          this.dates.push(element.dateMenu);
        });
        // this.convertDate(this.startDateStr);
      }
    }
   catch (error) {
    console.log(error)
  }
  }

  order(obj: WeeklyMenuDTO) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    // console.log(this.screenWidth)
    if (this.screenWidth > 750) {
      this.cards = false;
      this.totalElements = this.menu.length;
      this.dataSource = new MatTableDataSource<DailyMenuDTO>(this.menu);
      // this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.cards = true;
      this.menu.forEach(element => {
        // console.log(element.dateMenu);
        this.dates.push(element.dateMenu);
      });

      // this.convertDate(this.startDateStr);
    }
    // 750
  }

  convertDate(dateStr: string) {
    let parts = dateStr.split('.');
    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10) - 1;
    let year = parseInt(parts[2], 10);

    let date = new Date(year, month, day);
    return date;

    // console.log(this.formatDate(date));
    // this.startDateStr = this.formatDate(date);
    
    // date.setDate(date.getDate() + 6);

    // console.log(this.formatDate(date));
    // this.endDateStr = this.formatDate(date);
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
  
      return dayStr + '.' + monthStr + '.' + year;
  }

  selectChange(selectedValue: any) {
    // console.log(selectedValue);
    if (selectedValue == 'None') {
      this.cardsCurrentDate = "";
    } else {
      this.cardsCurrentDate = selectedValue;
      this.menu.forEach(daily => {
        // console.log(daily.dateMenu);
        // console.log(selectedValue);
        if (daily.dateMenu == selectedValue) {
          console.log(daily);
          this.cardsCurrentMeals = daily;
        }
      });
    }
  }
  
}
