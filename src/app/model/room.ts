export interface Room {
  id: number;
  description: string;
  price: number;
  photo?: null;
  createdAt?: null;
  categoryId?: number;
  categoryName: string;
  bedCount?: number;
  powerBackup?: boolean;
  ac?: boolean;
  tv?: boolean;
  wifi?: boolean;
  breakfast?: boolean;
  lunch?: boolean;
  dinner?: boolean;
  parkingFacility?: boolean;
  cctvCameras?: boolean;
}
