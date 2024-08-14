export interface WorkspaceType {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  creatorId: number;
}
export type QUEUESTATUS =
  | 'PENDING'
  | 'COMPLETE'
  | 'FAILED'
  | 'PROMPT_NOT_INTERIOR'
  | 'IMAGE_NOT_INTERIOR'
  | 'QUEUE';

export interface TaskQueueImage {
  id: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  prompt?: string;
  url?: string;
  status: QUEUESTATUS;
}
