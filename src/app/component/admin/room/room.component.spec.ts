import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRoomComponent } from './room.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, NgForm } from '@angular/forms';
import { RoomService } from 'src/app/service/room.service';
import { CategoryService } from 'src/app/service/category.service';
import { of, throwError } from 'rxjs';
import { AppResponse } from 'src/app/model/appResponse';
import { Room } from 'src/app/model/room';

describe('AdminRoomComponent', () => {
  let component: AdminRoomComponent;
  let fixture: ComponentFixture<AdminRoomComponent>;
  let roomService: RoomService;
  let categoryService: CategoryService;

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
    categoryService = TestBed.inject(CategoryService);
  });

  function getAllCategoriesError(errorMessage: string, expectedError: string) {
    const mockErrorResponse = { error: { error: { message: errorMessage } } };
    const categoryServiceSpy = spyOn(
      categoryService,
      'getAllCategories'
    ).and.returnValue(throwError(mockErrorResponse));
    component.ngOnInit();
    expect(categoryServiceSpy).toHaveBeenCalledWith();
    expect(component.error).toEqual(expectedError);
  }

  function getAllRoomsError(errorMessage: string, expectedError: string) {
    const mockErrorResponse = { error: { error: { message: errorMessage } } };
    const roomServiceSpy = spyOn(roomService, 'getAllRooms').and.returnValue(
      throwError(mockErrorResponse)
    );
    component.ngOnInit();
    expect(roomServiceSpy).toHaveBeenCalledWith();
    expect(component.error).toEqual(expectedError);
  }

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

  it('Should perform ngOnInit()', () => {
    spyOn(categoryService, 'getAllCategories').and.returnValue(
      of({
        status: 200,
        timestamp: '',
        data: {
          categories: [
            { id: 1, name: 'Category 1' },
            { id: 2, name: 'Category 2' },
            { id: 3, name: 'Category 3' },
          ],
        },
        error: null,
      })
    );
    component.ngOnInit();
    expect(component.categories.length).toBe(3);
  });

  it('Should handle getAllCategories() error with comma-separated message', () => {
    getAllCategoriesError('Error 1,Error 2', 'Error 1');
  });

  it('Should handle getAllCategories() error without message', () => {
    getAllCategoriesError('', '');
  });

  it('Should handle error in getRooms() with comma-separated message', () => {
    getAllRoomsError('Error 1,Error 2', 'Error 1');
  });

  it('Should handle error in getRooms() with comma-separated message', () => {
    getAllRoomsError('', '');
  });

  it('Should perform addRoom() method', () => {
    const mockAddRoom = {
      description: 'dummy',
      price: 1,
      categoryId: 1,
    };
    const mockNgForm = {
      valid: true,
      value: mockAddRoom,
    } as NgForm;

    spyOn(roomService, 'createRoom').and.returnValue(
      of({
        status: 200,
        timestamp: '',
        data: [],
        error: '',
      })
    );
    spyOn(component, 'ngOnInit');
    component.addRoom(mockNgForm);
    expect(component.ngOnInit).toHaveBeenCalled();
  });

  it('Should perform addRoom() with error', () => {
    const mockAddRoom = {
      description: 'dummy',
      price: 1,
      categoryId: 1,
    };
    const mockNgForm = {
      valid: true,
      value: mockAddRoom,
    } as NgForm;
    spyOn(roomService, 'createRoom').and.returnValue(
      throwError('Error occured')
    );
    component.addRoom(mockNgForm);
    expect(component.error).toBe('Error occured');
  });

  it('addRoomForm invalid part should run in addRoom()', async () => {
    component.file = 'photo';
    component.editId = 100;
    const mockNgForm = {
      valid: true,
      value: {
        id: 1,
        description: 'dummy',
        price: 1,
        categoryId: 1,
      },
    } as NgForm;
    let spy = spyOn(roomService, 'updateRoom').and.returnValue(
      of({
        status: 200,
        timestamp: 'dummy',
        data: [
          {
            id: 1,
            description: 'string',
            price: 1,
            categoryName: 'string',
          },
        ],
        error: null,
      })
    );
    component.addRoom(mockNgForm);
    await fixture.whenStable();
    expect(component.editId).toBe(0);
    expect(spy).toHaveBeenCalled();
  });

  it('Should perform edit()', () => {
    const mockRoom = {
      id: 1,
      price: 1,
      description: 'dummy',
      categoryName: 'dummy',
    };
    component.edit(mockRoom);
    expect(component.selectedRoom.id).toBe(1);
    expect(component.editId).toBe(1);
  });

  it('Should perform error cause in editRoomById()', () => {
    const randomId = 1;
    spyOn(roomService, 'deleteRoom').and.returnValue(
      throwError('error message')
    );
    component.deleteRoomById(randomId);
    expect(component.error).toBe('error message');
  });

  it('Should perform onFileChange()', () => {
    const mockEvent = {
      target: {
        files: ['dummy content'],
      },
    };
    component.onFileChange(mockEvent);
    expect(component.file).toBeDefined();
    expect(component.file).toBe('dummy content');
  });

  it('Should perform resetForm()', () => {
    const mockAddRoomForm = jasmine.createSpyObj('NgForm', ['resetForm']);
    component.addRoomForm = mockAddRoomForm;
    component.resetForm();
    expect(component.addRoomForm.resetForm).toHaveBeenCalled();
  });

  it('Should perform onModalHidden()', () => {
    let spy = spyOn(component, 'resetForm');
    component.onModalHidden();
    expect(spy).toHaveBeenCalled();
  });
});
