import { NgFor } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class AdminCategoryComponent implements OnInit {
  @ViewChild('editCategoryForm') editCategoryForm: any;
  categories: Category[] = [];
  error: string = '';

  constructor(
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {}

  selectedCategory: Category = {
    id: 0,
    name: '',
  };

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response: any) => {
        let categories: Category[] = response.data.categories;

        if (categories && categories.length > 0) {
          this.categories = categories;
        }
      },
      error: (err) => {
        let message: string = err?.error?.error?.message;
        this.error = message.includes(',') ? message.split(',')[0] : message;
      },
    });
  }

  edit(category: Category) {
    this.selectedCategory = { ...category };
  }

  editCategory(editCategoryForm: NgForm) {
    if (editCategoryForm.valid) {
      const name = editCategoryForm.value.category;
      const id = editCategoryForm.value.id;

      const selectedCategory: Category = {
        id: id,
        name: name,
      };

      this.categoryService.updateCategory(selectedCategory).subscribe(
        (response) => {
          // this.snackBar.open('Category edited successfully', 'Close', {
          //   duration: 3000,
          //   horizontalPosition: 'right',
          //   verticalPosition: 'bottom',
          // });
          this.ngOnInit();
        },
        (error) => {
          // this.snackBar.open('Error adding room', 'Close', {
          //   duration: 3000,
          // });
        }
      );
    }
  }

  resetForm() {
    this.editCategoryForm.resetForm();
  }

  onModalHidden() {
    this.resetForm();
  }
}
