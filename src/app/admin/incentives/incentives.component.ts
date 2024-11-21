import { Component } from '@angular/core';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { Location } from '@angular/common';
import { RoutingService } from 'src/app/services/routing-service';
@Component({
  selector: 'app-incentives',
  templateUrl: './incentives.component.html',
  styleUrls: ['./incentives.component.scss'],
})
export class IncentivesComponent {
  breadCrumbItems: any = [];
  loading: any;
  version = projectConstantsLocal.VERSION_DESKTOP;

  constructor(
    private location: Location,
    private routingService: RoutingService
  ) {
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: '  Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Incentives' },
    ];
  }

  addIncentive() {
    this.routingService.handleRoute('incentives/create', null);
  }

  goBack() {
    this.location.back();
  }
}
