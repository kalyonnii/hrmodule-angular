import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryhikeComponent } from './salaryhike.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FilterModule } from 'src/app/filter/filter.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

const routes: Routes = [
  { path: '', component: SalaryhikeComponent },
  {
    path: 'hikeletter/:id',
    loadChildren: () =>
      import('./hikeletter/hikeletter.module').then((m) => m.HikeletterModule),
  },
];

@NgModule({
  declarations: [SalaryhikeComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    PreloaderModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    FilterModule,
    CapitalizeFirstPipe,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    DropdownModule,
    [RouterModule.forChild(routes)],
  ],
})
export class SalaryhikeModule {}
