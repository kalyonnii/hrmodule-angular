import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../employees.service';
import { ToastService } from 'src/app/services/toast.service';
import { RoutingService } from 'src/app/services/routing-service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  breadCrumbItems: any = [];
  loading: boolean = false;
  employees: any = null;
  employeeId: string | null = null;
  activeSection: string = 'employeeDetails'; 

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private routingService: RoutingService,
    private employeesService: EmployeesService
  ) {
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: ' Dashboard',
        routerLink: '/user/dashboard',
      },
      { label: 'Employees', routerLink: '/user/employees' },
      { label: 'Profile' },
    ];
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.getLeadById(this.employeeId);
    }
  }

  selectSection(section: string) {
    this.activeSection = section;
  }
  updateEmployee(employeeId) {
    console.log(employeeId);
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
  getLeadById(id: string) {
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
