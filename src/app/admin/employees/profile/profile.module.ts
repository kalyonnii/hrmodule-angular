import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [{ path: '', component: ProfileComponent }];


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,
    CapitalizeFirstPipe,
    ButtonModule,
    [RouterModule.forChild(routes)],
  ]
})
export class ProfileModule { }
