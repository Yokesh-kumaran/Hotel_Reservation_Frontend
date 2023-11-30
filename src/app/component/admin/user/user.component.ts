import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class AdminUserComponent implements OnInit {
  error: string = '';
  user: User = {
    id: 0,
    name: '',
    username: '',
    joinedAt: '',
  };

  users: User[] = [];
  constructor(private userService: UserService, private snackBar: MatSnackBar) {
    userService.getAllUsers;
  }
  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        let users: User[] = response.data;

        if (users.length > 0) {
          this.users = users;
          this.user = users[0];
        }
      },
      error: (err) => {
        let message: string = err?.error?.error?.message;
        this.error = message.includes(',') ? message.split(',')[0] : message;
      },
    });
  }

  deleteUser(id: number) {
    this.userService.deleteUserById(id).subscribe(
      (response) => {
        this.snackBar.open('User deleted successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.users = this.users.filter((user) => user.id !== id);
      },
      (error) => {
        this.snackBar.open('Error deleting user', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
        });
      }
    );
  }
}
