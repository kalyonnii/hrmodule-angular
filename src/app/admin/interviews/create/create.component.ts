import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { EmployeesService } from '../../employees/employees.service';
import { RoutingService } from 'src/app/services/routing-service';
import { ActivatedRoute } from '@angular/router';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { projectConstantsLocal } from 'src/app/constants/project-constants';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  formFields: any = [];
  breadCrumbItems: any = [];
  interviewsData: any;
  moment: any;
  locationEntities: any = projectConstantsLocal.BRANCH_ENTITIES;
  attendedInterviewEntities: any =
    projectConstantsLocal.ATTENDED_INTERVIEW_ENTITIES;
  interviewStatusEntities: any =
    projectConstantsLocal.INTERVIEW_STATUS_ENTITIES;

  interviewId: any;
  interviewsForm: UntypedFormGroup;
  activeIndex: number = 0;
  heading: any = 'Create Interview';
  actionType: any = 'create';

  loading: any;
  constructor(
    private location: Location,
    private formBuilder: UntypedFormBuilder,
    private toastService: ToastService,
    private employeesService: EmployeesService,
    private routingService: RoutingService,
    private activatedRoute: ActivatedRoute,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.activatedRoute.params.subscribe((params) => {
      if (params && params['id']) {
        this.interviewId = params['id'];
        this.actionType = 'update';
        this.heading = 'Update Interview';
        this.getInterviewById().then((data) => {
          if (data) {
            console.log('Interview Data', this.interviewsData);
            this.interviewsForm.patchValue({
              candidateName: this.interviewsData?.candidateName,
              dateOfBirth: this.moment(this.interviewsData?.dateOfBirth).format(
                'MM/DD/YYYY'
              ),
              contactNumber: this.interviewsData?.contactNumber,
              qualification: this.interviewsData?.qualification,
              currentAddress: this.interviewsData?.currentAddress,
              permanentAddress: this.interviewsData?.permanentAddress,
              experience: this.interviewsData?.experience,
              scheduledLocation: this.interviewsData?.scheduledLocation,
              scheduledDate: this.moment(
                this.interviewsData?.scheduledDate
              ).format('MM/DD/YYYY'),
              attendedInterview: this.interviewsData?.attendedInterview,
              interviewStatus: this.interviewsData?.interviewStatus,
              remarks: this.interviewsData?.remarks,
              postponedDate: this.moment(
                this.interviewsData?.postponedDate
              ).format('MM/DD/YYYY'),
            });
          }
        });
      }
    });
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: ' Dashboard',
        routerLink: '/user/dashboard',
      },
      { label: 'Interviews', routerLink: '/user/interviews' },
      { label: this.actionType == 'create' ? 'Create' : 'Update' },
    ];
  }

  ngOnInit() {
    this.createForm();
    this.setInterviewsList();
  }

  setInterviewsList() {
    this.formFields = [
      {
        label: 'Candidate Name',
        controlName: 'candidateName',
        type: 'text',
        required: true,
      },
      {
        label: 'Date Of Birth',
        controlName: 'dateOfBirth',
        type: 'calendar',
        required: true,
      },
      {
        label: 'Contact Number',
        controlName: 'contactNumber',
        type: 'text',
        maxLength: 10,
        required: true,
      },
      {
        label: 'Qualification',
        controlName: 'qualification',
        type: 'text',
        required: true,
      },
      {
        label: 'Current Address',
        controlName: 'currentAddress',
        type: 'text',
        required: false,
      },
      {
        label: 'Permanent Address',
        controlName: 'permanentAddress',
        type: 'text',
        required: false,
      },
      {
        label: 'Experience',
        controlName: 'experience',
        type: 'text',
        required: true,
      },
      {
        label: 'Scheduled Location',
        controlName: 'scheduledLocation',
        type: 'dropdown',
        options: 'locationEntities',
        required: true,
        optionLabel: 'displayName',
        optionValue: 'id',
      },
      {
        label: 'Scheduled Date',
        controlName: 'scheduledDate',
        type: 'calendar',
        required: true,
      },
      {
        label: 'Attended Interview?',
        controlName: 'attendedInterview',
        type: 'dropdown',
        options: 'attendedInterviewEntities',
        required: true,
        optionLabel: 'displayName',
        optionValue: 'id',
      },
      {
        label: 'Interview Status',
        controlName: 'interviewStatus',
        type: 'dropdown',
        options: 'interviewStatusEntities',
        required: true,
        optionLabel: 'displayName',
        optionValue: 'id',
      },
      {
        label: 'Remarks',
        controlName: 'remarks',
        type: 'textarea',
        required: true,
      },
    ];

    this.interviewsForm
      .get('attendedInterview')
      ?.valueChanges.subscribe((value) => {
        if (value === 4) {
          if (
            !this.formFields.some(
              (field) => field.controlName === 'newInterviewDate'
            )
          ) {
            this.formFields.splice(10, 0, {
              label: 'New Scheduled Date',
              controlName: 'postponedDate',
              type: 'calendar',
              required: false,
            });
          }
        } else {
          this.formFields = this.formFields.filter(
            (field) => field.controlName !== 'newInterviewDate'
          );
        }
      });
  }

  createForm() {
    this.interviewsForm = this.formBuilder.group({
      candidateName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      contactNumber: ['', Validators.required],
      currentAddress: ['', Validators.required],
      qualification: ['', Validators.required],
      permanentAddress: ['', Validators.required],
      experience: ['', Validators.required],
      scheduledLocation: ['', Validators.required],
      scheduledDate: ['', Validators.required],
      attendedInterview: ['', Validators.required],
      interviewStatus: ['', Validators.required],
      remarks: ['', Validators.required],
      postponedDate: [''],
    });
  }

  onSubmit(formValues) {
    let formData: any = {
      candidateName: formValues.candidateName,
      dateOfBirth: formValues.dateOfBirth,
      contactNumber: formValues.contactNumber,
      qualification: formValues.qualification,
      currentAddress: formValues.currentAddress,
      permanentAddress: formValues.permanentAddress,
      experience: formValues.experience,
      scheduledLocation: formValues.scheduledLocation,
      scheduledLocationName: this.getScheduledLocationName(
        formValues.scheduledLocation
      ),
      scheduledDate: formValues.scheduledDate,
      attendedInterview: formValues.attendedInterview,
      attendedInterviewName: this.getattendedInterviewName(
        formValues.attendedInterview
      ),
      interviewStatus: formValues.interviewStatus,
      interviewStatusName: this.getinterviewStatusName(
        formValues.interviewStatus
      ),
      remarks: formValues.remarks,
      postponedDate: formValues.postponedDate,
    };

    console.log('formData', formData);
    if (this.actionType == 'create') {
      this.loading = true;
      this.employeesService.createInterview(formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Interview Added Successfully');
            this.routingService.handleRoute('interviews', null);
          }
        },
        (error: any) => {
          this.loading = false;
          console.log(error);
          this.toastService.showError(error);
        }
      );
    } else if (this.actionType == 'update') {
      this.loading = true;
      console.log(formData);
      this.employeesService
        .updateInterview(this.interviewId, formData)
        .subscribe(
          (data) => {
            if (data) {
              this.loading = false;
              this.toastService.showSuccess('Interview Updated Successfully');
              this.routingService.handleRoute('interviews', null);
            }
          },
          (error: any) => {
            this.loading = false;
            this.toastService.showError(error);
          }
        );
    }
  }

  getInterviewById(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.employeesService
        .getInterviewById(this.interviewId, filter)
        .subscribe(
          (response) => {
            this.interviewsData = response;
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

  getScheduledLocationName(interviewId) {
    if (this.locationEntities && this.locationEntities.length > 0) {
      let locationName = this.locationEntities.filter(
        (location) => location.id == interviewId
      );
      return (
        (locationName && locationName[0] && locationName[0].displayName) || ''
      );
    }
    return '';
  }

  getattendedInterviewName(interviewId) {
    if (
      this.attendedInterviewEntities &&
      this.attendedInterviewEntities.length > 0
    ) {
      let attendedInterviewName = this.attendedInterviewEntities.filter(
        (name) => name.id == interviewId
      );
      console.log(attendedInterviewName);
      return (
        (attendedInterviewName &&
          attendedInterviewName[0] &&
          attendedInterviewName[0].displayName) ||
        ''
      );
    }
    return '';
  }

  getinterviewStatusName(interviewId) {
    if (
      this.interviewStatusEntities &&
      this.interviewStatusEntities.length > 0
    ) {
      let interviewStatusName = this.interviewStatusEntities.filter(
        (name) => name.id == interviewId
      );
      return (
        (interviewStatusName &&
          interviewStatusName[0] &&
          interviewStatusName[0].displayName) ||
        ''
      );
    }
    return '';
  }

  goBack() {
    this.location.back();
  }
}
