export interface Cpe {
  id?: number
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface CpeWithTotal {
  items: Cpe[]
  total: number
}