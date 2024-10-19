import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RoutingService } from 'src/app/services/routing-service';
import { EmployeesService } from '../employees/employees.service';
import { ToastService } from 'src/app/services/toast.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userDetails: any;
  loading: any;
  totalEmployeesCount: any = 0;
  DepartmentChartOptions: any;
  totalUsersCount: any = 0;
  totalInterviewsCount: any = 0;
  totalHolidaysCount: any = 0;
  countsAnalytics: any[] = [];
  constructor(
    private localStorageService: LocalStorageService,
    private routingService: RoutingService,
    private employeesService: EmployeesService,
    private toastService: ToastService
  ) {}
  ngOnInit(): void {
    this.userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = this.userDetails.user;
    console.log(this.userDetails);
    this.setChartOptions();
    this.fetchCounts();
    this.updateCountsAnalytics();
  }

  updateCountsAnalytics() {
    this.countsAnalytics = [
      {
        name: 'employees',
        displayName: 'Employees',
        count: this.totalEmployeesCount,
        routerLink: 'employees',
        condition: true,
      },
      {
        name: 'users',
        displayName: 'Users',
        count: this.totalUsersCount,
        routerLink: 'users',
        condition: true,
      },
      {
        name: 'interviews',
        displayName: 'Interviews',
        count: this.totalInterviewsCount,
        routerLink: 'interviews',
        condition: true,
      },
      {
        name: 'payroll',
        displayName: 'Payroll',
        count: 0,
        routerLink: 'payroll',
        condition: true,
      },
      {
        name: 'attendance',
        displayName: 'Attendance',
        count: 0,
        routerLink: 'attendance',
        condition: true,
      },
      {
        name: 'holidays',
        displayName: 'Holidays',
        count: this.totalHolidaysCount,
        routerLink: 'holidays',
        condition: true,
      },
      {
        name: 'events',
        displayName: 'Events',
        count: 0,
        routerLink: 'events',
        condition: true,
      },
      {
        name: 'reports',
        displayName: 'Reports',
        count: 0,
        routerLink: 'reports',
        condition: true,
      },
    ];
  }

  fetchCounts(filter = {}) {
    this.loading = true;
    forkJoin([
      this.employeesService?.getEmployeesCount(filter),
      this.employeesService?.getUsersCount(filter),
      this.employeesService?.getHolidaysCount(filter),
      this.employeesService?.getInterviewCount(filter),
    ]).subscribe(
      ([employeesCount, usersCount, holidaysCount, interviewCount]) => {
        this.totalEmployeesCount = employeesCount;
        this.totalUsersCount = usersCount;
        this.totalHolidaysCount = holidaysCount;
        this.totalInterviewsCount = interviewCount;
        this.updateCountsAnalytics();
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getEmployeesCount(filter = {}) {
    this.loading = true;
    this.employeesService.getEmployeesCount(filter).subscribe(
      (response) => {
        this.totalEmployeesCount = response;
        this.updateCountsAnalytics();
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getUsersCount(filter = {}) {
    this.loading = true;
    this.employeesService.getUsersCount(filter).subscribe(
      (response) => {
        this.totalUsersCount = response;
        this.updateCountsAnalytics();
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getHolidaysCount(filter = {}) {
    this.loading = true;
    this.employeesService.getHolidaysCount(filter).subscribe(
      (response) => {
        this.totalHolidaysCount = response;
        this.updateCountsAnalytics();
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  setChartOptions() {
    this.DepartmentChartOptions = {
      series: [
        {
          name: 'Telesales',
          data: [30],
        },
        {
          name: 'Operations Team',
          data: [4],
        },
        {
          name: 'HR Team',
          data: [2],
        },
        {
          name: 'Office Team',
          data: [3],
        },
      ],
      chart: {
        height: 400,
        type: 'bar',
        toolbar: {
          show: true,
        },
      },
      colors: ['#3357FF', '#FFC300', '#C70039', '#581845'],
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
        },
      },
      stroke: {
        width: 2,
        colors: ['#fff'],
      },
      title: {
        text: 'Departments Metrics',
        align: 'left',
        style: {
          fontSize: '18px',
          color: '#33009C',
        },
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      markers: {
        size: 4,
      },
      xaxis: {
        categories: ['Total Count'],
        title: {
          text: 'Month',
        },
      },
      yaxis: {
        title: {
          text: 'Amount',
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -20,
        offsetX: -5,
      },
    };
  }
  goToRoute(route) {
    this.routingService.setFeatureRoute('user');
    this.routingService.handleRoute(route, null);
  }
}
