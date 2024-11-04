import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../employees.service';
import { ToastService } from 'src/app/services/toast.service';
import { RoutingService } from 'src/app/services/routing-service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  breadCrumbItems: any = [];
  loading: boolean = false;
  employees: any = null;
  offerLetterHtml: string = '';
  attendance: any = [];
  selectedDate: Date;
  moment: any;
  version = projectConstantsLocal.VERSION_DESKTOP;
  employeeId: string | null = null;
  activeSection: string = 'employeeDetails';
  month: any;
  year: any;

  sections = [
    { id: 'employeeDetails', label: 'Employee Details' },
    { id: 'addressDetails', label: 'Address Details' },
    { id: 'experienceDetails', label: 'Experience Details' },
    { id: 'kycDetails', label: 'KYC Details' },
    { id: 'accountDetails', label: 'Account Details' },
    { id: 'attendanceDetails', label: 'Attendance Details' },
    { id: 'otherDetails', label: 'Other Details' },
  ];

  attendanceStatusCounts: { [key: string]: number } = {
    Present: 0,
    Absent: 0,
    Late: 0,
    'Half-day': 0,
  };

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private routingService: RoutingService,
    private employeesService: EmployeesService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.selectedDate = this.moment(new Date()).toDate();
    this.month = this.selectedDate.getMonth() + 1;
    this.year = this.selectedDate.getFullYear();

    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: 'Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Employees',
        routerLink: '/user/employees',
        queryParams: { v: this.version },
      },
      { label: 'Profile' },
    ];
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.getEmployeeById(this.employeeId);
      this.getAttendance();
    }
  }
  //   generateOfferletter() {
  //     const offerData = {
  //       date: '2024-10-21',
  //       name: 'John Doe',
  //       city: 'Hyderabad',
  //       address: 'Andhara Pradesh',
  //       designation: 'designation',
  //       dateOfJoining: '1st November 2024',
  //       hrname: 'HR Team',
  //       salary: 21000,
  //     };

  //     this.employeesService.getOfferLetterTemplateHtml('index', offerData).then(
  //       (html) => {
  //         console.log('called');
  //         console.log(html);
  //         if (html) {
  //           console.log(html);
  //           this.offerLetterHtml = html as string;
  //         } else {
  //           console.error('Failed to render offer letter.');
  //         }
  //       },
  //       (error) => {
  //         console.error('Error rendering offer letter:', error);
  //       }
  //     );
  //   }

  onDateChange(event: any) {
    const selectedDate = this.moment(event).toDate();
    this.month = selectedDate.getMonth() + 1;
    this.year = selectedDate.getFullYear();
    this.getAttendance();
  }

  getAttendance() {
    this.loading = true;
    this.employeesService.getAttendance().subscribe(
      (response) => {
        this.attendance = response;
        this.loading = false;
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

  getAttendanceCountsByMonth(attendanceRecords, month, year, employeeId) {
    this.attendanceStatusCounts = {
      Present: 0,
      Absent: 0,
      Late: 0,
      'Half-day': 0,
    };

    attendanceRecords.forEach((record) => {
      const attendanceDate = new Date(record.attendanceDate);
      const recordMonth = attendanceDate.getMonth() + 1;
      const recordYear = attendanceDate.getFullYear();

      if (recordMonth === month && recordYear === year) {
        const employeeAttendance = record?.attendanceData.find(
          (data) => data.employeeId == employeeId
        );

        if (
          employeeAttendance &&
          this.attendanceStatusCounts[employeeAttendance.status] !== undefined
        ) {
          this.attendanceStatusCounts[employeeAttendance.status]++;
        }
      }
    });

    console.log('Attendance Status Counts:', this.attendanceStatusCounts);
  }

  selectSection(section: string) {
    this.activeSection = section;
  }

  updateEmployee(employeeId) {
    this.routingService.handleRoute('employees/update/' + employeeId, null);
  }

  isImageFile(file: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = file.split('.').pop()?.toLowerCase();
    return !!fileExtension && imageExtensions.includes(fileExtension);
  }

  getFileIcon(fileType) {
    return this.employeesService.getFileIcon(fileType);
  }

  getEmployeeById(id: string) {
    this.loading = true;
    this.employeesService.getEmployeeById(id).subscribe(
      (response) => {
        this.employees = response;
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  goBack() {
    this.location.back();
  }
}
