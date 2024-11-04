import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarMenuComponent } from './sidebar-menu.component';
import { RouterModule } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [SidebarMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    SidebarModule,
    TooltipModule,
    LazyLoadImageModule,
    ButtonModule,
  ],
  exports: [SidebarMenuComponent],
})
export class SidebarMenuModule {}
