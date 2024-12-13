import { Component } from '@angular/core';
import { EmployeesService } from '../employees/employees.service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';
import { RoutingService } from 'src/app/services/routing-service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Component({
  selector: 'app-leavemanagement',
  templateUrl: './leavemanagement.component.html',
  styleUrls: ['./leavemanagement.component.scss'],
})
export class LeavemanagementComponent {
  loading: any;
  countsAnalytics: any[] = [];
  appliedFilter: {};
  searchFilter: any = {};
  currentTableEvent: any;
  filterConfig: any[] = [];
  employeeNameToSearch: any;
  employees: any = [];
  totalLeavesCount: any = 0;
  leavetypeentities = projectConstantsLocal.LEAVE_TYPE_ENTITIES;
  durationTypeEntities = projectConstantsLocal.DURATION_TYPE_ENTITIES;
  leavesInternalStatusList: any = projectConstantsLocal.LEAVE_STATUS;
  version = projectConstantsLocal.VERSION_DESKTOP;
  leaves: any = [];
  leavesStatusCount: { [key: number]: number } = { 1: 0, 2: 0, 3: 0 };
  selectedLeavesStatus = this.leavesInternalStatusList[1];
  selectedEmployee: any;
  breadCrumbItems: any = [];
  userDetails: any;
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
        queryParams: { v: this.version },
      },
      { label: 'Leave Management' },
    ];
  }

  ngOnInit(): void {
    this.getEmployees();
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.updateCountsAnalytics();
    this.setFilterConfig();
    this.getLeavesStatusCount();
    const storedStatus = localStorage.getItem('selectedLeaveStatus');
    if (storedStatus) {
      this.selectedLeavesStatus = JSON.parse(storedStatus);
    }
    const storedEmployee = localStorage.getItem('selectedEmployeeStatus');
    if (storedEmployee) {
      this.selectedEmployee = JSON.parse(storedEmployee);
    }
    const storedAppliedFilter = localStorage.getItem('leavesAppliedFilter');
    if (storedAppliedFilter) {
      this.appliedFilter = JSON.parse(storedAppliedFilter);
    }
  }

  setFilterConfig() {
    this.filterConfig = [
      {
        header: 'Leave Id',
        data: [
          {
            field: 'leaveId',
            title: 'Leave Id',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
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
        header: 'Leave Type',
        data: [
          {
            field: 'leaveType',
            title: 'Leave Type',
            type: 'dropdown',
            filterType: 'like',
            options: this.leavetypeentities.map((entity) => ({
              label: entity.displayName,
              value: entity.name,
            })),
          },
        ],
      },
      {
        header: 'Leave From',
        data: [
          {
            field: 'leaveFrom',
            title: 'Leave From',
            type: 'date',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Leave To',
        data: [
          {
            field: 'leaveTo',
            title: 'Leave To',
            type: 'date',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Duration Type',
        data: [
          {
            field: 'durationType',
            title: 'Duration Type',
            type: 'dropdown',
            filterType: 'like',
            options: this.durationTypeEntities.map((entity) => ({
              label: entity.displayName,
              value: entity.name,
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
  updateCountsAnalytics() {
    this.countsAnalytics = [
      {
        name: 'user',
        displayName: 'Leaves',
        count:
          this.leavesStatusCount[1] +
          this.leavesStatusCount[2] +
          this.leavesStatusCount[3],
        textcolor: '#6C5FFC',
        backgroundcolor: '#F0EFFF',
      },
      {
        name: 'circle-half-stroke',
        displayName: 'Pending',
        count: this.leavesStatusCount[1],
        textcolor: '#FFC107',
        backgroundcolor: '#FFF3D6',
      },
      {
        name: 'check-circle',
        displayName: 'Approved',
        count: this.leavesStatusCount[2],
        textcolor: '#2ECC71',
        backgroundcolor: '#F0F9E8',
      },
      {
        name: 'circle-xmark',
        displayName: 'Rejected',
        count: this.leavesStatusCount[3],
        textcolor: '#DC3545',
        backgroundcolor: '#F8D7DA',
      },
    ];
  }
  loadLeaves(event) {
    this.currentTableEvent = event;
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilter,
      this.appliedFilter
    );
    if (this.selectedLeavesStatus) {
      if (this.selectedLeavesStatus && this.selectedLeavesStatus.name) {
        if (this.selectedLeavesStatus.name != 'all') {
          api_filter['leaveInternalStatus-eq'] = this.selectedLeavesStatus.id;
        } else {
          api_filter['lastleaveInternalStatus-or'] = '1,2,3';
        }
      }
    }
    if (this.selectedEmployee) {
      if (this.selectedEmployee && this.selectedEmployee.employeeName) {
        if (this.selectedEmployee.employeeName != 'All') {
          api_filter['employeeId-eq'] = this.selectedEmployee.employeeId;
        } else {
          api_filter['lastleaveInternalStatus-or'] = '1,2,3';
        }
      }
    }
    console.log(api_filter);
    if (api_filter) {
      this.getLeavesCount(api_filter);
      this.getLeaves(api_filter);
    }
  }

  actionItems(leave: any): MenuItem[] {
    const menuItems: any = [{ label: 'Actions', items: [] }];

    if (leave.leaveInternalStatus === 1) {
      menuItems[0].items.push({
        label: 'Approved',
        icon: 'fa fa-circle-check',
        command: () => this.approveLeave(leave),
      });
      menuItems[0].items.push({
        label: 'Rejected',
        icon: 'fa fa-circle-xmark',
        command: () => this.rejectLeave(leave),
      });
      menuItems[0].items.push({
        label: 'Update',
        icon: 'fa fa-pen-to-square',
        command: () => this.updateLeave(leave.leaveId),
      });
      if (this.userDetails?.designation == 4) {
        menuItems[0].items.push({
          label: 'Delete',
          icon: 'fa fa-trash',
          command: () => this.confirmDelete(leave.leaveId),
        });
      }
    } else if (leave.leaveInternalStatus === 2) {
      menuItems[0].items.push({
        label: 'Pending',
        icon: 'fa fa-clock-rotate-left',
        command: () => this.pendingLeave(leave),
      });
      menuItems[0].items.push({
        label: 'Rejected',
        icon: 'fa fa-circle-xmark',
        command: () => this.rejectLeave(leave),
      });
      menuItems[0].items.push({
        label: 'Update',
        icon: 'fa fa-pen-to-square',
        command: () => this.updateLeave(leave.leaveId),
      });
      if (this.userDetails?.designation == 4) {
        menuItems[0].items.push({
          label: 'Delete',
          icon: 'fa fa-trash',
          command: () => this.confirmDelete(leave.leaveId),
        });
      }
    } else if (leave.leaveInternalStatus === 3) {
      menuItems[0].items.push({
        label: 'Pending',
        icon: 'fa fa-clock-rotate-left',
        command: () => this.pendingLeave(leave),
      });
      menuItems[0].items.push({
        label: 'Approved',
        icon: 'fa fa-circle-check',
        command: () => this.approveLeave(leave),
      });
      menuItems[0].items.push({
        label: 'Update',
        icon: 'fa fa-pen-to-square',
        command: () => this.updateLeave(leave.leaveId),
      });
      if (this.userDetails?.designation == 4) {
        menuItems[0].items.push({
          label: 'Delete',
          icon: 'fa fa-trash',
          command: () => this.confirmDelete(leave.leaveId),
        });
      }
    }
    return menuItems;
  }
  confirmDelete(leaveId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Leave?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteLeave(leaveId);
      },
    });
  }
  deleteLeave(leaveId) {
    this.loading = true;
    this.employeesService.deleteLeave(leaveId).subscribe(
      (response: any) => {
        console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadLeaves(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  approveLeave(leave) {
    this.changeLeaveStatus(leave.leaveId, 2);
  }
  rejectLeave(leave) {
    this.changeLeaveStatus(leave.leaveId, 3);
  }
  pendingLeave(leave) {
    this.changeLeaveStatus(leave.leaveId, 1);
  }
  changeLeaveStatus(leaveId, statusId) {
    this.loading = true;
    this.employeesService.changeLeaveStatus(leaveId, statusId).subscribe(
      (response) => {
        this.toastService.showSuccess('Leave Status Changed Successfully');
        this.loading = false;
        this.loadLeaves(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getLeavesCount(filter = {}) {
    this.employeesService.getLeavesCount(filter).subscribe(
      (response) => {
        this.totalLeavesCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getLeaves(filter = {}) {
    this.loading = true;
    this.employeesService.getLeaves(filter).subscribe(
      (response) => {
        this.leaves = response;
        console.log('leaves', this.leaves);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getLeavesStatusCount() {
    this.loading = true;
    this.employeesService.getLeaves().subscribe(
      (response) => {
        this.leavesStatusCount = this.countleaveInternalStatus(response);
        this.updateCountsAnalytics();
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  countleaveInternalStatus(leaves) {
    const statusCount = { 1: 0, 2: 0, 3: 0 };
    leaves.forEach((leave) => {
      if (leave.leaveInternalStatus in statusCount) {
        statusCount[leave.leaveInternalStatus]++;
      }
    });
    return statusCount;
  }

  getStatusColor(status: string): {
    textColor: string;
    backgroundColor: string;
  } {
    switch (status) {
      case 'approved':
        return { textColor: '#5DCC0B', backgroundColor: '#E4F7D6' };
      case 'pending':
        return { textColor: '#FFBA15', backgroundColor: '#FFF3D6' };
      case 'rejected':
        return { textColor: '#FF555A', backgroundColor: '#FFE2E3' };
      default:
        return { textColor: 'black', backgroundColor: 'white' };
    }
  }
  getStatusName(statusId) {
    if (
      this.leavesInternalStatusList &&
      this.leavesInternalStatusList.length > 0
    ) {
      let leaveStatusName = this.leavesInternalStatusList.filter(
        (leaveStatus) => leaveStatus.id == statusId
      );
      return (
        (leaveStatusName && leaveStatusName[0] && leaveStatusName[0].name) || ''
      );
    }
    return '';
  }

  getEmployees(filter = {}) {
    this.loading = true;
    filter['employeeInternalStatus-eq'] = 1;
    this.employeesService.getEmployees(filter).subscribe(
      (response: any) => {
        this.employees = [{ employeeName: 'All' }, ...response];
        console.log('employees', this.employees);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      console.log(this.currentTableEvent);
      this.loadLeaves(this.currentTableEvent);
    }
  }
  filterWithemployeeName() {
    let searchFilter = { 'employeeName-like': this.employeeNameToSearch };
    this.applyFilters(searchFilter);
  }
  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    console.log(this.currentTableEvent);
    this.loadLeaves(this.currentTableEvent);
  }
  // statusChange(event) {
  //   this.loadLeaves(this.currentTableEvent);
  // }

  statusChange(event: any): void {
    localStorage.setItem('selectedLeaveStatus', JSON.stringify(event.value));
    this.loadLeaves(this.currentTableEvent);
  }

  statusChangeEmployee(event: any): void {
    localStorage.setItem('selectedEmployeeStatus', JSON.stringify(event.value));
    this.loadLeaves(this.currentTableEvent);
  }

  // applyConfigFilters(event) {
  //   let api_filter = event;
  //   if (api_filter['reset']) {
  //     delete api_filter['reset'];
  //     this.appliedFilter = {};
  //   } else {
  //     this.appliedFilter = api_filter;
  //   }
  //   this.loadLeaves(this.currentTableEvent);
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
      'leavesAppliedFilter',
      JSON.stringify(this.appliedFilter)
    );
    this.loadLeaves(this.currentTableEvent);
  }
  createLeave() {
    this.routingService.handleRoute('leaves/create', null);
  }

  updateLeave(leaveId) {
    this.routingService.handleRoute('leaves/update/' + leaveId, null);
  }
  goBack() {
    this.location.back();
  }
}
