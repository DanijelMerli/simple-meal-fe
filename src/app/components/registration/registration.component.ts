import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registrationForm!: FormGroup;

  
  
  

  constructor() {
    
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
      console.log(this.registrationForm.value);
      alert("uspesno");
    } else {
      alert("nije uspesno");
    }
  }
}
