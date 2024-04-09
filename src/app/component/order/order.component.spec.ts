import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderComponent } from './order.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import player from 'lottie-web';
import { LottieModule, ɵLOTTIE_OPTIONS } from 'ngx-lottie';

export function playerFactory() {
  return player;
}

const mockLottieOptions = {
  player: playerFactory,
};

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderComponent, NavbarComponent],
      imports: [HttpClientModule, FormsModule, LottieModule],
      providers: [{ provide: ɵLOTTIE_OPTIONS, useValue: mockLottieOptions }],
    });
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
  });

  it('OrderComponent should created', () => {
    expect(component).toBeTruthy();
  });
});
