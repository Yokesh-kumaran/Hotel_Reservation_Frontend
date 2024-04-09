import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackComponent } from './feedback.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { FeedbackService } from 'src/app/service/feedback.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CdkPortal } from '@angular/cdk/portal';

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;
  let feedbackService: FeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackComponent, NavbarComponent],
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [FeedbackService],
    });
    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    feedbackService = TestBed.inject(FeedbackService);
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

  it('Should call getAllfeedback()', () => {
    try {
      spyOn(component, 'getAllFeedback').and.callThrough();
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.getAllFeedback).toHaveBeenCalled();
    } catch (error) {
      error = 'Error has noted';
      fail(`Exception occurred: ${error}`);
    }
  });

  it('Should get the data from api from getAllFeedback()', () => {
    const mockFeedbackResponse = {
      status: 200,
      timestamp: '2022-01-01T12:00:00Z',
      data: [
        { id: 1, message: 'Great job!' },
        { id: 2, message: 'Awesome work!' },
      ],
      error: null,
    };
    spyOn(feedbackService, 'getAllFeedbacks').and.returnValue(
      of(mockFeedbackResponse)
    );
    component.getAllFeedback();
    fixture.detectChanges();
    expect(component.feedback).toEqual(mockFeedbackResponse.data);
  });
});
