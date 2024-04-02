import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingComponent } from './booking.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import player from 'lottie-web';
import { LottieModule, ɵLOTTIE_OPTIONS } from 'ngx-lottie';
import { By } from '@angular/platform-browser';
import { StorageService } from 'src/app/service/storage.service';

export function playerFactory() {
  return player;
}

const mockLottieOptions = {
  player: playerFactory,
};

describe('BookingComponent', () => {
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;
  let storageService: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingComponent, NavbarComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        FormsModule,
        LottieModule,
      ],
      providers: [
        { provide: ɵLOTTIE_OPTIONS, useValue: mockLottieOptions },
        StorageService,
      ],
    });
    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
    storageService = TestBed.inject(StorageService);
  });

  it('BookingComponent should created', () => {
    expect(component).toBeTruthy();
  });

  it('should display a red paragraph with specific text content', () => {
    const compiled = fixture.nativeElement;
    const redParagraph = compiled.querySelector('p');
    expect(redParagraph).toBeTruthy();
    expect(redParagraph.textContent).toBe('*Booking is not cancellable');
    expect(redParagraph.style.color).toBe('red');
  });

  it('Should check for roomPrice, checkInDate, checkOutDate', () => {
    spyOn(storageService, 'getRoomPrice').and.returnValue(10000);
    spyOn(storageService, 'getCheckInDate').and.returnValue('18-11-2001');
    spyOn(storageService, 'getCheckOutDate').and.returnValue('20-11-2001');
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.roomPrice).toBe(10000);
    expect(component.checkInDate).toBe('18-11-2001');
    expect(component.checkOutDate).toBe('20-11-2001');
  });

  it('should contain Lottie animation component in the template', () => {
    const lottieElement = fixture.debugElement.query(By.css('.lottie'));
    const ngLottieElement = lottieElement.query(By.css('ng-lottie'));
    expect(lottieElement).toBeTruthy();
    expect(ngLottieElement).toBeTruthy();
  });
});
