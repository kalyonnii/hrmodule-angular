import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportListComponent } from './report-list.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: ReportListComponent }];

@NgModule({
  declarations: [ReportListComponent],
  imports: [CommonModule, [RouterModule.forChild(routes)]],
})
export class ReportListModule {}
