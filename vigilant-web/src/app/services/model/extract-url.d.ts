export interface ExtracrUrlInput {
  url: string
}

export interface ExtractedUrlResponse {
  id: number;
  originalName: string;
  fileHash: string;
  hostId: number;
  domain: string;
  url: string;
  content: string | null;
  emails: string[];
  phones: string[];
  createdAt: string; // pode ser `Date` se for convertido
  updatedAt: string; // pode ser `Date` se for convertido
  collected: boolean;
  collectorCount: number;
  category: string;
}
