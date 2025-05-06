// src/app/features/categories/components/category-form/category-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CategoryRequest } from '../../models/category.model';
import { Location } from '@angular/common';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-category-form',
  standalone: false,  
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;
  isLoading = false;
  isSubmitting = false;
  error = '';
  presetColors = [
    '#FF6B6B', // Red
    '#FF9E7D', // Orange
    '#FFD93D', // Yellow
    '#6BCB77', // Green
    '#4D96FF', // Blue
    '#9B5DE5', // Purple
    '#F15BB5', // Pink
    '#00BBF9', // Light Blue
    '#00F5D4', // Turquoise
    '#FB5607', // Deep orange
    '#8338EC', // Violet
    '#3A86FF', // Royal blue
    '#606C38', // Olive
    '#023047', // Dark blue
    '#7209B7', // Dark purple
  ];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.categoryForm = this.createForm();
  }

  ngOnInit(): void {
    // Check if there's an ID parameter (edit mode)
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(+id)) {
      this.isEditMode = true;
      this.categoryId = +id;
      this.loadCategoryData(+id);
    }
  }
  
  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(200)],
      color: ['#4D96FF'] // Default color
    });
  }
  
  loadCategoryData(id: number): void {
    this.isLoading = true;
    
    this.categoryService.getCategory(id)
      .pipe(
        catchError(err => {
          this.error = err.message || 'Failed to load category data';
          return of(null);
        })
      )
      .subscribe(category => {
        if (category) {
          // Patch form with category data
          this.categoryForm.patchValue({
            name: category.name,
            description: category.description || '',
            color: category.color || '#4D96FF'
          });
        }
        
        this.isLoading = false;
      });
  }
  
  onSubmit(): void {
    if (this.categoryForm.invalid) {
      // Mark all controls as touched to trigger validation messages
      Object.keys(this.categoryForm.controls).forEach(key => {
        const control = this.categoryForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }
    
    this.isSubmitting = true;
    
    // Create request payload
    const categoryRequest: CategoryRequest = {
      name: this.categoryForm.value.name,
      description: this.categoryForm.value.description,
      color: this.categoryForm.value.color
    };
    
    if (this.isEditMode && this.categoryId) {
      // Update existing category
      this.categoryService.updateCategory(this.categoryId, categoryRequest)
        .pipe(
          catchError(err => {
            this.error = err.message || 'Failed to update category';
            this.isSubmitting = false;
            return of(null);
          })
        )
        .subscribe(response => {
          if (response) {
            this.router.navigate(['/categories']);
          }
          
          this.isSubmitting = false;
        });
    } else {
      // Create new category
      this.categoryService.createCategory(categoryRequest)
        .pipe(
          catchError(err => {
            this.error = err.message || 'Failed to create category';
            this.isSubmitting = false;
            return of(null);
          })
        )
        .subscribe(response => {
          if (response) {
            this.router.navigate(['/categories']);
          }
          
          this.isSubmitting = false;
        });
    }
  }
  
  selectColor(color: string): void {
    this.categoryForm.patchValue({ color });
  }
  
  cancel(): void {
    this.location.back();
  }
  
  // Helper methods for form validation
  get nameInvalid(): boolean {
    const control = this.categoryForm.get('name');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  
  get nameErrorMessage(): string {
    const control = this.categoryForm.get('name');
    if (!control) return '';
    
    if (control.errors?.['required']) {
      return 'Name is required';
    }
    
    if (control.errors?.['maxlength']) {
      return 'Name cannot exceed 50 characters';
    }
    
    return '';
  }
  
  get descriptionInvalid(): boolean {
    const control = this.categoryForm.get('description');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  
  get descriptionErrorMessage(): string {
    const control = this.categoryForm.get('description');
    if (!control || !control.errors) return '';
    
    if (control.errors['maxlength']) {
      return 'Description cannot exceed 200 characters';
    }
    
    return '';
  }
  
  get colorInvalid(): boolean {
    const control = this.categoryForm.get('color');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  
  get colorErrorMessage(): string {
    const control = this.categoryForm.get('color');
    if (!control || !control.errors) return '';
    
    if (control.errors['pattern']) {
      return 'Invalid color format. Use hex color code (e.g., #FF0000)';
    }
    
    return '';
  }
}