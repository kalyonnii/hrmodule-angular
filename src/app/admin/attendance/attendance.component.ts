import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';
import { RoutingService } from 'src/app/services/routing-service';
import { EmployeesService } from '../employees/employees.service';
import { ConfirmationService } from 'primeng/api';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  breadCrumbItems: any = [];
  currentTableEvent: any;
  totalAttendanceCount: any = 0;
  userDetails: any;
  searchFilter: any = {};
  moment: any;
  loading: any;
  selectedDate: any;
  displayDialog = false;
  attendance: any = [];
  month = 10;
  year = 2024;
  employeeId = 2635633454;

  version = projectConstantsLocal.VERSION_DESKTOP;
  filteredData: any[] = [];
  constructor(
    private location: Location,
    private confirmationService: ConfirmationService,
    private employeesService: EmployeesService,
    private routingService: RoutingService,
    private toastService: ToastService,
    private dateTimeProcessor: DateTimeProcessorService,
    private localStorageService: LocalStorageService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: '  Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      { label: 'Attendance' },
    ];
  }

  ngOnInit(): void {
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
  }

  loadAttendance(event) {
    this.currentTableEvent = event;
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign({}, api_filter, this.searchFilter);
    console.log(api_filter);
    if (api_filter) {
      this.getAttendanceCount(api_filter);
      this.getAttendance(api_filter);
    }
  }

  filterByDate() {
    if (this.selectedDate) {
      console.log('called');
      const formattedDate = this.moment(this.selectedDate).format('YYYY-MM-DD');
      console.log(formattedDate);
      const searchFilter = { 'attendanceDate-like': formattedDate };
      this.applyFilters(searchFilter);
    } else {
      this.searchFilter = {};
      this.loadAttendance(event);
    }
  }

  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    console.log(this.currentTableEvent);
    this.loadAttendance(this.currentTableEvent);
  }
  getAttendanceCount(filter = {}) {
    this.employeesService.getAttendanceCount(filter).subscribe(
      (response) => {
        this.totalAttendanceCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getAttendance(filter = {}) {
    this.loading = true;
    this.employeesService.getAttendance(filter).subscribe(
      (response) => {
        this.attendance = response;
        console.log('attendance', this.attendance);
        this.loading = false;
        this.attendencecount();
        this.getAttendanceCountsByMonth(
          this.attendance,
          this.month,
          this.year,
          this.employeeId
        );
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  updateAttendance(attendanceId) {
    this.routingService.handleRoute('attendance/update/' + attendanceId, null);
  }
  confirmDelete(attendanceId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Attendance?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteAttendance(attendanceId);
      },
    });
  }

  deleteAttendance(attendanceId) {
    this.loading = true;
    this.employeesService.deleteAttendance(attendanceId).subscribe(
      (response: any) => {
        console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadAttendance(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  createAttendance() {
    this.routingService.handleRoute('attendance/create', null);
  }
  ViewAttendance(attendanceId) {
    this.routingService.handleRoute('attendance/view/' + attendanceId, null);
  }

  attendencecount() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const attendanceCount = {};
    this.attendance.forEach((record) => {
      const attendanceDate = new Date(record.attendanceDate);
      const attendanceMonth = attendanceDate.getMonth() + 1;
      const attendanceYear = attendanceDate.getFullYear();
      if (attendanceMonth === currentMonth && attendanceYear === currentYear) {
        record.attendanceData.forEach((entry) => {
          const { employeeId, status } = entry;
          if (!attendanceCount[employeeId]) {
            attendanceCount[employeeId] = {
              Present: 0,
              Absent: 0,
              'Half-day': 0,
              Late: 0,
            };
          }
          attendanceCount[employeeId][status]++;
        });
      }
    });
    console.log(attendanceCount);
  }

  getAttendanceCountsByMonth(attendanceRecords, month, year, employeeId) {
    const statusCounts = {
      Present: 0,
      Absent: 0,
      Late: 0,
      'Half-day': 0,
    };
    attendanceRecords.forEach((record) => {
      const attendanceDate = new Date(record.attendanceDate);
      const recordMonth = attendanceDate.getMonth() + 1; // getMonth is 0-indexed
      const recordYear = attendanceDate.getFullYear();
      if (recordMonth === month && recordYear === year) {
        const employeeAttendance = record.attendanceData.find(
          (data) => data.employeeId === employeeId
        );
        if (
          employeeAttendance &&
          statusCounts[employeeAttendance.status] !== undefined
        ) {
          statusCounts[employeeAttendance.status]++;
        }
      }
    });
    console.log(statusCounts);
    return statusCounts;
  }

  goBack() {
    this.location.back();
  }
}
