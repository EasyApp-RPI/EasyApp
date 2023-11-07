export interface UserInfo {
  [key: string]: string;
  firstName: string;
  phoneNumber: string;
}

export interface FieldInfo {
  inputLabel: string,
  name: string,
  id: string,
  placeholder: string,
  type: string | null,
  header: string,
}

export interface FilePaths {
  resumePath: string,
  transcriptPath: string,
  coverLetterPath: string,
}

export interface JobInfo {
  position: string,
  company: string,
  location: string,
  startDate: string,
  endDate: string,
  description: string,
}

export interface inputElements {
  label: HTMLLabelElement,
  inputs: Array<HTMLInputElement>,
  type: string | null,
  header: string,
}