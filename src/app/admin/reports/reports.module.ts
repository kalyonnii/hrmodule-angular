import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [
  { path: '', component: ReportsComponent },
  {
    path: 'create',
    loadChildren: () =>
      import('./create/create.module').then((m) => m.CreateModule),
  },
  {
    path: 'report-list',
    loadChildren: () =>
      import('./report-list/report-list.module').then(
        (m) => m.ReportListModule
      ),
  },
];

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    PreloaderModule,
    ButtonModule,
    BreadcrumbModule,
    [RouterModule.forChild(routes)],
  ],
})
export class ReportsModule {}
