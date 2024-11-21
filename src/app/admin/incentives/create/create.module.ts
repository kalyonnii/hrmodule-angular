import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create.component';
import { RouterModule, Routes } from '@angular/router';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';

const routes: Routes = [{ path: '', component: CreateComponent }];

@NgModule({
  declarations: [CreateComponent],
  imports: [CommonModule,
    PreloaderModule,
    BreadcrumbModule, RouterModule.forChild(routes)],
})
export class CreateModule {}
