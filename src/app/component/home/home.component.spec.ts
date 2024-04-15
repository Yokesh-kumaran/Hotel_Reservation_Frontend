import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CategoryService } from 'src/app/service/category.service';
import { StorageService } from 'src/app/service/storage.service';
import { AuthService } from 'src/app/service/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { LottieModule, ɵLOTTIE_OPTIONS } from 'ngx-lottie';
import player from 'lottie-web';
import { routes } from 'src/app/app-routing.module';
import { AppResponse } from 'src/app/model/appResponse';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { error } from 'jquery';

export function playerFactory() {
  return player;
}

const mockLottieOptions = {
  player: playerFactory,
};

const mockCategories = [
  { id: 4, name: 'Premium', amenityId: 1 },
  { id: 5, name: 'Gold', amenityId: 2 },
  { id: 12, name: 'Silver', amenityId: 3 },
];

const mockAppResponse: AppResponse = {
  status: 200,
  timestamp: new String(),
  error: [],
  data: { categories: mockCategories },
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let categoryService: CategoryService;
  let storageService: StorageService;
  let authService: AuthService;
  let spy: any;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        AppRoutingModule,
        RouterTestingModule.withRoutes(routes),
        HttpClientModule,
        LottieModule,
      ],
      providers: [
        CategoryService,
        StorageService,
        AuthService,
        { provide: ɵLOTTIE_OPTIONS, useValue: mockLottieOptions },
      ],
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
    categoryService = TestBed.inject(CategoryService);
    storageService = TestBed.inject(StorageService);
    authService = TestBed.inject(AuthService);
  });

  beforeEach(() => {
    spyOn(router, 'navigate');
  });

  function getAllCategoriesError(errorMessage: string, expectedError: string) {
    const mockErrorResponse = { error: { error: { message: errorMessage } } };
    const userServiceSpy = spyOn(
      categoryService,
      'getAllCategories'
    ).and.returnValue(throwError(mockErrorResponse));
    component.ngOnInit();
    expect(userServiceSpy).toHaveBeenCalledWith();
    expect(component.error).toEqual(expectedError);
  }

  it('HomeComponent should created', () => {
    expect(component).toBeTruthy();
  });

  it('Should perform ngOnInit()', () => {
    spy = spyOn(categoryService, 'getAllCategories').and.returnValue(
      of(mockAppResponse)
    );
    spyOn(storageService, 'getLoggedInUser').and.returnValue({
      id: 1,
      username: 'String',
      password: 'String',
      role: 'String',
    });
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component.isLoggedIn).toBeTrue();
  });

  it('Should return categories correctly', () => {
    spy = spyOn(categoryService, 'getAllCategories').and.returnValue(
      of(mockAppResponse)
    );
    component.ngOnInit();
    expect(component.categories).toEqual(mockAppResponse.data.categories);
  });

  it('Should call navigateToRoomPage()', () => {
    let randomid = 4;
    let spy2 = spyOn(component, 'navigateToRoomPage').and.returnValue();
    component.navigateToRoomPage(randomid);
    expect(spy2).toHaveBeenCalled();
  });

  it('Should navigate to order page after clicking on bookings link', () => {
    const bookingLink = fixture.debugElement.query(
      By.css('a[routerlink="/order"]')
    );
    expect(bookingLink).toBeTruthy();
    let spyNavigate = spyOn(router, 'navigateByUrl');
    bookingLink.nativeElement.click();
    const url = spyNavigate.calls.first().args[0].toString();
    fixture.detectChanges();
    expect(url).toBe('/order');
  });

  it('Should handle error in getAllUsers() with comma-separated message', () => {
    getAllCategoriesError('Error 1,Error 2', 'Error 1');
  });

  it('Should handle error in getAllUsers() without comma-separated message', () => {
    getAllCategoriesError('', '');
  });

  it('Should navigate to room page', () => {
    const categoryId = 1;
    component.navigateToRoomPage(categoryId);
    expect(router.navigate).toHaveBeenCalledWith(['/room', 1]);
  });

  it('Should navigate to see all rooms page', () => {
    component.navigateToSeeAllRooms();
    expect(router.navigate).toHaveBeenCalledWith(['/room']);
  });

  it('Should scroll the page to specific location', () => {
    let spy = spyOn(window, 'scrollTo').and.stub();
    component.scrollPageUp();
    expect(spy).toHaveBeenCalledWith({ top: 1300, behavior: 'smooth' });
  });

  it('Should reciprocal toggle description after calling methods', () => {
    component.toggleRestaurantDescription();
    component.toggleTransportDescription();
    component.toggleBestCareDescription();
    component.toggleDeluxeRoomDescription();
    expect(component.showRestaurantDescription).toBeTrue();
    expect(component.showBestCareDescription).toBeTrue();
    expect(component.showDeluxeRoomDescription).toBeTrue();
    expect(component.showTransportDescription).toBeTrue();
  });

  it('Should perform logoutHandler()', () => {
    let logoutSpy = spyOn(authService, 'logout');
    component.logoutHandler();
    expect(logoutSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
