import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HolidaysComponent } from './holidays.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { FormsModule } from '@angular/forms';
import { FilterModule } from 'src/app/filter/filter.module';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

const routes: Routes = [
  { path: '', component: HolidaysComponent },
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
  declarations: [HolidaysComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    TooltipModule,
    PreloaderModule,
    InputTextModule,
    FormsModule,
    CapitalizeFirstPipe,
    FilterModule,
    [RouterModule.forChild(routes)],
  ],

})
export class HolidaysModule {}
