import { Component, OnInit } from '@angular/core';
import { EmployeesService } from '../employees/employees.service';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { ToastService } from 'src/app/services/toast.service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { RoutingService } from 'src/app/services/routing-service';
@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss'],
})
export class DesignationsComponent implements OnInit {
  breadCrumbItems: any = [];
  formFields: any = [];
  loading: any;
  appliedFilter: {};
  departmentData: any;
  filterConfig: any[] = [];
  totalDesignationsCount: any = 0;

  designationId: any;
  userDetails: any;
  searchFilter: any = {};
  displayNameToSearch: any;
  isDialogVisible = false;
  designations: any = [];
  currentTableEvent: any;
  departmentsForm: UntypedFormGroup;
  heading: any = 'Create Department';
  actionType: any = 'create';
  departmentInternalStatusList: any = projectConstantsLocal.DEPARTMENT_STATUS;
  selectedDepartmentStatus = this.departmentInternalStatusList[1];
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private employeesService: EmployeesService,
    private location: Location,
    private routingService: RoutingService,
    private formBuilder: UntypedFormBuilder,
    private localStorageService: LocalStorageService,
    private confirmationService: ConfirmationService,
    private toastService: ToastService
  ) {
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: '  Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Departments' },
    ];
  }
  ngOnInit(): void {
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.setFilterConfig();
    this.createForm();
    this.setDepartmentsList();
    const storedFilter = localStorage.getItem('selectedDepartmentStatus');
    if (storedFilter) {
      this.selectedDepartmentStatus = JSON.parse(storedFilter);
    }
    const storedAppliedFilter = localStorage.getItem(
      'departmentsAppliedFilter'
    );
    if (storedAppliedFilter) {
      this.appliedFilter = JSON.parse(storedAppliedFilter);
    }
  }

  createForm() {
    this.departmentsForm = this.formBuilder.group({
      displayName: ['', Validators.required],
      designation: ['', Validators.required],
    });
  }

  setFilterConfig() {
    this.filterConfig = [
      {
        header: 'Department Id',
        data: [
          {
            field: 'designationId',
            title: 'Department Id',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Designation Name',
        data: [
          {
            field: 'displayName',
            title: 'Designation Name',
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
        header: 'Department',
        data: [
          {
            field: 'designation',
            title: 'Department',
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

  setDepartmentsList() {
    this.formFields = [
      {
        label: 'Designation Name',
        controlName: 'designation',
        type: 'text',
        required: true,
      },
      {
        label: 'Department Name',
        controlName: 'displayName',
        type: 'text',
        required: true,
      },
    ];
  }
  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      console.log(this.currentTableEvent);
      this.loadDesignations(this.currentTableEvent);
    }
  }

  statusChange(event: any): void {
    localStorage.setItem(
      'selectedDepartmentStatus',
      JSON.stringify(event.value)
    );
    this.loadDesignations(this.currentTableEvent);
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
      'departmentsAppliedFilter',
      JSON.stringify(this.appliedFilter)
    );
    this.loadDesignations(this.currentTableEvent);
  }
  filterWithCandidateName(): void {
    const searchFilter = { 'displayName-like': this.displayNameToSearch };
    this.applyFilters(searchFilter);
  }

  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    console.log(this.currentTableEvent);
    this.loadDesignations(this.currentTableEvent);
  }
  loadDesignations(event) {
    this.currentTableEvent = event;
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilter,
      this.appliedFilter
    );
    if (this.selectedDepartmentStatus) {
      if (this.selectedDepartmentStatus && this.selectedDepartmentStatus.name) {
        if (this.selectedDepartmentStatus.name != 'all') {
          api_filter['designationInternalStatus-eq'] =
            this.selectedDepartmentStatus.id;
        } else {
          api_filter['lastDesignationInternalStatus-or'] = '1,2';
        }
      }
    }
    if (api_filter) {
      this.getDesignationCount(api_filter);
      this.getDesignations(api_filter);
    }
  }

  getDesignationCount(filter = {}) {
    this.employeesService.getDesignationCount(filter).subscribe(
      (response) => {
        this.totalDesignationsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getDesignations(filter = {}) {
    this.loading = true;
    this.employeesService.getDesignations(filter).subscribe(
      (response) => {
        this.designations = response;
        console.log('designations', this.designations);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  createDepartment(): void {
    this.isDialogVisible = true;
    this.departmentsForm.reset();
  }

  clearDialog(): void {
    this.isDialogVisible = false;
    this.departmentsForm.reset();
  }

  onSubmit(formValues) {
    let formData: any = {
      displayName: formValues.displayName,
      designation: formValues.designation,
    };
    console.log('formData', formData);
    if (this.actionType == 'create') {
      this.loading = true;
      this.employeesService.createDesignation(formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.isDialogVisible = false;
            this.toastService.showSuccess('Department Added Successfully');
            this.routingService.handleRoute('designations', null);
            this.loadDesignations(this.currentTableEvent);
          }
        },
        (error: any) => {
          this.loading = false;
          console.log(error);
          this.toastService.showError(error);
        }
      );
    } else if (this.actionType == 'update') {
      this.loading = true;
      console.log(formData);
      this.employeesService
        .updateDesignation(this.designationId, formData)
        .subscribe(
          (data) => {
            if (data) {
              this.loading = false;
              this.isDialogVisible = false;
              this.toastService.showSuccess('Department Updated Successfully');
              this.routingService.handleRoute('designations', null);
              this.loadDesignations(this.currentTableEvent);
            }
          },
          (error: any) => {
            this.loading = false;
            this.toastService.showError(error);
          }
        );
    }
  }
  getStatusColor(status: string): {
    textColor: string;
    backgroundColor: string;
  } {
    switch (status) {
      case 'Active':
        return { textColor: '#5DCC0B', backgroundColor: '#E4F7D6' };
      case 'InActive':
        return { textColor: '#FF555A', backgroundColor: '#FFE2E3' };
      default:
        return { textColor: 'black', backgroundColor: 'white' };
    }
  }

  updateDepartment(department) {
    this.isDialogVisible = true;
    if (department && department?.designationId) {
      this.designationId = department.designationId;
      this.actionType = 'update';
      this.heading = 'Update Department';
      console.log(this.designationId);
      this.getDesignationsById().then((data) => {
        if (data) {
          this.departmentsForm.patchValue({
            designation: this.departmentData?.designation,
            displayName: this.departmentData?.displayName,
          });
        }
      });
    }
  }

  getDesignationsById(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.employeesService
        .getDesignationsById(this.designationId, filter)
        .subscribe(
          (response) => {
            this.departmentData = response;
            this.loading = false;
            resolve(true);
          },
          (error: any) => {
            this.loading = false;
            resolve(false);
            this.toastService.showError(error);
          }
        );
    });
  }

  actionItems(department: any): MenuItem[] {
    const menuItems: any = [{ label: 'Actions', items: [] }];
    if (department.designationInternalStatus === 1) {
      menuItems[0].items.push({
        label: 'In Active',
        icon: 'fa fa-right-to-bracket',
        command: () => this.inactiveDepartment(department),
      });
      menuItems[0].items.push({
        label: 'Update',
        icon: 'fa fa-pen-to-square',
        command: () => this.updateDepartment(department),
      });
      if (this.userDetails?.designation == 4) {
        menuItems[0].items.push({
          label: 'Delete',
          icon: 'fa fa-trash',
          command: () => this.confirmDelete(department.designationId),
        });
      }
    } else if (department.designationInternalStatus === 2) {
      menuItems[0].items.push({
        label: 'In Active',
        icon: 'fa fa-right-to-bracket',
        command: () => this.ActiveDepartment(department),
      });
    }
    return menuItems;
  }

  ActiveDepartment(department) {
    this.changeDesignationStatus(department.designationId, 1);
  }
  inactiveDepartment(department) {
    this.changeDesignationStatus(department.designationId, 2);
  }
  changeDesignationStatus(designationId, statusId) {
    this.loading = true;
    this.employeesService
      .changeDesignationStatus(designationId, statusId)
      .subscribe(
        (response) => {
          this.toastService.showSuccess(
            'Departments Status Changed Successfully'
          );
          this.loading = false;
          this.loadDesignations(this.currentTableEvent);
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
  }
  confirmDelete(designationId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Department?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteDepartment(designationId);
      },
    });
  }

  deleteDepartment(designationId) {
    this.loading = true;
    this.employeesService.deleteDesignation(designationId).subscribe(
      (response: any) => {
        console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadDesignations(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getStatusName(statusId) {
    if (
      this.departmentInternalStatusList &&
      this.departmentInternalStatusList.length > 0
    ) {
      let departmentStatusName = this.departmentInternalStatusList.filter(
        (departmentStatus) => departmentStatus.id == statusId
      );
      return (
        (departmentStatusName &&
          departmentStatusName[0] &&
          departmentStatusName[0].name) ||
        ''
      );
    }
    return '';
  }
  goBack() {
    this.location.back();
  }
}
