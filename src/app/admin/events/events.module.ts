import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PreloaderModule } from 'src/app/preloader/preloader.module';

const routes: Routes = [{ path: '', component: EventsComponent }];

@NgModule({
  declarations: [EventsComponent],
  imports: [
    CommonModule,
    PreloaderModule,
    FullCalendarModule,
    BreadcrumbModule,
    [RouterModule.forChild(routes)],
  ],
})
export class EventsModule {}
