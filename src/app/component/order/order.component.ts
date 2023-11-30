import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { AppUser } from 'src/app/model/appUser';
import { Order } from 'src/app/model/order';
import { OrderService } from 'src/app/service/order.service';
import { RoomService } from 'src/app/service/room.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit{
  constructor(
    private orderService: OrderService,
    private storageService: StorageService
  ) {}

  isLoggedIn = false;
  error: string = '';
  orders: Order[] = [];
  isOrdered = false;
  userId: number = 0;
  ngOnInit(): void {
    const loggedInUser: AppUser = this.storageService.getLoggedInUser();
    this.userId = loggedInUser.id;
    if (this.userId) {
      this.isLoggedIn = true;
    }

    this.orderService.getUserOrders(this.userId).subscribe({
      next: (response: any) => {
        this.orders = response.data;
        if(this.orders.length > 0){
          this.isOrdered = true;
        }
      },
      error: (err) => {
        let message: string = err?.error?.error?.message;
        this.error = message.includes(',') ? message.split(',')[0] : message;
      },
    });
  }

  //FOR LOTTIE ANIMATIONs
  option1: AnimationOptions = {
    path: '/assets/noorders.json',
  };
}
