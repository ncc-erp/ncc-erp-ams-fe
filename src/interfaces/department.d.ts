export interface IDepartment {
  id: number;
  name: string;
}

export interface IDepartmentRequest {
  id: number;
  name: string;
  company: string;
  manager: string;
  location: string;
  image: string;
  users_count: number;
  messages: string;
  status: string;
}

export interface IDepartmentResponse {
  id: number;
  name: string;
  company: {
    id: number;
    name: string;
  };
  manager: {
    id: number;
    name: string;
  };
  location: {
    id: number;
    name: string;
  };
  image: string;
  users_count: number;
}
