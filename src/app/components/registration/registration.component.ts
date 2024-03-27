import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UserDTO } from '../../dtos/UserDTO';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registrationForm!: FormGroup;
  failedRegisterMsg: string='';

  constructor(private authService: AuthService,private router: Router,private snackBar: MatSnackBar) {
    this.registrationForm = new FormGroup(
      {
      firstName: new FormControl( '', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password:new FormControl ('', [Validators.required, Validators.minLength(8)]),
      confirmPassword:new FormControl ('', [Validators.required]),
    }, 
    { 
      validators: this.passwordMatchValidator 
    }
    );
   }

  passwordMatchValidator(control: AbstractControl) {
    return control.get('password')?.value === control.get('confirmPassword')?.value ?  null : {mismatch: true} ;
      }
  
      onSubmit() {
        if (this.registrationForm.valid) {
          const formData = this.registrationForm.value;
          const user = new UserDTO(formData);
          this.authService.registerUser(user).pipe(
            tap(response => {
              this.router.navigate(['/login']);
            }),
            catchError(error =>{ if (error instanceof HttpErrorResponse) {
              this.snackBar.open(this.mapErrorMessage(error.error.message), undefined, {
                duration: 2000,
              });
            } else {
              this.snackBar.open(this.mapErrorMessage(error.message), undefined, {
                duration: 2000,
              });
            }
            return throwError(() => new Error(error));
          }
          )).subscribe();
        } else {
          this.snackBar.open('Something went wrong...', undefined, {
            duration: 2000,
          });
        }
      }
    
    mapErrorMessage(errorMessage: string): string {    
      if (errorMessage.includes('email')) {
        return 'Email is already in use. Please choose a different email.';
      } else if (errorMessage.includes('registration')) {
        return 'Registration failed. Please try again later.';
      } else {
        return 'An unknown error occurred. Please try again later.';
      }
    }
  }
    