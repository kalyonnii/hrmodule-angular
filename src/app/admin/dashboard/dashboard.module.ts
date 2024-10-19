import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { ApexChartsModule } from '../apex-charts/apex-charts.module';

const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    ApexChartsModule,
    PreloaderModule,
    [RouterModule.forChild(routes)],
  ],
})
export class DashboardModule {}
