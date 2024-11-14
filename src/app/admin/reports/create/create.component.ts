import { Component } from '@angular/core';
import { EmployeesService } from '../../employees/employees.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  reportsListConfig: any = [];
  leadUsers: any = [];
  banks: any = [];
  breadCrumbItems: any = [];
  customerLabel: any;
  donationStatus: any;
  apptStatus: any;
  checkinStatus: any;
  crmStatus: any;
  cdlStatus: any;
  leadStatus: any;
  ivrStatus: any;
  orderStatus: any;
  memberStatus: any;
  showToken: any;
  activeUser: any;
  loading: any;
  reportType: any;
  selectedReportConfig: any;
  reportData: any = {};
  showDateRange: any = false;
  dateRangeFrom: any;
  dateRangeTo: any;
  moment: any;

  employeeStatusList = projectConstantsLocal.EMPLOYEE_STATUS;
  leaveStatusList = projectConstantsLocal.LEAVE_STATUS;
  interviewStatusList = projectConstantsLocal.INTERVIEW_STATUS;
  officebranchEntities = projectConstantsLocal.BRANCH_ENTITIES;
  leaveTypeEntities = projectConstantsLocal.LEAVE_TYPE_ENTITIES;
  designationEntities = projectConstantsLocal.DEPARTMENT_ENTITIES;
  durationTypeEntities = projectConstantsLocal.DURATION_TYPE_ENTITIES;
  attendedInterviewStatus = projectConstantsLocal.ATTENDED_INTERVIEW_ENTITIES;

  dateRange = [
    { field: 'date', title: 'Date From', type: 'date', filterType: 'ge' },
    { field: 'date', title: 'Date To', type: 'date', filterType: 'le' },
  ];
  labels: any;
  locations: any = [];
  responseType: any = 'INLINE';
  isQuestionaire: any = false;
  financeStatus: any;
  invoiceCategories: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  constructor(
    private location: Location,
    private employeesService: EmployeesService,
    private activatedRoute: ActivatedRoute,
    private routingService: RoutingService,
    private toastService: ToastService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.breadCrumbItems = [
      {
        icon: 'pi pi-home',
        label: ' Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Reports',
        routerLink: '/user/reports',
        queryParams: { v: this.version },
      },
      { label: 'Generate Report' },
    ];
    this.moment = this.dateTimeProcessor.getMoment();
    this.activatedRoute.queryParams.subscribe((queryParams: any) => {
      if (queryParams && queryParams['reportType']) {
        this.reportType = queryParams['reportType'];
      } else {
        this.toastService.showError({ error: 'Invalid Url' });
        this.routingService.handleRoute('list', null);
      }
    });
  }
  ngOnInit() {
    this.setReportsList();
  }
  updateBreadcrumb(): void {
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: '  Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Reports',
        routerLink: '/user/reports',
        queryParams: { v: this.version },
      },
      {
        label:
          this.selectedReportConfig?.reportName + ' Report' ||
          'Generate Report',
      },
    ];
  }
  goBack() {
    this.location.back();
  }
  setReportsList() {
    let reportsListConfig = [
      {
        reportName: 'Employees',
        reportType: 'EMPLOYEES',
        condition: true,
        fields: [
          {
            field: 'employeeInternalStatus',
            title: 'Employee Status',
            type: 'dropdown',
            filterType: 'eq',
            options: this.employeeStatusList,
            value: 'id',
            label: 'displayName',
          },
          {
            field: 'ofcBranch',
            title: 'Office Branch',
            type: 'dropdown',
            filterType: 'eq',
            options: this.officebranchEntities,
            value: 'id',
            label: 'displayName',
          },
          {
            field: 'designation',
            title: 'Designation',
            type: 'dropdown',
            filterType: 'eq',
            options: this.designationEntities,
            value: 'id',
            label: 'displayName',
          },
          {
            field: 'createdOn',
            title: 'From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'createdOn',
            title: 'To Date',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },
      {
        reportName: 'Interviews',
        reportType: 'INTERVIEWS',
        condition: true,
        fields: [
          {
            field: 'interviewInternalStatus',
            title: 'Interview Status',
            type: 'dropdown',
            filterType: 'eq',
            options: this.interviewStatusList,
            value: 'id',
            label: 'displayName',
          },
          {
            field: 'scheduledLocation',
            title: 'Scheduled Location',
            type: 'dropdown',
            filterType: 'eq',
            options: this.officebranchEntities,
            value: 'id',
            label: 'displayName',
          },
          {
            field: 'attendedInterview',
            title: 'Attended Interview',
            type: 'dropdown',
            filterType: 'eq',
            options: this.attendedInterviewStatus,
            value: 'id',
            label: 'displayName',
          },
          {
            field: 'createdOn',
            title: 'From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'createdOn',
            title: 'To Date',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },
      {
        reportName: 'Salary Sheet',
        reportType: 'SALARYSHEET',
        condition: true,
        fields: [
          {
            field: 'payrollMonth',
            title: 'Payroll Month',
            type: 'month',
            filterType: 'eq',
          },
          {
            field: 'createdOn',
            title: 'From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'createdOn',
            title: 'To Date',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },
      {
        reportName: 'Leaves',
        reportType: 'LEAVES',
        condition: true,
        fields: [
          {
            field: 'leaveInternalStatus',
            title: 'Leave Status',
            type: 'dropdown',
            filterType: 'eq',
            options: this.leaveStatusList,
            value: 'id',
            label: 'displayName',
          },
          {
            field: 'leaveType',
            title: 'Leave Type',
            type: 'dropdown',
            filterType: 'eq',
            options: this.leaveTypeEntities,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'durationType',
            title: 'Duration Type',
            type: 'dropdown',
            filterType: 'eq',
            options: this.durationTypeEntities,
            value: 'name',
            label: 'displayName',
          },
          {
            field: 'createdOn',
            title: 'From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'createdOn',
            title: 'To Date',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },
      {
        reportName: 'Holidays',
        reportType: 'HOLIDAYS',
        condition: true,
        fields: [
          {
            field: 'createdOn',
            title: 'From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'createdOn',
            title: 'To Date',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },
      {
        reportName: 'Attendance',
        reportType: 'ATTENDANCE',
        condition: true,
        fields: [
          {
            field: 'attendanceDate',
            title: 'Day Wise Attendance',
            type: 'date',
            filterType: 'eq',
          },

          {
            field: 'createdOn',
            title: 'From Date',
            type: 'date',
            filterType: 'gte',
          },
          {
            field: 'createdOn',
            title: 'To Date',
            type: 'date',
            filterType: 'lte',
          },
        ],
      },
    ];
    this.selectedReportConfig = reportsListConfig.filter(
      (report) => report.condition && report.reportType == this.reportType
    )[0];
    this.updateBreadcrumb();
    if (!this.isQuestionaire) {
      if (this.selectedReportConfig.addOnReports) {
        delete this.selectedReportConfig.addOnReports;
      }
    }
  }

  getJsonKeys(json) {
    return Object.keys(json);
  }
  routeTo() {}

  generateReport(reportType: string) {
    this.loading = true;
    const selectedReportData = {};
    for (const key in this.reportData) {
      if (this.reportData[key]) {
        selectedReportData[key] = this.reportData[key];
      }
    }
    const apiFilter = {};
    if (this.reportData['createdOn-gte']) {
      apiFilter['createdOn-gte'] = this.moment(
        this.reportData['createdOn-gte']
      ).format('YYYY-MM-DD');
    }
    if (this.reportData['createdOn-lte']) {
      apiFilter['createdOn-lte'] = this.moment(this.reportData['createdOn-lte'])
        .add(1, 'days')
        .format('YYYY-MM-DD');
    }

    if (this.reportData['payrollMonth-eq']) {
      apiFilter['payrollMonth-eq'] = this.moment(
        this.reportData['payrollMonth-eq']
      ).format('MM/YYYY');
    }
    if (this.reportData['attendanceDate-eq']) {
      apiFilter['attendanceDate-eq'] = this.moment(
        this.reportData['attendanceDate-eq']
      ).format('YYYY-MM-DD');
    }

    Object.assign(selectedReportData, apiFilter);
    console.log(reportType);
    console.log(selectedReportData);
    const reportServiceMap = {
      EMPLOYEES: () =>
        this.employeesService.exportEmployees(selectedReportData),
      INTERVIEWS: () =>
        this.employeesService.exportInterviews(selectedReportData),
      SALARYSHEET: () =>
        this.employeesService.exportSalarySheet(selectedReportData),
      LEAVES: () => this.employeesService.exportLeaves(selectedReportData),
      HOLIDAYS: () => this.employeesService.exportHolidays(selectedReportData),
      ATTENDANCE: () =>
        this.employeesService.exportAttendance(selectedReportData),
    };
    const serviceCall = reportServiceMap[reportType];
    if (!serviceCall) {
      this.loading = false;
      this.toastService.showError('Invalid report type');
      return;
    }
    serviceCall().subscribe(
      (response: any) => {
        this.loading = false;
        if (response.success && response.fileUrl) {
          window.open('//' + response.fileUrl, '_blank');
          this.toastService.showSuccess('Report Downloaded Successfully');
        } else {
          this.toastService.showError('Failed to download the report.');
        }
      },
      (error: any) => {
        this.toastService.showError(error);
        this.loading = false;
      }
    );
  }

  onNumberInputChange(event: any) {
    const allowedChars = /[0-9]/g;
    const key = event.key;
    if (!allowedChars.test(key) && key !== 'Backspace') {
      event.preventDefault();
    }
  }
}
