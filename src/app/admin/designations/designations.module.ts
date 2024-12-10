import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignationsComponent } from './designations.component';
import { RouterModule, Routes } from '@angular/router';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FilterModule } from 'src/app/filter/filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

const routes: Routes = [{ path: '', component: DesignationsComponent }];

@NgModule({
  declarations: [DesignationsComponent],
  imports: [
    CommonModule,
    PreloaderModule,
    TableModule,
    MenuModule,
    FilterModule,
    DropdownModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    CapitalizeFirstPipe,
    BreadcrumbModule,
    [RouterModule.forChild(routes)],
  ],
})
export class DesignationsModule {}
