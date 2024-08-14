export type ImageFindIdea = {
  image_url: string;
  workspaceId: number | undefined;
  prompt: string;
  certainty: number;
  seed: number;
  numInferenceSteps: number;
  guidanceScale: number;
  negativePrompt: string;
};

export type PromptSuggest = {
  positivePrompts: string[];
  negativePrompt: string;
};

export type ImageRespone = ImageFindIdea[];
