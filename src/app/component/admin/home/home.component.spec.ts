import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminHomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderService } from 'src/app/service/order.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { urlEndpoint } from 'src/app/utils/constant';

describe('AdminHomeComponent', () => {
  let component: AdminHomeComponent;
  let fixture: ComponentFixture<AdminHomeComponent>;
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminHomeComponent],
      imports: [HttpClientModule, MatSnackBarModule, HttpClientTestingModule],
      providers: [OrderService],
    });
    fixture = TestBed.createComponent(AdminHomeComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(OrderService);
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
});
