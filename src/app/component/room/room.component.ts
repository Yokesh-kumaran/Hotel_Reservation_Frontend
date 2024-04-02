import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from 'src/app/model/room';
import { RoomService } from 'src/app/service/room.service';
import { StorageService } from 'src/app/service/storage.service';
import { Roomfilter } from 'src/app/model/roomfilter';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  // room: Room = {
  //   id: 0,
  //   description: '',
  //   price: 0,
  //   photo: null,
  //   createdAt: null,
  //   categoryId: 0,
  //   categoryName: '',
  //   bedCount: 0,
  //   powerBackup: false,
  //   ac: false,
  //   tv: false,
  //   wifi: false,
  //   breakfast: false,
  //   lunch: false,
  //   dinner: false,
  //   parkingFacility: false,
  //   cctvCameras: false,
  // };

  checkInDate: string = '';
  checkOutDate: string = '';
  filtered: boolean = false;
  allFiltered: boolean = false;
  error: string = '';
  validDate: number = 0;
  rooms: Room[] = [];
  filteredRoom: Room[] = [];
  categoryRoom: Room[] = [];
  priceFilter: Room[] = [];
  priceFiltered: boolean = false;
  isLoggedIn = false;
  categoryId: number = 0;
  minDate: string = '';
  getBranch: any = [];
  chennaiRooms: Room[] = [];
  keralaRooms: Room[] = [];
  isChennaiRooms: boolean = false;
  isKeralaRooms: boolean = false;
  selectedBranch: string = '';
  branchError = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roomService: RoomService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');
    this.categoryId = parseInt(categoryId!);
    if (isNaN(this.categoryId)) {
      this.categoryId = 0;
    }
    const loggedInUser = this.storageService.getLoggedInUser();
    if (loggedInUser.id) {
      this.isLoggedIn = true;
    }
    const currentDate = new Date();
    this.minDate = this.formatDate(currentDate);
  }

  //DATE FILTER
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  navigateToBookingPage(roomId: number, price: number) {
    if (this.isLoggedIn === true) {
      // Convert strings to Date objects
      const checkInDate: Date = new Date(this.checkInDate);
      const checkOutDate: Date = new Date(this.checkOutDate);

      // Calculate the difference in milliseconds
      const timeDifference: number =
        checkOutDate.getTime() - checkInDate.getTime();

      // Convert the time difference to days
      const daysDifference: number = timeDifference / (1000 * 60 * 60 * 24) + 1;

      price = price * daysDifference;

      this.router.navigate(['/booking', roomId]);
      this.storageService.setRoomPrice(price);
      this.storageService.setCheckInDate(this.checkInDate);
      this.storageService.setCheckOutDate(this.checkOutDate);
    } else {
      this.router.navigate(['/login']);
    }
  }

  shouldShowMore() {
    return true;
  }

  //FILTER DATES SUBMIT
  onFormSubmit(filterForm: NgForm) {
    if (this.selectedBranch === '') {
      this.branchError = true;
    } else {
      this.branchError = false;
    }
    this.categoryRoom = [];
    const checkInDate = filterForm.value.checkInDate;
    const checkOutDate = filterForm.value.checkOutDate;
    const branch = this.selectedBranch;
    if (checkInDate <= checkOutDate) {
      this.checkInDate = checkInDate;
      this.checkOutDate = checkOutDate;
      this.validDate = 1;
      const roomFilter: Roomfilter = {
        startDate: checkInDate,
        endDate: checkOutDate,
        place: branch,
      };
      this.roomService.filterRoom(roomFilter).subscribe(
        (response) => {
          this.filteredRoom = response.data;
          this.filteredRoom.forEach((room) => {
            if (room.branch === 'chennai') {
              this.isChennaiRooms = true;
              this.isKeralaRooms = false;
              this.chennaiRooms.push(room);
            } else if (room.branch === 'kerala') {
              this.isKeralaRooms = true;
              this.isChennaiRooms = false;
              this.keralaRooms.push(room);
            }
          });

          if (this.categoryId !== 0) {
            this.roomService.getRoomByCategoryId(this.categoryId).subscribe({
              next: (response: any) => {
                this.rooms = response.data;
                this.matchToCategory();
              },
              error: (err) => {},
            });
          } else {
            this.filtered = true;
          }
        },
        (error) => {}
      );
    } else {
      this.validDate = 2;
    }
  }

  //FILTERING ROOM
  matchToCategory() {
    for (let room of this.rooms) {
      if (this.filteredRoom.some((filter_Room) => filter_Room.id === room.id)) {
        this.categoryRoom.push(room);
      }
    }
    this.filtered = true;
    this.ngOnInit();
  }

  // FOR LOTTIE ANIMATIONS
  option1: AnimationOptions = {
    path: '/assets/search.json',
  };

  // FOR BINDING BRANCH
  selectBranch(branch: string) {
    this.selectedBranch = branch;
  }
}
