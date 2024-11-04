import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceComponent } from './attendance.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { LazyLoadImageModule } from 'ng-lazyload-image';

const routes: Routes = [
  { path: '', component: AttendanceComponent },
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
    path: 'view/:id',
    loadChildren: () => import('./view/view.module').then((m) => m.ViewModule),
  },
];
@NgModule({
  declarations: [AttendanceComponent],
  imports: [
    CommonModule,
    TableModule,
    CapitalizeFirstPipe,
    PreloaderModule,
    DropdownModule,
    FormsModule,
    CalendarModule,
    LazyLoadImageModule,
    ButtonModule,
    MenuModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    BreadcrumbModule,
    [RouterModule.forChild(routes)],
  ],
})
export class AttendanceModule {}
