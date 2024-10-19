import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FullCalendarModule } from '@fullcalendar/angular';

const routes: Routes = [{ path: '', component: EventsComponent }];

@NgModule({
  declarations: [EventsComponent],
  imports: [CommonModule,
    FullCalendarModule, BreadcrumbModule, [RouterModule.forChild(routes)]],
})
export class EventsModule {}
