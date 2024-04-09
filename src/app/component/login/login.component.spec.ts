import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientModule } from '@angular/common/http';
import { Form, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientModule, FormsModule, RouterTestingModule],
      providers: [AuthService],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
  });

  it('LoginComponent should created', () => {
    expect(component).toBeTruthy();
  });

  it('Should navigate to register page while clicking on register link', () => {
    const registerLink = fixture.debugElement.query(
      By.css('a[routerlink="/register"]')
    );
    expect(registerLink).toBeTruthy();
    let spyNavigate = spyOn(router, 'navigateByUrl');
    registerLink.nativeElement.click();
    const url = spyNavigate.calls.first().args[0].toString();
    fixture.detectChanges();
    expect(url).toBe('/register');
  });

  it('Should call login method', () => {
    let spy = spyOn(component, 'login').and.callThrough();
    let form: any = {};
    component.login(form);
    fixture.detectChanges();
    expect(component.login).toHaveBeenCalled();
  });
});
