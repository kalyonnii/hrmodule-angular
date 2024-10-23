import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from './employees.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { FilterModule } from 'src/app/filter/filter.module';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

const routes: Routes = [
  { path: '', component: EmployeesComponent },
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
    path: 'profile/:id',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
];

@NgModule({
  declarations: [EmployeesComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    ButtonModule,
    CapitalizeFirstPipe,
    TableModule,
    FormsModule,
    InputTextModule,
    MenuModule,
    DropdownModule,
    PreloaderModule,
    FilterModule,
    [RouterModule.forChild(routes)],
  ],
})
export class EmployeesModule {}
