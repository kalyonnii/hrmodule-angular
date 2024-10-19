import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';

const routes: Routes = [{ path: '', component: CreateComponent }];


@NgModule({
  declarations: [
    CreateComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    InputTextModule,
    PreloaderModule,
    InputTextareaModule,
    DropdownModule,
    FormsModule,
    CalendarModule,
    ReactiveFormsModule,
    [RouterModule.forChild(routes)],
  ]
})
export class CreateModule { }
