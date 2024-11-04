import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { EmployeesService } from '../../employees/employees.service';
import { Location } from '@angular/common';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.scss'],
})
export class PayslipComponent {
  breadCrumbItems: any = [];
  payroll: any = [];
  moment: any;
  payslipId: string | null = null;
  version = projectConstantsLocal.VERSION_DESKTOP;
  loading: boolean = false;
  amountinwords: string = 'Sixty Thousand Rupees Only';

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private routingService: RoutingService,
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
  }

  ngOnInit(): void {
    this.payslipId = this.route.snapshot.paramMap.get('id');
    if (this.payslipId) {
      this.getPayrollById(this.payslipId);
    }
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
      return { ...payroll, designationName: employee.designationName };
    }
    return payroll;
  }

  getMonthNameAndYear(dateString: string): string {
    const date = this.moment(dateString, 'MM/YYYY'); // Parse input date
    return date.format('MMMM YYYY'); // Format as "October 2024"
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

  goBack() {
    this.location.back();
  }
}
