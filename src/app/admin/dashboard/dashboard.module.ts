import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { ApexChartsModule } from '../apex-charts/apex-charts.module';
import { TableModule } from 'primeng/table';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SkeletonModule } from 'primeng/skeleton';
const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    ApexChartsModule,
    TableModule,
    LazyLoadImageModule,
    CapitalizeFirstPipe,
    SkeletonModule,
    PreloaderModule,
    CalendarModule,
    FormsModule,
    [RouterModule.forChild(routes)],
  ],
})
export class DashboardModule {}
