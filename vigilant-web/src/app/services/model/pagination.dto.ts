export interface PaginationDto {
  take: number;
  skip: number;
  cve?: string; // Optional field for filtering by CVE
  name?: string; // Optional field for filtering by CPE name
}