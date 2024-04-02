import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/service/auth.service';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutComponent, NavbarComponent],
      imports: [HttpClientModule],
      providers: [AuthService],
    });
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('AboutComponent should created', () => {
    expect(component).toBeTruthy();
  });

  it('AppNavbar should present in template', () => {
    const element = fixture.nativeElement;
    const navbarElement = element.querySelector('app-navbar');
    expect(navbarElement).toBeTruthy();
  });

  it('Should check for specific image', () => {
    const element2 = fixture.nativeElement;
    const imgElement = element2.querySelector(
      'img[src="https://p.w3layouts.com/demos_new/30-01-2017/resort-demo_Free/1920654907/web/images/ab.jpg"]'
    );
    expect(imgElement).toBeTruthy();
  });

  it('Should check for the specific color is applied to <p> tag', () => {
    const element3 = fixture.nativeElement;
    const pElement = element3.querySelector('p');
    const style = window.getComputedStyle(pElement);
    const color = style.getPropertyValue('color');
    expect(color).toEqual('rgb(137, 137, 137)');
  })

  
});
