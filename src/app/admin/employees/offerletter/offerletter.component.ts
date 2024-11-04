import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RoutingService } from 'src/app/services/routing-service';
import { ToastService } from 'src/app/services/toast.service';
import { EmployeesService } from '../employees.service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Component({
  selector: 'app-offerletter',
  templateUrl: './offerletter.component.html',
  styleUrls: ['./offerletter.component.scss'],
})
export class OfferletterComponent {
  breadCrumbItems: any = [];
  moment: any;
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
    // this.employeesService.getOfferLetterContent().subscribe(
    //   (data:any) => (this.offerLetterContent = data),
    //   (error) => console.error('Error fetching offer letter:', error)
    // );

    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.getEmployeeById(this.employeeId);
    }
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
