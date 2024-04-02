export interface Order {
  id: number;
  name?: string;
  userId: number;
  roomId: number;
  price: number;
  checkInDate: string;
  checkOutDate: string;
  address1: string;
  address2: string;
  adults: number;
  checkInTime: string;
  checkOutTime: string;
  children: number;
  city: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: number;
  state: string;
  zipCode: number;
}
