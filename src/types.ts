
export enum ModelType {
  NANO_BANANA_PRO = "gemini-3-pro-image-preview",
  NANO_BANANA_2 = "gemini-3.1-flash-image-preview",
  NANO_BANANA_NORMAL = "gemini-2.5-flash-image",
}

export type MockupArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GenerateConfig = {
  model: ModelType;
  quality: "512px" | "1K" | "2K" | "4K";
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
};
