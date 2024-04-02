import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { HomeComponent } from './component/home/home.component';
import { AdminHomeComponent } from './component/admin/home/home.component';
import { RoomComponent } from './component/room/room.component';
import { AdminRoomComponent } from './component/admin/room/room.component';
import { AdminCategoryComponent } from './component/admin/category/category.component';
import { AdminUserComponent } from './component/admin/user/user.component';
import { BookingComponent } from './component/booking/booking.component';
import { AboutComponent } from './component/about/about.component';
import { authGuard } from './guard/auth.guard';
import { OrderComponent } from './component/order/order.component';
import { AdminfeedbackComponent } from './component/admin/adminfeedback/adminfeedback.component';
import { FeedbackComponent } from './component/feedback/feedback.component';

export const routes: Routes = [
  { path: 'room/:id', component: RoomComponent },
  {
    path: 'booking/:id',
    component: BookingComponent,
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'room', component: RoomComponent },
  { path: '', component: HomeComponent },
  { path: 'order', component: OrderComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'admin', component: AdminHomeComponent, canActivate: [authGuard] },
  {
    path: 'adminRoom',
    component: AdminRoomComponent,
    canActivate: [authGuard],
  },
  {
    path: 'adminCategory',
    component: AdminCategoryComponent,
    canActivate: [authGuard],
  },
  {
    path: 'adminUser',
    component: AdminUserComponent,
    canActivate: [authGuard],
  },
  {
    path: 'adminFeedback',
    component: AdminfeedbackComponent,
    canActivate: [authGuard],
  },
  { path: 'booking', component: BookingComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
