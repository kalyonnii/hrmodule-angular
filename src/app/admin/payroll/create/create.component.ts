import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { EmployeesService } from '../../employees/employees.service';
import { ToastService } from 'src/app/services/toast.service';
import { RoutingService } from 'src/app/services/routing-service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  loading: any;
  breadCrumbItems: any = [];
  moment: any;
  formFields: any = [];
  payslipId: any;
  payrollData: any;
  payrollForm: UntypedFormGroup;
  userDetails: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  employees: any = [];
  heading: any = 'Create Payroll';
  actionType: any = 'create';
  constructor(
    private location: Location,
    private routingService: RoutingService,
    private toastService: ToastService,
    private formBuilder: UntypedFormBuilder,
    private employeesService: EmployeesService,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.activatedRoute.params.subscribe((params) => {
      if (params && params['id']) {
        this.payslipId = params['id'];
        this.actionType = 'update';
        this.heading = 'Update Payroll';
        this.getPayrollById().then((data) => {
          if (data) {
            console.log('Payroll Data', this.payrollData);
            this.payrollForm.patchValue({
              payrollMonth: this.payrollData.payrollMonth,
              employeeName: this.payrollData.employeeName,
              employeeId: this.payrollData.employeeId,
              customEmployeeId: this.payrollData.customEmployeeId,
              joiningDate: this.payrollData.joiningDate,
              workingDays: this.payrollData.workingDays,
              presentDays: this.payrollData.presentDays,
              absentDays: this.payrollData.absentDays,
              paidDays: this.payrollData.paidDays,
              casualDays: this.payrollData.casualDays,
              totalAbsentDays: this.payrollData.totalAbsentDays,
              doubleLopDays: this.payrollData.doubleLopDays,
              lateLopDays: this.payrollData.lateLopDays,
              totalDeductedDays: this.payrollData.totalDeductedDays,
              salary: this.payrollData.salary,
              deductions: this.payrollData.deductions,
              daySalary: this.payrollData.daySalary,
              netSalaryWithoutDoubleLop:
                this.payrollData.netSalaryWithoutDoubleLop,
              netSalaryWithDoubleLop: this.payrollData.netSalaryWithDoubleLop,
              netSalary: this.payrollData.netSalary,
              petrolExpenses: this.payrollData.petrolExpenses,
              accountNumber: this.payrollData.accountNumber,
              ifscCode: this.payrollData.ifscCode,
              bankBranch: this.payrollData.bankBranch,
            });
          }
        });
      }
    });
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: ' Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Payroll',
        routerLink: '/user/payroll',
        queryParams: { v: this.version },
      },
      { label: this.actionType == 'create' ? 'Create' : 'Update' },
    ];
  }

  ngOnInit() {
    this.createForm();
    this.setPayrollList();
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    if (userDetails) {
      this.userDetails = userDetails.user;
      console.log(this.userDetails);
    }

    this.getEmployees();

    // Subscribe to employeeName changes and auto-fill employee details
    this.payrollForm
      .get('employeeName')
      ?.valueChanges.subscribe((selectedName) => {
        const selectedEmployee = this.employees.find(
          (employee) => employee.employeeName === selectedName
        );

        if (selectedEmployee) {
          this.payrollForm.patchValue({
            employeeId: selectedEmployee.employeeId,
            customEmployeeId: selectedEmployee.customEmployeeId,
            joiningDate: selectedEmployee.joiningDate,
            salary: selectedEmployee.salary,
            accountNumber: selectedEmployee.accountNumber,
            ifscCode: selectedEmployee.ifscCode,
            bankBranch: selectedEmployee.bankBranch,
          });
        }
      });

    // Subscribe to absentDays changes and calculate casual days and total absent days
    this.payrollForm.get('absentDays')?.valueChanges.subscribe((absentDays) => {
      this.handleAbsentDays(absentDays);
    });

    // Subscribe to workingDays and petrolExpenses changes to update net salary
    this.payrollForm
      .get('workingDays')
      ?.valueChanges.subscribe(() => this.calculatedaySalary());

    this.payrollForm
      .get('totalDeductedDays')
      ?.valueChanges.subscribe(() => this.calculateNetSalary());
  }

  // Handle calculation for casual days and total absent days
  handleAbsentDays(absentDays: number | null) {
    const joiningDateString = this.payrollForm.get('joiningDate')?.value;
    if (!joiningDateString) return; // Ensure joiningDate is available

    const joiningDate = new Date(joiningDateString);
    const today = new Date();

    const threeMonthsLater = new Date(joiningDate);
    threeMonthsLater.setMonth(joiningDate.getMonth() + 3);

    let casualDays = 0;

    const validAbsentDays = absentDays ?? 0; // Handle null/undefined absentDays
    let totalAbsentDays = validAbsentDays;
    if (validAbsentDays === 0) {
      casualDays = 0;
      totalAbsentDays = 0;
    } else if (today >= threeMonthsLater) {
      casualDays = 1; // After 3 months, assign 1 casual day
      totalAbsentDays = validAbsentDays - casualDays;
    }

    this.payrollForm.patchValue({
      casualDays,
      totalAbsentDays,
    });
  }
  calculatedaySalary() {
    const workingDays = this.payrollForm.get('workingDays')?.value;
    const salary = this.payrollForm.get('salary')?.value;
    if (salary && workingDays > 0) {
      const daySalary = salary / workingDays;
      // Patch daySalary and netSalaryWithoutDoubleLop to the form
      this.payrollForm.patchValue({
        daySalary: daySalary.toFixed(),
      });
    }
  }

  // Calculate net salary based on form inputs
  calculateNetSalary() {
    const workingDays = this.payrollForm.get('workingDays')?.value;
    const totalDeductedDays = this.payrollForm.get('totalDeductedDays')?.value;
    const daySalary = this.payrollForm.get('daySalary')?.value;

    if (workingDays && totalDeductedDays > 0) {
      const netSalaryWithoutDoubleLop =
        (workingDays - totalDeductedDays) * daySalary;
      this.payrollForm.patchValue({
        netSalaryWithoutDoubleLop: netSalaryWithoutDoubleLop.toFixed(),
      });
    }
  }

  // calculateWithPetrol() {
  //   const netSalaryWithoutDoubleLop = +this.payrollForm.get('netSalaryWithoutDoubleLop')?.value || 0;
  //   const petrolExpensesValue = this.payrollForm.get('petrolExpenses')?.value;
  //   const petrolExpenses = petrolExpensesValue ? +petrolExpensesValue : 0;
  //   const netSalary = netSalaryWithoutDoubleLop + petrolExpenses;
  //   console.log('Updated Net Salary:', netSalary);
  //   this.payrollForm.patchValue({
  //     netSalaryWithoutDoubleLop: netSalary.toFixed(), // Ensure two decimal points
  //   });
  // }

  getEmployees(filter = {}) {
    this.loading = true;
    filter['employeeInternalStatus-eq'] = 1;
    this.employeesService.getEmployees(filter).subscribe(
      (response) => {
        this.employees = response;
        console.log('employees', this.employees);
        this.loading = false;
        this.setPayrollList();
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  setPayrollList() {
    this.formFields = [
      {
        label: 'Payroll Month',
        controlName: 'payrollMonth',
        type: 'month',
        required: true,
      },
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
        label: 'Custom Employee Id',
        controlName: 'customEmployeeId',
        type: 'text',
        required: true,
      },
      {
        label: 'Joining Date',
        controlName: 'joiningDate',
        type: 'calendar',
        required: true,
      },
      {
        label: 'Account Number',
        controlName: 'accountNumber',
        type: 'text',
        required: true,
      },
      {
        label: 'IFSC Code',
        controlName: 'ifscCode',
        type: 'text',
        required: true,
      },
      {
        label: 'Bank Branch',
        controlName: 'bankBranch',
        type: 'text',
        required: true,
      },
      {
        label: 'Working Days',
        controlName: 'workingDays',
        type: 'number',
        required: true,
      },
      {
        label: 'Present Days',
        controlName: 'presentDays',
        type: 'number',
        required: true,
      },
      {
        label: 'Absent Days',
        controlName: 'absentDays',
        type: 'number',
        required: true,
      },
      {
        label: 'Casual Days',
        controlName: 'casualDays',
        type: 'number',
        required: true,
      },
      {
        label: 'Total Absent Days',
        controlName: 'totalAbsentDays',
        type: 'number',
        required: true,
      },
      {
        label: 'Double LOP Days',
        controlName: 'doubleLopDays',
        type: 'number',
        required: true,
      },
      {
        label: 'Late LOP Days',
        controlName: 'lateLopDays',
        type: 'number',
        required: true,
      },
      {
        label: 'Total Deducted Days',
        controlName: 'totalDeductedDays',
        type: 'number',
        required: true,
      },
      {
        label: 'Paid Days',
        controlName: 'paidDays',
        type: 'number',
        required: true,
      },
      {
        label: 'Salary',
        controlName: 'salary',
        type: 'number',
        required: true,
      },
      {
        label: 'Day Salary',
        controlName: 'daySalary',
        type: 'number',
        required: true,
      },
      {
        label: 'Petrol Expenses',
        controlName: 'petrolExpenses',
        type: 'number',
        required: false,
      },
      {
        label: 'Deductions',
        controlName: 'deductions',
        type: 'number',
        required: true,
      },
      {
        label: 'Net Salary Without Double LOP',
        controlName: 'netSalaryWithoutDoubleLop',
        type: 'number',
        required: true,
      },
      {
        label: 'Net Salary with Double LOP',
        controlName: 'netSalaryWithDoubleLop',
        type: 'number',
        required: true,
      },
      {
        label: 'Net Salary',
        controlName: 'netSalary',
        type: 'number',
        required: true,
      },
    ];
  }

  createForm() {
    this.payrollForm = this.formBuilder.group({
      employeeName: ['', Validators.required],
      payrollMonth: ['', Validators.required],
      employeeId: ['', Validators.required],
      customEmployeeId: ['', Validators.required],
      joiningDate: ['', Validators.required],
      workingDays: ['', Validators.required],
      presentDays: ['', Validators.required],

      absentDays: ['', Validators.required],
      paidDays: ['', Validators.required],
      casualDays: ['', Validators.required],
      totalAbsentDays: ['', Validators.required],
      doubleLopDays: ['', Validators.required],
      lateLopDays: ['', Validators.required],
      totalDeductedDays: ['', Validators.required],
      salary: ['', Validators.required],
      daySalary: ['', Validators.required],
      netSalaryWithoutDoubleLop: ['', Validators.required],
      netSalaryWithDoubleLop: ['', Validators.required],
      netSalary: ['', Validators.required],
      petrolExpenses: ['', Validators.required],
      accountNumber: ['', Validators.required],
      ifscCode: ['', Validators.required],
      bankBranch: ['', Validators.required],
      deductions: ['', Validators.required],
    });
  }

  onSubmit(formValues) {
    console.log(formValues.payrollMonth);
    let formData: any = {
      payrollMonth: this.moment(formValues.payrollMonth, [
        'MM-YYYY',
        'YYYY-MM-DD',
        'MM/YYYY',
      ]).format('MM/YYYY'),

      employeeName: formValues.employeeName,
      employeeId: formValues.employeeId,
      customEmployeeId: formValues.customEmployeeId,
      joiningDate: formValues.joiningDate,
      workingDays: formValues.workingDays,
      presentDays: formValues.presentDays,
      absentDays: formValues.absentDays,
      casualDays: formValues.casualDays,
      totalAbsentDays: formValues.totalAbsentDays,
      doubleLopDays: formValues.doubleLopDays,
      lateLopDays: formValues.lateLopDays,
      totalDeductedDays: formValues.totalDeductedDays,
      salary: formValues.salary,
      daySalary: formValues.daySalary,
      netSalaryWithoutDoubleLop: formValues.netSalaryWithoutDoubleLop,
      netSalaryWithDoubleLop: formValues.netSalaryWithDoubleLop,
      netSalary: formValues.netSalary,
      petrolExpenses: formValues.petrolExpenses,
      accountNumber: formValues.accountNumber,
      ifscCode: formValues.ifscCode,
      bankBranch: formValues.bankBranch,
      deductions: formValues.deductions,
      paidDays: formValues.paidDays,
    };

    console.log('formData', formData);
    if (this.actionType == 'create') {
      this.loading = true;
      this.employeesService.createPayroll(formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Payroll Added Successfully');
            this.routingService.handleRoute('payroll', null);
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
      this.employeesService.updatePayroll(this.payslipId, formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Payroll Updated Successfully');
            this.routingService.handleRoute('payroll', null);
          }
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    }
  }

  getPayrollById(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.employeesService.getPayrollById(this.payslipId, filter).subscribe(
        (response) => {
          this.payrollData = response;
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
  goBack() {
    this.location.back();
  }
}
