
export interface ImageFile {
  base64: string;
  mimeType: string;
  previewUrl: string;
}

export enum AspectRatio {
  SQUARE = "1:1",
  LANDSCAPE = "16:9",
  PORTRAIT = "9:16",
  PHOTO = "4:3",
  INSTA = "3:4"
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  resultUrl: string | null;
  resultMimeType: string | null;
}
