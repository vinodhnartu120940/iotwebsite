// src/app/shared/activity-events.ts

export const activityEvents = {
  Workers: [
    {
      field: 'NO of workers',
      type: 'number',
      placeholder: 'Enter number of workers',
    },
    {
      field: 'Cost per worker',
      type: 'number',
      placeholder: 'Enter cost per worker',
    },
  ],
  Machinery: [
    {
      field: 'NO of machines',
      type: 'number',
      placeholder: 'Enter number of machines',
    },
    {
      field: 'Cost per machine',
      type: 'number',
      placeholder: 'Enter cost per machine',
    },
  ],
  'Other Expenses': [
    {
      field: 'expense name',
      type: 'text',
      placeholder: 'Enter expense name',
    },
    {
      field: 'cost',
      type: 'number',
      placeholder: 'Enter cost',
    },
  ],
  Duration: [
    {
      field: 'hours',
      type: 'dropdown',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      placeholder: 'Select hours',
    },
    {
      field: 'minutes',
      type: 'dropdown',
      options: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
        57, 58, 59, 60,
      ],
      placeholder: 'Select minutes',
    },
  ],
  'Fertilizer Details': [
    {
      field: 'fertilizer name',
      type: 'text',
      placeholder: 'Enter fertilizer name',
    },
    {
      field: 'Quantity',
      type: 'number',
      placeholder: 'Enter quantity',
    },
    {
      field: 'units',
      type: 'dropdown',
      options: ['kg', 'g', 'lb', 'oz', 'liters', 'ml'],
      placeholder: 'Select unit',
    },
    {
      field: 'cost',
      type: 'number',
      placeholder: 'Enter cost',
    },
  ],
  'Spray Details': [
    {
      field: 'Spray name',
      type: 'text',
      placeholder: 'Enter spray name',
    },
    {
      field: 'Quantity',
      type: 'number',
      placeholder: 'Enter quantity',
    },
    {
      field: 'units',
      type: 'dropdown',
      options: ['ml', 'liters', 'gallons', 'oz'],
      placeholder: 'Select unit',
    },
    {
      field: 'cost',
      type: 'number',
      placeholder: 'Enter cost',
    },
  ],
  Quantity: [
    {
      field: 'Quantity',
      type: 'number',
      placeholder: 'Enter quantity',
    },
    {
      field: 'units',
      type: 'dropdown',
      options: ['kg', 'g', 'lb', 'oz'],
      placeholder: 'Select unit',
    },
  ],
  'Cost of mulch': [
    {
      field: 'cost',
      type: 'number',
      placeholder: 'Enter cost',
    },
  ],
  Attachments: {
    field: 'document attachment',
    type: 'file',
    placeholder: 'Upload document',
  },
};
