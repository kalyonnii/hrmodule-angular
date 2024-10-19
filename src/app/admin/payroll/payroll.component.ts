import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent {
  breadCrumbItems: any = [];
  constructor(private location: Location) {
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: '  Dashboard',
        routerLink: '/user/dashboard',
      },
      { label: 'Payroll' },
    ];
  }

  goBack() {
    this.location.back();
  }
}
