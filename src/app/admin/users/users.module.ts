import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

const routes: Routes = [
  { path: '', component: UsersComponent },
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
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    TableModule,
    BreadcrumbModule,
    PreloaderModule,
    CapitalizeFirstPipe,
    MenuModule,
    ButtonModule,
    TooltipModule,
    [RouterModule.forChild(routes)],
  ],
})
export class UsersModule {}