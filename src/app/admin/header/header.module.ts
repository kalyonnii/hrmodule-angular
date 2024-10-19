import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { HeaderComponent } from './header.component';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule
  ],
  exports:[
    HeaderComponent
  ]
})
export class HeaderModule { }
