import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { EmployeesService } from '../../employees/employees.service';
import { Location } from '@angular/common';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { LocalStorageService } from 'src/app/services/local-storage.service';
@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.scss'],
})
export class PayslipComponent {
  breadCrumbItems: any = [];
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  payroll: any = [];
  moment: any;
  designations: any = [];
  userDetails: any;
  payslipId: string | null = null;
  version = projectConstantsLocal.VERSION_DESKTOP;
  loading: boolean = false;
  amountinwords: string = 'Sixty Thousand Rupees Only';

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
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
        label: 'Payroll',
        routerLink: '/user/payroll',
        queryParams: { v: this.version },
      },
      { label: 'Payslip' },
    ];
    this.getdesignations();
  }

  ngOnInit(): void {
    this.payslipId = this.route.snapshot.paramMap.get('id');
    if (this.payslipId) {
      this.getPayrollById(this.payslipId);
    }
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    if (userDetails) {
      this.userDetails = userDetails.user;
    }
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
      pdf.save('payslip.pdf');
      this.loading = false;
    });
  }

  getPayrollById(id: string) {
    this.loading = true;
    this.employeesService.getPayrollById(id).subscribe(
      (payrollresponse: any) => {
        console.log(payrollresponse);
        this.employeesService
          .getEmployeeById(payrollresponse.employeeId)
          .subscribe(
            (employeeResponse: any) => {
              this.payroll = this.mergePayrollWithEmployee(
                payrollresponse,
                employeeResponse
              );
              console.log('Merged Payroll Data:', this.payroll);
              this.loading = false;
            },
            (error: any) => {
              this.loading = false;
              this.toastService.showError(error);
            }
          );
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  mergePayrollWithEmployee(payroll: any, employee: any): any {
    if (employee && payroll) {
      return {
        ...payroll,
        designationName: employee.designationName,
        designation: employee.designation,
      };
    }
    return payroll;
  }

  getMonthNameAndYear(dateString: string): string {
    const date = this.moment(dateString, 'MM/YYYY');
    return date.format('MMMM YYYY');
  }

  convertAmountToWords(amount: number): string {
    const ones = [
      '',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ];
    const tens = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ];
    const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
    if (amount === 0) return 'Zero';
    const chunkify = (n: number): number[] => {
      const chunks: number[] = [];
      while (n > 0) {
        chunks.push(n % 1000);
        n = Math.floor(n / 1000);
      }
      return chunks;
    };
    const convertChunk = (chunk: number): string => {
      let words = '';
      if (chunk >= 100) {
        words += ones[Math.floor(chunk / 100)] + ' Hundred ';
        chunk %= 100;
      }
      if (chunk >= 20) {
        words += tens[Math.floor(chunk / 10)] + ' ';
        chunk %= 10;
      }
      if (chunk > 0) {
        words += ones[chunk] + ' ';
      }
      return words.trim();
    };
    const chunks = chunkify(amount);
    let words = '';
    for (let i = 0; i < chunks.length; i++) {
      if (chunks[i] > 0) {
        words = convertChunk(chunks[i]) + ' ' + scales[i] + ' ' + words;
      }
    }
    return words.trim();
  }
  getDesignationName(userId) {
    if (this.designations && this.designations.length > 0) {
      let designationName = this.designations.filter(
        (designation) => designation.id == userId
      );
      return (
        (designationName &&
          designationName[0] &&
          designationName[0].department) ||
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
