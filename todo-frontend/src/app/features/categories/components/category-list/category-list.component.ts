// src/app/features/categories/components/category-list/category-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CategoryResponse } from '../../models/category.model';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-category-list',
  standalone: false,
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: CategoryResponse[] = [];
  filteredCategories: CategoryResponse[] = [];
  isLoading = true;
  error = '';
  searchKeyword = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.error = '';
    
    this.categoryService.getCategories()
      .pipe(
        catchError(err => {
          this.error = err.message || 'Failed to load categories';
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(categories => {
        this.categories = categories;
        this.applyFilter();
      });
  }
  
  applyFilter(): void {
    if (!this.searchKeyword.trim()) {
      this.filteredCategories = [...this.categories];
    } else {
      const keyword = this.searchKeyword.toLowerCase().trim();
      this.filteredCategories = this.categories.filter(category => 
        category.name.toLowerCase().includes(keyword) || 
        (category.description && category.description.toLowerCase().includes(keyword))
      );
    }
  }
  
  search(): void {
    this.applyFilter();
  }
  
  clearSearch(): void {
    this.searchKeyword = '';
    this.applyFilter();
  }
  
  createCategory(): void {
    this.router.navigate(['/categories/new']);
  }
  
  viewCategoryTasks(id: number): void {
    this.router.navigate(['/categories', id]);
  }
  
  editCategory(id: number, event: MouseEvent): void {
    event.stopPropagation(); // Prevent triggering viewCategoryTasks
    this.router.navigate(['/categories', id, 'edit']);
  }
  
  deleteCategory(id: number, event: MouseEvent): void {
    event.stopPropagation(); // Prevent triggering viewCategoryTasks
    
    if (confirm('Are you sure you want to delete this category? Tasks assigned to this category will be unassigned, but not deleted.')) {
      this.categoryService.deleteCategory(id)
        .pipe(
          catchError(err => {
            this.error = err.message || 'Failed to delete category';
            return of(null);
          })
        )
        .subscribe(() => {
          this.loadCategories();
        });
    }
  }
  
  getContrastColor(hexColor?: string): string {
    if (!hexColor) return 'text-black';
    
    // Remove # if present
    hexColor = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    // Calculate brightness (YIQ formula)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return white text for dark backgrounds, black text for light backgrounds
    return brightness > 128 ? 'text-black' : 'text-white';
  }
  
  getCategoryColorStyle(category: CategoryResponse): any {
    if (!category.color) return { 'background-color': '#e5e7eb' }; // Tailwind gray-200
    return { 'background-color': category.color };
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  }
}