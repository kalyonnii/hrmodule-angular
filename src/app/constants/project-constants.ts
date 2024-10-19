export const projectConstantsLocal = {
  EMPLOYEE_STATUS: [
    { id: 0, name: 'all', displayName: 'All Employees' },
    { id: 1, name: 'Active', displayName: 'Active Employees' },
    { id: 2, name: 'In Active', displayName: 'In Active Employees' },
  ],
  BRANCH_ENTITIES: [
    { id: 1, displayName: 'Panjagutta', name: 'panjagutta' },
    { id: 2, displayName: 'Begumpet', name: 'begumpet' },
  ],
  CARE_OF_ENTITIES: [
    { displayName: 'Father', name: 'father' },
    { displayName: 'Spouse', name: 'spouse' },
  ],
  GENDER_ENTITIES: [
    { displayName: 'Female', name: 'female' },
    { displayName: 'Male', name: 'male' },
  ],
  DEPARTMENT_ENTITIES: [
    { id: 1, displayName: 'Telesales', name: 'telesales' },
    { id: 2, displayName: 'Operations Team', name: 'operationsteam' },
    { id: 3, displayName: 'HR Team', name: 'hrteam' },
    { id: 4, displayName: 'Office Team', name: 'ofcteam' },
    { id: 5, displayName: 'Support Team', name: 'supportteam' },
  ],

  DESIGNATION_ENTITIES: [
    { id: 1, displayName: 'Super Admin', name: 'superAdmin' },
    { id: 2, displayName: 'Admin', name: 'admin' },
    { id: 3, displayName: 'HR Admin', name: 'hrAdmin' },
  ],
  ATTENDED_INTERVIEW_ENTITIES: [
    { id: 1, displayName: 'Yes', name: 'yes' },
    { id: 2, displayName: 'No', name: 'no' },
    { id: 3, displayName: 'Not Responding', name: 'notresponding' },
    { id: 4, displayName: 'Postponed', name: 'postponed' },
  ],
  INTERVIEW_STATUS_ENTITIES: [
    { id: 1, displayName: 'Selected', name: 'selected' },
    { id: 2, displayName: 'Not Selected', name: 'notSelected' },
    { id: 3, displayName: 'Status Not Updated', name: 'statusNotUpdated' },
  ],
  INTERVIEW_STATUS: [
    { id: 0, name: 'all', displayName: 'All Interviews' },
    { id: 1, name: 'new', displayName: 'New Interviews' },
    { id: 2, name: 'archived', displayName: 'Archived Interviews' },
  ],

  ATTENDANCE_OPTIONS: [
    { label: 'Present', value: 'Present' },
    { label: 'Absent', value: 'Absent' },
    { label: 'Half-day', value: 'Half-day' },
  ],
  BASE_URL: 'http://localhost:5001/',
  VERSION_DESKTOP: '0.0.0',
};
