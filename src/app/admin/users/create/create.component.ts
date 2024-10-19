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
  heading: any = 'Create User';
  breadCrumbItems: any = [];
  userData: any;
  formFields: any = [];
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  actionType: any = 'create';
  loading: any;
  userId: any;
  userForm: UntypedFormGroup;
  designationEntities: any = projectConstantsLocal.DESIGNATION_ENTITIES;
  moment: any;
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
        this.userId = params['id'];
        this.actionType = 'update';
        this.heading = 'Update User';
        this.getUserById().then((data) => {
          if (data) {
            console.log('User Data', this.userData);
            this.userForm.patchValue({
              firstName: this.userData?.firstName,
              lastName: this.userData?.lastName,
              username: this.userData?.username,
              email: this.userData?.email,
              phoneNumber: this.userData?.phoneNumber,
              designation: this.userData?.designation,
              password: this.userData?.password,
              confirmPassword: this.userData?.confirmPassword,
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
      { label: 'Users', routerLink: '/user/users' },
      { label: this.actionType == 'create' ? 'Create' : 'Update' },
    ];
  }
  ngOnInit() {
    this.createForm();
    this.setEmployeesList();
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }
  setEmployeesList() {
    this.formFields = [
      {
        label: 'First Name',
        controlName: 'firstName',
        type: 'text',
        required: true,
      },
      {
        label: 'Last Name',
        controlName: 'lastName',
        type: 'text',
        required: true,
      },

      {
        label: 'Username',
        controlName: 'username',
        type: 'text',
        required: true,
      },

      {
        label: 'Email',
        controlName: 'email',
        type: 'text',
        required: true,
      },
      {
        label: 'Phone Number ',
        controlName: 'phoneNumber',
        type: 'text',
        required: true,
        maxLength: 10,
      },
      {
        label: 'Designation',
        controlName: 'designation',
        type: 'dropdown',
        options: 'designationEntities',
        required: true,
        optionLabel: 'displayName',
        optionValue: 'id',
      },
      {
        label: 'Password',
        controlName: 'password',
        type: 'text',
        required: true,
        isPasswordField: true,
      },
      {
        label: 'Confirm Password',
        controlName: 'confirmPassword',
        type: 'text',
        required: true,
        isPasswordField: true,
      },
    ];
  }
  createForm() {
    this.userForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        designation: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: UntypedFormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  getUserById(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.employeesService.getUserById(this.userId, filter).subscribe(
        (response) => {
          this.userData = response;
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

  onSubmit(formValues) {
    let formData: any = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      username: formValues.username,
      email: formValues.email,
      phoneNumber: formValues.phoneNumber,
      designation: formValues.designation,
      designationName: this.getDesignationName(formValues.designation),
      password: formValues.password,
      confirmPassword: formValues.confirmPassword,
    };

    console.log('formData', formData);
    if (this.actionType == 'create') {
      this.loading = true;
      this.employeesService.createUser(formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('User Added Successfully');
            this.routingService.handleRoute('users', null);
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
      this.employeesService.updateUser(this.userId, formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('User Updated Successfully');
            this.routingService.handleRoute('users', null);
          }
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    }
  }

  getDesignationName(designationId) {
    if (this.designationEntities && this.designationEntities.length > 0) {
      let designationName = this.designationEntities.filter(
        (designation) => designation.id == designationId
      );
      return (
        (designationName &&
          designationName[0] &&
          designationName[0].displayName) ||
        ''
      );
    }
    return '';
  }

  goBack() {
    this.location.back();
  }
}
