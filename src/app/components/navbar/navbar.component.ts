import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from  '@angular/material/sidenav';
import { JwtService } from '../../jwt/jwt.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isTokenPresent: boolean = false;
  isLogin: boolean = false;
  isHome: boolean = false;

  constructor(private router: Router, private jwtService: JwtService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        
        // Gledamo na kojoj smo putanji i prikazujemo navbar u skladu sa tim
        const navigationEndEvent = event as NavigationEnd;
        const url = navigationEndEvent.url;
        // console.log(url);
        if (url.includes('login')) {
          this.isLogin = true;
        } else {
          this.isLogin = false;
        }

        if (url.includes('home') || url === "/") {
          this.isHome = true;
        } else {
          this.isHome = false;
        }
      }
    });
  }

  ngOnInit() {
    let token = this.jwtService.getToken();
    // console.log(token);
    if (token == null || token == undefined) {
      this.isTokenPresent = false;
    } else {
      this.isTokenPresent = true;
    }
  }

  logout() {
    this.jwtService.clearToken();
    // this.router.navigate(['']).then(()=>{location.reload();});
    this.isTokenPresent = false;
  }

  login() {
    // this.jwtService.setToken("blablabla");
    this.isTokenPresent = true;
  }
}
