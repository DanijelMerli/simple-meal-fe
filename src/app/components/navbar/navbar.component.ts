import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { JwtService } from '../../jwt/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  isTokenPresent: boolean = false;
  isLogin: boolean = false;

  constructor(private router: Router, private jwtService: JwtService) {}

  ngOnInit() {
    let token = this.jwtService.getToken();
    console.log(token);
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
    this.jwtService.setToken("blablabla");
    this.isTokenPresent = true;
  }
}
