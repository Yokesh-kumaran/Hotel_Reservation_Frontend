import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Feedbackresponse } from 'src/app/model/feedbackresponse';
import { FeedbackService } from 'src/app/service/feedback.service';

@Component({
  selector: 'app-adminfeedback',
  templateUrl: './adminfeedback.component.html',
  styleUrls: ['./adminfeedback.component.css'],
})
export class AdminfeedbackComponent implements OnInit {
  constructor(private feedbackService: FeedbackService) {}

  feedback: Feedbackresponse[] = [];
  selectedFeedback: Feedbackresponse = {
    id: 0,
    adminReply: '',
  };

  ngOnInit(): void {
    this.getAllFeedback();
  }

  //FOR GETTING ALL FEEDBACKS
  getAllFeedback() {
    this.feedbackService.getAllFeedbacks().subscribe({
      next: (response) => {
        this.feedback = response.data;
      },
    });
  }

  reply(feedback: Feedbackresponse) {
    this.selectedFeedback = { ...feedback };
  }

  //POST ADMIN REPLY
  postReply(replyFeedbackForm: NgForm) {
    const id = replyFeedbackForm.value.id;
    const adminReply = replyFeedbackForm.value.adminReply;

    const adminFeedback: any = {
      id: id,
      adminReply: adminReply,
    };

    this.feedbackService
      .adminReplyFeedback(adminFeedback)
      .subscribe((response) => {
        this.ngOnInit();
      });
  }
}
