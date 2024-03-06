import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { MenuDTO } from '../../dtos/MenuDTO';
import {MatTableDataSource} from "@angular/material/table";
import { MatSort } from '@angular/material/sort';
import {MatPaginator, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  displayedColumns: string[] = ['description', 'price', 'size', 'type', 'special', 'order'];
  dataSource: MatTableDataSource<MenuDTO> = new MatTableDataSource<MenuDTO>();
  totalElements: number = 0;
  menu: MenuDTO[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: MenuService) {}

  ngOnInit(): void {
    this.getAll();

  }

  async getAll(): Promise<void> {
    try {
      let result = await this.service.getMenu().toPromise();
      if (result != undefined) {
        this.menu = result;
      } else {
        console.log(":-(")
        this.menu = [];
      }
      this.totalElements = this.menu.length;
      this.dataSource = new MatTableDataSource<MenuDTO>(this.menu);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
   catch (error) {
    console.log(error)
  }
  }

  order(obj: MenuDTO) {}
}
