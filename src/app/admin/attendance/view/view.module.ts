import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewComponent } from './view.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { TableModule } from 'primeng/table';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [{ path: '', component: ViewComponent }];

@NgModule({
  declarations: [ViewComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    PreloaderModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    TableModule,
    CapitalizeFirstPipe,
    RouterModule.forChild(routes),
  ],
})
export class ViewModule {}
