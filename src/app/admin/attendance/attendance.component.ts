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
  displayMonth: Date;
  displayDialog = false;
  attendance: any = [];
  selectedMonth: Date;
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
    this.selectedMonth = this.moment(new Date()).format('YYYY-MM');
    this.displayMonth = this.moment(new Date()).format('MMMM YYYY');
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
    const storedDate = localStorage.getItem('selectedAttendanceDate');
    if (storedDate) {
      this.selectedDate = storedDate;
      this.filterByDate();
    }
    const storedMonth = localStorage.getItem('selectedAttendanceMonth');
    if (storedMonth) {
      this.selectedMonth = JSON.parse(storedMonth);
      this.displayMonth = this.moment(this.selectedMonth).format('MMMM YYYY');
    }
  }

  loadAttendance(event) {
    this.currentTableEvent = event;
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    if (this.selectedMonth) {
      console.log(this.selectedMonth);
      this.selectedMonth = this.moment(this.selectedMonth, 'YYYY-MM').format(
        'YYYY-MM'
      );
      console.log(this.selectedMonth);
      const startOfMonth = this.moment(`${this.selectedMonth}-01`)
        .startOf('month')
        .format('YYYY-MM-DD');
      const endOfMonth = this.moment(startOfMonth)
        .endOf('month')
        .format('YYYY-MM-DD');
      api_filter['attendanceDate-gte'] = startOfMonth;
      api_filter['attendanceDate-lte'] = endOfMonth;
    }
    api_filter = Object.assign({}, api_filter, this.searchFilter);
    console.log(api_filter);
    if (api_filter) {
      this.getAttendanceCount(api_filter);
      this.getAttendance(api_filter);
    }
  }
  onDateChange(event: any) {
    this.selectedMonth = this.moment(event).format('YYYY-MM');
    this.displayMonth = this.moment(event).format('MMMM YYYY');
    localStorage.setItem(
      'selectedAttendanceMonth',
      JSON.stringify(this.selectedMonth)
    );
    this.loadAttendance(this.currentTableEvent);
  }

  filterByDate(): void {
    if (this.selectedDate) {
      const formattedDate = this.moment(this.selectedDate).format('YYYY-MM-DD');
      console.log('Formatted Date:', formattedDate);
      localStorage.setItem('selectedAttendanceDate', formattedDate);
      const searchFilter = { 'attendanceDate-like': formattedDate };
      this.applyFilters(searchFilter);
    } else {
      this.searchFilter = {};
      localStorage.removeItem('selectedAttendanceDate');
      this.loadAttendance(this.currentTableEvent);
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
  confirmDelete(attendance) {
    this.confirmationService.confirm({
      // message: 'Are you sure you want to delete this Attendance?',
      message: `Are you sure you want to delete this Attendance ?<br>
              Attendance Date: ${attendance.attendanceDate}<br>
              Attendance ID: ${attendance.attendanceId}
              `,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteAttendance(attendance.attendanceId);
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

  monthAttendance() {
    this.routingService.handleRoute('attendance/monthattendance', null);
  }
  ViewAttendance(attendanceId) {
    this.routingService.handleRoute('attendance/view/' + attendanceId, null);
  }
  goBack() {
    this.location.back();
  }
}
