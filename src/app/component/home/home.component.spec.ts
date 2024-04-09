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
import { of } from 'rxjs';

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
    spy = spyOn(categoryService, 'getAllCategories').and.returnValue(
      of(mockAppResponse)
    );
  });

  it('HomeComponent should created', () => {
    expect(component).toBeTruthy();
  });

  it('Should call getAllCategories()', () => {
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('Should return categories correctly', () => {
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
});
