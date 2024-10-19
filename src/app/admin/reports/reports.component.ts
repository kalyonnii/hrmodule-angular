import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  breadCrumbItems: any = [];
  constructor(private location: Location) {
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: '  Dashboard',
        routerLink: '/user/dashboard',
      },
      { label: 'Reports' },
    ];
  }

  goBack() {
    this.location.back();
  }
}
