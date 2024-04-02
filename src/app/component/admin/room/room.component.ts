import { Component, OnInit, ViewChild } from '@angular/core';
import { Room } from 'src/app/model/room';
import { RoomService } from 'src/app/service/room.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';
import { CategoryService } from 'src/app/service/category.service';
import { Category } from 'src/app/model/category';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class AdminRoomComponent implements OnInit {
  @ViewChild('addRoomForm') addRoomForm: any;
  error: string = '';
  editId: number = 0;
  file = '';

  selectedRoom: Room = {
    id: 0,
    photo: null,
    description: '',
    price: 0,
    categoryId: 0,
    categoryName: '',
  };

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

  categories: Category[] = [];
  rooms: Room[] = [];
  selectedCategoryId: number = 0;
  getBranch: any = [];

  constructor(
    private roomService: RoomService,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService
  ) {
    roomService.getAllRooms;
  }

  ngOnInit(): void {
    this.getRooms();
    console.log(this.getRooms());

    this.categoryService.getAllCategories().subscribe({
      next: (response: any) => {
        let categories: Category[] = response.data.categories;

        if (categories && categories.length > 0) {
          this.categories = categories;
        }
      },
      error: (err) => {
        let message: string = err?.error?.error?.message;
        this.error = message.includes(',') ? message.split(',')[0] : message;
      },
    });
  }

  //GET ALL ROOMS
  getRooms() {
    this.roomService.getAllRooms().subscribe({
      next: (response: any) => {
        let rooms: Room[] = response.data;

        if (rooms.length > 0) {
          this.rooms = rooms;
          this.room = rooms[0];
        }
      },
      error: (err) => {
        let message: string = err?.error?.error?.message;
        this.error = message.includes(',') ? message.split(',')[0] : message;
      },
    });
  }

  //ADD ROOM
  addRoom(addRoomForm: NgForm): void {
    if (addRoomForm.valid) {
      const formData = new FormData();
      formData.append('photo', this.file);
      formData.append('description', addRoomForm.value.description);
      formData.append('price', addRoomForm.value.price);
      formData.append('categoryId', addRoomForm.value.categoryId);

      // const description = addRoomForm.value.description;
      // const photo = addRoomForm.value.photo;
      // const price = addRoomForm.value.price;
      // const categoryId = addRoomForm.value.categoryId;

      // const addRoom: Addroom = {
      //   description: description,
      //   photo: photo,
      //   price: price,
      //   categoryId: categoryId,
      // };

      if (this.editId === 0) {
        this.roomService.createRoom(formData).subscribe(
          (response) => {
            this.ngOnInit();
          },
          (error) => {
            this.snackBar.open('Error adding room', 'Close', {
              duration: 3000,
            });
          }
        );
        addRoomForm.reset();
      } else {
        this.editId = addRoomForm.value.id;
        console.log(this.editId);

        const formData = new FormData();

        formData.append('id', this.editId.toString());
        formData.append('photo', this.file);
        formData.append('description', addRoomForm.value.description);
        formData.append('price', addRoomForm.value.price);
        formData.append('categoryId', addRoomForm.value.categoryId);

        this.roomService.updateRoom(formData).subscribe({
          next: (response: any) => {
            this.rooms = response.data;

            // this.snackBar.open('Room edited successfully', 'Close', {
            //   duration: 3000,
            // });
          },
          error: (err) => {
            console.log(err);

            this.snackBar.open('Error editing room', 'Close', {
              duration: 3000,
            });
          },
        });
        addRoomForm.reset();
        this.editId = 0;
      }
    }
  }

  //EDIT FOR POPUP
  edit(room: Room) {
    this.selectedRoom = { ...room };
    this.editId = 1;
  }

  //DELETE ROOM BY ID
  deleteRoomById(id: number) {
    this.roomService.deleteRoom(id).subscribe(
      (response) => {
        this.rooms = this.rooms.filter((room) => room.id !== id);
      },
      (error) => {
        this.snackBar.open('Error deleting room', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
        });
      }
    );
  }

  onFileChange(event: any) {
    const fileInput = event.target;
    if (fileInput && fileInput.files.length > 0) {
      this.file = fileInput.files[0];
    }
  }

  resetForm() {
    this.addRoomForm.resetForm();
  }

  onModalHidden() {
    this.resetForm();
    this.editId = 0;
  }
}
