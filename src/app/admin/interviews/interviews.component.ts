import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { EmployeesService } from '../employees/employees.service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ToastService } from 'src/app/services/toast.service';
import { RoutingService } from 'src/app/services/routing-service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.scss'],
})
export class InterviewsComponent {
  breadCrumbItems: any = [];
  currentTableEvent: any;
  totalInterviewsCount: any = 0;
  loading: any;
  interviews: any = [];
  interviewInternalStatusList: any = projectConstantsLocal.INTERVIEW_STATUS;

  constructor(
    private employeesService: EmployeesService,
    private location: Location,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private routingService: RoutingService
  ) {
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: '  Dashboard',
        routerLink: '/user/dashboard',
      },
      { label: 'Interviews' },
    ];
  }

  actionItems(interview: any): MenuItem[] {
    const menuItems: any = [{ label: 'Actions', items: [] }];

    if (interview.interviewInternalStatus === 1) {
      menuItems[0].items.push({
        label: 'In Active',
        icon: 'fa fa-right-to-bracket',
        command: () => this.inactiveInterview(interview),
      });
      menuItems[0].items.push({
        label: 'Update',
        icon: 'fa fa-pen-to-square',
        command: () => this.updateInterview(interview.interviewId),
      });

      menuItems[0].items.push({
        label: 'Delete',
        icon: 'fa fa-trash',
        command: () => this.confirmDelete(interview.interviewId),
      });
    } else if (interview.interviewInternalStatus === 2) {
      menuItems[0].items.push({
        label: 'Active',
        icon: 'fa fa-right-to-bracket',
        command: () => this.activateInterview(interview),
      });
    }
    return menuItems;
  }

  inactiveInterview(interview) {
    this.changeInterviewStatus(interview.interviewId, 2);
  }

  activateInterview(interview) {
    this.changeInterviewStatus(interview.interviewId, 1);
  }
  changeInterviewStatus(interviewId, statusId) {
    this.loading = true;
    this.employeesService
      .changeInterviewStatus(interviewId, statusId)
      .subscribe(
        (response) => {
          this.toastService.showSuccess(
            'Interview Status Changed Successfully'
          );
          this.loading = false;
          this.loadInterviews(this.currentTableEvent);
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
  }

  confirmDelete(interviewId) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Interview?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteInterview(interviewId);
      },
    });
  }
  deleteInterview(interviewId) {
    this.loading = true;
    this.employeesService.deleteInterview(interviewId).subscribe(
      (response: any) => {
        console.log(response);
        this.toastService.showSuccess(response?.message);
        this.loading = false;
        this.loadInterviews(this.currentTableEvent);
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }
  loadInterviews(event) {
    this.currentTableEvent = event;
    let api_filter = this.employeesService.setFiltersFromPrimeTable(event);
    api_filter = Object.assign({}, api_filter);
    if (api_filter) {
      this.getInterviewCount(api_filter);
      this.getInterviews(api_filter);
    }
  }

  getInterviewCount(filter = {}) {
    this.employeesService.getInterviewCount(filter).subscribe(
      (response) => {
        this.totalInterviewsCount = response;
      },
      (error: any) => {
        this.toastService.showError(error);
      }
    );
  }

  getInterviews(filter = {}) {
    this.loading = true;
    this.employeesService.getInterviews(filter).subscribe(
      (response) => {
        this.interviews = response;
        console.log('Interviews', this.interviews);
        this.loading = false;
      },
      (error: any) => {
        this.loading = false;
        this.toastService.showError(error);
      }
    );
  }

  getStatusName(statusId) {
    if (
      this.interviewInternalStatusList &&
      this.interviewInternalStatusList.length > 0
    ) {
      let interviewStatusName = this.interviewInternalStatusList.filter(
        (interviewStatus) => interviewStatus.id == statusId
      );
      return (
        (interviewStatusName &&
          interviewStatusName[0] &&
          interviewStatusName[0].name) ||
        ''
      );
    }
    return '';
  }

  getStatusColor(status: string): {
    textColor: string;
    backgroundColor: string;
  } {
    switch (status) {
      case 'new':
        return { textColor: '#0F006D', backgroundColor: '#DED3FF' };
      case 'archived':
        return { textColor: '#FFBA15', backgroundColor: '#FFF3D6' };
      default:
        return { textColor: 'black', backgroundColor: 'white' };
    }
  }

  createInterview() {
    this.routingService.handleRoute('interviews/create', null);
  }

  updateInterview(interviewId) {
    this.routingService.handleRoute('interviews/update/' + interviewId, null);
  }

  goBack() {
    this.location.back();
  }
}
