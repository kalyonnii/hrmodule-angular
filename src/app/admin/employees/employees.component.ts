import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { RoutingService } from 'src/app/services/routing-service';
import { EmployeesService } from './employees.service';
import { ToastService } from 'src/app/services/toast.service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  breadCrumbItems: any = [];
  currentTableEvent: any;
  filterConfig: any[] = [];
  totalEmployeesCount: any = 0;
  loading: any;
  appliedFilter: {};
  userDetails: any;
  searchFilter: any = {};
  employeeNameToSearch: any;
  @ViewChild('employeesTable') employeesTable!: Table;
  employees: any = [];
  designationDetails: any = projectConstantsLocal.DEPARTMENT_ENTITIES;
  branchDetails: any = projectConstantsLocal.BRANCH_ENTITIES;
  genderDetails: any = projectConstantsLocal.GENDER_ENTITIES;
  employeeInternalStatusList: any = projectConstantsLocal.EMPLOYEE_STATUS;
  selectedEmployeeStatus = this.employeeInternalStatusList[1];

  constructor(
    private employeesService: EmployeesService,
    private location: Location,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private routingService: RoutingService,
    private localStorageService: LocalStorageService
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

  ngOnInit(): void {
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    if (userDetails) {
      this.userDetails = userDetails.user;
      console.log(this.userDetails);
    }

    this.setFilterConfig();
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
      if (this.userDetails?.designation == 4) {
        menuItems[0].items.push({
          label: 'Delete',
          icon: 'fa fa-trash',
          command: () => this.confirmDelete(employee.employeeId),
        });
      }
    } else if (employee.employeeInternalStatus === 2) {
      menuItems[0].items.push({
        label: 'Active',
        icon: 'fa fa-right-to-bracket',
        command: () => this.activateEmployee(employee),
      });
    }
    return menuItems;
  }

  setFilterConfig() {
    this.filterConfig = [
      {
        header: 'Employee Id',
        data: [
          {
            field: 'employeeId',
            title: 'Employee Id',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Employee Name',
        data: [
          {
            field: 'employeeName',
            title: 'Employee Name',
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
            field: 'primaryPhone',
            title: 'Phone Number',
            type: 'text',
            filterType: 'like',
          },
        ],
      },

      {
        header: 'Secondary Number',
        data: [
          {
            field: 'secondaryPhone',
            title: 'Secondary Number',
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
        header: 'Joining Date',
        data: [
          {
            field: 'joiningDate',
            title: 'Joining Date',
            type: 'date',
            filterType: 'like',
          },
        ],
      },

      {
        header: 'Office Branch',
        data: [
          {
            field: 'ofcBranch',
            title: 'Branch',
            type: 'dropdown',
            filterType: 'like',
            options: this.branchDetails.map((entity) => ({
              label: entity.displayName,
              value: entity.id,
            })),
          },
        ],
      },
      {
        header: 'Salary',
        data: [
          {
            field: 'salary',
            title: 'Salary',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Email',
        data: [
          {
            field: 'emailAddress',
            title: 'Email',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Date Of Birth',
        data: [
          {
            field: 'dateOfBirth',
            title: 'Date Of Birth',
            type: 'date',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'City',
        data: [
          {
            field: 'city',
            title: 'City Name',
            type: 'text',
            filterType: 'like',
          },
        ],
      },

      {
        header: 'Gender',
        data: [
          {
            field: 'gender',
            title: 'Gender',
            type: 'dropdown',
            filterType: 'like',
            options: this.genderDetails.map((entity) => ({
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

      {
        header: 'Pan Number',
        data: [
          {
            field: 'panNumber',
            title: 'Pan Number',
            type: 'text',
            filterType: 'like',
          },
        ],
      },

      {
        header: 'Aadhar Number',
        data: [
          {
            field: 'aadharNumber',
            title: 'Aadhar Number',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Current Address',
        data: [
          {
            field: 'currentAddress',
            title: 'Current Address',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Permanent Address',
        data: [
          {
            field: 'permanentAddress',
            title: 'Permanent Address',
            type: 'text',
            filterType: 'like',
          },
        ],
      },

      {
        header: 'Account Holder Name',
        data: [
          {
            field: 'accountHolderName',
            title: 'Account Holder Name',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Bank Name',
        data: [
          {
            field: 'bankName',
            title: 'Bank Name',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Bank Branch',
        data: [
          {
            field: 'bankBranch',
            title: 'Bank Branch',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'IFSC Code',
        data: [
          {
            field: 'ifscCode',
            title: 'IFSC Code',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Account Number',
        data: [
          {
            field: 'accountNumber',
            title: 'Account Number',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
    ];
  }
  applyConfigFilters(event) {
    let api_filter = event;
    if (api_filter['reset']) {
      delete api_filter['reset'];
      this.appliedFilter = {};
    } else {
      this.appliedFilter = api_filter;
    }
    this.loadEmployees(this.currentTableEvent);
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

  statusChange(event) {
    this.loadEmployees(this.currentTableEvent);
  }

  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      console.log(this.currentTableEvent);
      this.loadEmployees(this.currentTableEvent);
    }
  }
  filterWithEmployeeName() {
    let searchFilter = { 'employeeName-like': this.employeeNameToSearch };
    this.applyFilters(searchFilter);
  }

  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    console.log(this.currentTableEvent);
    this.loadEmployees(this.currentTableEvent);
  }
  loadEmployees(event) {
    this.currentTableEvent = event;
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    if (this.selectedEmployeeStatus) {
      if (this.selectedEmployeeStatus && this.selectedEmployeeStatus.name) {
        if (this.selectedEmployeeStatus.name != 'all') {
          api_filter['employeeInternalStatus-eq'] =
            this.selectedEmployeeStatus.id;
        } else {
          api_filter['employeeInternalStatus-or'] = '1,2';
        }
      }
    }
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilter,
      this.appliedFilter
    );
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
