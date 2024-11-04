import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { HeaderComponent } from './header.component';
import { ButtonModule } from 'primeng/button';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';


@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    SidebarModule,
    CapitalizeFirstPipe,
    ButtonModule
  ],
  exports:[
    HeaderComponent
  ]
})
export class HeaderModule { }
