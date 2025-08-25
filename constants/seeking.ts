export const SEEKING_OPTIONS = [
  { label: 'Women', value: 'woman' },
  { label: 'Men', value: 'man' },
  { label: 'Non-binary', value: 'nonbinary' },
  { label: 'Everyone', value: 'everyone' },
] as const;

export type SeekingValue = typeof SEEKING_OPTIONS[number]['value'];
