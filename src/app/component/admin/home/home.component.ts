import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/model/order';
import { Room } from 'src/app/model/room';
import { User } from 'src/app/model/user';
import { OrderService } from 'src/app/service/order.service';
import { RoomService } from 'src/app/service/room.service';
import { UserService } from 'src/app/service/user.service';
import Chart from 'chart.js/auto';
import { CategoryService } from 'src/app/service/category.service';
import { Category } from 'src/app/model/category';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  error: string = '';

  orders: Order[] = [];
  rooms: Room[] = [];
  users: User[] = [];
  categories: Category[] = [];

  category1Id: number = 0;
  category2Id: number = 0;
  category3Id: number = 0;

  category1Count: number = 0;
  category2Count: number = 0;
  category3Count: number = 0;

  totalOrders: number = 0;
  totalRooms: number = 0;
  totalUsers: number = 0;
  totalPrice: number = 0;

  constructor(
    private orderService: OrderService,
    private roomService: RoomService,
    private userService: UserService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {
    orderService.getAllOrders;
  }
  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data.categories;

        const [category1, category2, category3] = this.categories;

        // Accessing individual category IDs
        this.category1Id = category1?.id;
        this.category2Id = category2?.id;
        this.category3Id = category3?.id;
        this.getAllOrders();
      },
    });

    this.roomService.getAllRooms().subscribe({
      next: (response: any) => {
        this.rooms = response.data;
        this.totalRooms = this.rooms.length;
      },
    });

    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        this.users = response.data;
        this.totalUsers = this.users.length;
      },
    });
  }

  getAllOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (response: any) => {
        this.orders = response.data;
        this.totalOrders = this.orders.length;
        console.log(this.orders);

        response.data.forEach((temp: any) => {
          this.totalPrice += temp.roomPrice;
          if (temp.categoryId === this.category1Id) {
            this.category1Count += 1;
            console.log(this.category1Count);
          } else if (temp.categoryId === this.category2Id) {
            this.category2Count += 1;
            console.log(this.category2Count);
          } else {
            this.category3Count += 1;
            console.log(this.category3Count);
          }
        });
        this.createChart();
      },
      error: (err) => {
        let message: string = err?.error?.error?.message;
        this.error = message.includes(',') ? message.split(',')[0] : message;
      },
    });
  }

  createChart() {
    let xValues = ['Premium', 'Gold', 'Silver'];
    let yValues = [
      this.category1Count,
      this.category2Count,
      this.category3Count,
    ];
    let barColors = ['purple', 'gold', 'silver'];

    let myChart = new Chart('myChart', {
      type: 'pie',
      data: {
        labels: xValues,
        datasets: [
          {
            backgroundColor: barColors,
            data: yValues,
          },
        ],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Category based room booking',
            font: {
              size: 20,
            },
          },
        },
        layout: {
          padding: {
            top: 50,
            bottom: 300,
          },
        },
      },
    });
  }

  deleteOrder(id: any) {
    this.orderService.deleteOrder(id).subscribe(
      (response) => {
        // this.snackBar.open('Order deleted successfully', 'Close', {
        //   duration: 3000,
        // });
        this.orders = this.orders.filter((order) => order.id !== id);
      },
      (error) => {
        // this.snackBar.open('Error deleting order', 'Close', {
        //   duration: 3000,
        //   horizontalPosition: 'right',
        // });
      }
    );
  }
}
