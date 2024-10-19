import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';
import { RoutingService } from 'src/app/services/routing-service';
import { EmployeesService } from '../employees/employees.service';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent {
  breadCrumbItems: any = [];
  currentTableEvent: any;
  totalAttendanceCount: any = 0;
  loading: any;
  displayDialog = false;
  attendance: any = [];
  constructor(
    private location: Location,
    private confirmationService: ConfirmationService,
    private employeesService: EmployeesService,
    private routingService: RoutingService,
    private toastService: ToastService
  ) {
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: '  Dashboard',
        routerLink: '/user/dashboard',
      },
      { label: 'Attendance' },
    ];
  }

  loadAttendance(event) {
    this.currentTableEvent = event;
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign({}, api_filter);
    console.log(api_filter);
    if (api_filter) {
      this.getAttendanceCount(api_filter);
      this.getAttendance(api_filter);
    }
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
    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
    const currentYear = currentDate.getFullYear();

    // Object to hold the count of statuses for each employeeId
    const attendanceCount = {};

    // Iterate through the attendance records
    this.attendance.forEach((record) => {
      const attendanceDate = new Date(record.attendanceDate);
      const attendanceMonth = attendanceDate.getMonth() + 1;
      const attendanceYear = attendanceDate.getFullYear();

      // Check if the attendance date is in the current month and year
      if (attendanceMonth === currentMonth && attendanceYear === currentYear) {
        record.attendanceData.forEach((entry) => {
          const { employeeId, status } = entry;

          // Initialize the employee's entry in the count object if it doesn't exist
          if (!attendanceCount[employeeId]) {
            attendanceCount[employeeId] = {
              Present: 0,
              Absent: 0,
              'Half-day': 0,
            };
          }

          // Increment the count based on the status
          attendanceCount[employeeId][status]++;
        });
      }
    });

    // Output the attendance count for each employee
    console.log(attendanceCount);
  }

  goBack() {
    this.location.back();
  }
}
