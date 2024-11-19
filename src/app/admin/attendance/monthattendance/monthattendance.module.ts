import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthattendanceComponent } from './monthattendance.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { TableModule } from 'primeng/table';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

const routes: Routes = [{ path: '', component: MonthattendanceComponent }];

@NgModule({
  declarations: [MonthattendanceComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    CapitalizeFirstPipe,
    TableModule,
    FormsModule,
    InputTextModule,
    CalendarModule,
    PreloaderModule,
    [RouterModule.forChild(routes)],
  ],
})
export class MonthattendanceModule {}
