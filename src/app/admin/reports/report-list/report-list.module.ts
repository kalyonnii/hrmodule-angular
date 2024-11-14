import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportListComponent } from './report-list.component';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { ButtonModule } from 'primeng/button';
import { FilterModule } from 'src/app/filter/filter.module';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

const routes: Routes = [{ path: '', component: ReportListComponent }];

@NgModule({
  declarations: [ReportListComponent],
  imports: [
    CommonModule,
    PreloaderModule,
    BreadcrumbModule,
    TableModule,
    FilterModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    [RouterModule.forChild(routes)],
  ],
})
export class ReportListModule {}
