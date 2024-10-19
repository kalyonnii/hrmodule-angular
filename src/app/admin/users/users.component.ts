import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { EmployeesService } from '../employees/employees.service';
import { ToastService } from 'src/app/services/toast.service';
import { ConfirmationService } from 'primeng/api';
import { RoutingService } from 'src/app/services/routing-service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  breadCrumbItems: any = [];
  currentTableEvent: any;
  totalUsersCount: any = 0;
  loading: any;
  users: any = [];
  constructor(
    private location: Location,
    private confirmationService: ConfirmationService,
    private routingService: RoutingService,
    private toastService: ToastService,
    private employeesService: EmployeesService
  ) {
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: '  Dashboard',
        routerLink: '/user/dashboard',
      },
      { label: 'Users' },
    ];
  }
  loadUsers(event) {
    this.currentTableEvent = event;
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign({}, api_filter);
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
    this.loading = true;
    this.employeesService.getUsers(filter).subscribe(
      (response) => {
        this.users = response;
        console.log('users', this.users);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  confirmDelete(userId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this User?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUser(userId);
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
