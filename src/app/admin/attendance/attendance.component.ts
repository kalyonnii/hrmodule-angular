import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastService } from 'src/app/services/toast.service';
import { RoutingService } from 'src/app/services/routing-service';
import { EmployeesService } from '../employees/employees.service';
import { ConfirmationService } from 'primeng/api';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
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

  months = [
    { label: 'January', value: 0 },
    { label: 'February', value: 1 },
    { label: 'March', value: 2 },
    { label: 'April', value: 3 },
    { label: 'May', value: 4 },
    { label: 'June', value: 5 },
    { label: 'July', value: 6 },
    { label: 'August', value: 7 },
    { label: 'September', value: 8 },
    { label: 'October', value: 9 },
    { label: 'November', value: 10 },
    { label: 'December', value: 11 },
  ];

  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth(); // Current month (0-indexed)
  minDate!: Date;
  maxDate!: Date;
  defaultDate: Date = new Date(); // Used to display the calendar's view to the correct month/year initially

  years: any[] = [];
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
      },
      { label: 'Attendance' },
    ];
  }

  ngOnInit(): void {
    let userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    this.userDetails = userDetails.user;
    this.initializeYears();
    const today = new Date();
    this.selectedMonth = today.getMonth();
    this.selectedYear = today.getFullYear();
  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      this.years.push({ label: i.toString(), value: i });
    }
  }

  onYearOrMonthChange() {
    this.minDate = new Date(this.selectedYear, this.selectedMonth, 1); // First day of the selected month
    this.maxDate = new Date(this.selectedYear, this.selectedMonth + 1, 0); // Last day of the selected month
    this.defaultDate = new Date(this.selectedYear, this.selectedMonth, 1); // Set calendar view to selected month/year
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

  goBack() {
    this.location.back();
  }
}
