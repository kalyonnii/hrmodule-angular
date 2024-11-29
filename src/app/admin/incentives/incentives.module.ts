import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncentivesComponent } from './incentives.component';
import { RouterModule, Routes } from '@angular/router';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TabMenuModule } from 'primeng/tabmenu';
import { CalendarModule } from 'primeng/calendar';

const routes: Routes = [
  { path: '', component: IncentivesComponent },
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
  declarations: [IncentivesComponent],
  imports: [
    CommonModule,
    PreloaderModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    CapitalizeFirstPipe,
    DialogModule,
    TabMenuModule,
    CalendarModule,
    TableModule,
    BreadcrumbModule,
    [RouterModule.forChild(routes)],
  ],
})
export class IncentivesModule {}
