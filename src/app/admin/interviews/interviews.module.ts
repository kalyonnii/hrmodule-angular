import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterviewsComponent } from './interviews.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { ButtonModule } from 'primeng/button';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FilterModule } from 'src/app/filter/filter.module';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';

const routes: Routes = [
  { path: '', component: InterviewsComponent },
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
  declarations: [InterviewsComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    PreloaderModule,
    TableModule,
    MenuModule,
    FormsModule,
    DialogModule,
    CapitalizeFirstPipe,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    FilterModule,
    [RouterModule.forChild(routes)],
  ],
})
export class InterviewsModule {}
