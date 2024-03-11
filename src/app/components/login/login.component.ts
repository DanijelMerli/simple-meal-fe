import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService) { }

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
          console.log('Login successful');
          console.log(response.token);
          this.auth.saveToken(response.token);
          alert("Login successful");
        },
        error => {
          if (error.status === 400) {
            console.error('Bad credentials:', error);
            // Inform user about invalid credentials
          } else {
            console.error('An error occurred:', error);
            // Inform user about general error
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
