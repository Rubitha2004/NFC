export interface CreateWorkerDto {
  employeeCode: string;
  nfcCardId: string;
  firstName: string;
  lastName: string;
  gender?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string | Date;
  joiningDate?: string | Date;
  departmentId: number;
  gradeId: number;
  remarks?: string;
}

export interface UpdateWorkerDto {
  employeeCode?: string;
  nfcCardId?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string | Date;
  joiningDate?: string | Date;
  departmentId?: number;
  gradeId?: number;
  remarks?: string;
}
