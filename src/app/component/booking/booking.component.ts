import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { Order } from 'src/app/model/order';
import { OrderService } from 'src/app/service/order.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent implements OnInit {
  option1: AnimationOptions = {};
  isLoggedIn = false;
  defaultCheckOutTime: string = '22:00:00';
  defaultCheckInTime: string = '08:00:00';
  minDate: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private orderService: OrderService,
    private snackBar: MatSnackBar
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  roomId: number = 0;
  userId: number = 0;
  roomPrice: number = 0;
  name: string = '';
  ngOnInit(): void {
    const roomId = this.route.snapshot.paramMap.get('id');
    this.roomId = parseInt(roomId!);

    const loggedInUser = this.storageService.getLoggedInUser();
    this.userId = loggedInUser.id;
    if (loggedInUser.id) {
      this.isLoggedIn = true;
    }

    this.roomPrice = this.storageService.getRoomPrice();
  }

  booking(bookingForm: NgForm): void {
    if (bookingForm.valid) {
      const firstName = bookingForm.value.firstName;
      const lastName = bookingForm.value.lastName;
      const gender = bookingForm.value.gender;
      const address1 = bookingForm.value.address1;
      const address2 = bookingForm.value.address2;
      const city = bookingForm.value.city;
      const state = bookingForm.value.state;
      const zipCode = bookingForm.value.zipCode;
      const phone = bookingForm.value.phone;
      const email = bookingForm.value.email;
      const checkInDate = bookingForm.value.checkInDate;
      const checkOutDate = bookingForm.value.checkOutDate;
      const checkInTime = this.defaultCheckInTime;
      const checkOutTime = this.defaultCheckOutTime;
      const adults = bookingForm.value.adults;
      const children = bookingForm.value.children;

      const order: Order = {
        userId: this.userId,
        roomId: this.roomId,
        price: this.roomPrice,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        address1: address1,
        address2: address2,
        adults: adults,
        checkInTime: checkInTime,
        checkOutTime: checkOutTime,
        children: children,
        city: city,
        email: email,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        phoneNumber: phone,
        state: state,
        zipCode: zipCode,
      };

      this.orderService.placeOrders(order).subscribe(
        (response) => {
          // this.snackBar.open('Room booked successfully', 'Close', {
          //   duration: 3000,
          //   horizontalPosition: 'right',
          //   verticalPosition: 'bottom',
          // });
          this.playLottieAnimation();
          setTimeout(() => {
            this.storageService.removeRoomPrice();
            this.router.navigate(['/']);
          }, 2000);
        },
        (error) => {
          // console.error(error);
          // this.snackBar.open('Error placing order', 'Close', {
          //   duration: 3000,
          // });
        }
      );
    }
  }

  //FOR LOTTIE ANIMATIONs
  playLottieAnimation() {
    this.option1 = {
      path: '/assets/booked.json',
    };
  }
}
