import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { EmployeesService } from '../../employees/employees.service';
import { RoutingService } from 'src/app/services/routing-service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  heading = 'Create Incentive';
  actionType: 'create' | 'update' = 'create';
  formFields: any[] = [];
  monthFileGroups: { name: string; label: string; list: any[] }[] = [];

  incentiveForm: UntypedFormGroup;
  moment: any;
  activeItem: any;
  userDetails: any;
  incentiveId?: number;
  items: any[];
  version = projectConstantsLocal.VERSION_DESKTOP;
  breadCrumbItems: any[] = [];
  employees: any[] = [];
  loading = false;
  incentiveData: any;

  firstMonthFiles: any[] = [];
  secondMonthFiles: any[] = [];
  thirdMonthFiles: any[] = [];

  constructor(
    private location: Location,
    private formBuilder: UntypedFormBuilder,
    private toastService: ToastService,
    private employeesService: EmployeesService,
    private routingService: RoutingService,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
    this.initializeBreadcrumb();

    this.activatedRoute.params.subscribe((params) => {
      if (params && params['id']) {
        this.incentiveId = params['id'];
        this.actionType = 'update';
        this.heading = 'Update Incentive';
        this.getEmployeeById().then((data) => {
          if (data) {
            console.log('Employee Data', this.incentiveData);
            this.incentiveForm.patchValue({
              employeeName: this.incentiveData?.employeeName,
              employeeId: this.incentiveData?.employeeId,
              incentiveAmount: this.incentiveData?.incentiveAmount,
              incentiveApplicableMonth:
                this.incentiveData?.incentiveApplicableMonth,
            });

            this.firstMonthFiles = this.incentiveData?.firstMonthFiles?.length
              ? [...this.incentiveData.firstMonthFiles]
              : [];
            this.secondMonthFiles = this.incentiveData?.secondMonthFiles?.length
              ? [...this.incentiveData.secondMonthFiles]
              : [];
            this.thirdMonthFiles = this.incentiveData?.thirdMonthFiles?.length
              ? [...this.incentiveData.thirdMonthFiles]
              : [];

            this.monthFileGroups[0].list = this.firstMonthFiles;
            this.monthFileGroups[1].list = this.secondMonthFiles;
            this.monthFileGroups[2].list = this.thirdMonthFiles;
          }
        });
      }
    });
  }

  ngOnInit() {
    this.initializeForm();
    this.setIncentivesList();
    this.setupDropdownListener();
    this.loadUserDetails();
    this.loadEmployees();
    this.setupActiveItemTabs();
  }

  initializeBreadcrumb() {
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: 'Dashboard',
        routerLink: '/user/dashboard',
      },
      { label: 'Holidays', routerLink: '/user/holidays' },
      { label: this.actionType === 'create' ? 'Create' : 'Update' },
    ];
  }

  initializeForm() {
    this.incentiveForm = this.formBuilder.group({
      employeeName: ['', Validators.required],
      employeeId: ['', Validators.required],
      incentiveApplicableMonth: ['', Validators.required],
    });
  }

  setupDropdownListener() {
    this.incentiveForm
      .get('employeeName')
      ?.valueChanges.subscribe((selectedName) => {
        const selectedEmployee = this.employees.find(
          (employee) => employee.employeeName === selectedName
        );
        if (selectedEmployee) {
          this.incentiveForm.patchValue({
            employeeId: selectedEmployee.employeeId,
          });
        }
      });
  }

  loadUserDetails() {
    const userDetails =
      this.localStorageService.getItemFromLocalStorage('userDetails');
    if (userDetails) {
      this.userDetails = userDetails.user;
    }
  }

  loadEmployees(filter: any = {}) {
    this.loading = true;
    if (this.actionType === 'create') {
      filter['employeeInternalStatus-eq'] = 1;
    }
    this.employeesService.getEmployees(filter).subscribe(
      (response: any) => {
        this.employees = response;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.toastService.showError('Failed to load employees');
      }
    );
  }

  setupActiveItemTabs() {
    this.items = [
      { label: 'First Month Files', name: 'firstMonthFiles' },
      { label: 'Second Month Files', name: 'secondMonthFiles' },
      { label: 'Third Month Files', name: 'thirdMonthFiles' },
    ];
    this.activeItem = this.items[0];
  }

  setIncentivesList() {
    this.formFields = [
      {
        label: 'Employee Name',
        controlName: 'employeeName',
        type: 'dropdown',
        options: 'employees',
        required: true,
        optionLabel: 'employeeName',
        optionValue: 'employeeName',
      },

      {
        label: 'Incentive Applicable Month',
        controlName: 'incentiveApplicableMonth',
        type: 'calendar',
        required: true,
      },
    ];

    this.monthFileGroups = [
      {
        name: 'firstMonthFiles',
        label: 'First Month Files',
        list: this.firstMonthFiles,
      },
      {
        name: 'secondMonthFiles',
        label: 'Second Month Files',
        list: this.secondMonthFiles,
      },
      {
        name: 'thirdMonthFiles',
        label: 'Third Month Files',
        list: this.thirdMonthFiles,
      },
    ];
  }

  addFileRow(list: any[]) {
    list.push({ fileName: '', disbursedMonth: '', disbursedAmount: '' });
  }

  deleteFileRow(list: any[], index: number) {
    list.splice(index, 1);
  }

  onActiveItemChange(event: any) {
    this.activeItem = event;
  }

  onSubmit(formValues) {
    const formatMonthFiles = (files: any[]) =>
      files.map((file) => ({
        ...file,
        disbursedMonth: file.disbursedMonth
          ? this.moment(file.disbursedMonth).format('YYYY-MM-DD')
          : null,
      }));

    const calculateIncentive = (totalDisbursedAmount: number): number => {
      if (totalDisbursedAmount >= 10000000) {
        return totalDisbursedAmount * 0.003;
      } else if (totalDisbursedAmount >= 4900000) {
        return totalDisbursedAmount * 0.002;
      } else if (totalDisbursedAmount >= 1500000) {
        return totalDisbursedAmount * 0.0015;
      }
      return 0;
    };

    const getTotalDisbursedAmount = (files: any[]) =>
      files.reduce(
        (sum, file) =>
          sum + (file.disbursedAmount ? Number(file.disbursedAmount) : 0),
        0
      );

    const firstMonthTotal = getTotalDisbursedAmount(this.firstMonthFiles || []);
    const secondMonthTotal = getTotalDisbursedAmount(
      this.secondMonthFiles || []
    );
    const thirdMonthTotal = getTotalDisbursedAmount(this.thirdMonthFiles || []);
    const totalDisbursedAmount =
      firstMonthTotal + secondMonthTotal + thirdMonthTotal;

    const incentiveAmount = calculateIncentive(totalDisbursedAmount);

    const formData: any = {
      employeeName: formValues.employeeName,
      employeeId: formValues.employeeId,
      incentiveAmount,
      incentiveApplicableMonth: formValues.incentiveApplicableMonth
        ? this.moment(formValues.incentiveApplicableMonth).format('YYYY-MM-DD')
        : null,
      firstMonthFiles:
        this.firstMonthFiles && this.firstMonthFiles.length > 0
          ? formatMonthFiles(this.firstMonthFiles)
          : null,
      secondMonthFiles:
        this.secondMonthFiles && this.secondMonthFiles.length > 0
          ? formatMonthFiles(this.secondMonthFiles)
          : null,
      thirdMonthFiles:
        this.thirdMonthFiles && this.thirdMonthFiles.length > 0
          ? formatMonthFiles(this.thirdMonthFiles)
          : null,
    };

    console.log('formData', formData);

    if (this.actionType == 'create') {
      this.loading = true;
      this.employeesService.createIncentive(formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Incentive Added Successfully');
            this.routingService.handleRoute('incentives', null);
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
      this.employeesService
        .updateIncentive(this.incentiveId, formData)
        .subscribe(
          (data) => {
            if (data) {
              this.loading = false;
              this.toastService.showSuccess('Incentives Updated Successfully');
              this.routingService.handleRoute('incentives', null);
            }
          },
          (error: any) => {
            this.loading = false;
            this.toastService.showError(error);
          }
        );
    }
  }

  getEmployeeById(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.employeesService
        .getIncentiveById(this.incentiveId, filter)
        .subscribe(
          (response) => {
            this.incentiveData = response;
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

  goBack() {
    this.location.back();
  }
}
