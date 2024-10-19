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
    CapitalizeFirstPipe,
    ButtonModule,
    [RouterModule.forChild(routes)],
  ],
})
export class InterviewsModule {}
