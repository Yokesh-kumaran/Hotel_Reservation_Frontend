import { Component } from '@angular/core';
import { Form } from '@angular/forms';
import { AppResponse } from 'src/app/model/appResponse';
import { Login } from 'src/app/model/login';
import { AppUser } from 'src/app/model/appUser';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: String = '';
  password: String = '';
  error: String = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(_loginForm: Form): void {
    let login: Login = {
      username: this.username,
      password: this.password,
    };
    this.authService.login(login).subscribe({
      next: (response: AppResponse) => {
        let user: AppUser = response.data;
        this.authService.setLoggedIn(user);
        // this.router.navigate(['/']);
      },
      error: (err) => {
        let message: String = err.error.error.message;
        this.error = message.includes(',') ? message.split(',')[0] : message;
      },
    });
  }
}
