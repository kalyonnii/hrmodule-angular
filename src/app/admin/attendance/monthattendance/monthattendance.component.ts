import { Component, OnInit } from '@angular/core';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx'; // Import xlsx
import { EmployeesService } from '../../employees/employees.service';
import { ToastService } from 'src/app/services/toast.service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
@Component({
  selector: 'app-monthattendance',
  templateUrl: './monthattendance.component.html',
  styleUrls: ['./monthattendance.component.scss'],
})
export class MonthattendanceComponent implements OnInit {
  breadCrumbItems: any = [];
  searchFilter: any = {};
  version = projectConstantsLocal.VERSION_DESKTOP;
  currentTableEvent: any;
  employeeNameToSearch: any;
  totalEmployeesCount: number = 0;
  filteredEmployees: any[] = [];

  employees: any[] = [];
  selectedDate: Date;
  moment: any;
  showTimes = false;
  monthDates: Date[] = [];
  attendance: any = [];
  loading: boolean = false;
  constructor(
    private location: Location,
    private toastService: ToastService,
    private dateTimeProcessor: DateTimeProcessorService,
    private employeesService: EmployeesService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.selectedDate = this.moment(new Date()).toDate();
    this.generateMonthDates();
    this.selectedDate = this.moment(new Date()).format('MM/YYYY');
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: ' Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Attendance',
        routerLink: '/user/attendance',
        queryParams: { v: this.version },
      },
      { label: 'Monthly Attendance' },
    ];
  }

  ngOnInit(): void {}

  // exportToExcel() {
  //   this.loading = true;
  //   const exportData = this.filteredEmployees.map((employee) => {
  //     const row: any = {
  //       'Employee ID': employee.employeeId,
  //       'Employee Name': employee.employeeName,
  //     };

  //     let presentCount = 0,
  //       absentCount = 0,
  //       lateCount = 0,
  //       halfDayCount = 0;

  //     this.monthDates.forEach((date) => {
  //       const dateStr = this.moment(date).format('YYYY-MM-DD');
  //       const attendanceEntry = this.attendance.find(
  //         (entry) => entry.attendanceDate === dateStr
  //       );
  //       if (!attendanceEntry) {
  //         row[dateStr] = 'H';
  //       } else {
  //         const employeeData = attendanceEntry?.attendanceData.find(
  //           (data) => data.employeeId === employee.employeeId
  //         );
  //         let status = employeeData?.status || '-';
  //         if (status === 'Late' || status === 'Half-day') {
  //           const checkInTime = employeeData?.checkInTime || '-';
  //           const checkOutTime = employeeData?.checkOutTime || '-';
  //           status += ` (Check-in: ${checkInTime}, Check-out: ${checkOutTime})`;
  //         }
  //         row[dateStr] = status;
  //         switch (employeeData?.status) {
  //           case 'Present':
  //             presentCount++;
  //             break;
  //           case 'Absent':
  //             absentCount++;
  //             break;
  //           case 'Late':
  //             lateCount++;
  //             break;
  //           case 'Half-day':
  //             halfDayCount++;
  //             break;
  //         }
  //       }
  //     });

  //     row['Total Present'] = presentCount;
  //     row['Total Absent'] = absentCount;
  //     row['Total Late'] = lateCount;
  //     row['Total Half-day'] = halfDayCount;

  //     return row;
  //   });

  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Attendance Data');

  //   XLSX.writeFile(wb, `Attendance_${this.selectedDate}.xlsx`);
  //   this.loading = false;
  // }

  exportToExcel() {
    this.loading = true;
    console.log(this.loading);
    try {
      const exportData = this.filteredEmployees.map((employee) => {
        const row: any = {
          'Employee ID': employee.employeeId,
          'Employee Name': employee.employeeName,
        };

        let presentCount = 0,
          absentCount = 0,
          lateCount = 0,
          halfDayCount = 0;

        this.monthDates.forEach((date) => {
          const dateStr = this.moment(date).format('YYYY-MM-DD');
          const attendanceEntry = this.attendance.find(
            (entry) => entry.attendanceDate === dateStr
          );
          if (!attendanceEntry) {
            row[dateStr] = 'H';
          } else {
            const employeeData = attendanceEntry?.attendanceData.find(
              (data) => data.employeeId === employee.employeeId
            );
            let status = employeeData?.status || '-';
            if (status === 'Late' || status === 'Half-day') {
              const checkInTime = employeeData?.checkInTime || '-';
              const checkOutTime = employeeData?.checkOutTime || '-';
              status += ` (Check-in: ${checkInTime}, Check-out: ${checkOutTime})`;
            }
            row[dateStr] = status;
            switch (employeeData?.status) {
              case 'Present':
                presentCount++;
                break;
              case 'Absent':
                absentCount++;
                break;
              case 'Late':
                lateCount++;
                break;
              case 'Half-day':
                halfDayCount++;
                break;
            }
          }
        });

        row['Total Present'] = presentCount;
        row['Total Absent'] = absentCount;
        row['Total Late'] = lateCount;
        row['Total Half-day'] = halfDayCount;

        return row;
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance Data');
      XLSX.writeFile(wb, `Attendance_${this.selectedDate}.xlsx`);
      this.loading = false;
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      this.loading = false;
    } finally {
      this.loading = false;
    }
  }

  generateMonthDates() {
    if (!this.selectedDate) return;
    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    this.monthDates = Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1)
    );
  }
  countAttendanceStatus(employeeId: number, status: string): number {
    return this.monthDates.filter(
      (date) => this.getAttendanceForDate(employeeId, date) === status
    ).length;
  }
  isAttendanceMatched(employeeId: number, date: Date): boolean {
    const formattedDate = this.moment(date).format('YYYY-MM-DD');
    const result = this.attendance.some(
      (entry) => entry.attendanceDate == formattedDate
    );
    return result;
  }

  isAttendanceMatchedforemployee(employeeId: number, date: Date): boolean {
    const formattedDate = this.moment(date).format('YYYY-MM-DD');
    const attendanceEntry = this.attendance.find(
      (entry) => entry.attendanceDate == formattedDate
    );
    return attendanceEntry?.attendanceData?.some(
      (data) => data.employeeId == employeeId
    );
  }

  isEmployeePresent(employeeId: number): boolean {
    return this.attendance.some((entry) =>
      entry?.attendanceData?.some((data) => data.employeeId === employeeId)
    );
  }

  getAttendanceForDate(employeeId: number, date: Date): string {
    const formattedDate = this.moment(date).format('YYYY-MM-DD');
    const attendanceEntry = this.attendance.find(
      (entry) => entry.attendanceDate == formattedDate
    );
    if (!attendanceEntry) {
      return 'No Data';
    }
    const employeeAttendance = attendanceEntry.attendanceData.find(
      (data) => data.employeeId == employeeId
    );
    return employeeAttendance ? employeeAttendance.status : '-';
  }
  getCheckinTimeCheckOutTime(employeeId: number, date: Date): string {
    const formattedDate = this.moment(date).format('YYYY-MM-DD');
    const attendanceEntry = this.attendance.find(
      (entry) => entry.attendanceDate == formattedDate
    );
    if (!attendanceEntry) {
      return 'No Data';
    }
    const employeeAttendance = attendanceEntry.attendanceData.find(
      (data) => data.employeeId == employeeId
    );
    if (!employeeAttendance) {
      return '-';
    }
    if (employeeAttendance.status === 'Late') {
      return `Late - Check-in: ${employeeAttendance.checkInTime}, Check-out: ${employeeAttendance.checkOutTime}`;
    }
    if (employeeAttendance.status === 'Half-day') {
      return `Half-Day - Check-in: ${employeeAttendance.checkInTime}, Check-out: ${employeeAttendance.checkOutTime}`;
    }
    return employeeAttendance.status;
  }

  onDateChange(event: any) {
    this.generateMonthDates();
    this.selectedDate = this.moment(event).format('MM/YYYY');
    if (this.selectedDate) {
      this.loadEmployees(this.currentTableEvent);
    }
  }

  // getAttendance() {
  //   this.loading = true;
  //   this.employeesService.getAttendance().subscribe(
  //     (response) => {
  //       this.attendance = response;
  //       console.log('attendance', this.attendance);
  //       this.loading = false;
  //     },
  //     (error: any) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }
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

  loadEmployees(event) {
    this.currentTableEvent = event;
    console.log(event.first);
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    // api_filter['employeeInternalStatus-eq'] = 1;
    api_filter = Object.assign({}, api_filter, this.searchFilter);
    if ('from' in api_filter) {
      delete api_filter.from;
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
  // getEmployees(filter = {}) {
  //   this.loading = true;
  //   this.employeesService.getEmployees(filter).subscribe(
  //     (response: any) => {
  //       this.employees = response;
  //       console.log('Employees:', this.employees);
  //       this.getAttendance()
  //         .then(() => {
  //           if (this.attendance && this.attendance.length > 0) {
  //             this.filteredEmployees = this.employees.filter((employee) => {
  //               const hasAttendance = this.isEmployeePresent(
  //                 employee.employeeId
  //               );
  //               return hasAttendance;
  //             });
  //             console.log('Filtered Employees:', this.filteredEmployees);
  //           } else {
  //             console.log('No attendance data available');
  //           }

  //           this.loading = false;
  //         })
  //         .catch((error) => {
  //           console.error('Error retrieving attendance data:', error);
  //           this.loading = false;
  //         });
  //     },
  //     (error: any) => {
  //       this.loading = false;
  //       this.toastService.showError(error);
  //     }
  //   );
  // }

  getEmployees(filter = {}) {
    this.loading = true;
    this.employeesService.getEmployees(filter).subscribe(
      (response: any) => {
        this.employees = response;
        console.log('Employees:', this.employees);

        this.getAttendance()
          .then(() => {
            if (this.attendance && this.attendance.length > 0) {
              this.filteredEmployees = this.employees.filter((employee) => {
                return this.monthDates.some((date) =>
                  this.isAttendanceMatchedforemployee(employee.employeeId, date)
                );
              });
              console.log('Filtered Employees:', this.filteredEmployees);
            } else {
              console.log('No attendance data available');
            }

            this.loading = false;
          })
          .catch((error) => {
            console.error('Error retrieving attendance data:', error);
            this.loading = false;
          });
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  filterWithEmployeeName() {
    let searchFilter = { 'employeeName-like': this.employeeNameToSearch };
    this.applyFilters(searchFilter);
  }
  applyFilters(searchFilter = {}) {
    this.searchFilter = searchFilter;
    console.log(this.currentTableEvent);
    this.loadEmployees(this.currentTableEvent);
  }
  inputValueChangeEvent(dataType, value) {
    if (value == '') {
      this.searchFilter = {};
      console.log(this.currentTableEvent);
      this.loadEmployees(this.currentTableEvent);
    }
  }
  goBack() {
    this.location.back();
  }
}