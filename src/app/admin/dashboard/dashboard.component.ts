import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RoutingService } from 'src/app/services/routing-service';
import { EmployeesService } from '../employees/employees.service';
import { ToastService } from 'src/app/services/toast.service';
import { forkJoin } from 'rxjs';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userDetails: any;
  maleCount: number = 0;
  femaleCount: number = 0;
  panjaguttaCount: number = 0;
  @ViewChild('employeesTable') employeesTable!: Table;
  BegumpetCount: number = 0;
  selectedDate: any;
  loading: any;
  totalEmployeesCount: any = 0;
  designationsCount: any = 0;
  incentivesCount: any = 0;
  pieChartOptions: any;
  branchpieChartOptions: any;
  DepartmentChartOptions: any;
  moment: any;
  totalPresentCount: number = 0;
  totalAbsentCount: number = 0;
  totalHalfDayCount: number = 0;
  totalLateCount: number = 0;
  attendanceData: any;
  totalUsersCount: any = 0;
  totalLeavesCount: any = 0;
  employees: any[] = [];
  totalInterviewsCount: any = 0;
  employeeDetails: any[] = [];
  totalHolidaysCount: any = 0;
  lastMonthpayrollCount: any = 0;
  currentTableEvent: any;
  countsAnalytics: any[] = [];
  designationCounts: any[] = [];
  selectedDateforPayroll: Date;
  selectedDateforIncentive: Date;
  selectedYear: number;
  constructor(
    private localStorageService: LocalStorageService,
    private routingService: RoutingService,
    private employeesService: EmployeesService,
    private toastService: ToastService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.selectedDateforIncentive = this.moment(new Date())
      .subtract(1, 'month')
      .format('MM/YYYY');
    this.selectedDateforPayroll = this.moment(new Date())
      .subtract(1, 'month')
      .format('MM/YYYY');
    this.selectedYear = new Date().getFullYear();
  }
  ngOnInit(): void {
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    if (userDetails) {
      this.userDetails = userDetails.user;
    }
    this.selectedDate = this.moment().format('YYYY-MM-DD');
    this.setChartOptions();
    this.initializeDashboardData();
  }

  initializeDashboardData() {
    this.fetchCounts();
    this.updateCountsAnalytics();
    this.getGenderCounts();
    this.getBranchCounts();
    this.getAttendanceByDate();
    this.getDepartmentCounts();
  }
  onDateChange(event: any) {
    console.log(event);
    this.selectedDate = this.moment(event).format('YYYY-MM-DD');
    this.attendanceData = [];
    this.employeeDetails = [];
    this.employees = [];
    this.getAttendanceByDate()
      .then(() => {
        this.employeesTable.reset();
      })
      .catch((error) => {
        console.error('Failed to get attendance data:', error);
        this.toastService.showError('Failed to load attendance data.');
      });
  }
  updateCountsAnalytics() {
    this.countsAnalytics = [
      {
        name: 'employees',
        displayName: 'Employees',
        count: this.totalEmployeesCount,
        routerLink: 'employees',
        condition: true,
      },
      {
        name: 'interviews',
        displayName: 'Interviews',
        count: this.totalInterviewsCount,
        routerLink: 'interviews',
        condition: true,
      },
      {
        name: 'attendance',
        displayName: 'Attendance',
        count:
          this.totalPresentCount + this.totalLateCount + this.totalHalfDayCount,
        routerLink: 'attendance',
        condition: true,
      },
      {
        name: 'payroll',
        displayName: 'Payroll',
        count: this.lastMonthpayrollCount,
        routerLink: 'payroll',
        condition: true,
      },
      {
        name: 'leaves',
        displayName: 'Leave Management',
        count: this.totalLeavesCount,
        routerLink: 'leaves',
        condition: true,
      },
      {
        name: 'holidays',
        displayName: 'Holidays',
        count: this.totalHolidaysCount,
        routerLink: 'holidays',
        condition: true,
      },
      {
        name: 'incentives',
        displayName: 'Incentives',
        count: this.incentivesCount,
        routerLink: 'incentives',
        condition: true,
      },
      {
        name: 'departments',
        displayName: 'Departments',
        count: this.designationsCount,
        routerLink: 'designations',
        condition: true,
      },
      // {
      //   name: 'events',
      //   displayName: 'Events',
      //   count: 0,
      //   routerLink: 'events',
      //   condition: true,
      // },
      {
        name: 'users',
        displayName: 'Users',
        count: this.totalUsersCount,
        routerLink: 'users',
        // condition: true,
        condition:
          this.userDetails?.designation == 1 ||
          this.userDetails?.designation == 4,
      },
      // {
      //   name: 'reports',
      //   displayName: 'Reports',
      //   count: 0,
      //   routerLink: 'reports',
      //   condition: true,
      // },
    ];
  }

  calculateAttendanceCounts(): void {
    this.totalPresentCount =
      this.totalAbsentCount =
      this.totalHalfDayCount =
      this.totalLateCount =
        0;
    this.attendanceData[0]?.attendanceData.forEach((attendance) => {
      switch (attendance.status) {
        case 'Present':
          this.totalPresentCount++;
          break;
        case 'Absent':
          this.totalAbsentCount++;
          break;
        case 'Late':
          this.totalLateCount++;
          break;
        case 'Half-day':
          this.totalHalfDayCount++;
          break;
      }
    });
    this.updateCountsAnalytics();
    console.log(
      `Present: ${this.totalPresentCount}, Absent: ${this.totalAbsentCount}, Half-day: ${this.totalHalfDayCount}, Late: ${this.totalLateCount}`
    );
  }
  loadEmployees(event) {
    this.currentTableEvent = event;

    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign({}, api_filter);
    if ('from' in api_filter) {
      delete api_filter.from;
    }
    console.log(api_filter);
    if (api_filter) {
      this.getEmployees(api_filter);
    }
  }
  setDefaultAttendanceData() {
    this.employeeDetails = this.employees
      .filter((employee) =>
        this.attendanceData[0]?.attendanceData.some(
          (att) =>
            att.employeeId === employee.employeeId && att.status === 'Absent'
        )
      )
      .map((employee) => {
        const attendance = this.attendanceData[0]?.attendanceData.find(
          (att) => att.employeeId === employee.employeeId
        );
        return {
          ...employee,
          status: attendance?.status,
          checkInTime: attendance?.checkInTime,
          checkOutTime: attendance?.checkOutTime,
        };
      });
    console.log('Absent Employee Details:', this.employeeDetails);
  }
  getEmployees(filter = {}) {
    this.loading = true;
    this.employeesService.getEmployees(filter).subscribe({
      next: (response: any) => {
        if (response) {
          this.employees = response;
          console.log('employees', this.employees);
          this.setDefaultAttendanceData();
        } else {
          console.warn('No employees data received');
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.toastService.showError(
          'Failed to load employees: ' + error.message
        );
      },
    });
  }
  getAttendanceByDate(filter = {}): Promise<void> {
    this.loading = true;
    filter['attendanceDate-eq'] = this.selectedDate;
    return new Promise((resolve, reject) => {
      this.employeesService.getAttendance(filter).subscribe(
        (response: any) => {
          console.log('attendanceData:', response);
          this.attendanceData = response;
          this.loading = false;
          this.calculateAttendanceCounts();
          resolve();
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError('Failed to load attendance data');
          reject(error);
        }
      );
    });
  }
  fetchCounts(filter = {}) {
    this.loading = true;
    const employeefilter = { ...filter, 'employeeInternalStatus-eq': 1 };
    const leavesfilter = { ...filter, 'leaveInternalStatus-eq': 1 };
    const departmentfilter = { ...filter, 'designationInternalStatus-eq': 1 };
    const payrollfilter = {
      ...filter,
      'payrollMonth-eq': this.selectedDateforPayroll,
    };
    const holidayfilter = {
      ...filter,
    };
    if (this.selectedYear) {
      const startOfYear = this.moment(`${this.selectedYear}-01-01`).format(
        'YYYY-MM-DD'
      );
      const endOfYear = this.moment(`${this.selectedYear}-12-31`).format(
        'YYYY-MM-DD'
      );
      holidayfilter['date-gte'] = startOfYear;
      holidayfilter['date-lte'] = endOfYear;
    }
    const incentivefilter = {
      ...filter,
      'incentiveApplicableMonth-eq': this.selectedDateforIncentive,
    };
    forkJoin([
      this.employeesService?.getEmployeesCount(employeefilter),
      this.employeesService?.getUsersCount(filter),
      this.employeesService?.getHolidaysCount(holidayfilter),
      this.employeesService?.getInterviewCount(filter),
      this.employeesService?.getLeavesCount(leavesfilter),
      this.employeesService?.getPayrollCount(payrollfilter),
      this.employeesService?.getDesignationCount(departmentfilter),
      this.employeesService?.getIncentivesCount(incentivefilter),
    ]).subscribe(
      ([
        employeesCount,
        usersCount,
        holidaysCount,
        interviewCount,
        leavesCount,
        payrollCount,
        designationsCount,
        incentivesCount,
      ]) => {
        this.totalEmployeesCount = employeesCount;
        this.totalUsersCount = usersCount;
        this.totalHolidaysCount = holidaysCount;
        this.totalInterviewsCount = interviewCount;
        this.totalLeavesCount = leavesCount;
        this.lastMonthpayrollCount = payrollCount;
        this.designationsCount = designationsCount;
        this.incentivesCount = incentivesCount;
        this.updateCountsAnalytics();
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getGenderCounts(filter = {}) {
    filter['employeeInternalStatus-eq'] = 1;
    const maleFilter = { ...filter, 'gender-eq': 2 };
    const femaleFilter = { ...filter, 'gender-eq': 1 };
    this.loading = true;
    forkJoin({
      maleCount: this.employeesService?.getEmployeesCount(maleFilter),
      femaleCount: this.employeesService?.getEmployeesCount(femaleFilter),
    }).subscribe(
      (response: any) => {
        this.maleCount = response.maleCount;
        this.femaleCount = response.femaleCount;
        console.log('Male Count:', this.maleCount);
        console.log('Female Count:', this.femaleCount);
        this.setChartOptions();
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getDepartmentCounts(filter = {}) {
    filter['employeeInternalStatus-eq'] = 1;
    const filters = [1, 2, 3, 4].map((designation) => ({
      ...filter,
      'designation-eq': designation,
    }));
    this.loading = true;
    forkJoin(
      filters.map((f) => this.employeesService.getEmployeesCount(f))
    ).subscribe(
      (counts) => {
        this.designationCounts = counts.map((count) => count || 0);
        this.setChartOptions();
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getBranchCounts(filter = {}) {
    filter['employeeInternalStatus-eq'] = 1;
    const panjaguttafilter = { ...filter, 'ofcBranch-eq': 1 };
    const begumpetfilter = { ...filter, 'ofcBranch-eq': 2 };
    this.loading = true;
    forkJoin({
      panjaguttaCount:
        this.employeesService.getEmployeesCount(panjaguttafilter),
      BegumpetCount: this.employeesService.getEmployeesCount(begumpetfilter),
    }).subscribe(
      (response: any) => {
        this.panjaguttaCount = response.panjaguttaCount;
        this.BegumpetCount = response.BegumpetCount;
        console.log('Panjagutta Count:', this.panjaguttaCount);
        console.log('Begumpet Count:', this.BegumpetCount);
        this.setChartOptions();
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  setChartOptions() {
    this.DepartmentChartOptions = {
      series: [
        {
          name: 'Telesales',
          data: [this.designationCounts[0]],
        },
        {
          name: 'Operations Team',
          data: [this.designationCounts[1]],
        },
        {
          name: 'HR Team',
          data: [this.designationCounts[2]],
        },
        {
          name: 'Office Team',
          data: [this.designationCounts[3]],
        },
      ],
      chart: {
        height: 400,
        type: 'bar',
        toolbar: {
          show: true,
        },
      },
      colors: ['#18BADD', '#3039A1', '#8BBEE1', '#676A86'],
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
        },
      },
      stroke: {
        width: 2,
        colors: ['#fff'],
      },
      title: {
        text: 'Departments Metrics',
        align: 'left',
        style: {
          fontSize: '18px',
          color: '#33009C',
        },
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      markers: {
        size: 4,
      },
      xaxis: {
        categories: ['Total Count'],
        title: {
          text: 'Month',
        },
      },
      yaxis: {
        title: {
          text: 'Amount',
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -20,
        offsetX: -5,
      },
    };
    this.pieChartOptions = {
      series: [this.maleCount, this.femaleCount],
      labels: ['Male', 'Female'],
      chart: {
        height: 350,
        type: 'pie',
        toolbar: { show: true },
      },
      colors: ['#FF9A76', '#69DCE4'],
      title: {
        text: 'Employee Structure',
        align: 'left',
        style: { fontSize: '18px', color: '#33009C' },
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        floating: false,
        offsetY: 15,
        offsetX: -5,
        formatter: (seriesName, opts) => {
          const customLabels = ['Male', 'Female'];
          return `${customLabels[opts.seriesIndex]}: ${
            opts.w.config.series[opts.seriesIndex]
          }`;
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          var customLabels = ['Male', 'Female'];
          var seriesValues = opts.w.config.series[opts.seriesIndex];
          var customLabel = customLabels[opts.seriesIndex];
          return customLabel + ': ' + seriesValues;
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
    this.branchpieChartOptions = {
      series: [this.panjaguttaCount, this.BegumpetCount],
      labels: ['Panjagutta', 'Begumpet'],
      chart: {
        height: 350,
        type: 'donut',
        toolbar: { show: true },
      },
      colors: ['#3039A1', '#8BBEE1'],
      title: {
        text: 'Employees Count in Different Branches',
        align: 'left',
        style: { fontSize: '18px', color: '#33009C' },
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        floating: false,
        offsetY: 15,
        offsetX: -5,
        formatter: (seriesName, opts) => {
          const customLabels = ['Panjagutta', 'Begumpet'];
          return `${customLabels[opts.seriesIndex]}: ${
            opts.w.config.series[opts.seriesIndex]
          }`;
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          var customLabels = ['Panjagutta', 'Begumpet'];
          var seriesValues = opts.w.config.series[opts.seriesIndex];
          var customLabel = customLabels[opts.seriesIndex];
          return customLabel + ': ' + seriesValues;
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }
  goToRoute(route) {
    this.routingService.setFeatureRoute('user');
    this.routingService.handleRoute(route, null);
  }
}
