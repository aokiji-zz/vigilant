export interface CrawlerByUpload {
  folderName: string;
  formData: FormData
}

interface ExtractedFileResult {
  original_name: string;
  file_hash: string;
  emails: string[];
  tels_br: string[];
  size: number;
  url: string;
}

export interface ExtractResponse {
  message: string;
  results: ExtractedFileResult[];
}

export interface CrawlerByUrl {
  url: string
}