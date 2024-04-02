import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackComponent } from './feedback.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackComponent, NavbarComponent],
      imports: [HttpClientModule],
      providers: [],
    });
    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
  });

  it('FeedbackComponent should created', () => {
    expect(component).toBeTruthy();
  });

  it('H3 element should contain font-weight:bold', () => {
    const compiled = fixture.nativeElement;
    const h3Element = compiled.querySelector('h3');
    expect(h3Element).toBeTruthy();
    expect(h3Element.textContent).toBe(' ANONYMOUS FEEDBACKS\n');
    const computedStyle = window.getComputedStyle(h3Element);
    expect(computedStyle.fontWeight).toBe('700');
  });
});
