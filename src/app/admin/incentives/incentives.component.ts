import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { Location } from '@angular/common';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { EmployeesService } from '../employees/employees.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-incentives',
  templateUrl: './incentives.component.html',
  styleUrls: ['./incentives.component.scss'],
})
export class IncentivesComponent implements OnInit {
  breadCrumbItems: any = [];
  loading: any;
  searchFilter: any = {};
  currentTableEvent: any;
  employeeNameToSearch: any;
  userDetails: any;
  totalIncentivesCount: any = 0;
  incentives: any = [];
  version = projectConstantsLocal.VERSION_DESKTOP;

  constructor(
    private location: Location,
    private confirmationService: ConfirmationService,
    private localStorageService: LocalStorageService,
    private employeesService: EmployeesService,
    private toastService: ToastService,
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

  ngOnInit(): void {
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    if (userDetails) {
      this.userDetails = userDetails.user;
    }
  }
  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      console.log(this.currentTableEvent);
      this.loadIncentives(this.currentTableEvent);
    }
  }
  filterWithEmployeeName() {
    let searchFilter = { 'employeeName-like': this.employeeNameToSearch };
    this.applyFilters(searchFilter);
  }
  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    console.log(this.currentTableEvent);
    this.loadIncentives(this.currentTableEvent);
  }

  loadIncentives(event) {
    this.currentTableEvent = event;
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    // if (this.selectedYear) {
    //   const startOfYear = this.moment(`${this.selectedYear}-01-01`).format(
    //     'YYYY-MM-DD'
    //   );
    //   const endOfYear = this.moment(`${this.selectedYear}-12-31`).format(
    //     'YYYY-MM-DD'
    //   );
    //   api_filter['date-gte'] = startOfYear;
    //   api_filter['date-lte'] = endOfYear;
    // }
    api_filter = Object.assign({}, api_filter, this.searchFilter);
    if (api_filter) {
      this.getIncentivesCount(api_filter);
      this.getIncentives(api_filter);
    }
  }

  getIncentivesCount(filter = {}) {
    this.employeesService.getIncentivesCount(filter).subscribe(
      (response) => {
        this.totalIncentivesCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getIncentives(filter = {}) {
    this.loading = true;
    this.employeesService.getIncentives(filter).subscribe(
      (response) => {
        this.incentives = response;
        console.log('incentives', this.incentives);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }


  confirmDelete(incentiveId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Incentive?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteIncentive(incentiveId);
      },
    });
  }

  deleteIncentive(incentiveId) {
    this.loading = true;
    this.employeesService.deleteIncentive(incentiveId).subscribe(
      (response: any) => {
        console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadIncentives(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  updateIncentive(incentiveId) {
    this.routingService.handleRoute('incentives/update/' + incentiveId, null);
  }
  addIncentive() {
    this.routingService.handleRoute('incentives/create', null);
  }

  goBack() {
    this.location.back();
  }
}
