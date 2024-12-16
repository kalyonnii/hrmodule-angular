import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { RoutingService } from 'src/app/services/routing-service';
import { EmployeesService } from '../employees/employees.service';
import { ToastService } from 'src/app/services/toast.service';
import { ConfirmationService } from 'primeng/api';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss'],
})
export class HolidaysComponent implements OnInit {
  breadCrumbItems: any = [];
  loading: any;
  appliedFilter: {};
  holidays: any = [];
  moment: any;
  totalHolidaysCount: any = 0;
  holidayNameToSearch: any;
  currentTableEvent: any;
  searchFilter: any = {};
  userDetails: any;
  filterConfig: any[] = [];
  years: { label: string; value: number }[] = [];
  selectedYear: number;
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private employeesService: EmployeesService,
    private location: Location,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private routingService: RoutingService,
    private localStorageService: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: '  Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Holidays' },
    ];
  }
  ngOnInit(): void {
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    if (userDetails) {
      this.userDetails = userDetails.user;
    }
    this.setFilterConfig();
    this.generateYears();
    this.selectedYear = new Date().getFullYear();
    const storedYear = localStorage.getItem('selectedYear');
    if (storedYear) {
      this.selectedYear = JSON.parse(storedYear);
    }
    const storedAppliedFilter = localStorage.getItem('holidaysAppliedFilter');
    if (storedAppliedFilter) {
      this.appliedFilter = JSON.parse(storedAppliedFilter);
    }
  }
  setFilterConfig() {
    this.filterConfig = [
      {
        header: 'Holiday Id',
        data: [
          {
            field: 'holidayId',
            title: 'Holiday Id',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Holiday Name',
        data: [
          {
            field: 'holidayName',
            title: 'Holiday Name',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Created Date Range',
        data: [
          {
            field: 'createdOn',
            title: 'From',
            type: 'date',
            filterType: 'gte',
          },
          { field: 'createdOn', title: 'To', type: 'date', filterType: 'lte' },
        ],
      },
      {
        header: 'Date',
        data: [
          {
            field: 'date',
            title: 'Date',
            type: 'date',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Day',
        data: [
          {
            field: 'day',
            title: 'Day',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Description',
        data: [
          {
            field: 'description',
            title: 'Description',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'created On  ',
        data: [
          {
            field: 'createdOn',
            title: 'Date ',
            type: 'date',
            filterType: 'like',
          },
        ],
      },
    ];
  }
  filterWithHolidayName() {
    let searchFilter = { 'holidayName-like': this.holidayNameToSearch };
    this.applyFilters(searchFilter);
  }

  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    console.log(this.currentTableEvent);
    this.loadHolidays(this.currentTableEvent);
  }

  applyConfigFilters(event) {
    let api_filter = event;
    if (api_filter['reset']) {
      delete api_filter['reset'];
      this.appliedFilter = {};
    } else {
      this.appliedFilter = api_filter;
    }
    localStorage.setItem(
      'holidaysAppliedFilter',
      JSON.stringify(this.appliedFilter)
    );
    this.loadHolidays(this.currentTableEvent);
  }
  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      console.log(this.currentTableEvent);
      this.loadHolidays(this.currentTableEvent);
    }
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
  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 10; year--) {
      this.years.push({ label: `${year}`, value: year });
    }
  }

  loadHolidaysByYear(): void {
    localStorage.setItem('selectedYear', JSON.stringify(this.selectedYear));
    this.loadHolidays(this.currentTableEvent);
  }
  loadHolidays(event) {
    this.currentTableEvent = event;
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    if (this.selectedYear) {
      const startOfYear = this.moment(`${this.selectedYear}-01-01`).format(
        'YYYY-MM-DD'
      );
      const endOfYear = this.moment(`${this.selectedYear}-12-31`).format(
        'YYYY-MM-DD'
      );
      api_filter['date-gte'] = startOfYear;
      api_filter['date-lte'] = endOfYear;
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilter,
      this.appliedFilter
    );
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
