import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollComponent } from './payroll.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { FilterModule } from 'src/app/filter/filter.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { InputTextModule } from 'primeng/inputtext';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

const routes: Routes = [
  { path: '', component: PayrollComponent },
  {
    path: 'create',
    loadChildren: () =>
      import('./create/create.module').then((m) => m.CreateModule),
  },
  {
    path: 'update/:id',
    loadChildren: () =>
      import('./create/create.module').then((m) => m.CreateModule),
  },
  {
    path: 'payslip/:id',
    loadChildren: () => import('./payslip/payslip.module').then((m) => m.PayslipModule),
  },
];
@NgModule({
  declarations: [PayrollComponent],
  imports: [
    CommonModule,
    ButtonModule,
    BreadcrumbModule,
    FormsModule,
    InputTextModule,
    TableModule,
    CapitalizeFirstPipe,
    FilterModule,
    DropdownModule,
    CalendarModule,
    PreloaderModule,
    [RouterModule.forChild(routes)],
  ],
})
export class PayrollModule {}
