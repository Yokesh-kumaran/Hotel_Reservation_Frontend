import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AdminHomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderService } from 'src/app/service/order.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { urlEndpoint } from 'src/app/utils/constant';
import { CategoryService } from 'src/app/service/category.service';
import { of, throwError } from 'rxjs';
import { AppResponse } from 'src/app/model/appResponse';
import { RoomService } from 'src/app/service/room.service';
import { UserService } from 'src/app/service/user.service';

describe('AdminHomeComponent', () => {
  let component: AdminHomeComponent;
  let fixture: ComponentFixture<AdminHomeComponent>;
  let service: OrderService;
  let categoryService: CategoryService;
  let roomService: RoomService;
  let userService: UserService;
  let orderService: OrderService;
  let httpMock: HttpTestingController;

  const mockOrderServiceResponse = {
    status: 200,
    timestamp: '2022-01-01T12:00:00Z',
    data: [
      {
        id: 1,
        categoryId: 1,
        userId: 1,
        roomId: 1,
        price: 1,
        checkInDate: 'string',
        checkOutDate: 'string',
        address1: 'string',
        address2: 'string',
        adults: 1,
        checkInTime: 'string',
        checkOutTime: 'string',
        children: 1,
        city: 'string',
        email: 'string',
        firstName: 'string',
        lastName: 'string',
        gender: 'string',
        phoneNumber: 1,
        state: 'string',
        zipCode: 1,
      },
      {
        id: 2,
        categoryId: 2,
        userId: 2,
        roomId: 2,
        price: 2,
        checkInDate: 'string',
        checkOutDate: 'string',
        address1: 'string',
        address2: 'string',
        adults: 1,
        checkInTime: 'string',
        checkOutTime: 'string',
        children: 1,
        city: 'string',
        email: 'string',
        firstName: 'string',
        lastName: 'string',
        gender: 'string',
        phoneNumber: 1,
        state: 'string',
        zipCode: 1,
      },
      {
        id: 3,
        categoryId: 3,
        userId: 2,
        roomId: 2,
        price: 2,
        checkInDate: 'string',
        checkOutDate: 'string',
        address1: 'string',
        address2: 'string',
        adults: 1,
        checkInTime: 'string',
        checkOutTime: 'string',
        children: 1,
        city: 'string',
        email: 'string',
        firstName: 'string',
        lastName: 'string',
        gender: 'string',
        phoneNumber: 1,
        state: 'string',
        zipCode: 1,
      },
    ],
    error: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminHomeComponent],
      imports: [HttpClientModule, MatSnackBarModule, HttpClientTestingModule],
      providers: [OrderService],
    });
    fixture = TestBed.createComponent(AdminHomeComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(OrderService);
    categoryService = TestBed.inject(CategoryService);
    roomService = TestBed.inject(RoomService);
    userService = TestBed.inject(UserService);
    orderService = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('AdminHomeComponent should created', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the "Hi, Welcome Back" text', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain(
      'Hi, Welcome Back'
    );
  });

  it('should contain the canvas element', () => {
    const compiled = fixture.nativeElement;
    const canvasElement = compiled.querySelector('#myChart');
    expect(canvasElement).toBeTruthy();
  });

  it('Should call getAllOrders() in order service', () => {
    let spy = spyOn(service, 'getAllOrders').and.callThrough();
    component.getAllOrders();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call the deleteOrder API endpoint', async () => {
    const orderId = 123;
    service.deleteOrder(orderId).subscribe(() => {});
    const req = httpMock.expectOne(
      `${urlEndpoint.baseUrl}/admin/order/delete/${orderId}`
    );
    await fixture.whenStable();
    expect(req.request.method).toBe('DELETE');
  });

  it('Should perform all branches in ngOnInit lifecycle', fakeAsync(() => {
    const mockResponse = {
      status: 200,
      timestamp: '2022-01-01T12:00:00Z',
      data: {
        categories: [
          { id: 1, name: 'Category 1', amenityId: 1 },
          { id: 2, name: 'Category 2', amenityId: 2 },
          { id: 3, name: 'Category 3', amenityId: 3 },
        ],
      },
      error: null,
    };

    let spy = spyOn(categoryService, 'getAllCategories').and.returnValue(
      of(mockResponse)
    );

    const mockRoomResponse: AppResponse = {
      status: 200,
      timestamp: '2022-01-01T12:00:00Z',
      data: [
        {
          id: 1,
          description: 'string',
          price: 1,
          categoryName: 'string',
        },
        {
          id: 2,
          description: 'string',
          price: 1,
          categoryName: 'string',
        },
        {
          id: 3,
          description: 'string',
          price: 1,
          categoryName: 'string',
        },
      ],
      error: null,
    };
    let spy2 = spyOn(roomService, 'getAllRooms').and.returnValue(
      of(mockRoomResponse)
    );

    const mockUserResponse = {
      status: 200,
      timestamp: '2022-01-01T12:00:00Z',
      data: [
        {
          id: 1,
          name: 'string',
          username: 'string',
          joinedAt: 'string',
        },
        {
          id: 2,
          name: 'string',
          username: 'string',
          joinedAt: 'string',
        },
      ],
      error: null,
    };
    const userServiceSpy = spyOn(userService, 'getAllUsers').and.returnValue(
      of(mockUserResponse)
    );

    component.ngOnInit();
    tick();
    expect(spy).toHaveBeenCalled();
    expect(component.category1Id).toBe(1);
    expect(component.category2Id).toBe(2);
    expect(component.category3Id).toBe(3);
    expect(spy2).toHaveBeenCalled();
    expect(userServiceSpy).toHaveBeenCalled();
  }));

  it('Should perform getAllOrders() method in order service', () => {
    let spy = spyOn(orderService, 'getAllOrders').and.returnValue(
      of(mockOrderServiceResponse)
    );
    component.category1Id = 1;
    component.category2Id = 2;

    component.getAllOrders();
    expect(spy).toHaveBeenCalled();
    expect(component.category1Count).toBe(1);
    expect(component.category2Count).toBe(1);
    expect(component.category3Count).toBe(1);
  });

  it('should handle error in getAllOrders service call', () => {
    const errorMessage = 'Test error message with comma, additional message';
    spyOn(service, 'getAllOrders').and.returnValue(
      throwError({ error: { error: { message: errorMessage } } })
    );
    component.getAllOrders();
    expect(component.error).toBe('Test error message with comma');
  });

  it('Should perform deleteOrder()', () => {
    component.orders = mockOrderServiceResponse.data;
    spyOn(orderService, 'deleteOrder').and.returnValue(
      of(mockOrderServiceResponse)
    );
    component.deleteOrder(1);
    expect(component.orders.length).toEqual(2);
  });
});
