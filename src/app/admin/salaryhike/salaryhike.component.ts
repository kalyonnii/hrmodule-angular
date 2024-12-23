import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { EmployeesService } from '../employees/employees.service';
import { RoutingService } from 'src/app/services/routing-service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from 'src/app/services/toast.service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';

@Component({
  selector: 'app-salaryhike',
  templateUrl: './salaryhike.component.html',
  styleUrls: ['./salaryhike.component.scss'],
})
export class SalaryhikeComponent {
  breadCrumbItems: any = [];
  formFields: any = [];
  loading: any;
  appliedFilter: {};
  salaryHikeData: any;
  filterConfig: any[] = [];
  totalSalaryHikesCount: any = 0;
  moment: any;
  hikeId: any;
  userDetails: any;
  searchFilter: any = {};
  employeeeNameToSearch: any;
  isDialogVisible = false;
  salaryHikes: any = [];
  salaryHikes1: any = [];
  currentTableEvent: any;
  salaryHikeForm: UntypedFormGroup;
  heading: any = 'Create Salary Hike';
  actionType: any = 'create';
  employees: any = [];
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private employeesService: EmployeesService,
    private location: Location,
    private routingService: RoutingService,
    private formBuilder: UntypedFormBuilder,
    private localStorageService: LocalStorageService,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
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
      { label: 'Salary Hikes' },
    ];
  }
  ngOnInit(): void {
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.setFilterConfig();
    this.createForm();
    this.getEmployees();
    this.setSalaryHikesList();
    const storedAppliedFilter = localStorage.getItem(
      'salaryHikesAppliedFilter'
    );
    if (storedAppliedFilter) {
      this.appliedFilter = JSON.parse(storedAppliedFilter);
    }
    this.salaryHikeForm
      .get('employeeName')
      ?.valueChanges.subscribe((selectedName) => {
        const selectedEmployee = this.employees.find(
          (employee) => employee.employeeName === selectedName
        );
        if (selectedEmployee) {
          this.salaryHikeForm.patchValue({
            employeeId: selectedEmployee.employeeId,
            basicSalary: selectedEmployee.salary,
          });
          console.log(selectedEmployee);
          const missingFields: any = [];
          if (!selectedEmployee.salary) missingFields.push('Salary');
          if (missingFields.length > 0) {
            const missingFieldsMessage = `The following fields are missing: ${missingFields.join(
              ', '
            )}`;
            this.confirmationService.confirm({
              message: `${missingFieldsMessage}. Please update your information.`,
              header: 'Incomplete Employee Details',
              icon: 'pi pi-exclamation-triangle',
              acceptLabel: 'Update',
              accept: () => {
                this.updateEmployee(selectedEmployee.employeeId);
              },
            });
          }
        }
      });
  }

  createForm() {
    this.salaryHikeForm = this.formBuilder.group({
      employeeName: ['', Validators.required],
      employeeId: ['', Validators.required],
      basicSalary: ['', Validators.required],
      monthlyHike: ['', Validators.required],
      hikeDate: ['', Validators.required],
      totalSalary: [''],
    });
  }

  setFilterConfig() {
    this.filterConfig = [
      {
        header: 'Hike Id',
        data: [
          {
            field: 'hikeId',
            title: 'Hike Id',
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
        header: 'Basic Salary',
        data: [
          {
            field: 'basicSalary',
            title: 'Basic Salary',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Monthly Hike',
        data: [
          {
            field: 'monthlyHike',
            title: 'Monthly Hike',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Hike Date',
        data: [
          {
            field: 'hikeDate',
            title: 'Date',
            type: 'date',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Hike Date Range',
        data: [
          {
            field: 'hikeDate',
            title: 'From',
            type: 'date',
            filterType: 'gte',
          },
          { field: 'hikeDate', title: 'To', type: 'date', filterType: 'lte' },
        ],
      },
      {
        header: 'Total Salary',
        data: [
          {
            field: 'totalSalary',
            title: 'Total Salary',
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

  getEmployees(filter = {}) {
    this.loading = true;
    filter['employeeInternalStatus-eq'] = 1;
    this.employeesService.getEmployees(filter).subscribe(
      (response) => {
        this.employees = response;
        console.log('employees', this.employees);
        this.loading = false;
        this.setSalaryHikesList();
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  updateEmployee(employeeId) {
    this.routingService.handleRoute('employees/update/' + employeeId, null);
  }
  setSalaryHikesList() {
    this.formFields = [
      {
        label: 'Employee Name',
        controlName: 'employeeName',
        type: 'dropdown',
        options: 'employees',
        required: true,
        optionLabel: 'employeeName',
        optionValue: 'employeeName',
      },
      {
        label: 'Monthly Hike',
        controlName: 'monthlyHike',
        type: 'number',
        required: true,
      },
      {
        label: 'Hike Date',
        controlName: 'hikeDate',
        type: 'calendar',
        required: true,
      },
    ];
  }

  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      console.log(this.currentTableEvent);
      this.loadSalaryHikes(this.currentTableEvent);
    }
  }

  statusChange(event: any): void {
    localStorage.setItem(
      'selectedDepartmentStatus',
      JSON.stringify(event.value)
    );
    this.loadSalaryHikes(this.currentTableEvent);
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
      'salaryHikesAppliedFilter',
      JSON.stringify(this.appliedFilter)
    );
    this.loadSalaryHikes(this.currentTableEvent);
  }
  filterWithEmployeeName(): void {
    const searchFilter = { 'employeeName-like': this.employeeeNameToSearch };
    this.applyFilters(searchFilter);
  }

  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    console.log(this.currentTableEvent);
    this.loadSalaryHikes(this.currentTableEvent);
  }
  loadSalaryHikes(event) {
    this.currentTableEvent = event;
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilter,
      this.appliedFilter
    );

    if (api_filter) {
      this.getSalaryHikesCount(api_filter);
      this.getSalaryHikes(api_filter);
    }
  }

  getSalaryHikesCount(filter = {}) {
    this.employeesService.getSalaryHikesCount(filter).subscribe(
      (response) => {
        this.totalSalaryHikesCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getSalaryHikes(filter = {}) {
    this.loading = true;
    this.employeesService.getSalaryHikes(filter).subscribe(
      (response) => {
        this.salaryHikes = response;
        console.log('salaryHikes', this.salaryHikes);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  createSalaryHike(): void {
    this.isDialogVisible = true;
    this.salaryHikeForm.reset();
  }

  clearDialog(): void {
    this.isDialogVisible = false;
    this.salaryHikeForm.reset();
  }

  // onSubmit(formValues) {
  //   let formData: any = {
  //     employeeId: formValues.employeeId,
  //     employeeName: formValues.employeeName,
  //     basicSalary: formValues.basicSalary,
  //     monthlyHike: formValues.monthlyHike,
  //     hikeDate: formValues.hikeDate
  //       ? this.moment(formValues.hikeDate).format('YYYY-MM-DD')
  //       : null,
  //     totalSalary: formValues.basicSalary + formValues.monthlyHike,
  //   };
  //   console.log('salaryhikeformData', formData);
  //   if (this.actionType == 'create') {
  //     this.loading = true;
  //     this.employeesService.createSalaryHike(formData).subscribe(
  //       (data) => {
  //         if (data) {
  //           this.loading = false;
  //           this.isDialogVisible = false;
  //           this.toastService.showSuccess('Salary Hike Added Successfully');
  //           this.routingService.handleRoute('salaryhikes', null);
  //           this.loadSalaryHikes(this.currentTableEvent);
  //         }
  //       },
  //       (error: any) => {
  //         this.loading = false;
  //         console.log(error);
  //         this.toastService.showError(error);
  //       }
  //     );
  //   } else if (this.actionType == 'update') {
  //     this.loading = true;
  //     console.log(formData);
  //     this.employeesService.updateSalaryHike(this.hikeId, formData).subscribe(
  //       (data) => {
  //         if (data) {
  //           this.loading = false;
  //           this.isDialogVisible = false;
  //           this.toastService.showSuccess('Salary Hike Updated Successfully');
  //           this.routingService.handleRoute('salaryhikes', null);
  //           this.loadSalaryHikes(this.currentTableEvent);
  //         }
  //       },
  //       (error: any) => {
  //         this.loading = false;
  //         this.toastService.showError(error);
  //       }
  //     );
  //   }
  // }

  getSalaryHikes1(filter = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.employeesService.getSalaryHikes(filter).subscribe(
        (response) => {
          this.salaryHikes1 = response;
          console.log('salaryHikes1', this.salaryHikes1);
          this.loading = false;
          resolve();
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
          reject(error);
        }
      );
    });
  }

  async onSubmit(formValues) {
    // Fetch the latest salary hikes before processing
    await this.getSalaryHikes1();
    if (this.salaryHikes) {
      const existingHike = this.salaryHikes1
        .filter((hike) => hike.employeeId === formValues.employeeId)
        .sort(
          (a, b) =>
            new Date(b.hikeDate).getTime() - new Date(a.hikeDate).getTime()
        )[0];
      if (existingHike) {
        formValues.basicSalary = existingHike.totalSalary;
      }
    }

    let formData: any = {
      employeeId: formValues.employeeId,
      employeeName: formValues.employeeName,
      basicSalary: formValues.basicSalary,
      monthlyHike: formValues.monthlyHike,
      hikeDate: formValues.hikeDate
        ? this.moment(formValues.hikeDate).format('YYYY-MM-DD')
        : null,
      totalSalary: formValues.basicSalary + formValues.monthlyHike,
    };

    console.log('salaryhikeformData', formData);

    if (this.actionType === 'create') {
      this.loading = true;
      this.employeesService.createSalaryHike(formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.isDialogVisible = false;
            this.toastService.showSuccess('Salary Hike Added Successfully');
            this.routingService.handleRoute('salaryhikes', null);
            this.loadSalaryHikes(this.currentTableEvent);
          }
        },
        (error: any) => {
          this.loading = false;
          console.log(error);
          this.toastService.showError(error);
        }
      );
    } else if (this.actionType === 'update') {
      if (!this.hikeId) {
        this.toastService.showError('Hike ID is required for updates.');
        return;
      }
      this.loading = true;
      this.employeesService.updateSalaryHike(this.hikeId, formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.isDialogVisible = false;
            this.toastService.showSuccess('Salary Hike Updated Successfully');
            this.routingService.handleRoute('salaryhikes', null);
            this.loadSalaryHikes(this.currentTableEvent);
          }
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    }
  }

  updateSalaryHike(salaryHike) {
    this.isDialogVisible = true;
    if (salaryHike && salaryHike?.hikeId) {
      this.hikeId = salaryHike.hikeId;
      this.actionType = 'update';
      this.heading = 'Update Salary Hike';
      console.log(this.hikeId);
      this.getSalaryHikesById().then((data) => {
        if (data) {
          this.salaryHikeForm.patchValue({
            employeeId: this.salaryHikeData?.employeeId,
            employeeName: this.salaryHikeData?.employeeName,
            basicSalary: this.salaryHikeData?.basicSalary,
            monthlyHike: this.salaryHikeData?.monthlyHike,
            hikeDate: this.salaryHikeData?.hikeDate,
            totalSalary: this.salaryHikeData?.totalSalary,
          });
        }
      });
    }
  }

  getSalaryHikesById(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.employeesService.getSalaryHikesById(this.hikeId, filter).subscribe(
        (response) => {
          this.salaryHikeData = response;
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

  confirmDelete(salaryHike) {
    this.confirmationService.confirm({
      // message: 'Are you sure you want to delete this Salary Hike?',
      message: `Are you sure you want to delete this Salary Hike ? <br>
      Employee Name: ${salaryHike.employeeName}<br>
      Salary Hike ID: ${salaryHike.hikeId}
      `,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteSalaryHike(salaryHike.hikeId);
      },
    });
  }

  deleteSalaryHike(hikeId) {
    this.loading = true;
    this.employeesService.deleteSalaryHike(hikeId).subscribe(
      (response: any) => {
        console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadSalaryHikes(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  ViewHikeletter(hikeId) {
    this.routingService.handleRoute('salaryhikes/hikeletter/' + hikeId, null);
  }
  goBack() {
    this.location.back();
  }
}
