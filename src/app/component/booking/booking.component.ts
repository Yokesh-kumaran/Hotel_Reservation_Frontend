import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AppResponse } from 'src/app/model/appResponse';
import { Order } from 'src/app/model/order';
import { MailService } from 'src/app/service/mail.service';
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
  checkInDate: string = '';
  checkOutDate: string = '';

  error = '';

  minDate: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private orderService: OrderService,
    private mailService: MailService
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
    this.checkInDate = this.storageService.getCheckInDate()!;
    this.checkOutDate = this.storageService.getCheckOutDate()!;
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
      const checkInDate = this.checkInDate;
      const checkOutDate = this.checkOutDate;
      const checkInTime = this.defaultCheckInTime;
      const checkOutTime = this.defaultCheckOutTime;
      const adults = bookingForm.value.adults;
      const children = bookingForm.value.children;

      const order: Order = {
        id: 0,
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

      this.orderService.placeOrders(order).subscribe({
        next: () => {},
        complete: () => {
          //Mail trigger
          const mail: any = {
            email: order.email,
            roomNo: order.roomId,
            price: order.price,
            bookingName: order.firstName + ' ' + order.lastName,
            checkInDate: order.checkInDate,
            checkOutDate: order.checkOutDate,
            checkInTime: order.checkInTime,
            checkOutTime: order.checkOutTime,
            adults: order.adults,
            children: order.children,
          };

          this.mailService.sendEmail(mail).subscribe({});

          this.playLottieAnimation();
          setTimeout(() => {
            this.storageService.removeRoomPrice();
            this.storageService.removeCheckInDate();
            this.storageService.removeCheckOutDate();
            this.router.navigate(['/']);
          }, 2000);
        },
      });
    }
  }

  //FOR LOTTIE ANIMATIONs
  playLottieAnimation() {
    this.option1 = {
      path: '/assets/booked.json',
    };
  }
}
