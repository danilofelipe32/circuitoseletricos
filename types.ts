export interface Bulb {
  id: number;
  broken: boolean;
}

export type CircuitType = 'series' | 'parallel';