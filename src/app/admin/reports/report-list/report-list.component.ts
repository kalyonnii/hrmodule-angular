import { Component } from '@angular/core';
import { EmployeesService } from '../../employees/employees.service';
import { ToastService } from 'src/app/services/toast.service';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
})
export class ReportListComponent {
  breadCrumbItems: any = [];
  reportsData: any = [];
  loading: any;
  userDetails: any;
  appliedFilter: {};
  filterConfig: any[] = [];
  currentTableEvent: any;
  reportTypeToSearch: any;
  searchFilter: any = {};
  version = projectConstantsLocal.VERSION_DESKTOP;

  reportsCount: any = 0;
  constructor(
    private location: Location,
    private confirmationService: ConfirmationService,
    private employeesService: EmployeesService,
    private toastService: ToastService,
    private localStorageService: LocalStorageService
  ) {
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: ' Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Reports',
        routerLink: '/user/reports',
        queryParams: { v: this.version },
      },
      { label: 'Saved Reports' },
    ];
  }

  ngOnInit(): void {
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.setFilterConfig();
    const storedReportType = localStorage.getItem('reportType');
    if (storedReportType) {
      this.reportTypeToSearch = storedReportType;
      this.filterWithReportType();
    }
    const storedAppliedFilter = localStorage.getItem('reportsAppliedFilter');
    if (storedAppliedFilter) {
      this.appliedFilter = JSON.parse(storedAppliedFilter);
    }
  }

  setFilterConfig() {
    this.filterConfig = [
      {
        header: 'Report Id',
        data: [
          {
            field: 'reportId',
            title: 'Report Id',
            type: 'text',
            filterType: 'like',
          },
        ],
      },

      {
        header: 'Report Type',
        data: [
          {
            field: 'reportType',
            title: 'Report Type',
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
        header: 'Created By',
        data: [
          {
            field: 'createdBy',
            title: 'Created By',
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
  loadReports(event) {
    console.log(event);
    this.currentTableEvent = event;
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilter,
      this.appliedFilter
    );
    if (api_filter) {
      console.log(api_filter);
      this.getReportsCount(api_filter);
      this.getReports(api_filter);
    }
  }
  getReportsCount(filter = {}) {
    this.employeesService.getReportsCount(filter).subscribe(
      (response) => {
        this.reportsCount = response;
        console.log(this.reportsCount);
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }
  getReports(filter = {}) {
    this.loading = true;
    this.employeesService.getReports(filter).subscribe(
      (response) => {
        this.reportsData = response;
        console.log(this.reportsData);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  // filterWithReportType() {
  //   let searchFilter = { 'reportType-like': this.reportTypeToSearch };
  //   this.applyFilters(searchFilter);
  // }

  filterWithReportType(): void {
    const reportTypeToSearch =
      localStorage.getItem('reportType') || this.reportTypeToSearch;
    if (reportTypeToSearch) {
      const searchFilter = { 'reportType-like': reportTypeToSearch };
      this.applyFilters(searchFilter);
    }
  }
  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    console.log(this.currentTableEvent);
    this.loadReports(this.currentTableEvent);
  }
  // inputValueChangeEvent(dataType, value) {
  //   if (value == '') {
  //     this.searchFilter = {};
  //     console.log(this.currentTableEvent);
  //     this.loadReports(this.currentTableEvent);
  //   }
  // }
  inputValueChangeEvent(dataType: string, value: string): void {
    if (value === '') {
      this.searchFilter = {};
      localStorage.setItem('reportType', value);
      console.log(this.currentTableEvent);
      this.loadReports(this.currentTableEvent);
    } else {
      localStorage.setItem('reportType', value);
    }
  }
  // applyConfigFilters(event) {
  //   let api_filter = event;
  //   if (api_filter['reset']) {
  //     delete api_filter['reset'];
  //     this.appliedFilter = {};
  //   } else {
  //     this.appliedFilter = api_filter;
  //   }
  //   this.loadReports(this.currentTableEvent);
  // }
  applyConfigFilters(event) {
    let api_filter = event;
    if (api_filter['reset']) {
      delete api_filter['reset'];
      this.appliedFilter = {};
    } else {
      this.appliedFilter = api_filter;
    }
    localStorage.setItem(
      'reportsAppliedFilter',
      JSON.stringify(this.appliedFilter)
    );
    this.loadReports(this.currentTableEvent);
  }

  confirmDelete(reportId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Report?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteReport(reportId);
      },
    });
  }

  deleteReport(reportId) {
    this.loading = true;
    this.employeesService.deleteReport(reportId).subscribe(
      (response: any) => {
        console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadReports(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  goBack() {
    this.location.back();
  }
}
