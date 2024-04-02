import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRoomComponent } from './room.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { RoomService } from 'src/app/service/room.service';
import { CategoryService } from 'src/app/service/category.service';
import { of } from 'rxjs';
import { AppResponse } from 'src/app/model/appResponse';
import { Room } from 'src/app/model/room';

describe('AdminRoomComponent', () => {
  let component: AdminRoomComponent;
  let fixture: ComponentFixture<AdminRoomComponent>;
  let roomService: RoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRoomComponent],
      imports: [HttpClientModule, MatSnackBarModule, FormsModule],
      providers: [RoomService, MatSnackBar, CategoryService],
    }).compileComponents();
    fixture = TestBed.createComponent(AdminRoomComponent);
    component = fixture.componentInstance;
    component = new AdminRoomComponent(
      TestBed.inject(RoomService),
      TestBed.inject(MatSnackBar),
      TestBed.inject(CategoryService)
    );
    roomService = TestBed.inject(RoomService);
  });

  it('AdminRoomComponent should created', () => {
    expect(component).toBeTruthy();
  });

  it('should have an input element with type "hidden"', () => {
    const compiled = fixture.nativeElement;
    const inputElement = compiled.querySelector('input#id');
    expect(inputElement.getAttribute('type')).toBe('hidden');
  });

  it('should call getAllRooms method after constructor', () => {
    spyOn(roomService, 'getAllRooms').and.returnValue(of({} as AppResponse));
    fixture.detectChanges();
    expect(roomService.getAllRooms).toHaveBeenCalled();
  });

  it('Should increase rooms length after calling the getAllRooms from service', () => {
    spyOn(roomService, 'getAllRooms').and.returnValue(
      of({
        data: [{}, {}, {}, {}, {}, {}] as Room[],
      } as AppResponse)
    );
    component.getRooms();
    fixture.detectChanges();
    expect(component.rooms.length).toBeGreaterThan(5);
  });

  it('should delete room when deleteRoomById is called', () => {
    spyOn(roomService, 'deleteRoom').and.returnValue(of({} as AppResponse));
    const roomIdToDelete = 1;
    const initialRooms: Room[] = [
      { id: 1, description: 'Room 1', price: 1, categoryName: '1' },
      { id: 2, description: 'Room 2', price: 2, categoryName: '2' },
    ];
    component.rooms = initialRooms;
    component.deleteRoomById(roomIdToDelete);
    fixture.detectChanges();
    expect(component.rooms.some((room) => room.id === roomIdToDelete)).toBe(
      false
    );
  });
});
