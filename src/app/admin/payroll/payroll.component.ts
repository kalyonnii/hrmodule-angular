import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { RoutingService } from 'src/app/services/routing-service';
import { ConfirmationService, MenuItem } from 'primeng/api';
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
  selectedPayrollDetails: any = null;
  isDialogVisible = false;
  selectedEmployee: any;
  loading: any;
  apiLoading: any;
  payroll: any = [];
  totalPayrollCount: any = 0;
  employees: any = [];
  searchFilter: any = {};
  version = projectConstantsLocal.VERSION_DESKTOP;
  moment: any;
  selectedMonth: Date;
  displayMonth: Date;
  capabilities: any;
  userDetails: any;
  currentYear: number;
  constructor(
    private location: Location,
    private confirmationService: ConfirmationService,
    private routingService: RoutingService,
    private toastService: ToastService,
    private employeesService: EmployeesService,
    private localStorageService: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    const usertype = localStorage.getItem('userType');
    this.moment = this.dateTimeProcessor.getMoment();
    this.selectedMonth = this.moment(new Date())
      .subtract(1, 'month')
      .format('YYYY-MM');
    this.displayMonth = this.moment(new Date())
      .subtract(1, 'month')
      .format('MMMM YYYY');
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: '  Dashboard',
        routerLink: `/${usertype}/dashboard`,
        queryParams: { v: this.version },
      },
      { label: 'Payroll' },
    ];
  }
  ngOnInit(): void {
    this.currentYear = this.employeesService.getCurrentYear();
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.capabilities = this.employeesService.getUserRbac();
    console.log('capabilities', this.capabilities);
    if (this.capabilities.adminPayroll) {
      this.getEmployees();
    }
    this.setFilterConfig();
    const storedStatus = localStorage.getItem('selectedEmployee');
    if (storedStatus) {
      this.selectedEmployee = JSON.parse(storedStatus);
    }
    const storedMonth = localStorage.getItem('payrollMonth');
    if (storedMonth) {
      this.selectedMonth = JSON.parse(storedMonth);
      this.displayMonth = this.moment(this.selectedMonth).format('MMMM YYYY');
    }
    const storedAppliedFilter = localStorage.getItem('payrollAppliedFilter');
    if (storedAppliedFilter) {
      this.appliedFilter = JSON.parse(storedAppliedFilter);
    }
  }
  onDateChange(event: any) {
    this.selectedMonth = this.moment(event).format('YYYY-MM');
    this.displayMonth = this.moment(event).format('MMMM YYYY');
    localStorage.setItem('payrollMonth', JSON.stringify(this.selectedMonth));
    this.loadPayslips(this.currentTableEvent);
  }
  getEmployees(filter = {}) {
    this.loading = true;
    filter['employeeInternalStatus-eq'] = 1;
    filter['sort'] = 'joiningDate,asc';
    console.log(filter);
    this.employeesService.getEmployees(filter).subscribe(
      (response: any) => {
        this.employees = [{ employeeName: 'All' }, ...response];
        this.employees = this.employees.map((emp) => ({
          ...emp,
          employeeName: emp.employeeName
            .split(' ')
            .map((word) => {
              if (word.includes('.')) {
                return word
                  .split('.')
                  .map(
                    (part) =>
                      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
                  )
                  .join('.');
              }
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(' '),
        }));
        console.log('employees', this.employees);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  actionItems(payslip: any): MenuItem[] {
    const menuItems: any = [{ label: 'Actions', items: [] }];
    menuItems[0].items.push({
      label: 'Payroll Details',
      icon: 'fa fa-eye',
      command: () => this.showPayrollDetails(payslip),
    });
    if (this.capabilities.adminPayroll) {
      menuItems[0].items.push({
        label: 'Update',
        icon: 'fa fa-pen-to-square',
        command: () => this.updateUser(payslip.payslipId),
      });
    }
    if (this.capabilities.delete) {
      menuItems[0].items.push({
        label: 'Delete',
        icon: 'fa fa-trash',
        command: () => this.confirmDelete(payslip),
      });
    }
    return menuItems;
  }

  showPayrollDetails(user: any): void {
    this.selectedPayrollDetails = user;
    this.isDialogVisible = true;
  }
  clearDialog(): void {
    this.selectedPayrollDetails = null;
    this.isDialogVisible = false;
  }

  statusChange(event: any): void {
    localStorage.setItem('selectedEmployee', JSON.stringify(event.value));
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
      // {
      //   header: 'Employee Id',
      //   data: [
      //     {
      //       field: 'employeeId',
      //       title: 'Employee Id',
      //       type: 'text',
      //       filterType: 'like',
      //     },
      //   ],
      // },

      ...(this.capabilities.employeePayroll
        ? [
            {
              header: 'Payroll Month',
              data: [
                {
                  field: 'payrollMonth',
                  title: 'Payroll Month',
                  type: 'month',
                  filterType: 'eq',
                },
              ],
            },
          ]
        : []),

      ...(this.capabilities.adminPayroll
        ? [
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
          ]
        : []),
      // {
      //   header: 'Custom Employee Id',
      //   data: [
      //     {
      //       field: 'customEmployeeId',
      //       title: 'Custom Employee Id',
      //       type: 'text',
      //       filterType: 'like',
      //     },
      //   ],
      // },
      // {
      //   header: 'Joining Date',
      //   data: [
      //     {
      //       field: 'joiningDate',
      //       title: 'Joining Date ',
      //       type: 'date',
      //       filterType: 'like',
      //     },
      //   ],
      // },
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
      // {
      //   header: 'Account Number',
      //   data: [
      //     {
      //       field: 'accountNumber',
      //       title: 'Account Number',
      //       type: 'text',
      //       filterType: 'like',
      //     },
      //   ],
      // },
      // {
      //   header: 'IFSC Code',
      //   data: [
      //     {
      //       field: 'ifscCode',
      //       title: 'IFSC Code',
      //       type: 'text',
      //       filterType: 'like',
      //     },
      //   ],
      // },
      // {
      //   header: 'Bank Branch',
      //   data: [
      //     {
      //       field: 'bankBranch',
      //       title: 'Bank Branch',
      //       type: 'text',
      //       filterType: 'like',
      //     },
      //   ],
      // },
      ...(this.capabilities.adminPayroll
        ? [
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
          ]
        : []),
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
    if (this.capabilities.employeePayroll) {
      api_filter['employeeId-eq'] = this.userDetails.employeeId;
    } else {
      api_filter['payrollMonth-eq'] = this.selectedMonth;
    }
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
    this.apiLoading = true;
    this.employeesService.getPayroll(filter).subscribe(
      (payrollResponse: any) => {
        this.employeesService.getEmployees().subscribe(
          (employeeResponse: any) => {
            this.payroll = this.mergePayrollWithEmployees(
              payrollResponse,
              employeeResponse
            );
            console.log('Merged Payroll Data:', this.payroll);
            this.apiLoading = false;
          },
          (error: any) => {
            this.apiLoading = false;
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
    localStorage.setItem(
      'payrollAppliedFilter',
      JSON.stringify(this.appliedFilter)
    );
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

  confirmDelete(payslip) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this Payroll ? <br>
              Employee Name: ${payslip.employeeName}<br>
              Payroll ID: ${payslip.payslipId}
              `,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletePayroll(payslip.payslipId);
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
