import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HikeletterComponent } from './hikeletter.component';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [{ path: '', component: HikeletterComponent }];

@NgModule({
  declarations: [HikeletterComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    CapitalizeFirstPipe,
    ButtonModule,
    ButtonModule,
    PreloaderModule,
    RouterModule.forChild(routes),
  ],
})
export class HikeletterModule {}
