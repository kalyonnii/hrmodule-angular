import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { EmployeesService } from '../employees.service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-offerletter',
  templateUrl: './offerletter.component.html',
  styleUrls: ['./offerletter.component.scss'],
})
export class OfferletterComponent {
  breadCrumbItems: any = [];
  moment: any;
  userDetails: any;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  loading: boolean = false;
  version = projectConstantsLocal.VERSION_DESKTOP;
  employees: any = null;
  employeeId: string | null = null;
  offerLetterContent: string | undefined;
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
        label: 'Employees',
        routerLink: '/user/employees',
        queryParams: { v: this.version },
      },
      { label: 'Offer Letter' },
    ];
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.getEmployeeById(this.employeeId);
    }
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    if (userDetails) {
      this.userDetails = userDetails.user;
    }
  }

  generatePDF() {
    this.loading = true;

    const pageElements = document.querySelectorAll('.page');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const pageHeight = 297;

    const addPagesToPDF = async () => {
      for (let i = 0; i < pageElements.length; i++) {
        const pageElement = pageElements[i];
        await html2canvas(pageElement as HTMLElement).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
          if (i < pageElements.length - 1) {
            pdf.addPage();
          }
        });
      }
    };

    addPagesToPDF()
      .then(() => {
        pdf.save('Offerletter.pdf');
        this.loading = false;
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
        this.loading = false;
      });
  }

  getOfferLetterDate(joiningDate: string): Date {
    const date = new Date(joiningDate);
    date.setDate(date.getDate() - 2);
    return date;
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
  goBack() {
    this.location.back();
  }
}
