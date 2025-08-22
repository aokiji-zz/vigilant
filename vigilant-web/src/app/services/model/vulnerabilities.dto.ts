export interface Vulnerability {
  id: number
  title: string
  description: string | null
  cve: string | null
  references: string[]
  createdAt: Date
  updatedAt: Date | null
  publishedTime: Date | null
  cvss: string | null
  rankingEpss: string | null
  kev: boolean | null
}
export interface VulnerabilityWithTotal {
  items: Vulnerability[]
  total: number
}