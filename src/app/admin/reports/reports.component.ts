import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { RoutingService } from 'src/app/services/routing-service';
import { NavigationExtras } from '@angular/router';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {
  reportsListConfig: any = [];
  loading: any;
  breadCrumbItems: any = [];
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private routingService: RoutingService,
    private location: Location
  ) {
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: '  Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Reports' },
    ];
  }
  ngOnInit() {
    this.setReportsList();
  }
  setReportsList() {
    let reportsListConfig = [
      {
        reportName: 'Employees',
        name: 'employees',
        reportType: 'EMPLOYEES',
        condition: true,
      },
      {
        reportName: 'Interviews',
        name: 'interviews',
        reportType: 'INTERVIEWS',
        condition: true,
      },
      {
        reportName: 'Attendance',
        name: 'attendance',
        reportType: 'ATTENDANCE',
        condition: true,
      },
      {
        reportName: 'Salary Sheet',
        name: 'payroll',
        reportType: 'SALARYSHEET',
        condition: true,
      },

      {
        reportName: 'Leaves',
        name: 'leaves',
        reportType: 'LEAVES',
        condition: true,
      },
      {
        reportName: 'Holidays',
        name: 'holidays',
        reportType: 'HOLIDAYS',
        condition: true,
      },
    ];
    this.reportsListConfig = reportsListConfig.filter(
      (report) => report.condition
    );
  }

  createReport(reportType) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        reportType: reportType,
      },
    };
    this.routingService.setFeatureRoute('user/reports');
    this.routingService.handleRoute('create', navigationExtras);
  }

  viewAllReports() {
    this.routingService.setFeatureRoute('user/reports');
    this.routingService.handleRoute('report-list', null);
  }

  goBack() {
    this.location.back();
  }
}
