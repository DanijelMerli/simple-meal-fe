import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private userService: UserService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm && this.loginForm.valid) {
      const loginRequest = this.loginForm.value;
      this.auth.login(loginRequest).subscribe(
        response => {
          this.userService.setToken(response.token);     
          this.router.navigate(['menu']).then(()=>{location.reload();});
        },
        error => {
          if (error.status === 400) {
            this.snackBar.open('Bad credentials', undefined, {
              duration: 2000,
            });
          } else if(error.status === 404) {
            this.snackBar.open('User with email not found', undefined, {
              duration: 2000,
            });
          }
           else {
            this.snackBar.open('An error occurred', undefined, {
              duration: 2000,
            });
          }
        }
      );
    }
  }


  isFieldInvalid(field: string) {
    const formControl = this.loginForm.get(field);
    return formControl?.invalid && formControl?.touched;
  }
}
