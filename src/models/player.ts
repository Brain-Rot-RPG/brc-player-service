export interface Player {
  id?: number,
  level: number,
  brainrotId: number,
  inventory: Record<number, number>,
  gold: number
}