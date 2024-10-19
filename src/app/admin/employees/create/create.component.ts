import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { EmployeesService } from '../employees.service';
import { ToastService } from 'src/app/services/toast.service';
import { RoutingService } from 'src/app/services/routing-service';
import { ActivatedRoute } from '@angular/router';
import { projectConstantsLocal } from 'src/app/constants/project-constants';
import { DialogService } from 'primeng/dynamicdialog';
import { FileUploadComponent } from '../../file-upload/file-upload.component';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent {
  personalFields: any = [];
  experienceFields: any = [];
  addressFields: any = [];
  kycFields: any = [];
  salaryAccountFields: any = [];
  breadCrumbItems: any = [];
  employeeData: any;
  steps: any[];
  moment: any;
  employeeId: any;
  employeeForm: UntypedFormGroup;
  activeIndex: number = 0;
  heading: any = 'Create Employee';
  actionType: any = 'create';
  ofcBranchNamesList: any = projectConstantsLocal.BRANCH_ENTITIES;
  branchEntities: any = projectConstantsLocal.BRANCH_ENTITIES;
  careOfEntities: any = projectConstantsLocal.CARE_OF_ENTITIES;
  genderEntities: any = projectConstantsLocal.GENDER_ENTITIES;
  designationEntities: any = projectConstantsLocal.DEPARTMENT_ENTITIES;
  loading: any;
  otherAttachments: any = [
    {
      name: '',
      otherAttachments: [],
    },
  ];
  selectedFiles: any = {
    panCard: { filesData: [], links: [], uploadedFiles: [] },
    aadharCard: { filesData: [], links: [], uploadedFiles: [] },
    passPhoto: { filesData: [], links: [], uploadedFiles: [] },
    otherAttachments: [{ filesData: [], links: [], uploadedFiles: [] }],
  };

  constructor(
    private location: Location,
    private confirmationService: ConfirmationService,
    private formBuilder: UntypedFormBuilder,
    private toastService: ToastService,
    private employeesService: EmployeesService,
    private routingService: RoutingService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.steps = [
      { label: 'Employee Details', icon: 'fa fa-user' },
      { label: 'Employee Address', icon: 'fa fa-location-dot' },
      { label: 'Experience Details', icon: 'fa fa-briefcase' },
      { label: 'Kyc Details', icon: 'fa fa-address-card' },
      { label: 'Account Details', icon: 'fa fa-money-bill' },
    ];
    this.moment = this.dateTimeProcessor.getMoment();
    this.activatedRoute.params.subscribe((params) => {
      if (params && params['id']) {
        this.employeeId = params['id'];
        this.actionType = 'update';
        this.heading = 'Update Employee';
        this.getEmployeeById().then((data) => {
          if (data) {
            console.log('Employee Data', this.employeeData);
            this.employeeForm.patchValue({
              employeeName: this.employeeData?.employeeName,
              customEmployeeId: this.employeeData?.customEmployeeId,
              careOf: this.employeeData?.careOf,
              careOfName: this.employeeData?.careOfName,
              dateOfBirth: this.moment(this.employeeData?.dateOfBirth).format(
                'MM/DD/YYYY'
              ),
              gender: this.employeeData?.gender,
              ofcBranch: this.employeeData?.ofcBranch,
              designation: this.employeeData?.designation,
              joiningDate: this.moment(this.employeeData?.joiningDate).format(
                'MM/DD/YYYY'
              ),
              primaryPhone: this.employeeData?.primaryPhone,
              emailAddress: this.employeeData?.emailAddress,
              salary: this.employeeData?.salary,
              city: this.employeeData?.city,
              currentAddress: this.employeeData?.currentAddress,
              permanentAddress: this.employeeData?.permanentAddress,
              secondaryPhone: this.employeeData?.secondaryPhone,
              accountHolderName: this.employeeData?.accountHolderName,
              bankName: this.employeeData?.bankName,
              bankBranch: this.employeeData?.bankBranch,
              accountNumber: this.employeeData?.accountNumber,
              ifscCode: this.employeeData?.ifscCode,
              panNumber: this.employeeData?.panNumber,
              aadharNumber: this.employeeData?.aadharNumber,
              prevCompanyName: this.employeeData?.prevCompanyName,
              prevEmployerContact: this.employeeData?.prevEmployerContact,
              prevEmployerName: this.employeeData?.prevEmployerName,
            });
            if (this.employeeData.panCard) {
              this.selectedFiles['panCard']['uploadedFiles'] =
                this.employeeData.panCard;
            }
            if (this.employeeData.aadharCard) {
              this.selectedFiles['aadharCard']['uploadedFiles'] =
                this.employeeData.aadharCard;
            }
            if (this.employeeData.passPhoto) {
              this.selectedFiles['passPhoto']['uploadedFiles'] =
                this.employeeData.passPhoto;
            }
            if (
              this.employeeData.otherDocuments &&
              this.employeeData.otherDocuments.length > 0
            ) {
              this.otherAttachments = [];
              this.selectedFiles['otherAttachments'] = [];
              this.employeeData.otherDocuments.forEach((statement, index) => {
                let fileData = {
                  filesData: [],
                  links: [],
                  uploadedFiles: statement['otherAttachments'],
                };
                this.selectedFiles['otherAttachments'].push(fileData);
                this.otherAttachments.push(statement);
              });
            }
            console.log(this.selectedFiles);
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
      { label: 'Employees', routerLink: '/user/employees' },
      { label: this.actionType == 'create' ? 'Create' : 'Update' },
    ];
  }

  ngOnInit() {
    this.createForm();
    this.setEmployeesList();
    // this.createPayslip();
  }

  addOtherAttachmentsRow() {
    const attachmentFormGroup = this.formBuilder.group({
      name: [''],
      otherAttachments: this.formBuilder.array([]),
    });

    this.otherAttachments.push(attachmentFormGroup);

    const fileData = { filesData: [], links: [], uploadedFiles: [] };
    this.selectedFiles.otherAttachments.push(fileData);
  }

  deleteOtherAttachmentsRow(index: number) {
    if (this.otherAttachments.length > 1) {
      this.otherAttachments.removeAt(index);

      if (
        this.selectedFiles['otherAttachments'] &&
        this.selectedFiles['otherAttachments'][index]
      ) {
        this.selectedFiles['otherAttachments'].splice(index, 1);
      }
    }
  }

  createPayslip() {
    const payslipData = {
      employeeId: 23,
      employeeName: 'Mudhiiguubba Kalyonnii',
      designation: 'Web developer',
      basicSalary: 21666,
      dateOfJoining: '04/13/2024',
      totalDays: 27,
      workedDays: 27,
      employeePan: 'WDERS3454T',
      employeeAc: '2343151353',
      employeeIfsc: 'DAGDAG45235',
      hra: 0,
      allowances: 0,
      grossEarnings: 21666,
      tds: 0,
      pf: 0,
      otherDeductions: 0,
      totalDeductions: 0,
      netPay: 21666,
      month: 'October',
      year: '2024',
    };

    this.employeesService.generatePdf(payslipData).subscribe(
      (response: any) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${payslipData.employeeId}_payslip.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error generating payslip:', error);
      }
    );
  }

  setEmployeesList() {
    this.personalFields = [
      {
        label: 'Employee Name',
        controlName: 'employeeName',
        type: 'text',
        required: true,
      },
      {
        label: 'Employee Id',
        controlName: 'customEmployeeId',
        type: 'text',
        required: true,
      },
      {
        label: 'Care Of',
        controlName: 'careOf',
        type: 'dropdown',
        options: 'careOfEntities',
        required: true,
        optionLabel: 'displayName',
        optionValue: 'name',
      },
      {
        label: 'Care Of Name',
        controlName: 'careOfName',
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
        label: 'Gender',
        controlName: 'gender',
        type: 'dropdown',
        options: 'genderEntities',
        required: true,
        optionLabel: 'displayName',
        optionValue: 'name',
      },
      {
        label: 'Office Branch',
        controlName: 'ofcBranch',
        type: 'dropdown',
        options: 'branchEntities',
        required: true,
        optionLabel: 'displayName',
        optionValue: 'id',
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
        label: 'Joining Date',
        controlName: 'joiningDate',
        type: 'calendar',
        required: true,
      },
      {
        label: 'Phone',
        controlName: 'primaryPhone',
        type: 'text',
        maxLength: 10,
        required: true,
      },
      {
        label: 'Email',
        controlName: 'emailAddress',
        type: 'email',
      },
      {
        label: 'City',
        controlName: 'city',
        type: 'text',
        required: true,
      },
      {
        label: 'Salary',
        controlName: 'salary',
        type: 'text',
        required: true,
      },
    ];

    this.addressFields = [
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
        label: 'Secondary Phone',
        controlName: 'secondaryPhone',
        type: 'text',
        maxLength: 10,
        required: false,
      },
    ];

    this.experienceFields = [
      {
        label: 'Previous Company Name',
        controlName: 'prevCompanyName',
        type: 'text',
        required: false,
      },
      {
        label: 'Previous Employer Name',
        controlName: 'prevEmployerName',
        type: 'text',
        required: false,
      },
      {
        label: 'Previous Employer Contact',
        controlName: 'prevEmployerContact',
        type: 'text',
        required: false,
        maxLength: 10,
      },
    ];
    this.kycFields = [
      {
        label: 'Employee Name',
        controlName: 'employeeName',
        type: 'text',
        required: true,
      },
      {
        label: 'Pan Number',
        controlName: 'panNumber',
        type: 'text',
        required: false,
        pattern: '[A-Z]{5}[0-9]{4}[A-Z]{1}',
        maxLength: 10,
      },
      {
        label: 'Aadhar Number',
        controlName: 'aadharNumber',
        type: 'text',
        required: false,
        pattern: '[0-9]{12}',
        maxLength: 12,
      },
      {
        label: 'Employee Photo',
        controlName: 'passPhoto',
        type: 'file',
        required: false,
        uploadFunction: 'uploadFiles',
        acceptedFileTypes: 'image/*',
      },
      {
        label: 'Pan Card',
        controlName: 'panCard',
        type: 'file',
        required: true,
        uploadFunction: 'uploadFiles',
        acceptedFileTypes: 'image/*',
      },
      {
        label: 'Aadhar Card',
        controlName: 'aadharCard',
        type: 'file',
        required: true,
        uploadFunction: 'uploadFiles',
        acceptedFileTypes: 'image/*',
      },
    ];

    this.salaryAccountFields = [
      {
        label: 'Account Holder Name',
        controlName: 'accountHolderName',
        type: 'text',
        required: false,
      },
      {
        label: 'Bank Name',
        controlName: 'bankName',
        type: 'text',
        required: false,
      },
      {
        label: 'Bank Branch',
        controlName: 'bankBranch',
        type: 'text',
        required: false,
      },
      {
        label: 'Account Number',
        controlName: 'accountNumber',
        type: 'text',
        required: false,
      },
      {
        label: 'IFSC Code',
        controlName: 'ifscCode',
        type: 'text',
        required: false,
      },
    ];
  }
  createForm() {
    this.employeeForm = this.formBuilder.group({
      employeeName: ['', Validators.compose([Validators.required])],
      customEmployeeId: ['', Validators.compose([Validators.required])],
      careOf: ['', Validators.compose([Validators.required])],
      careOfName: ['', Validators.compose([Validators.required])],
      dateOfBirth: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      ofcBranch: ['', Validators.compose([Validators.required])],
      designation: ['', Validators.compose([Validators.required])],
      joiningDate: ['', Validators.compose([Validators.required])],
      primaryPhone: ['', Validators.compose([Validators.required])],
      emailAddress: [''],
      city: ['', Validators.compose([Validators.required])],
      salary: ['', Validators.compose([Validators.required])],
      secondaryPhone: [''],
      permanentAddress: [''],
      currentAddress: [''],
      accountHolderName: [''],
      bankName: [''],
      bankBranch: [''],
      accountNumber: [''],
      ifscCode: [''],
      aadharNumber: [''],
      panNumber: [''],
      prevCompanyName: [''],
      prevEmployerName: [''],
      prevEmployerContact: [''],
      otherAttachments: this.formBuilder.array([]),
    });
  }

  onSubmit(formValues) {
    let formData: any = {
      employeeName: formValues.employeeName,
      customEmployeeId: formValues.customEmployeeId,
      careOf: formValues.careOf,
      careOfName: formValues.careOfName,
      dateOfBirth: formValues.dateOfBirth,
      gender: formValues.gender,
      ofcBranch: formValues.ofcBranch,
      ofcBranchName: this.getOfcBranchName(formValues.ofcBranch),
      designation: formValues.designation,
      designationName: this.getDesignationName(formValues.designation),
      joiningDate: formValues.joiningDate,
      panNumber: formValues.panNumber,
      aadharNumber: formValues.aadharNumber,
      currentAddress: formValues.currentAddress,
      permanentAddress: formValues.permanentAddress,
      primaryPhone: formValues.primaryPhone,
      secondaryPhone: formValues.secondaryPhone,
      emailAddress: formValues.emailAddress,
      salary: formValues.salary,
      city: formValues.city,
      prevCompanyName: formValues.prevCompanyName,
      prevEmployerName: formValues.prevEmployerName,
      prevEmployerContact: formValues.prevEmployerContact,
      accountHolderName: formValues.accountHolderName,
      bankName: formValues.bankName,
      bankBranch: formValues.bankBranch,
      ifscCode: formValues.ifscCode,
      accountNumber: formValues.accountNumber,
    };
    formData['panCard'] = [];
    if (
      this.selectedFiles['panCard'] &&
      this.selectedFiles['panCard']['links']
    ) {
      for (let i = 0; i < this.selectedFiles['panCard']['links'].length; i++) {
        formData['panCard'].push(this.selectedFiles['panCard']['links'][i]);
      }
      for (
        let i = 0;
        i < this.selectedFiles['panCard']['uploadedFiles'].length;
        i++
      ) {
        formData['panCard'].push(
          this.selectedFiles['panCard']['uploadedFiles'][i]
        );
      }
    }
    formData['aadharCard'] = [];
    if (
      this.selectedFiles['aadharCard'] &&
      this.selectedFiles['aadharCard']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['aadharCard']['links'].length;
        i++
      ) {
        formData['aadharCard'].push(
          this.selectedFiles['aadharCard']['links'][i]
        );
      }
      for (
        let i = 0;
        i < this.selectedFiles['aadharCard']['uploadedFiles'].length;
        i++
      ) {
        formData['aadharCard'].push(
          this.selectedFiles['aadharCard']['uploadedFiles'][i]
        );
      }
    }
    formData['passPhoto'] = [];
    if (
      this.selectedFiles['passPhoto'] &&
      this.selectedFiles['passPhoto']['links']
    ) {
      for (
        let i = 0;
        i < this.selectedFiles['passPhoto']['links'].length;
        i++
      ) {
        formData['passPhoto'].push(this.selectedFiles['passPhoto']['links'][i]);
      }
      for (
        let i = 0;
        i < this.selectedFiles['passPhoto']['uploadedFiles'].length;
        i++
      ) {
        formData['passPhoto'].push(
          this.selectedFiles['passPhoto']['uploadedFiles'][i]
        );
      }
    }
    for (let index = 0; index < this.otherAttachments.length; index++) {
      this.otherAttachments[index]['otherAttachments'] = [];
      if (
        this.selectedFiles['otherAttachments'][index] &&
        this.selectedFiles['otherAttachments'][index]['links']
      ) {
        for (
          let i = 0;
          i < this.selectedFiles['otherAttachments'][index]['links'].length;
          i++
        ) {
          this.otherAttachments[index]['otherAttachments'].push(
            this.selectedFiles['otherAttachments'][index]['links'][i]
          );
        }
        for (
          let i = 0;
          i <
          this.selectedFiles['otherAttachments'][index]['uploadedFiles'].length;
          i++
        ) {
          this.otherAttachments[index]['otherAttachments'].push(
            this.selectedFiles['otherAttachments'][index]['uploadedFiles'][i]
          );
        }
      }
    }
    formData['otherDocuments'] = this.otherAttachments;
    console.log(this.otherAttachments);
    console.log('formData', formData);
    if (this.actionType == 'create') {
      this.loading = true;
      this.employeesService.createEmployee(formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Employee Added Successfully');
            this.routingService.handleRoute('employees', null);
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
      this.employeesService.updateEmployee(this.employeeId, formData).subscribe(
        (data) => {
          if (data) {
            this.loading = false;
            this.toastService.showSuccess('Employee Updated Successfully');
            this.routingService.handleRoute('employees', null);
          }
        },
        (error: any) => {
          this.loading = false;
          this.toastService.showError(error);
        }
      );
    }
  }

  getOfcBranchName(branchId) {
    if (this.ofcBranchNamesList && this.ofcBranchNamesList.length > 0) {
      let branchName = this.ofcBranchNamesList.filter(
        (ofcBranch) => ofcBranch.id == branchId
      );
      return (branchName && branchName[0] && branchName[0].displayName) || '';
    }
    return '';
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
  getEmployeeById(filter = {}) {
    return new Promise((resolve, reject) => {
      this.loading = true;
      this.employeesService.getEmployeeById(this.employeeId, filter).subscribe(
        (response) => {
          this.employeeData = response;
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
  uploadFiles(fileType, acceptableTypes, index?) {
    console.log(acceptableTypes);
    let data = {
      acceptableTypes: acceptableTypes,
      files:
        index || index == 0
          ? this.selectedFiles[fileType][index]['filesData']
          : this.selectedFiles[fileType]['filesData'],
      uploadedFiles:
        index || index == 0
          ? this.selectedFiles[fileType][index]['uploadedFiles']
          : this.selectedFiles[fileType]['uploadedFiles'],
    };
    let fileUploadRef = this.dialogService.open(FileUploadComponent, {
      header: 'Select Files',
      width: '90%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      data: data,
    });
    fileUploadRef.onClose.subscribe((files: any) => {
      if (files) {
        this.saveFiles(files, fileType, index);
      }
    });
  }
  saveFiles(files, fileType, index) {
    this.loading = true;
    if (files && files.length > 0) {
      console.log(files);
      const formData = new FormData();
      for (let file of files) {
        if (file && !file['fileuploaded']) {
          formData.append('files', file);
        }
      }
      console.log(formData);
      console.log(this.employeeId);
      console.log(fileType);
      this.employeesService
        .uploadFiles(formData, this.employeeId, fileType)
        .subscribe(
          (response: any) => {
            console.log(response);
            if (response && response['links'] && response['links'].length > 0) {
              for (let i = 0; i < response['links'].length; i++) {
                index || index == 0
                  ? this.selectedFiles[fileType][index]['links'].push(
                      response['links'][i]
                    )
                  : this.selectedFiles[fileType]['links'].push(
                      response['links'][i]
                    );
              }
              for (let i = 0; i < files.length; i++) {
                files[i]['fileuploaded'] = true;
                index || index == 0
                  ? this.selectedFiles[fileType][index]['filesData'].push(
                      files[i]
                    )
                  : this.selectedFiles[fileType]['filesData'].push(files[i]);
              }
              console.log(
                'this.selectedFiles',
                this.selectedFiles[fileType],
                files
              );
              this.toastService.showSuccess('Files Uploaded Successfully');
            } else {
              this.toastService.showError({ error: 'Something went wrong' });
            }
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
            this.toastService.showError(error);
          }
        );
    }
  }

  confirmDelete(file, controlName) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Employee?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteFile(file, controlName);
      },
    });
  }
  deleteFile(fileUrl: string, fileType: string) {
    const relativePath = fileUrl.substring(fileUrl.indexOf('/documents'));

    console.log('Before Deletion:', this.selectedFiles);

    this.employeesService.deleteFile(relativePath).subscribe(
      (response: any) => {
        if (response.message === 'File deleted successfully.') {
          console.log('File deleted successfully.');

          if (this.selectedFiles[fileType]?.uploadedFiles) {
            this.selectedFiles[fileType].uploadedFiles = this.selectedFiles[
              fileType
            ].uploadedFiles.filter((f: string) => f !== fileUrl);
            console.log('After Deletion:', this.selectedFiles);
          } else {
            console.error(
              'No uploaded files found for the specified file type.'
            );
          }
          this.toastService.showSuccess('Files Deleted Successfully');
        } else {
          console.error('Error deleting file:', response.error);
          this.toastService.showError(response);
        }
      },
      (error) => {
        console.error('Error deleting file:', error);
        this.toastService.showError(
          'Failed to delete file. Please try again later.'
        );
      }
    );
  }

  getFileIcon(fileType) {
    return this.employeesService.getFileIcon(fileType);
  }
  goBack() {
    this.location.back();
  }
}