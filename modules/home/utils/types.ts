export interface WellnessOption {
  label: string;
  color: string;
  textColor: string;
}

export interface WellnessOptions {
  flow: WellnessOption[];
  feelings: WellnessOption[];
  sleep: WellnessOption[];
  pain: WellnessOption[];
  energy: WellnessOption[];
}

export interface SelectedDate {
  day: number;
  month: number;
  year: number;
  key: string;
}

export interface WellnessData {
  [key: string]: {
    [category: string]: WellnessOption;
  };
}

export type WellnessCategory = 'flow' | 'feelings' | 'sleep' | 'pain' | 'energy';