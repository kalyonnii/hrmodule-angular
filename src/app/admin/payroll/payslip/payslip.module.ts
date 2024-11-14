import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayslipComponent } from './payslip.component';
import { RouterModule, Routes } from '@angular/router';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { ButtonModule } from 'primeng/button';


const routes: Routes = [{ path: '', component: PayslipComponent }];


@NgModule({
  declarations: [
    PayslipComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    PreloaderModule,
    ButtonModule,
    CapitalizeFirstPipe,
    RouterModule.forChild(routes)
  ]
})
export class PayslipModule { }
