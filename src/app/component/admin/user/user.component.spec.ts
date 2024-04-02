import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { AdminUserComponent } from './user.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { AppResponse } from 'src/app/model/appResponse';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { urlEndpoint } from 'src/app/utils/constant';

describe('AdminUserComponent', () => {
  let component: AdminUserComponent;
  let fixture: ComponentFixture<AdminUserComponent>;
  let userService: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUserComponent],
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [UserService],
    });
    fixture = TestBed.createComponent(AdminUserComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('AdminUserComponent should created', () => {
    expect(component).toBeTruthy();
  });

  it('Table should contains two columns (i.e - userid and name...)', () => {
    const columns = fixture.debugElement.queryAll(By.css('th'));
    const columnNames = columns.map((col) =>
      col.nativeElement.textContent.trim()
    );

    expect(columnNames).toContain('User Id');
    expect(columnNames).toContain('Name');
  });

  it('Should call getAllUsers() method', () => {
    let spy = spyOn(userService, 'getAllUsers').and.callThrough();
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('Should call deleteUserById() method to delete particular user', () => {
    let spy = spyOn(userService, 'deleteUserById').and.callThrough();
    component.deleteUser(1);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should delete the user', fakeAsync(() => {
    spyOn(userService, 'deleteUserById').and.returnValue(of({} as AppResponse));
    const userIdToDelete = 1;
    const initialRooms: User[] = [
      { id: 1, name: 'Room 1', username: 'Room 1', joinedAt: '1' },
      { id: 2, name: 'Room 2', username: 'Room 2', joinedAt: '1' },
      { id: 3, name: 'Room 3', username: 'Room 3', joinedAt: '1' },
    ];
    component.users = initialRooms;
    component.deleteUser(userIdToDelete);
    tick();
    fixture.detectChanges();
    expect(component.users.some((user) => user.id === userIdToDelete)).toBe(
      false
    );
    flush();
  }));
});
