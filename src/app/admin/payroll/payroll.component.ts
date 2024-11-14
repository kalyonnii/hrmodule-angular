import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { RoutingService } from 'src/app/services/routing-service';
import { ConfirmationService } from 'primeng/api';
import { ToastService } from 'src/app/services/toast.service';
import { EmployeesService } from '../employees/employees.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss'],
})
export class PayrollComponent {
  breadCrumbItems: any = [];
  currentTableEvent: any;
  filterConfig: any[] = [];
  appliedFilter: {};
  selectedEmployee: any;
  loading: any;
  payroll: any = [];
  totalPayrollCount: any = 0;
  employees: any = [];
  searchFilter: any = {};
  version = projectConstantsLocal.VERSION_DESKTOP;
  moment: any;
  selectedDate: Date;
  userDetails: any;
  constructor(
    private location: Location,
    private confirmationService: ConfirmationService,
    private routingService: RoutingService,
    private toastService: ToastService,
    private employeesService: EmployeesService,
    private localStorageService: LocalStorageService,
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
      { label: 'Payroll' },
    ];
  }
  ngOnInit(): void {
    this.getEmployees();
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.setFilterConfig();
  }
  onDateChange(event: any) {
    this.selectedDate = this.moment(event).format('MM/YYYY');
    this.loadPayslips(this.currentTableEvent);
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

  statusChange(event) {
    this.loadPayslips(this.currentTableEvent);
  }

  setFilterConfig() {
    this.filterConfig = [
      {
        header: 'Payslip Id',
        data: [
          {
            field: 'payslipId',
            title: 'Payslip Id',
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
        header: 'Custom Employee Id',
        data: [
          {
            field: 'customEmployeeId',
            title: 'Custom Employee Id',
            type: 'text',
            filterType: 'like',
          },
        ],
      },

      {
        header: 'Joining Date',
        data: [
          {
            field: 'joiningDate',
            title: 'Joining Date ',
            type: 'date',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Working Days',
        data: [
          {
            field: 'workingDays',
            title: 'Working Days',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Present Days',
        data: [
          {
            field: 'presentDays',
            title: 'Present Days',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Paid Days',
        data: [
          {
            field: 'paidDays',
            title: 'Paid Days',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Absent Days',
        data: [
          {
            field: 'absentDays',
            title: 'Absent Days',
            type: 'text',
            filterType: 'like',
          },
        ],
      },

      {
        header: 'Total Absent Days',
        data: [
          {
            field: 'totalAbsentDays',
            title: 'Total Absent Days',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Double LOP Days',
        data: [
          {
            field: 'doubleLopDays',
            title: 'Double LOP Days',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Late LOP Days',
        data: [
          {
            field: 'lateLopDays',
            title: 'Late LOP Days',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Total Deducted Days',
        data: [
          {
            field: 'totalDeductedDays',
            title: 'Total Deducted Days',
            type: 'text',
            filterType: 'like',
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
        header: 'Day Salary',
        data: [
          {
            field: 'daySalary',
            title: 'Day Salary',
            type: 'text',
            filterType: 'like',
          },
        ],
      },

      {
        header: 'Net Salary Without Double LOP',
        data: [
          {
            field: 'netSalaryWithoutDoubleLop',
            title: 'Net Salary Without Double LOP',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Net Salary With Double LOP',
        data: [
          {
            field: 'netSalaryWithDoubleLop',
            title: 'Net Salary With Double LOP',
            type: 'text',
            filterType: 'like',
          },
        ],
      },
      {
        header: 'Petrol Expenses',
        data: [
          {
            field: 'petrolExpenses',
            title: 'Petrol Expenses',
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
  loadPayslips(event) {
    this.currentTableEvent = event;
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign(
      {},
      api_filter,
      this.searchFilter,
      this.appliedFilter
    );
    if (this.selectedEmployee) {
      if (this.selectedEmployee && this.selectedEmployee.employeeName) {
        if (this.selectedEmployee.employeeName != 'All') {
          api_filter['employeeId-eq'] = this.selectedEmployee.employeeId;
        } else {
        }
      }
    }
    api_filter['payrollMonth-eq'] = this.selectedDate;
    console.log(api_filter);
    if (api_filter) {
      this.getPayrollCount(api_filter);
      this.getPayroll(api_filter);
    }
  }

  getPayrollCount(filter = {}) {
    this.employeesService.getPayrollCount(filter).subscribe(
      (response) => {
        this.totalPayrollCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getPayroll(filter = {}) {
    this.loading = true;
    this.employeesService.getPayroll(filter).subscribe(
      (payrollResponse: any) => {
        this.employeesService.getEmployees().subscribe(
          (employeeResponse: any) => {
            this.payroll = this.mergePayrollWithEmployees(
              payrollResponse,
              employeeResponse
            );

            console.log('Merged Payroll Data:', this.payroll);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.toastService.showError(error);
          }
        );
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  mergePayrollWithEmployees(payroll: any[], employees: any[]): any[] {
    return payroll.map((p) => {
      const employee = employees.find((e) => e.employeeId === p.employeeId);
      return employee ? { ...p, passPhoto: employee.passPhoto } : p;
    });
  }

  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    console.log(this.currentTableEvent);
    this.loadPayslips(this.currentTableEvent);
  }

  applyConfigFilters(event) {
    let api_filter = event;
    if (api_filter['reset']) {
      delete api_filter['reset'];
      this.appliedFilter = {};
    } else {
      this.appliedFilter = api_filter;
    }
    this.loadPayslips(this.currentTableEvent);
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

  updateUser(payslipId) {
    this.routingService.handleRoute('payroll/update/' + payslipId, null);
  }

  confirmDelete(payslipId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this User?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletePayroll(payslipId);
      },
    });
  }

  deletePayroll(payslipId) {
    this.loading = true;
    this.employeesService.deletePayroll(payslipId).subscribe(
      (response: any) => {
        console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadPayslips(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  createPayroll() {
    this.routingService.handleRoute('payroll/create', null);
  }

  ViewPayslip(payslipId) {
    this.routingService.handleRoute('payroll/payslip/' + payslipId, null);
  }
  goBack() {
    this.location.back();
  }
}
