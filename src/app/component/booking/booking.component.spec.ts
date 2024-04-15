import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  flushMicrotasks,
  tick,
} from '@angular/core/testing';
import { BookingComponent } from './booking.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule, NgForm } from '@angular/forms';
import player from 'lottie-web';
import { LottieModule, ɵLOTTIE_OPTIONS } from 'ngx-lottie';
import { By } from '@angular/platform-browser';
import { StorageService } from 'src/app/service/storage.service';
import { OrderService } from 'src/app/service/order.service';
import { of } from 'rxjs';
import { MailService } from 'src/app/service/mail.service';
import { Router } from '@angular/router';

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
  let orderService: OrderService;
  let mailService: MailService;
  let router: Router;

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
    orderService = TestBed.inject(OrderService);
    mailService = TestBed.inject(MailService);
    router = TestBed.inject(Router);
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
    spyOn(storageService, 'getLoggedInUser').and.returnValue({
      id: 1,
      username: 'undefined',
      password: 'undefined',
      role: 'undefined',
    });
    component.ngOnInit();
    expect(component.roomPrice).toBe(10000);
    expect(component.checkInDate).toBe('18-11-2001');
    expect(component.checkOutDate).toBe('20-11-2001');
    expect(component.isLoggedIn).toBe(true);
  });

  it('should contain Lottie animation component in the template', () => {
    const lottieElement = fixture.debugElement.query(By.css('.lottie'));
    const ngLottieElement = lottieElement.query(By.css('ng-lottie'));
    expect(lottieElement).toBeTruthy();
    expect(ngLottieElement).toBeTruthy();
  });

  it('Should perform booking()', async () => {
    component.checkInDate = 'dummy';
    component.checkOutDate = 'dummy';
    component.defaultCheckInTime = 'dummy';
    component.defaultCheckOutTime = 'dummy';
    component.userId = 1;
    component.roomId = 1;
    component.roomPrice = 1;

    const mockBooking = {
      firstName: 'dummy',
      lastName: 'dummy',
      gender: 'dummy',
      address1: 'dummy',
      address2: 'dummy',
      city: 'dummy',
      state: 'dummy',
      zipCode: 1,
      phone: 1,
      email: 'dummy',
      adults: 1,
      children: 1,
    };

    const mailRequest = {
      email: 'dummy',
      roomNo: 1,
      price: 1,
      bookingName: 'dummy dummy',
      checkInDate: 'dummy',
      checkOutDate: 'dummy',
      checkInTime: 'dummy',
      checkOutTime: 'dummy',
      adults: 1,
      children: 1,
    };

    const mockBookingForm = {
      valid: true,
      value: mockBooking,
    } as NgForm;

    const mockSpyResponse = {
      status: 200,
      timestamp: '2022-01-01T12:00:00Z',
      data: [],
      error: null,
    };
    const mailServiceSpyResponse = {
      status: 200,
      timestamp: '2022-01-01T12:00:00Z',
      data: [],
      error: null,
    };

    let spy = spyOn(orderService, 'placeOrders').and.returnValue(
      of(mockSpyResponse)
    );
    let mailServiceSpy = spyOn(mailService, 'sendEmail').and.returnValue(
      of(mailServiceSpyResponse)
    );
    let playLottieAnimationSpy = spyOn(component, 'playLottieAnimation');

    component.booking(mockBookingForm);

    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith({
      id: 0,
      userId: 1,
      roomId: 1,
      price: 1,
      checkInDate: 'dummy',
      checkOutDate: 'dummy',
      address1: 'dummy',
      address2: 'dummy',
      adults: 1,
      checkInTime: 'dummy',
      checkOutTime: 'dummy',
      children: 1,
      city: 'dummy',
      email: 'dummy',
      firstName: 'dummy',
      lastName: 'dummy',
      gender: 'dummy',
      phoneNumber: 1,
      state: 'dummy',
      zipCode: 1,
    });
    expect(mailServiceSpy).toHaveBeenCalledWith(mailRequest);
    expect(playLottieAnimationSpy).toHaveBeenCalled();
  });

  it('Should perform playLottieAnimation', () => {
    component.playLottieAnimation();
    expect(component.option1).toEqual({
      path: '/assets/booked.json',
    });
  });
});
