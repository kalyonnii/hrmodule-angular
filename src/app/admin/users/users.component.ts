import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { EmployeesService } from '../employees/employees.service';
import { ToastService } from 'src/app/services/toast.service';
import { ConfirmationService } from 'primeng/api';
import { RoutingService } from 'src/app/services/routing-service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  breadCrumbItems: any = [];
  currentTableEvent: any;
  userNameToSearch: any;
  totalUsersCount: any = 0;
  selectedUser: any = null;
  isDialogVisible = false;
  loading: any;
  apiLoading: any;
  appliedFilter: {};
  searchFilter: any = {};
  filterConfig: any[] = [];
  userDetails: any;
  designationDetails = projectConstantsLocal.DESIGNATION_ENTITIES;
  version = projectConstantsLocal.VERSION_DESKTOP;
  users: any = [];
  isPasswordVisible: boolean = false;
  constructor(
    private location: Location,
    private confirmationService: ConfirmationService,
    private routingService: RoutingService,
    private toastService: ToastService,
    private employeesService: EmployeesService,
    private localStorageService: LocalStorageService
  ) {
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: '  Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Users' },
    ];
  }

  ngOnInit(): void {
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.setFilterConfig();
    const storedAppliedFilter = localStorage.getItem('usersAppliedFilter');
    if (storedAppliedFilter) {
      this.appliedFilter = JSON.parse(storedAppliedFilter);
    }
  }
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  maskPassword(input: any): string {
    return String(input).replace(/./g, '•');
  }

  showUserDetails(user: any): void {
    this.selectedUser = user;
    this.isDialogVisible = true;
  }
  clearDialog(): void {
    this.selectedUser = null;
    this.isDialogVisible = false;
  }
  setFilterConfig() {
    this.filterConfig = [
      {
        header: 'User Id',
        data: [
          {
            field: 'userId',
            title: 'User Id',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'First Name',
        data: [
          {
            field: 'firstName',
            title: 'First Name',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Last Name',
        data: [
          {
            field: 'lastName',
            title: 'Last Name',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'User Name',
        data: [
          {
            field: 'username',
            title: 'User Name',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Email',
        data: [
          {
            field: 'email',
            title: 'Email',
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
        header: 'Phone Number',
        data: [
          {
            field: 'phoneNumber',
            title: 'Phone Number',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Designation',
        data: [
          {
            field: 'designation',
            title: 'Designation',
            type: 'dropdown',
            filterType: 'like',
            options: this.designationDetails.map((entity) => ({
              label: entity.displayName,
              value: entity.id,
            })),
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
  loadUsers(event) {
    this.currentTableEvent = event;
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilter,
      this.appliedFilter
    );
    if (api_filter) {
      this.getUsersCount(api_filter);
      this.getUsers(api_filter);
    }
  }

  getUsersCount(filter = {}) {
    this.employeesService.getUsersCount(filter).subscribe(
      (response) => {
        this.totalUsersCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getUsers(filter = {}) {
    this.apiLoading = true;
    this.employeesService.getUsers(filter).subscribe(
      (response) => {
        this.users = response;
        console.log('users', this.users);
        this.apiLoading = false;
      },
      (error: any) => {
        this.apiLoading = false;
        this.toastService.showError(error);
      }
    );
  }

  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      console.log(this.currentTableEvent);
      this.loadUsers(this.currentTableEvent);
    }
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
      'usersAppliedFilter',
      JSON.stringify(this.appliedFilter)
    );
    this.loadUsers(this.currentTableEvent);
  }
  filterWithUserName() {
    let searchFilter = { 'username-like': this.userNameToSearch };
    this.applyFilters(searchFilter);
  }

  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    console.log(this.currentTableEvent);
    this.loadUsers(this.currentTableEvent);
  }
  confirmDelete(user) {
    this.confirmationService.confirm({
      // message: 'Are you sure you want to delete this User?',
      message: `Are you sure you want to delete this User ? <br>
      User Name: ${user.username}<br>
      User ID: ${user.userId}
      `,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUser(user.userId);
      },
    });
  }

  deleteUser(userId) {
    this.loading = true;
    this.employeesService.deleteUser(userId).subscribe(
      (response: any) => {
        console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadUsers(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getStatusColor(status: string): {
    textColor: string;
    backgroundColor: string;
  } {
    switch (status) {
      case 'Super Admin':
        return { textColor: '#FFFFFF', backgroundColor: '#18BADD' };
      case 'Admin':
        return { textColor: '#FFFFFF', backgroundColor: '#2A328F' };
      case 'HR Admin':
        return { textColor: '#FFFFFF', backgroundColor: '#9367B4' };
      case 'Support Team':
        return { textColor: '#FFFFFF', backgroundColor: '#F78181' };
      default:
        return { textColor: 'black', backgroundColor: 'white' };
    }
  }

  createUser() {
    this.routingService.handleRoute('users/create', null);
  }
  updateUser(userId) {
    this.routingService.handleRoute('users/update/' + userId, null);
  }
  goBack() {
    this.location.back();
  }
}
