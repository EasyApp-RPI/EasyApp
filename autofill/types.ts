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
}

export interface FilePaths {
  resumePath: string,
  transcriptPath: string,
  coverLetterPath: string,
}

