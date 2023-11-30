import { Component } from '@angular/core';
import { Form } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { Register } from 'src/app/model/register';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private authService: AuthService, private router: Router) {}

  option1: AnimationOptions = {};

  username: string = '';
  name: string = '';
  password: string = '';
  confirmPassword: string = '';
  error: String = '';

  register(_registerForm: Form): void {
    let register: Register = {
      username: this.username,
      name: this.name,
      password: this.password,
      confirmPassword: this.confirmPassword,
    };
    this.authService.register(register).subscribe(
      (response) => {
        this.playLottieAnimation();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      (error) => {}
    );
  }

  private playLottieAnimation(): void {
    this.option1 = {
      path: '/assets/registration_successful.json',
    };
  }
}
