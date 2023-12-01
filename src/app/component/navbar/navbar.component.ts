import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}
  isLoggedIn = false;
  // @Output() logoutClicked = new EventEmitter<void>();

  ngOnInit(): void {
    const loggedInUser = this.storageService.getLoggedInUser();
    if (loggedInUser.id) {
      this.isLoggedIn = true;
    }
  }

  logoutHandler() {
    this.authService.logout();
    this.router.navigate(['/']);
    // this.logoutClicked.emit();
  }
}
