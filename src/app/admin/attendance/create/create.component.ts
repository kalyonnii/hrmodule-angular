import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { EmployeesService } from '../../employees/employees.service';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute } from '@angular/router';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  breadCrumbItems: any = [];
  heading: string = 'Create Attendance';
  actionType: string = 'create';
  selectedDate: Date;
  moment: any;
  currentTableEvent: any;
  attendanceData: any;
  totalEmployeesCount: number = 0;
  loading: boolean = false;

  employees: any[] = [];
  employeeDetails: any[] = [];
  attendanceId: any;
  attendanceOptions = projectConstantsLocal.ATTENDANCE_OPTIONS;
  constructor(
    private location: Location,
    private employeesService: EmployeesService,
    private routingService: RoutingService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.activatedRoute.params.subscribe((params) => {
      if (params && params['id']) {
        this.attendanceId = params['id'];
        this.actionType = 'update';
        this.heading = 'Update Attendance';

        this.getAttendanceById(this.attendanceId)
          .then((data) => {
            if (data) {
              (this.selectedDate = this.moment(
                this.attendanceData?.attendanceDate
              ).format('MM/DD/YYYY')),
                console.log('Attendance Data', this.attendanceData);
            }
          })
          .catch((error) => {
            console.error('Error fetching attendance data:', error);
          });
      } else {
        this.loadEmployees(event);
      }
    });

    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: 'Dashboard',
        routerLink: '/user/dashboard',
      },
      { label: 'Attendance', routerLink: '/user/attendance' },
      { label: this.actionType === 'create' ? 'Create' : 'Update' },
    ];
  }

  ngOnInit(): void {
    this.loadEmployees(event);
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

  loadEmployees(event) {
    this.currentTableEvent = event;
    console.log(event.first);
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    api_filter['employeeInternalStatus-eq'] = 1;
    api_filter = Object.assign({}, api_filter);
    if ('from' in api_filter) {
      delete api_filter.from; // Safe access now
    }
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
      },
      (error: any) => {
        this.toastService.showError(error);
      }
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
  setDefaultAttendanceData() {
    const defaultCheckInTime = this.formatTime(new Date(0, 0, 0, 10, 5)); // 10:05 AM
    const defaultCheckOutTime = this.formatTime(new Date(0, 0, 0, 18, 30)); // 6:30 PM
    console.log(this.actionType);
    if (this.actionType == 'create') {
      this.employeeDetails = this.employees.map((employee) => ({
        employeeId: employee.employeeId,
        employeeName: employee.employeeName.trim(),
        passPhoto: employee.passPhoto,
        status: 'Present',
        checkInTime: defaultCheckInTime,
        checkOutTime: defaultCheckOutTime,
      }));

      console.log(
        'Employee Details with Default Data for Create:',
        this.employeeDetails
      );
    } else if (this.actionType == 'update') {
      this.employeeDetails = this.employees.map((employee) => {
        console.log(this.attendanceData);
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
  }

  // Update attendance status and times dynamically
  updateAttendanceStatus(employee: any) {
    console.log(
      `Attendance status for employee ID ${employee.employeeId} updated to ${employee.status}`
    );

    if (employee.status === 'Absent') {
      employee.checkInTime = ''; // Clear check-in time
      employee.checkOutTime = ''; // Clear check-out time
    } else {
      employee.checkInTime = this.formatTime(new Date(0, 0, 0, 10, 5)); // 10:05 AM
      employee.checkOutTime = this.formatTime(new Date(0, 0, 0, 18, 30)); // 6:30 PM
    }
  }

  // Helper method to format time as HH:mm
  private formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Save attendance data
  saveAttendance() {
    const formData = {
      attendanceDate: this.selectedDate,
      attendanceData: this.employeeDetails.map((employee) => ({
        employeeId: employee.employeeId,
        status: employee.status,
        checkInTime: employee.checkInTime,
        checkOutTime: employee.checkOutTime,
      })),
    };

    console.log('Formatted Form Data:', formData);

    if (this.actionType == 'create') {
      this.loading = true;
      this.employeesService.createAttendance(formData).subscribe(
        (data) => {
          this.loading = false;
          this.toastService.showSuccess('Attendance Added Successfully');
          this.routingService.handleRoute('attendance', null);
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError('Failed to add attendance.');
        }
      );
    } else if (this.actionType == 'update') {
      this.loading = true;
      console.log(formData);
      this.employeesService
        .updateAttendance(this.attendanceId, formData)
        .subscribe(
          (data) => {
            if (data) {
              this.loading = false;
              this.toastService.showSuccess('Attendance Updated Successfully');
              this.routingService.handleRoute('attendance', null);
            }
          },
          (error: any) => {
            this.loading = false;
            this.toastService.showError(error);
          }
        );
    }
  }

  // Helper method to format date as YYYY-MM-DD
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Go back to the previous route
  goBack() {
    this.location.back();
  }
}