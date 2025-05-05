import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { HighlightDirective } from './directives/highlight.directive';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { FilterPipe } from './pipes/filter.pipe';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ClickOutsideDirective,
    HighlightDirective,
    DateFormatPipe,
    FilterPipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
