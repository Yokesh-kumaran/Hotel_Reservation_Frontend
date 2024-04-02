import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdminCategoryComponent } from './category.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CategoryService } from 'src/app/service/category.service';
import { urlEndpoint } from 'src/app/utils/constant';

describe('AdminCategoryComponent', () => {
  let component: AdminCategoryComponent;
  let fixture: ComponentFixture<AdminCategoryComponent>;
  let httpMock: HttpTestingController;
  let service: CategoryService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCategoryComponent],
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        FormsModule,
        HttpClientTestingModule,
      ],
      providers: [CategoryService],
    });
    fixture = TestBed.createComponent(AdminCategoryComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CategoryService);
    fixture.detectChanges();
  }));

  it('AdminCategoryComponent should created', () => {
    expect(component).toBeTruthy();
  });

  it('Table should contains two columns (i.e - name and action)', () => {
    const columns = fixture.debugElement.queryAll(By.css('th'));
    const columnNames = columns.map((col) =>
      col.nativeElement.textContent.trim()
    );

    expect(columnNames).toContain('Name');
    expect(columnNames).toContain('Action');
  });

  it('Should bind ngModule value correctly', async () => {
    const inputElement: HTMLInputElement =
      fixture.nativeElement.querySelector('#amenityId');
    component.selectedCategory.amenityId = 10;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(inputElement.value).toBe('10');
  });

  it('should call the API to get all categories', () => {
    const req = httpMock.expectOne(`${urlEndpoint.baseUrl}/category/all`);
    expect(req.request.method).toEqual('GET');
    req.flush({
      status: 200,
      timestamp: new String(),
      error: [],
      data: { categories: [] },
    });
  });
});
