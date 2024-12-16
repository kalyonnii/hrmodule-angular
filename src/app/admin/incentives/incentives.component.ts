import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { Location } from '@angular/common';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { EmployeesService } from '../employees/employees.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ConfirmationService } from 'primeng/api';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
@Component({
  selector: 'app-incentives',
  templateUrl: './incentives.component.html',
  styleUrls: ['./incentives.component.scss'],
})
export class IncentivesComponent implements OnInit {
  breadCrumbItems: any = [];
  loading: any;
  searchFilter: any = {};
  activeItem: any;
  selectedDate: Date;
  currentTableEvent: any;
  selectedIncentive: any = null;
  isDialogVisible = false;
  employeeNameToSearch: any;
  userDetails: any;
  totalIncentivesCount: any = 0;
  items: any[];
  incentives: any = [];
  version = projectConstantsLocal.VERSION_DESKTOP;
  moment: any;
  constructor(
    private location: Location,
    private confirmationService: ConfirmationService,
    private localStorageService: LocalStorageService,
    private employeesService: EmployeesService,
    private toastService: ToastService,
    private routingService: RoutingService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.selectedDate = this.moment(new Date())
      .subtract(1, 'month')
      .format('MM/YYYY');
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
    this.setupActiveItemTabs();
    const storedMonth = localStorage.getItem('selectedIncentiveMonth');
    if (storedMonth) {
      this.selectedDate = JSON.parse(storedMonth);
    }
  }

  onActiveItemChange(event: any) {
    this.activeItem = event;
  }

  onDateChange(event: any) {
    this.selectedDate = this.moment(event).format('MM/YYYY');
    localStorage.setItem(
      'selectedIncentiveMonth',
      JSON.stringify(this.selectedDate)
    );
    this.loadIncentives(this.currentTableEvent);
  }
  setupActiveItemTabs() {
    this.items = [
      { label: 'First Month Files', name: 'firstMonthFiles' },
      { label: 'Second Month Files', name: 'secondMonthFiles' },
      { label: 'Third Month Files', name: 'thirdMonthFiles' },
    ];
    this.activeItem = this.items[0];
  }

  getFilesForActiveTab(): any[] {
    if (!this.selectedIncentive || !this.activeItem) return [];
    switch (this.activeItem.name) {
      case 'firstMonthFiles':
        return this.selectedIncentive.firstMonthFiles || [];
      case 'secondMonthFiles':
        return this.selectedIncentive.secondMonthFiles || [];
      case 'thirdMonthFiles':
        return this.selectedIncentive.thirdMonthFiles || [];
      default:
        return [];
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
    api_filter = Object.assign({}, api_filter, this.searchFilter);
    api_filter['incentiveApplicableMonth-eq'] = this.selectedDate;
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
  showUserDetails(user: any): void {
    this.selectedIncentive = user;
    this.isDialogVisible = true;
  }
  clearDialog(): void {
    this.selectedIncentive = null;
    this.isDialogVisible = false;
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

  getFormattedMonthYear(date: string): string {
    if (!date) return '';
    const [month, year] = date.split('/');
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthName = months[parseInt(month, 10) - 1];
    return `${monthName} ${year}`;
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
