import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/service/auth.service';
import { StorageService } from 'src/app/service/storage.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;
  let authService: AuthService;
  let storageService: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [AuthService],
    });
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    storageService = TestBed.inject(StorageService);
  });

  it('NavbarComponent should created', () => {
    expect(component).toBeTruthy();
  });

  it('Should navigate to feedback page while clicking on feedback link', () => {
    const feedbackLink = fixture.debugElement.query(
      By.css('a[routerlink="/feedback"]')
    );
    expect(feedbackLink).toBeTruthy();
    let spyNavigate = spyOn(router, 'navigateByUrl');
    feedbackLink.nativeElement.click();
    const url = spyNavigate.calls.first().args[0].toString();
    fixture.detectChanges();
    expect(url).toBe('/feedback');
  });

  it('Should navigate to home page while clicking on home link', () => {
    const homeLink = fixture.debugElement.query(By.css('a[routerlink="/"]'));
    expect(homeLink).toBeTruthy();
    let spyNavigate = spyOn(router, 'navigateByUrl');
    homeLink.nativeElement.click();
    const url = spyNavigate.calls.first().args[0].toString();
    fixture.detectChanges();
    expect(url).toBe('/');
  });

  it('Should access storageService - private field', () => {
    let privateField = component['authService'];
    expect(privateField).toBeTruthy();
  });

  it('should navigate to "/" after logout', fakeAsync(() => {
    spyOn(authService, 'logout');
    spyOn(router, 'navigate');
    component.logoutHandler();
    tick();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('Should check for login', () => {
    spyOn(storageService, 'getLoggedInUser').and.returnValue({
      id: 1,
      username: 'String',
      password: 'String',
      role: 'String',
    });
    component.ngOnInit();
    expect(component.isLoggedIn).toBe(true);
  });
});
