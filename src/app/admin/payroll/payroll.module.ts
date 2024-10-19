import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollComponent } from './payroll.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';

const routes: Routes = [{ path: '', component: PayrollComponent }];

@NgModule({
  declarations: [PayrollComponent],
  imports: [CommonModule, BreadcrumbModule, [RouterModule.forChild(routes)]],
})
export class PayrollModule {}
