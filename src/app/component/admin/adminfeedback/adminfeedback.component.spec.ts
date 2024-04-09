import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AdminfeedbackComponent } from './adminfeedback.component';
import { HttpClientModule } from '@angular/common/http';
import { FeedbackService } from 'src/app/service/feedback.service';
import { FormsModule, NgForm } from '@angular/forms';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { urlEndpoint } from 'src/app/utils/constant';
import { Feedbackresponse } from 'src/app/model/feedbackresponse';
import { AppResponse } from 'src/app/model/appResponse';
import { of, throwError } from 'rxjs';

describe('AdminfeedbackComponent', () => {
  let component: AdminfeedbackComponent;
  let service: FeedbackService;
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<AdminfeedbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminfeedbackComponent],
      imports: [HttpClientModule, FormsModule, HttpClientTestingModule],
      providers: [FeedbackService],
    });
    fixture = TestBed.createComponent(AdminfeedbackComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(FeedbackService);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('Component should created', () => {
    expect(component).toBeTruthy();
  });

  it('Should call getAllFeedback() method', () => {
    let spy = spyOn(component, 'getAllFeedback');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call the API to get all feedbacks', () => {
    const req = httpMock.expectOne(`${urlEndpoint.baseUrl}/feedback/all`);
    expect(req.request.method).toEqual('GET');
    req.flush({
      status: 200,
      timestamp: new String(),
      error: [],
      data: { feedbacks: [] },
    });
  });

  it('should get all feedbacks from feedback service', () => {
    const mockFeedbacks: Feedbackresponse[] = [
      {
        id: 1,
        adminReply: 'Good',
        userFeedback: 'Test',
        orderId: 3,
        feedbackDate: '2023-12-05',
      },

      {
        id: 4,
        adminReply: 'Thank you, have a great day.',
        userFeedback: 'nice',
        orderId: 11,
        feedbackDate: '2024-01-25',
      },

      {
        id: 5,
        adminReply: 'Thanks',
        userFeedback: 'Great',
        orderId: 21,
        feedbackDate: '2024-01-25',
      },

      {
        id: 6,
        adminReply: 'Good',
        userFeedback: 'Next level',
        orderId: 28,
        feedbackDate: '2024-01-25',
      },

      {
        id: 7,
        adminReply: 'Good',
        userFeedback: 'Very good',
        orderId: 26,
        feedbackDate: '2024-01-25',
      },

      {
        id: 8,
        adminReply:
          'Sure, will make you surprise, contact us for any specific improvements.',
        userFeedback: 'Try better',
        orderId: 25,
        feedbackDate: '2024-01-25',
      },

      {
        id: 9,
        adminReply: null,
        userFeedback: 'Great service',
        orderId: 30,
        feedbackDate: '2024-01-30',
      },
    ];

    const req = httpMock.expectOne(`${urlEndpoint.baseUrl}/feedback/all`);
    req.flush({
      status: 200,
      timestamp: new String(),
      error: [],
      data: { feedbacks: mockFeedbacks },
    });

    const mockExpectedResponse: Feedbackresponse[] = [
      {
        id: 1,
        adminReply: 'Good',
        userFeedback: 'Test',
        orderId: 3,
        feedbackDate: '2023-12-05',
      },

      {
        id: 4,
        adminReply: 'Thank you, have a great day.',
        userFeedback: 'nice',
        orderId: 11,
        feedbackDate: '2024-01-25',
      },

      {
        id: 5,
        adminReply: 'Thanks',
        userFeedback: 'Great',
        orderId: 21,
        feedbackDate: '2024-01-25',
      },

      {
        id: 6,
        adminReply: 'Good',
        userFeedback: 'Next level',
        orderId: 28,
        feedbackDate: '2024-01-25',
      },

      {
        id: 7,
        adminReply: 'Good',
        userFeedback: 'Very good',
        orderId: 26,
        feedbackDate: '2024-01-25',
      },

      {
        id: 8,
        adminReply:
          'Sure, will make you surprise, contact us for any specific improvements.',
        userFeedback: 'Try better',
        orderId: 25,
        feedbackDate: '2024-01-25',
      },

      {
        id: 9,
        adminReply: null,
        userFeedback: 'Great service',
        orderId: 30,
        feedbackDate: '2024-01-30',
      },
    ];

    const appResponse: AppResponse = {
      status: 200,
      timestamp: new String(),
      error: [],
      data: { feedbacks: mockExpectedResponse },
    };
    component.getAllFeedback();
    expect(component.feedback).toEqual(appResponse.data);
  });

  it('Should call postReply() method on form submission', () => {
    spyOn(component, 'postReply').and.callThrough();
    fixture.nativeElement
      .querySelector('form')
      .dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(component.postReply).toHaveBeenCalled();
  });

  it('Should store the feedback in selectedFeedback if reply() calls', () => {
    const mockFeedbackResponse = {
      id: 1,
      adminReply: null,
      userFeedback: 'dummy',
      orderId: 1,
      feedbackDate: 'dummy',
    };
    component.reply(mockFeedbackResponse);
    fixture.detectChanges();
    expect(component.selectedFeedback).not.toBeNull();
  });

  it('should call adminReplyFeedback method of FeedbackService and handle response and error', fakeAsync(() => {
    const mockFormValue = { id: 1, adminReply: 'Admin reply' };
    const ngFormMock = {
      value: mockFormValue,
    } as NgForm;
    spyOn(component, 'ngOnInit');

    const adminReplyFeedbackSpy = spyOn(
      service,
      'adminReplyFeedback'
    ).and.returnValue(
      of({
        status: 200,
        timestamp: '2022-01-01T12:00:00Z',
        data: [{ id: 1, adminReply: 'Admin reply' }],
        error: null,
      })
    );
    component.postReply(ngFormMock);
    tick();
    fixture.detectChanges();
    expect(adminReplyFeedbackSpy).toHaveBeenCalledWith({
      id: 1,
      adminReply: mockFormValue.adminReply,
    });

    expect(component.ngOnInit).toHaveBeenCalled();
  }));
});
