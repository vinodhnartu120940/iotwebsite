export const soilTypes: string[] = [
  'Clay',
  'Silt',
  'Peat',
  'Chalk',
  'Loam'
];

export const cropTypes: string[] = [
  'Wheat',
  'Rice',
  'Corn'
]


type Thresholds = {
  temperature: number[];
  humidity: number[];
  moisture: number[];
  nitrogen: number[];
  phosphorus: number[];
  potassium: number[];
};


export const thresholds: Thresholds = {
  temperature: [18, 24, 30],
  humidity: [60, 70, 80],
  moisture: [25, 50, 75],
  nitrogen: [10, 20, 30],
  phosphorus: [5, 10, 15],
  potassium: [10, 20, 30],
};