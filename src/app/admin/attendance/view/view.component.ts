import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { EmployeesService } from '../../employees/employees.service';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  // Existing variables
  breadCrumbItems: any = [];
  currentTableEvent: any;
  countsAnalytics: any[] = [];
  loading: boolean = false;
  moment: any;
  employees: any[] = [];
  attendanceData: any;
  attendanceId: any;
  selectedDate: Date;
  employeeDetails: any[] = [];
  totalEmployeesCount: number = 0;

  // New variables for counts
  totalPresentCount: number = 0;
  totalAbsentCount: number = 0;
  totalHalfDayCount: number = 0;

  constructor(
    private location: Location,
    private employeesService: EmployeesService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.activatedRoute.params.subscribe((params) => {
      if (params && params['id']) {
        this.attendanceId = params['id'];

        this.getAttendanceById(this.attendanceId)
          .then((data) => {
            if (data) {
              this.selectedDate = this.moment(
                this.attendanceData?.attendanceDate
              ).format('MM/DD/YYYY');
              console.log('Attendance Data', this.attendanceData);

              // Calculate the counts after fetching attendance data
              this.calculateAttendanceCounts();
            }
          })
          .catch((error) => {
            console.error('Error fetching attendance data:', error);
          });
      }
    });

    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: 'Dashboard',
        routerLink: '/user/dashboard',
      },
      { label: 'Attendance', routerLink: '/user/attendance' },
      { label: 'View Attendance' },
    ];
  }

  ngOnInit(): void {
    this.updateCountsAnalytics();
  }

  updateCountsAnalytics() {
    this.countsAnalytics = [
      {
        name: 'user',
        displayName: 'Employees',
        count: this.totalEmployeesCount,
        textcolor: '#6C5FFC',
        backgroundcolor: '#F0EFFF',
      },
      {
        name: 'check-circle',
        displayName: 'Total Present',
        count: this.totalPresentCount,
        textcolor: '#2ECC71',
        backgroundcolor: '#F0F9E8',
      },
      {
        name: 'star-half-stroke',
        displayName: 'Total Half Day',
        count: this.totalHalfDayCount,
        textcolor: '#FFC107',
        backgroundcolor: '#FFF3D6',
      },
      {
        name: 'circle-xmark',
        displayName: 'On Leave',
        count: this.totalAbsentCount,
        textcolor: '#DC3545',
        backgroundcolor: '#F8D7DA',
      },
    ];
  }

  calculateAttendanceCounts() {
    // Reset counts before calculating
    this.totalPresentCount = 0;
    this.totalAbsentCount = 0;
    this.totalHalfDayCount = 0;

    // Loop through attendance data and count statuses
    this.attendanceData?.attendanceData.forEach((attendance) => {
      if (attendance.status === 'Present') {
        this.totalPresentCount++;
      } else if (attendance.status === 'Absent') {
        this.totalAbsentCount++;
      } else if (attendance.status === 'Half-day') {
        this.totalHalfDayCount++;
      }
    });

    console.log(
      `Present: ${this.totalPresentCount}, Absent: ${this.totalAbsentCount}, Half-day: ${this.totalHalfDayCount}`
    );

    // Update the analytics after calculating counts
    this.updateCountsAnalytics();
  }

  loadEmployees(event) {
    this.currentTableEvent = event;
    console.log(event.first);
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    api_filter['employeeInternalStatus-eq'] = 1;
    api_filter = Object.assign({}, api_filter);
    console.log(api_filter);
    if (api_filter) {
      this.getEmployeesCount(api_filter);
      this.getEmployees(api_filter);
    }
  }

  getEmployeesCount(filter = {}) {
    this.employeesService.getEmployeesCount(filter).subscribe(
      (response: any) => {
        this.totalEmployeesCount = response;
        this.updateCountsAnalytics();
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  setDefaultAttendanceData() {
    this.employeeDetails = this.employees.map((employee) => {
      const attendance = this.attendanceData?.attendanceData.find(
        (att) => att.employeeId === employee.employeeId
      );
      return {
        ...employee,
        status: attendance?.status,
        checkInTime: attendance?.checkInTime,
        checkOutTime: attendance?.checkOutTime,
      };
    });

    console.log(
      'Employee Details with Attendance Data for Update:',
      this.employeeDetails
    );
  }

  getEmployees(filter = {}) {
    this.loading = true;
    this.employeesService.getEmployees(filter).subscribe(
      (response: any) => {
        this.employees = response;
        console.log('employees', this.employees);
        this.loading = false;
        this.setDefaultAttendanceData();
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getAttendanceById(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.employeesService
        .getAttendanceById(this.attendanceId, filter)
        .subscribe(
          (response) => {
            this.attendanceData = response;
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