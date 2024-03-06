import { Component, OnInit, ViewChild, HostListener  } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { MenuDTO } from '../../dtos/MenuDTO';
import {MatTableDataSource} from "@angular/material/table";
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';

// import {MatPaginator, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  // displayedColumns: string[] = ['description', 'price', 'size', 'type', 'special' /*, 'order'*/];
  displayedColumns: string[] = ['date', 'regularMeal', 'fitMeal', 'extra-soup', 'extra-dessert'];
  dataSource: MatTableDataSource<MenuDTO> = new MatTableDataSource<MenuDTO>();
  totalElements: number = 0;
  menu: MenuDTO[] = [];
  today: Date = new Date();
  screenWidth!: number;
  cards: boolean = false;

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
    this.screenWidth = window.innerWidth;
    this.getAll();
  }

  async getAll(): Promise<void> {
    try {
      let result = await this.service.getMenu().toPromise();
      if (result != undefined) {
        console.log(result);
        this.menu = result;
      } else {
        console.log(":-(")
        this.menu = [];
      }
      this.totalElements = this.menu.length;
      this.dataSource = new MatTableDataSource<MenuDTO>(this.menu);
      // this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
   catch (error) {
    console.log(error)
  }
  }

  order(obj: MenuDTO) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    // console.log(this.screenWidth)
    if (this.screenWidth > 750) {
      this.cards = false;
    } else {
      this.cards = true;
    }
    // 750
  }
}
