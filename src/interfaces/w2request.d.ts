export interface IW2Request {
  id: string;
  type: string;
  userRequestName: string;
  createdAt: string;
  lastExecutedAt: string;
  status: string;
}

export interface ITaskResult {
  input: IInputRequest;
  tasks: ITask;
  emailTo: Array<string>;
}

export interface IInputRequest {
  Request: Record<string, Record<string, string> | string>;
  RequestUser: IRequestUser;
}

export interface ITask {
  name: string;
  email: string;
  emailTo: string[];
  reason?: string;
  status: string;
  workflowInstanceId: string;
  dynamicActionData?: string;
  creationTime: string;
  id: string;
  otherActionSignals?: IOtherActionSignals[];
  description?: string;
  authorName?: string;
  updatedBy?: string;
}

export interface IRequestUser {
  email: string;
  name: string;
  branchName: string;
}
