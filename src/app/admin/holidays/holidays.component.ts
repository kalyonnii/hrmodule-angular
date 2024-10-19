import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { RoutingService } from 'src/app/services/routing-service';
import { EmployeesService } from '../employees/employees.service';
import { ToastService } from 'src/app/services/toast.service';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss'],
})
export class HolidaysComponent {
  breadCrumbItems: any = [];
  loading: any;
  holidays: any = [];
  totalHolidaysCount: any = 0;
  currentTableEvent: any;
  constructor(
    private employeesService: EmployeesService,
    private location: Location,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private routingService: RoutingService
  ) {
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: '  Dashboard',
        routerLink: '/user/dashboard',
      },
      { label: 'Holidays' },
    ];
  }

  deleteHoliday(holidayId) {
    this.loading = true;
    this.employeesService.deleteHoliday(holidayId).subscribe(
      (response: any) => {
        console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadHolidays(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  confirmDelete(holidayId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this holiday?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteHoliday(holidayId);
      },
    });
  }

  loadHolidays(event) {
    this.currentTableEvent = event;
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign({}, api_filter);
    if (api_filter) {
      this.getHolidaysCount(api_filter);
      this.getHolidays(api_filter);
    }
  }

  getHolidaysCount(filter = {}) {
    this.employeesService.getHolidaysCount(filter).subscribe(
      (response) => {
        this.totalHolidaysCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getHolidays(filter = {}) {
    this.loading = true;
    this.employeesService.getHolidays(filter).subscribe(
      (response) => {
        this.holidays = response;
        console.log('holidays', this.holidays);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  addHoliday() {
    this.routingService.handleRoute('holidays/create', null);
  }
  updateHoliday(holidayId) {
    this.routingService.handleRoute('holidays/update/' + holidayId, null);
  }
  goBack() {
    this.location.back();
  }
}
