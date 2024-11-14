import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DateTimeProcessorService } from 'src/app/services/date-time-processor.service';
import { ServiceMeta } from 'src/app/services/service-meta';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  moment: any;
  private url = 'https://s3.thefintalk.in/offerletterformat/index.html';

  constructor(
    private serviceMeta: ServiceMeta,
    private http: HttpClient,
    private dateTimeProcessor: DateTimeProcessorService
  ) {
    this.moment = this.dateTimeProcessor.getMoment();
  }

  getOfferLetterContent() {
    const url = 'https://s3.thefintalk.in/offerletterformat/index.html';
    return this.serviceMeta.httpGet(url, null);
  }

  getOfferLetterTemplateHtml(
    templateName: string,
    data: any
  ): Promise<string | boolean> {
    return new Promise((resolve, reject) => {
      const url = 'https://s3.thefintalk.in/offerletterformat/index.html';
      this.serviceMeta.httpGetText(url).subscribe(
        (htmlContent: any) => {
          console.log(htmlContent);
          let renderedTemplateData = this.renderTemplate(htmlContent, data);
          resolve(renderedTemplateData);
        },
        (error) => {
          console.error('Failed to fetch HTML:', error);
          resolve(false);
        }
      );
    });
  }

  renderTemplate(htmlString: string, data: any): string {
    const processedHtml = htmlString.replace(/{{(.*?)}}/g, (match, key) => {
      const value = data[key.trim()];
      return value !== undefined && value !== null ? value : '';
    });
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = processedHtml;
    const elements = tempDiv.querySelectorAll('[data-key]');
    elements.forEach((element) => {
      const key = element.getAttribute('data-key');
      if (key && data[key] === undefined) {
        element.remove();
      }
    });

    return tempDiv.innerHTML;
  }

  //NODE MAILER

  sendTerminationmail(data) {
    const url = 'mail/terminationmail';
    return this.serviceMeta.httpPost(url, data);
  }

  //employee
  createEmployee(data) {
    const url = 'employees';
    return this.serviceMeta.httpPost(url, data);
  }

  createEmployeeFromInterview(data) {
    const url = 'employees/interviewtoemployee';
    return this.serviceMeta.httpPost(url, data);
  }

  updateEmployee(employeeId, data) {
    const url = 'employees/' + employeeId;
    return this.serviceMeta.httpPut(url, data);
  }
  getEmployees(filter = {}) {
    const url = 'employees';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  changeEmployeeStatus(employeeId, statusId) {
    const url = `employees/${employeeId}/changestatus/${statusId}`;
    return this.serviceMeta.httpPut(url, null);
  }
  getEmployeeById(employeeId, filter = {}) {
    const url = 'employees/' + employeeId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  deleteEmployee(employeeId, filter = {}) {
    const url = 'employees/' + employeeId;
    return this.serviceMeta.httpDelete(url, null, filter);
  }
  getEmployeesCount(filter = {}) {
    const url = 'employees/total';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  //HOLIDAYS
  createHoliday(data) {
    const url = 'holidays';
    return this.serviceMeta.httpPost(url, data);
  }

  updateHoliday(employeeId, data) {
    const url = 'holidays/' + employeeId;
    return this.serviceMeta.httpPut(url, data);
  }
  getHolidays(filter = {}) {
    const url = 'holidays';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getHolidayById(employeeId, filter = {}) {
    const url = 'holidays/' + employeeId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  deleteHoliday(employeeId, filter = {}) {
    const url = 'holidays/' + employeeId;
    return this.serviceMeta.httpDelete(url, null, filter);
  }
  getHolidaysCount(filter = {}) {
    const url = 'holidays/total';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  //USERS
  createUser(data) {
    const url = 'users';
    return this.serviceMeta.httpPost(url, data);
  }

  updateUser(userId, data) {
    const url = 'users/' + userId;
    return this.serviceMeta.httpPut(url, data);
  }
  getUsers(filter = {}) {
    const url = 'users';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getUserById(userId, filter = {}) {
    const url = 'users/' + userId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  deleteUser(userId, filter = {}) {
    const url = 'users/' + userId;
    return this.serviceMeta.httpDelete(url, null, filter);
  }
  getUsersCount(filter = {}) {
    const url = 'users/total';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  //REPORTS

  exportEmployees(filter = {}) {
    const url = 'reports/employees';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  exportInterviews(filter = {}) {
    const url = 'reports/interviews';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  exportSalarySheet(filter = {}) {
    const url = 'reports/salarysheet';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  exportLeaves(filter = {}) {
    const url = 'reports/leaves';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  exportHolidays(filter = {}) {
    const url = 'reports/holidays';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  exportAttendance(filter = {}) {
    const url = 'reports/attendance';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getReports(filter = {}) {
    const url = 'reports/reportsdata';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getReportsCount(filter = {}) {
    const url = 'reports/reportsCount';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  deleteReport(reportId, filter = {}) {
    const url = 'reports/' + reportId;
    return this.serviceMeta.httpDelete(url, null, filter);
  }

  //PAYROLL
  createPayroll(data) {
    const url = 'payroll';
    return this.serviceMeta.httpPost(url, data);
  }

  updatePayroll(payslipId, data) {
    const url = 'payroll/' + payslipId;
    return this.serviceMeta.httpPut(url, data);
  }
  getPayroll(filter = {}) {
    const url = 'payroll';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getPayrollById(payslipId, filter = {}) {
    const url = 'payroll/' + payslipId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  deletePayroll(payslipId, filter = {}) {
    const url = 'payroll/' + payslipId;
    return this.serviceMeta.httpDelete(url, null, filter);
  }
  getPayrollCount(filter = {}) {
    const url = 'payroll/total';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  //Interviews
  createInterview(data) {
    const url = 'interviews';
    return this.serviceMeta.httpPost(url, data);
  }

  updateInterview(interviewId, data) {
    const url = 'interviews/' + interviewId;
    return this.serviceMeta.httpPut(url, data);
  }
  getInterviews(filter = {}) {
    const url = 'interviews';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  changeInterviewStatus(interviewId, statusId) {
    const url = `interviews/${interviewId}/changestatus/${statusId}`;
    return this.serviceMeta.httpPut(url, null);
  }
  getInterviewById(interviewId, filter = {}) {
    const url = 'interviews/' + interviewId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  deleteInterview(interviewId, filter = {}) {
    const url = 'interviews/' + interviewId;
    return this.serviceMeta.httpDelete(url, null, filter);
  }
  getInterviewCount(filter = {}) {
    const url = 'interviews/total';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  //Leaves
  createLeave(data) {
    const url = 'leaves';
    return this.serviceMeta.httpPost(url, data);
  }

  updateLeave(leaveId, data) {
    const url = 'leaves/' + leaveId;
    return this.serviceMeta.httpPut(url, data);
  }
  getLeaves(filter = {}) {
    const url = 'leaves';
    return this.serviceMeta.httpGet(url, null, filter);
  }
  changeLeaveStatus(leaveId, statusId) {
    const url = `leaves/${leaveId}/changestatus/${statusId}`;
    return this.serviceMeta.httpPut(url, null);
  }
  getLeaveById(leaveId, filter = {}) {
    const url = 'leaves/' + leaveId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  deleteLeave(leaveId, filter = {}) {
    const url = 'leaves/' + leaveId;
    return this.serviceMeta.httpDelete(url, null, filter);
  }
  getLeavesCount(filter = {}) {
    const url = 'leaves/total';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  //ATTENDANCE
  createAttendance(data) {
    const url = 'attendance';
    return this.serviceMeta.httpPost(url, data);
  }

  updateAttendance(attendanceId, data) {
    const url = 'attendance/' + attendanceId;
    return this.serviceMeta.httpPut(url, data);
  }
  getAttendance(filter = {}) {
    const url = 'attendance';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  getAttendanceById(attendanceId, filter = {}) {
    const url = 'attendance/' + attendanceId;
    return this.serviceMeta.httpGet(url, null, filter);
  }
  deleteAttendance(attendanceId, filter = {}) {
    const url = 'attendance/' + attendanceId;
    return this.serviceMeta.httpDelete(url, null, filter);
  }
  getAttendanceCount(filter = {}) {
    const url = 'attendance/total';
    return this.serviceMeta.httpGet(url, null, filter);
  }

  generatePdf(data) {
    const url = 'pdfGenerator/payslip';
    return this.serviceMeta.httpPost(url, data);
  }

  uploadFiles(data: FormData, employeeId, type = 'default') {
    console.log(FormData);
    console.log(data);
    const url = `https://hrfiles.thefintalk.in/hrfiles?type=${type}&employeeId=${employeeId}`;
    console.log(url);
    return this.serviceMeta.httpPost(url, data);
  }

  deleteFile(filePath: string) {
    console.log(filePath);
    const url = `https://hrfiles.thefintalk.in/hrfiles?file_path=${encodeURIComponent(
      filePath
    )}`;
    console.log(url);
    return this.serviceMeta.httpDelete(url);
  }
  getFileIcon(fileType: string): string {
    const fileTypeLowerCase = fileType.toLowerCase();
    const iconMap: { [key: string]: string } = {
      jpg: 'fa fa-file-image',
      jpeg: 'fa fa-file-image',
      png: 'fa fa-file-image',
      gif: 'fa fa-file-image',
      bmp: 'fa fa-file-image',
      svg: 'fa fa-file-image',
      pdf: 'fa fa-file-pdf',
      doc: 'fa fa-file-word',
      docx: 'fa fa-file-word',
      xls: 'fa fa-file-excel',
      xlsx: 'fa fa-file-excel',
      ppt: 'fa fa-file-powerpoint',
      pptx: 'fa fa-file-powerpoint',
      odt: 'fa fa-file-alt',
      ods: 'fa fa-file-alt',
      odp: 'fa fa-file-alt',
      txt: 'fa fa-file-alt',
      rtf: 'fa fa-file-alt',
      // Audio Files
      mp3: 'fa fa-file-audio',
      wav: 'fa fa-file-audio',
      ogg: 'fa fa-file-audio',
      aac: 'fa fa-file-audio',
      flac: 'fa fa-file-audio',
      m4a: 'fa fa-file-audio',
      // Video Files
      mp4: 'fa fa-file-video',
      avi: 'fa fa-file-video',
      mov: 'fa fa-file-video',
      wmv: 'fa fa-file-video',
      flv: 'fa fa-file-video',
      webm: 'fa fa-file-video',
      // Archive Files
      zip: 'fa fa-file-archive',
      rar: 'fa fa-file-archive',
      '7z': 'fa fa-file-archive',
      tar: 'fa fa-file-archive',
      gz: 'fa fa-file-archive',
      gzip: 'fa fa-file-archive',

      // Miscellaneous Files
      csv: 'fa fa-file-csv',
      xml: 'fa fa-file-code',
      json: 'fa fa-file-code',
      html: 'fa fa-file-code',
      htm: 'fa fa-file-code',
      md: 'fa fa-file-alt',
      ini: 'fa fa-file-alt',
      cfg: 'fa fa-file-alt',
      config: 'fa fa-file-alt',
    };
    const icon = iconMap[fileTypeLowerCase];
    return icon ? icon : 'fa fa-file';
  }
  setFiltersFromPrimeTable(event) {
    let api_filter = {};
    if ((event && event.first) || (event && event.first == 0)) {
      api_filter['from'] = event.first;
    }
    if (event && event.rows) {
      api_filter['count'] = event.rows;
    }
    if (event && event.filters) {
      let filters = event.filters;
      Object.entries(filters).forEach(([key, value]) => {
        if (filters[key]['value'] != null) {
          let filterSuffix = '';
          if (filters[key]['matchMode'] == 'startsWith') {
            filterSuffix = 'startWith';
          } else if (filters[key]['matchMode'] == 'contains') {
            filterSuffix = 'like';
          } else if (filters[key]['matchMode'] == 'endsWith') {
            filterSuffix = 'endWith';
          } else if (filters[key]['matchMode'] == 'equals') {
            filterSuffix = 'eq';
          } else if (filters[key]['matchMode'] == 'notEquals') {
            filterSuffix = 'neq';
          } else if (filters[key]['matchMode'] == 'dateIs') {
            filterSuffix = 'eq';
            let dateValue = new Date(filters[key]['value']);
            filters[key]['value'] =
              this.dateTimeProcessor.getStringFromDate_YYYYMMDD(dateValue);
            filters[key]['value'] = this.moment(dateValue).format('YYYY-MM-DD');
          } else if (filters[key]['matchMode'] == 'dateIsNot') {
            filterSuffix = 'neq';
            let dateValue = new Date(filters[key]['value']);
            filters[key]['value'] =
              this.dateTimeProcessor.getStringFromDate_YYYYMMDD(dateValue);
            filters[key]['value'] = this.moment(dateValue).format('YYYY-MM-DD');
          }
          if (filterSuffix != '') {
            api_filter[key + '-' + filterSuffix] = filters[key]['value'];
          }
        }
      });
    }
    if (event && event.sortField) {
      let filterValue;
      if (event.sortOrder && event.sortOrder == 1) {
        filterValue = 'asc';
      } else if (event.sortOrder && event.sortOrder == -1) {
        filterValue = 'desc';
      }
      if (filterValue) {
        api_filter['sort'] = event.sortField + `,${filterValue}`;
      }
    }
    return api_filter;
  }
}
