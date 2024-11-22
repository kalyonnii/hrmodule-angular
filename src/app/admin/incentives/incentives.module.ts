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
    TableModule,
    BreadcrumbModule,
    [RouterModule.forChild(routes)],
  ],
})
export class IncentivesModule {}
