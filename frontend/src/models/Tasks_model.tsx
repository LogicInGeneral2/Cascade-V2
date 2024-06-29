export interface Student {
  id: number;
  status: string;
  username: string;
  email: string;
  avatar: string;
  last_name: string;
  first_name: string;
}

export interface SubTask {
  id: number;
  completed: boolean | undefined;
  title: string;
  description: string;
  file_upload?: string;
  file_name?: string;
}

export interface Task {
  class_id: string;
  task_id: string;
  name: string;
  avatar: string;
  description: string;
  start_date: Date;
  due_date: Date;
  file_upload?: string;
  subtasks: SubTask[];
}

export interface Graded {
  length: number;
  id: number;
  submission_name: string;
  submission_date: Date;
  submission_start_date: Date;
  submission_due_date: Date;
  student: Student;
  graded_date: Date;
  remarks: string;
  ratings: number;
  task_id: string;
}

export interface Submission {
  id: number;
  task_id: string;
  student: Student;
  name: string;
  submission_date: Date;
  start_date: Date;
  due_date: Date;
  file_upload?: string;
  file_name?: string;
  answer?: string;
}

export interface classes {
  id: string;
  subject: string;
  avatar: string;
  code: string;
  start_date: Date;
  student_count: number;
}

export interface StatsTaskProps {
  upcoming: number;
  ongoing: number;
  completed: number;
  graded: number;
  students: number;
}
