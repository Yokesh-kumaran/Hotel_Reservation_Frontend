import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AnimationOptions } from 'ngx-lottie';
import { AppUser } from 'src/app/model/appUser';
import { Feedback } from 'src/app/model/feedback';
import { Order } from 'src/app/model/order';
import { FeedbackService } from 'src/app/service/feedback.service';
import { OrderService } from 'src/app/service/order.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  constructor(
    private orderService: OrderService,
    private storageService: StorageService,
    private feedbackService: FeedbackService
  ) {}

  isLoggedIn = false;
  error: string = '';
  orderErrors: { [orderId: number]: string } = {};
  orders: Order[] = [];
  isOrdered = false;
  userId: number = 0;
  feedback: Feedback[] = [];
  selectedOrderId: number | undefined = 0;

  ngOnInit(): void {
    const loggedInUser: AppUser = this.storageService.getLoggedInUser();
    this.userId = loggedInUser.id;
    if (this.userId) {
      this.isLoggedIn = true;
    }

    //GETTING USER ORDERS
    this.orderService.getUserOrders(this.userId).subscribe({
      next: (response: any) => {
        this.orders = response.data;

        if (this.orders.length > 0) {
          this.isOrdered = true;
        }
      },

      error: (err) => {
        let message: string = err?.error?.error?.message;
        this.error = message.includes(',') ? message.split(',')[0] : message;
      },

      complete: () => {
        this.getAllFeedbacks();
      },
    });
  }

  //GETTING ALL FEEDBACKS
  getAllFeedbacks() {
    this.feedbackService.getAllFeedbacks().subscribe({
      next: (response) => {
        this.feedback = response.data;
        this.orderErrors = {};

        for (const order of this.orders) {
          const matchingFeedback = this.feedback.find(
            (feedback) => feedback.orderId === order.id
          );

          if (matchingFeedback) {
            if (order.id) {
              this.orderErrors[order.id] = 'yes';
            }
          } else {
            if (order.id) {
              this.orderErrors[order.id] = 'no';
            }
          }
        }
      },
    });
  }

  //FOR LOTTIE ANIMATIONs
  option1: AnimationOptions = {
    path: '/assets/noorders.json',
  };

  showPopUp(orderId: number | undefined) {
    this.selectedOrderId = orderId;
  }

  addFeedback(addFeedbackForm: NgForm) {
    const feedback: Feedback = {
      adminReply: null,
      userFeedBack: '',
      orderId: 0,
    };

    feedback.userFeedBack = addFeedbackForm.value.feedback;
    feedback.orderId = addFeedbackForm.value.id;

    this.feedbackService.addFeedback(feedback).subscribe(
      (response) => {
        addFeedbackForm.reset();
        this.showSuccessAlert('Feedback added successfully');
        this.ngOnInit();
      },
      (error) => {}
    );
  }

  private showSuccessAlert(message: string): void {
    alert(message);
  }

  //PRINTING BILL
  printBill(order: Order): void {
    const printWindow = window.open('', '_blank');
    console.log(order);

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Order Bill</title>
          </head>
          <body>
            <div style="text-align: center;">
              <img src="assets/images/logo.png" height="70px" width="100px">
            </div>
            <h1>Room No: ${order.roomId}<h1>
            <h3>Check In Date: ${order.checkInDate}<h3>
            <h3>Check Out Date: ${order.checkOutDate}<h3>
            <h3>Booking Name: ${order.firstName + ' ' + order.lastName}<h3>
            <h3>Guest Count: ${order.adults + order.children}<h3>
            <h3>
              <span style="color: black;">Status: </span>
              <span style="color: rgb(1, 151, 1);">PAID</span>
            </h3>
            <br><br><br>
            <h4>In case of any queries: <h4>
            <h4>Call: 93482929202 <h4>
            <br><br>
            <h5>*Show this receipt to admin while checkin<h5>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error('Unable to open new window for printing.');
    }
  }
}
