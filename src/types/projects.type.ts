import { SavedFloorPlan } from '@/app/(main-app)/blueprint/blueprint3D/model/floorplanModel';
import { QUEUESTATUS } from './workspace.type';

interface GenerateHistory {
  id: string;
  workspaceId: number;
  status: QUEUESTATUS; // assuming possible statuses

  url: string | undefined;
  prompt: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  creatorId: number;
  name: string;
  data?: SavedFloorPlan;
  createdAt: string;
  updatedAt: string;
  generateHistories: GenerateHistory[];
}

export interface ProjectInfo {
  id: number;
  name: string;
  createdAt: string;
  updateAt: string;
  image: string | null;
}

export interface HistoryImg {
  id: string;
  url: string;
  updateAt: string;
}
