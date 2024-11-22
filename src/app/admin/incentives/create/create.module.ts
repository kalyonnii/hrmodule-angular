import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create.component';
import { RouterModule, Routes } from '@angular/router';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';

const routes: Routes = [{ path: '', component: CreateComponent }];

@NgModule({
  declarations: [CreateComponent],
  imports: [
    CommonModule,
    PreloaderModule,
    PreloaderModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    DropdownModule,
    CalendarModule,
    TabMenuModule,
    InputTextModule,
    ButtonModule,
    RouterModule.forChild(routes),
  ],
})
export class CreateModule {}
