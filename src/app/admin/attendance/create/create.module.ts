import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { InputTextModule } from 'primeng/inputtext';

const routes: Routes = [{ path: '', component: CreateComponent }];

@NgModule({
  declarations: [CreateComponent],
  imports: [
    CommonModule,
    ButtonModule,
    BreadcrumbModule,
    DropdownModule,
    FormsModule,
    TableModule,
    PreloaderModule,
    InputTextModule,
    CapitalizeFirstPipe,
    CalendarModule,
    [RouterModule.forChild(routes)],
  ],
})
export class CreateModule {}
