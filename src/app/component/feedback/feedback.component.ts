import { Component, OnInit } from '@angular/core';
import { Feedback } from 'src/app/model/feedback';
import { FeedbackService } from 'src/app/service/feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent implements OnInit {
  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.getAllFeedback();
  }

  feedback: any = [];

  //FOR GETTING ALL FEEDBACKS
  getAllFeedback() {
    this.feedbackService.getAllFeedbacks().subscribe({
      next: (response) => {
        this.feedback = response.data;
      },
    });
  }
}
