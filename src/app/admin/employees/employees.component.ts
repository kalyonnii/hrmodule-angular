import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { RoutingService } from 'src/app/services/routing-service';
import { EmployeesService } from './employees.service';
import { ToastService } from 'src/app/services/toast.service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent {
  breadCrumbItems: any = [];
  currentTableEvent: any;
  totalEmployeesCount: any = 0;
  loading: any;
  employees: any = [];
  employeeInternalStatusList: any = projectConstantsLocal.EMPLOYEE_STATUS;

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
      { label: 'Employees' },
    ];
  }

  actionItems(employee: any): MenuItem[] {
    const menuItems: any = [{ label: 'Actions', items: [] }];

    if (employee.employeeInternalStatus === 1) {
      menuItems[0].items.push({
        label: 'In Active',
        icon: 'fa fa-right-to-bracket',
        command: () => this.inactiveEmployee(employee),
      });
      menuItems[0].items.push({
        label: 'Update',
        icon: 'fa fa-pen-to-square',
        command: () => this.updateEmployee(employee.employeeId),
      });
      menuItems[0].items.push({
        label: 'Profile',
        icon: 'fa fa-eye',
        command: () => this.employeeProfile(employee.employeeId),
      });
      menuItems[0].items.push({
        label: 'Delete',
        icon: 'fa fa-trash',
        command: () => this.confirmDelete(employee.employeeId),
      });
    } else if (employee.employeeInternalStatus === 2) {
      menuItems[0].items.push({
        label: 'Active',
        icon: 'fa fa-right-to-bracket',
        command: () => this.activateEmployee(employee),
      });
    }
    return menuItems;
  }

  inactiveEmployee(employee) {
    this.changeEmployeeStatus(employee.employeeId, 2);
  }

  activateEmployee(employee) {
    this.changeEmployeeStatus(employee.employeeId, 1);
  }
  changeEmployeeStatus(employeeId, statusId) {
    this.loading = true;
    this.employeesService.changeEmployeeStatus(employeeId, statusId).subscribe(
      (response) => {
        this.toastService.showSuccess('Employee Status Changed Successfully');
        this.loading = false;
        this.loadEmployees(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  confirmDelete(employeeId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Employee?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteEmployee(employeeId);
      },
    });
  }
  deleteEmployee(employeeId) {
    this.loading = true;
    this.employeesService.deleteEmployee(employeeId).subscribe(
      (response: any) => {
        console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadEmployees(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  loadEmployees(event) {
    this.currentTableEvent = event;
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign({}, api_filter);
    console.log(api_filter);
    if (api_filter) {
      this.getEmployeesCount(api_filter);
      this.getEmployees(api_filter);
    }
  }

  getEmployeesCount(filter = {}) {
    this.employeesService.getEmployeesCount(filter).subscribe(
      (response) => {
        this.totalEmployeesCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getEmployees(filter = {}) {
    this.loading = true;
    this.employeesService.getEmployees(filter).subscribe(
      (response) => {
        this.employees = response;
        console.log('employees', this.employees);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getStatusName(statusId) {
    if (
      this.employeeInternalStatusList &&
      this.employeeInternalStatusList.length > 0
    ) {
      let employeeStatusName = this.employeeInternalStatusList.filter(
        (employeeStatus) => employeeStatus.id == statusId
      );
      return (
        (employeeStatusName &&
          employeeStatusName[0] &&
          employeeStatusName[0].name) ||
        ''
      );
    }
    return '';
  }

  getStatusColor(status: string): {
    textColor: string;
    backgroundColor: string;
  } {
    switch (status) {
      case 'Active':
        return { textColor: '#0F006D', backgroundColor: '#DED3FF' };
      case 'In Active':
        return { textColor: '#FFBA15', backgroundColor: '#FFF3D6' };
      default:
        return { textColor: 'black', backgroundColor: 'white' };
    }
  }
  createEmployee() {
    this.routingService.handleRoute('employees/create', null);
  }

  updateEmployee(employeeId) {
    this.routingService.handleRoute('employees/update/' + employeeId, null);
  }
  employeeProfile(employeeId) {
    this.routingService.handleRoute('employees/profile/' + employeeId, null);
  }
  goBack() {
    this.location.back();
  }
}
