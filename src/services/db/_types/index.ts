export type FileRecord = {
  id?: string;
  title: string;
  description: string;
  category: string;
  language: string;
  provider: string;
  roles: UserRole[];
  s3key: string;
  created_at: Date;
  updated_at: Date;
};

export enum UserRole {
  Admin = 'admin',
  Editor = 'editor',
  Viewer = 'viewer',
}

export type Database = {
  files: FileRecord;
};

export enum DatabaseTablesEnum {
  Files = 'files',
}
