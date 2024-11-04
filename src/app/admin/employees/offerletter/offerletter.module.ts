import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferletterComponent } from './offerletter.component';
import { RouterModule, Routes } from '@angular/router';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';

const routes: Routes = [{ path: '', component: OfferletterComponent }];

@NgModule({
  declarations: [OfferletterComponent],
  imports: [
    CommonModule,
    PreloaderModule,
    BreadcrumbModule,
    CapitalizeFirstPipe,
    RouterModule.forChild(routes),
  ],
})
export class OfferletterModule {}
