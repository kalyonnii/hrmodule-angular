import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderModule } from './header/header.module';
import { SidebarMenuModule } from './sidebar-menu/sidebar-menu.module';


@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    AdminRoutingModule,
    HttpClientModule,
    SidebarMenuModule
  ],

})
export class AdminModule { }
