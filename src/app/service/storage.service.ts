import { Injectable } from '@angular/core';
import { AppUser } from '../model/appUser';
import { Room } from '../model/room';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  setLoggedInUser(user: AppUser): void {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  public getLoggedInUser(): AppUser {
    return JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  }

  public removeLoggedInUser(): void {
    localStorage.removeItem('loggedInUser');
  }

  setRoomPrice(price: number): void {
    localStorage.setItem('roomPrice', JSON.stringify(price));
  }

  public getRoomPrice(): number {
    const storedValue = localStorage.getItem('roomPrice');
    return storedValue !== null ? parseFloat(storedValue) : 0;
  }

  public removeRoomPrice(): void {
    localStorage.removeItem('roomPrice');
  }

  public setRoute(route: string | null): void {
    if (route !== null) localStorage.setItem('route', route);
  }

  public getRoute(): string | null {
    return localStorage.getItem('route');
  }

  public removeRoute(): void {
    localStorage.removeItem('route');
  }

  setAuthData(authData: string) {
    localStorage.setItem('authData', authData);
  }

  public getAuthData(): string | null {
    return localStorage.getItem('authData');
  }

  public removeAuthData(): void {
    localStorage.removeItem('authData');
  }

  // public setFromToDate(formValue: string) {
  //   localStorage.setItem('fromToRange', formValue);
  // }

  // public getFromToDate(): string | null {
  //   return localStorage.getItem('fromToRange');
  // }

  // public removeFromToDate(): void {
  //   localStorage.removeItem('fromToRange');
  // }

  // CHECK IN CHECK OUT DATE
  public setCheckInDate(checkInDate: string) {
    localStorage.setItem('checkInDate', checkInDate);
  }

  public getCheckInDate(): string | null {
    return localStorage.getItem('checkInDate');
  }

  public removeCheckInDate(): void {
    localStorage.removeItem('checkInDate');
  }

  setCheckOutDate(checkOutDate: any): void {
    localStorage.setItem('checkOutDate', checkOutDate);
  }

  getCheckOutDate(): string | null {
    return localStorage.getItem('checkOutDate');
  }

  removeCheckOutDate(): void {
    localStorage.removeItem('checkOutDate');
  }
  
}
