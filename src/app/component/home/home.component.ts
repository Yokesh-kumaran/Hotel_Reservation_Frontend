import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/service/category.service';
import { Category } from 'src/app/model/category';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { StorageService } from 'src/app/service/storage.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  error: string = '';
  category: Category = {
    id: 0,
    name: '',
    amenityId: 0,
  };

  categories: Category[] = [];
  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private storageService: StorageService,
    private authService:AuthService
  ) {
    categoryService.getAllCategories;
  }
  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response: any) => {
        let categories: Category[] = response.data.categories;

        if (categories && categories.length > 0) {
          this.categories = categories;
          this.category = categories[0];
        }
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

  navigateToRoomPage(categoryId: number) {
    this.router.navigate(['/room', categoryId]);
  }

  //FOR LOTTIE ANIMATIONs
  option1: AnimationOptions = {
    path: '/assets/premium.json',
  };

  option2: AnimationOptions = {
    path: '/assets/gold.json',
  };

  option3: AnimationOptions = {
    path: '/assets/silver.json',
  };

  //FOR SCROLLING THE PAGE UP
  scrollPageUp() {
    window.scrollTo({ top: 1300, behavior: 'smooth' });
  }

  //FOR TOGGLE WHILE PRESSING + ICONS
  showRestaurantDescription: boolean = false;
  showTransportDescription: boolean = false;
  showBestCareDescription: boolean = false;
  showDeluxeRoomDescription: boolean = false;

  toggleRestaurantDescription() {
    this.showRestaurantDescription = !this.showRestaurantDescription;
  }

  toggleTransportDescription() {
    this.showTransportDescription = !this.showTransportDescription;
  }

  toggleBestCareDescription() {
    this.showBestCareDescription = !this.showBestCareDescription;
  }

  toggleDeluxeRoomDescription() {
    this.showDeluxeRoomDescription = !this.showDeluxeRoomDescription;
  }

  //LOGOUT HANDLER
  logoutHandler(){
    this.authService.logout();
    this.router.navigate(["/"]);
  }
}
