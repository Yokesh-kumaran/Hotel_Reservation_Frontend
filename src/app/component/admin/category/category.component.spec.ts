import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { AdminCategoryComponent } from './category.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CategoryService } from 'src/app/service/category.service';
import { urlEndpoint } from 'src/app/utils/constant';
import { of, throwError } from 'rxjs';
import { Category } from 'src/app/model/category';

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
      data: { categories: ['Category1'] },
    });
  });

  it('should handle error in getAllCategories service call', () => {
    const errorMessage = 'Test error message with comma, additional message';
    spyOn(service, 'getAllCategories').and.returnValue(
      throwError({ error: { error: { message: errorMessage } } })
    );
    component.ngOnInit();
    expect(component.error).toBe('Test error message with comma');
  });

  it('Should store the selected category', () => {
    const mockCategory: Category = {
      id: 1,
      name: 'dummy',
      amenityId: 1,
    };
    component.edit(mockCategory);
    expect(component.selectedCategory).toEqual(mockCategory);
  });

  it('Should perform edit category method', fakeAsync(() => {
    const mockCategory = {
      category: 'dummy',
      id: 1,
      amenityId: 1,
    };

    const mockNgForm = {
      valid: true,
      value: mockCategory,
    } as NgForm;
    component.editCategory(mockNgForm);
    expect(mockNgForm.value.category).toBe('dummy');

    const spy = spyOn(service, 'updateCategory').and.returnValue(
      of({
        status: 200,
        timestamp: '2022-01-01T12:00:00Z',
        data: [],
        error: null,
      })
    );
    component.editCategory(mockNgForm);
    const expectedCategory: Category = {
      id: mockCategory.id,
      name: mockCategory.category,
      amenityId: mockCategory.amenityId,
    };
    expect(spy).toHaveBeenCalledWith(expectedCategory);
  }));
});
