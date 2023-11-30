import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from 'src/app/model/room';
import { Searchrange } from 'src/app/model/searchrange';
import { RoomService } from 'src/app/service/room.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  room: Room = {
    id: 0,
    description: '',
    price: 0,
    photo: null,
    createdAt: null,
    categoryName: '',
    bedCount: 0,
    powerBackup: false,
    ac: false,
    tv: false,
    wifi: false,
    breakfast: false,
    lunch: false,
    dinner: false,
    parkingFacility: false,
    cctvCameras: false,
  };

  error: string = '';
  rooms: Room[] = [];
  isLoggedIn = false;
  // form: FormGroup;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private roomService: RoomService,
    private storageService: StorageService,
    private fb: FormBuilder
  ) {}
  // this.form = this.fb.group({
  //   start_date: ['', Validators.required],
  //   end_date: ['', Validators.required],
  // });

  //   this.form.get('check-in-date')!.valueChanges.subscribe((value) => {
  //     const dropDateControl = this.form.get('check-out-date');
  //     if (value) {
  //       dropDateControl!.enable();
  //       dropDateControl!.setValidators([
  //         Validators.required,
  //         this.validateDropDate.bind(this),
  //       ]);
  //     } else {
  //       dropDateControl!.disable();
  //       dropDateControl!.clearValidators();
  //     }
  //     dropDateControl!.updateValueAndValidity();
  //   });
  // }

  // validateDropDate(control: AbstractControl) {
  //   const pickupDate = new Date(this.form.get('check-in-date')!.value);
  //   const dropDate = new Date(control.value);

  //   if (pickupDate && dropDate && dropDate <= pickupDate) {
  //     return { invalidDropDate: true };
  //   }

  //   return null;
  // }

  // onFormSubmit(): void {
  //   if (this.form.valid) {
  //     const formValue: Searchrange = this.form.value;
  //     const formValueString = JSON.stringify(formValue);
  //     this.storageService.setFromToDate(formValueString);

  //     this.userFindCarService.findCars(formValue).subscribe({
  //       next: (response: AppResponse) => {
  //         this.searchResults = response.data;
  //         console.log('Response:', response.data);
  //         this.showResults = true;
  //       },
  //       complete: () => {},
  //       error: (error: Error) => {
  //         console.log('Message:', error.message);
  //         console.log('Name:', error.name);
  //       },
  //     });
  //   }
  // }

  categoryId: number | undefined;
  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');
    this.categoryId = parseInt(categoryId!);

    this.roomService.getRoomByCategoryId(this.categoryId).subscribe({
      next: (response: any) => {
        this.rooms = response.data;
      },
      error: (err) => {
        let message: string = err?.error?.error?.message;
        this.error = message.includes(',') ? message.split(',')[0] : message;
      },
    });

    const loggedInUser = this.storageService.getLoggedInUser();
    if (loggedInUser.id) {
      this.isLoggedIn = true;
    }
  }

  navigateToBookingPage(roomId: number, price: number) {
    if (this.isLoggedIn === true) {
      this.router.navigate(['/booking', roomId]);
      this.storageService.setRoomPrice(price);
    } else {
      this.router.navigate(['/login']);
    }
  }

  shouldShowMore() {
    return true;
  }
}
