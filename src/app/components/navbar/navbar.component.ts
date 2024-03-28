import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from '../../services/user.service';
import { OrderService } from '../../services/order.service';
import { DailyMenuDTO } from '../../dtos/OrderDTO';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isTokenPresent: boolean = false;
  isLogin: boolean = false;
  isHome: boolean = false;
  isAdmin: boolean = false;
  isChosenOne: boolean = false;
  role: string = "user";
  showOrder: boolean = true;

  constructor(private router: Router, private userService: UserService, private orderService: OrderService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        const navigationEndEvent = event as NavigationEnd;
        const url = navigationEndEvent.url;
        this.isLogin = url.includes('login');
        this.isHome = url.includes('home') || url === "/";
      }
    });
  }

  ngOnInit() {
    let token = this.userService.getToken();
    if (token == null || token == undefined) {
      this.isTokenPresent = false;
    } else {
      this.isTokenPresent = true;
      let role = this.userService.getRole();
      this.isAdmin = role == 'ROLE_ADMIN';
      this.isChosenOne = role == 'ROLE_THE_CHOSEN_ONE';
    }

    this.orderService.getMeals(true).subscribe(
      (result) => {
        let menu: DailyMenuDTO = result;
        this.showOrder = !(menu.regular == null && menu.fit == null && menu.soup == null && menu.dessert == null);
      },
      (error) => {
        this.showOrder = false;
      }
    );
  }

  logout() {
    this.userService.clearToken();
    this.router.navigate(['login']).then(() => { location.reload(); });
    this.isTokenPresent = false;
  }

  navigateToSelectedDay(event: any): void {
    const selectedOption = event.value;
    let parts = selectedOption.split('-');
    if (parts.length != 2 && selectedOption == 'meals') {
      this.router.navigate(['/meals']);
    } else {
      let action = parts[0];
      let week = parts[1];
      if (action == 'view') {
        this.router.navigate(['/menu'], { queryParams: { week: week } }).then(() => { location.reload(); });
      } else {
        this.router.navigate(['/weekly-menu'], { queryParams: { week: week, action: action } }).then(() => { location.reload(); });
      }
    }
  }
}
