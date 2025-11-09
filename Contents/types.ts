
export interface ChapterInfo {
  title: string;
  startPage: number;
  endPage: number;
}

export interface SplitPdfFile {
  fileName: string;
  data: Uint8Array;
}
