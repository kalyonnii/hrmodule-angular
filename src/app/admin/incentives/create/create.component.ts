import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  heading: any = 'Create Incentive';
  actionType: any = 'create';
  version = projectConstantsLocal.VERSION_DESKTOP;
  breadCrumbItems: any = [];
  loading: any;
  constructor(private location: Location) {
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: ' Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Holidays',
        routerLink: '/user/holidays',
        queryParams: { v: this.version },
      },
      { label: this.actionType == 'create' ? 'Create' : 'Update' },
    ];
  }

  goBack() {
    this.location.back();
  }
}
