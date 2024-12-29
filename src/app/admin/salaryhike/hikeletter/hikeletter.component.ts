import { Component, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { RoutingService } from 'src/app/services/routing-service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { EmployeesService } from '../../employees/employees.service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-hikeletter',
  templateUrl: './hikeletter.component.html',
  styleUrls: ['./hikeletter.component.scss'],
})
export class HikeletterComponent {
  breadCrumbItems: any = [];
  moment: any;
  userDetails: any;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  loading: boolean = false;
  version = projectConstantsLocal.VERSION_DESKTOP;
  employees: any = null;
  salaryHikes: any = [];
  designations: any = [];
  employeeId: string | null = null;
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private routingService: RoutingService,
    private localStorageService: LocalStorageService,
    private employeesService: EmployeesService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: ' Dashboard',
        routerLink: '/user/dashboard',
        queryParams: { v: this.version },
      },
      {
        label: 'Salary Hikes',
        routerLink: '/user/salaryhikes',
        queryParams: { v: this.version },
      },
      { label: 'Hike Letter' },
    ];
    this.getdesignations();
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.getSalaryHikesById(this.employeeId);
    }
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    if (userDetails) {
      this.userDetails = userDetails.user;
    }
  }

  roundToLPA(amount: number): string {
    const lakhs = amount / 100000;
    return lakhs.toFixed(1) + ' LPA';
  }

  generatePDF() {
    this.loading = true;
    const pdfContent = this.pdfContent.nativeElement;
    html2canvas(pdfContent).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('incrementletter.pdf');
      this.loading = false;
    });
  }
  getOfferLetterDate(hikeDate: string | Date): Date {
    const date = new Date(hikeDate);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  calculateHikePercentage(oldSalary: number, newSalary: number): string {
    if (oldSalary <= 0) {
      return 'Invalid old salary';
    }
    console.log(oldSalary);
    console.log(newSalary);
    const hikePercentage = ((newSalary - oldSalary) / oldSalary) * 100;
    return hikePercentage.toFixed(2) + '%'; // Round to 2 decimal places and append '%'
  }
  getSalaryHikesById(id: string) {
    this.loading = true;
    this.employeesService.getSalaryHikesById(id).subscribe(
      (response) => {
        this.salaryHikes = response;
        console.log('Salary Hikes', this.salaryHikes);
        if (this.salaryHikes.employeeId) {
          this.getEmployeeById(this.salaryHikes.employeeId);
        }
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  getEmployeeById(id: string) {
    this.loading = true;
    this.employeesService.getEmployeeById(id).subscribe(
      (response) => {
        this.employees = response;
        console.log('Employees', this.employees);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getDesignationName(userId) {
    if (this.designations && this.designations.length > 0) {
      let designationName = this.designations.filter(
        (designation) => designation.id == userId
      );
      return (
        (designationName &&
          designationName[0] &&
          designationName[0].designation) ||
        ''
      );
    }
    return '';
  }

  getdesignations(filter = {}) {
    this.loading = true;
    this.employeesService.getDesignations(filter).subscribe(
      (designations: any) => {
        this.designations = [...designations];
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