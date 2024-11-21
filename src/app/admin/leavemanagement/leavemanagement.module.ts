import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeavemanagementComponent } from './leavemanagement.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FilterModule } from 'src/app/filter/filter.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';

const routes: Routes = [
  { path: '', component: LeavemanagementComponent },
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
];

@NgModule({
  declarations: [LeavemanagementComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    PreloaderModule,
    MenuModule,
    InputTextModule,
    TableModule,
    CapitalizeFirstPipe,
    FormsModule,
    DropdownModule,
    FilterModule,
    ButtonModule,
    [RouterModule.forChild(routes)],
  ],
})
export class LeavemanagementModule {}