import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.userService.isLoggedIn()) {
      const requiredRoles = next.data['roles'] as Array<string>;
      if (requiredRoles && requiredRoles.indexOf(this.userService.getRole()) === -1) {
        // User is not authorized, redirect to Access Denied page
        this.router.navigate(['/access-denied']);
        return false;
      }
      return true;
    } else {
        this.router.navigate(['/login']);
      return false;
    }
  }
}
