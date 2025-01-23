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
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  loading: any;
  breadCrumbItems: any = [];
  moment: any;
  attendance: any = [];
  formFields: any = [];
  holidays: any = [];
  payslipId: any;
  payrollData: any;
  payrollForm: UntypedFormGroup;
  version = projectConstantsLocal.VERSION_DESKTOP;
  employees: any = [];
  heading: any = 'Create Payroll';
  actionType: any = 'create';
  currentYear: number;
  presentDaysCount = 0;
  constructor(
    private location: Location,
    private routingService: RoutingService,
    private toastService: ToastService,
    private formBuilder: UntypedFormBuilder,
    private employeesService: EmployeesService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
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
              paidDaysWithoutDLOP: this.payrollData.paidDaysWithoutDLOP,
              paidDaysWithDLOP: this.payrollData.paidDaysWithDLOP,
              lopOption: this.payrollData.lopOption,
              casualDays: this.payrollData.casualDays,
              totalAbsentDays: this.payrollData.totalAbsentDays,
              doubleLopDays: this.payrollData.doubleLopDays,
              lateLopDays: this.payrollData.lateLopDays,
              totalDeductedDaysWithoutDLOP:
                this.payrollData.totalDeductedDaysWithoutDLOP,
              totalDeductedDaysWithDLOP:
                this.payrollData.totalDeductedDaysWithDLOP,
              salary: this.payrollData.salary,
              deductionsWithoutDLOP: this.payrollData.deductionsWithoutDLOP,
              deductionsWithDLOP: this.payrollData.deductionsWithDLOP,
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
    this.currentYear = this.employeesService.getCurrentYear();
    this.createForm();
    this.setPayrollList();
    this.getHolidays();
    this.getEmployees();
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
          const missingFields: any = [];
          if (!selectedEmployee.accountNumber)
            missingFields.push('Account Number');
          if (!selectedEmployee.ifscCode) missingFields.push('IFSC Code');
          if (!selectedEmployee.bankBranch) missingFields.push('Bank Branch');
          if (!selectedEmployee.customEmployeeId)
            missingFields.push('Custom Employee Id');
          if (!selectedEmployee.joiningDate) missingFields.push('Joining Date');
          if (!selectedEmployee.salary) missingFields.push('Salary');
          if (missingFields.length > 0) {
            const missingFieldsMessage = `The following fields are missing: ${missingFields.join(
              ', '
            )}`;
            this.confirmationService.confirm({
              message: `${missingFieldsMessage}. Please update this Fields.`,
              header: 'Incomplete Employee Details',
              icon: 'pi pi-exclamation-triangle',
              acceptLabel: 'Update',
              accept: () => {
                this.updateEmployee(selectedEmployee.employeeId);
              },
            });
          }
          this.getSalaryHikes().subscribe(
            (salaryHikes: any) => {
              const matchingHikes = salaryHikes.filter(
                (hike) => hike.employeeId == selectedEmployee.employeeId
              );
              if (matchingHikes.length > 0) {
                const totalHike = matchingHikes.reduce(
                  (accumulatedHike, hike) => accumulatedHike + hike.monthlyHike,
                  0
                );
                selectedEmployee.salary += totalHike;
                this.payrollForm.patchValue({
                  salary: selectedEmployee.salary,
                });
              }
            },
            (error) => {
              console.error(error);
            }
          );
        }
      });
    this.payrollForm
      .get('payrollMonth')
      ?.valueChanges.subscribe((payrollMonth) =>
        this.calculateWorkingDays(payrollMonth)
      );
    this.payrollForm
      .get('joiningDate')
      ?.valueChanges.subscribe((joiningDate) => {
        if (joiningDate) {
          this.handleCasualDays(joiningDate);
        }
      });
    this.payrollForm.get('employeeId')?.valueChanges.subscribe((employeeId) => {
      if (employeeId) {
        this.handlePresentDays();
      }
    });
  }

  getAttendance(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.employeesService.getAttendance().subscribe(
        (response) => {
          this.attendance = response;
          console.log('Attendance:', this.attendance);
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

  getSalaryHikes() {
    return this.employeesService.getSalaryHikes();
  }
  updateEmployee(employeeId) {
    this.routingService.handleRoute('employees/update/' + employeeId, null);
  }
  handleCasualDays(joiningDate: Date): void {
    const payrollMonth = this.payrollForm.get('payrollMonth')?.value;
    const joining = new Date(joiningDate);
    const payroll = new Date(this.moment(payrollMonth, 'YYYY-MM').toDate());
    let eligibleCasualMonth;
    if (joining.getDate() < 4) {
      eligibleCasualMonth = new Date(
        joining.getFullYear(),
        joining.getMonth() + 3,
        1
      );
    } else {
      eligibleCasualMonth = new Date(
        joining.getFullYear(),
        joining.getMonth() + 4,
        1
      );
    }
    const casualDays = payroll >= eligibleCasualMonth ? 1 : 0;
    this.payrollForm.patchValue({
      casualDays,
    });
  }

  handlePresentDays(): void {
    const payrollMonth = this.payrollForm.get('payrollMonth')?.value;
    const employeeId = this.payrollForm.get('employeeId')?.value;
    const payroll = new Date(this.moment(payrollMonth, 'YYYY-MM').toDate());
    this.loading = true;
    this.getAttendance()
      .then(() => {
        const filteredAttendance = this.attendance.filter((record) => {
          const attendanceDate = new Date(record.attendanceDate);
          return (
            attendanceDate.getMonth() === payroll.getMonth() &&
            attendanceDate.getFullYear() === payroll.getFullYear()
          );
        });
        console.log(filteredAttendance);
        const presentDays = filteredAttendance.reduce((count, record) => {
          const employeeRecord = record.attendanceData.find(
            (emp) => emp.employeeId === employeeId
          );
          if (employeeRecord) {
            if (
              employeeRecord.status === 'Present' ||
              employeeRecord.status === 'Late'
            ) {
              return count + 1;
            }
            if (employeeRecord.status === 'Half-day') {
              return count + 0.5;
            }
          }
          return count;
        }, 0);
        const lateDays = filteredAttendance.reduce((count, record) => {
          const employeeRecord = record.attendanceData.find(
            (emp) => emp.employeeId === employeeId && emp.status === 'Late'
          );
          return employeeRecord ? count + 1 : count;
        }, 0);
        const lateLopDays = Math.floor(lateDays / 3);
        this.payrollForm.patchValue({
          presentDays: presentDays,
          lateLopDays: lateLopDays,
        });
      })
      .catch((error) => {
        console.error('Error retrieving attendance data:', error);
      })
      .finally(() => {
        this.loading = false;
      });
  }
  calculateWorkingDays(payrollMonth: string): void {
    if (!payrollMonth) {
      return;
    }
    const startOfMonth = this.moment(payrollMonth, 'YYYY-MM').startOf('month');
    const endOfMonth = this.moment(payrollMonth, 'YYYY-MM').endOf('month');
    let workingDaysCount = 0;
    for (
      let day = startOfMonth;
      day.isBefore(endOfMonth) || day.isSame(endOfMonth, 'day');
      day.add(1, 'days')
    ) {
      if (day.isoWeekday() !== 7 && !this.isHoliday(day)) {
        workingDaysCount++;
      }
    }
    this.payrollForm.get('workingDays')?.setValue(workingDaysCount);
  }
  isHoliday(day: any): boolean {
    const dayStr = day.format('YYYY-MM-DD');
    return this.holidays.some((holiday) => holiday.date == dayStr);
  }
  getHolidays(filter = {}) {
    this.loading = true;
    this.employeesService.getHolidays(filter).subscribe(
      (response) => {
        this.holidays = response;
        console.log('holidays', this.holidays);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getEmployees(filter = {}) {
    this.loading = true;
    // if (this.actionType === 'create') {
    //   filter['employeeInternalStatus-eq'] = 1;
    // }
    filter['sort'] = 'joiningDate,asc';
    this.employeesService.getEmployees(filter).subscribe(
      (response) => {
        this.employees = response;
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
        label: 'Casual Days',
        controlName: 'casualDays',
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
        label: 'Salary',
        controlName: 'salary',
        type: 'number',
        required: true,
      },
      {
        label: 'Petrol Expenses',
        controlName: 'petrolExpenses',
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
      absentDays: [''],
      paidDaysWithoutDLOP: [''],
      paidDaysWithDLOP: [''],
      casualDays: ['', Validators.required],
      totalAbsentDays: [''],
      doubleLopDays: ['', Validators.required],
      lateLopDays: ['', Validators.required],
      totalDeductedDaysWithoutDLOP: [''],
      totalDeductedDaysWithDLOP: [''],
      salary: ['', Validators.required],
      daySalary: [''],
      netSalaryWithoutDoubleLop: [''],
      netSalaryWithDoubleLop: [''],
      netSalary: [''],
      petrolExpenses: ['', Validators.required],
      accountNumber: ['', Validators.required],
      ifscCode: ['', Validators.required],
      bankBranch: ['', Validators.required],
      deductionsWithoutDLOP: [''],
      deductionsWithDLOP: [''],
      lopOption: ['withoutDoubleLOP', Validators.required],
    });
  }

  onSubmit(formValues) {
    console.log(formValues.payrollMonth);
    const {
      payrollMonth,
      employeeName,
      employeeId,
      customEmployeeId,
      joiningDate,
      workingDays,
      presentDays,
      casualDays,
      doubleLopDays,
      lateLopDays,
      salary,
      petrolExpenses,
      accountNumber,
      ifscCode,
      bankBranch,
      lopOption,
    } = formValues;
    const monthFormatted = this.moment(payrollMonth, [
      'MM-YYYY',
      'YYYY-MM-DD',
      'YYYY-MM',
    ]).format('YYYY-MM');
    const absentDays =
      presentDays > 0 && workingDays > 0 ? workingDays - presentDays : 0;
    const totalAbsentDays =
      casualDays > 0 && absentDays
        ? Math.max(0, absentDays - casualDays)
        : absentDays || 0;
    const daySalary = Number((salary / workingDays).toFixed());
    const absentAndLate =
      absentDays > 0 || lateLopDays > 0
        ? casualDays > 0 && absentDays == 0.5
          ? Math.max(0, absentDays - casualDays) + lateLopDays
          : absentDays + lateLopDays - casualDays
        : absentDays + lateLopDays;
    const totalDeductedDaysWithoutDLOP = absentAndLate;
    const totalDeductedDaysWithDLOP = absentAndLate + doubleLopDays;
    const paidDaysWithoutDLOP = workingDays - totalDeductedDaysWithoutDLOP;
    const paidDaysWithDLOP = workingDays - totalDeductedDaysWithDLOP;
    const baseNetSalaryWithoutDLOP = Number(
      (paidDaysWithoutDLOP * daySalary).toFixed()
    );
    const baseNetSalaryWithDLOP = Number(
      (paidDaysWithDLOP * daySalary).toFixed()
    );
    const baseDeductionsWithoutDLOP = salary - baseNetSalaryWithoutDLOP;
    const baseDeductionsWithDLOP = salary - baseNetSalaryWithDLOP;
    const netSalaryWithoutDoubleLop =
      totalDeductedDaysWithoutDLOP === 0 ? salary : baseNetSalaryWithoutDLOP;
    const netSalaryWithDoubleLop =
      totalDeductedDaysWithDLOP === 0 ? salary : baseNetSalaryWithDLOP;
    const deductionsWithoutDLOP =
      totalDeductedDaysWithoutDLOP === 0 ? 0 : baseDeductionsWithoutDLOP;
    const deductionsWithDLOP =
      totalDeductedDaysWithDLOP === 0 ? 0 : baseDeductionsWithDLOP;
    let netSalary =
      lopOption === 'withoutDoubleLOP'
        ? netSalaryWithoutDoubleLop + petrolExpenses
        : netSalaryWithDoubleLop + petrolExpenses;
    const deductions =
      lopOption === 'withoutDoubleLOP'
        ? deductionsWithoutDLOP
        : deductionsWithDLOP;
    const paidDays =
      lopOption === 'withoutDoubleLOP' ? paidDaysWithoutDLOP : paidDaysWithDLOP;
    let professionalTax = 0;
    if (salary > 20000) {
      professionalTax = 200;
    } else if (salary > 15000) {
      professionalTax = 150;
    }
    netSalary = netSalary - professionalTax;
    const formData = {
      payrollMonth: monthFormatted,
      employeeName,
      employeeId,
      customEmployeeId,
      joiningDate,
      workingDays,
      presentDays,
      absentDays,
      casualDays,
      totalAbsentDays,
      doubleLopDays,
      lateLopDays,
      salary,
      daySalary,
      petrolExpenses,
      accountNumber,
      ifscCode,
      bankBranch,
      totalDeductedDaysWithoutDLOP,
      totalDeductedDaysWithDLOP,
      paidDaysWithoutDLOP,
      paidDaysWithDLOP,
      netSalaryWithoutDoubleLop,
      netSalaryWithDoubleLop,
      deductionsWithoutDLOP,
      deductionsWithDLOP,
      lopOption,
      netSalary,
      deductions,
      paidDays,
      professionalTax,
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
