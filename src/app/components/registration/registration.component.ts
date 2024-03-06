import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserDTO } from './dto/UserDTO';
import { UserService } from './service/user.service';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registrationForm!: FormGroup;
  failedRegisterMsg: string='';

  constructor(private userService: UserService,private router: Router) {
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
          alert(user.email);
          this.userService.registerUser(user).pipe(
            tap(response => {
              //  routing to login
              this.router.navigate(['/login']);
            }),
            catchError(error =>{ if (error instanceof HttpErrorResponse) {
              // Backend error
              this.failedRegisterMsg = 'Backend error:' + error.message;
            } else {
              // Frontend error
              this.failedRegisterMsg='Frontend error:'+ error.message;
            }
            return throwError(() => new Error(error));
          }
          )).subscribe();
        } else {
          this.failedRegisterMsg="Something went wrong..."
        }
      }
    }
