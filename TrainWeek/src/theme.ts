export const C = {
  bg: '#0B0D11',
  card: '#151A21',
  card2: '#1C222B',
  line: '#252C36',
  ink: '#F2F5F7',
  muted: '#8A97A5',
  faint: '#5A6673',
  green: '#1EE6A8',
  blue: '#4AA8FF',
  red: '#FF4E5E',
  amber: '#FFB84A',
  purple: '#B48CFF',
  track: '#232A33',
};

export const TAG_COLORS: Record<string, { bg: string; ink: string }> = {
  hipext: { bg: '#12312A', ink: '#1EE6A8' },
  joints: { bg: '#14283C', ink: '#4AA8FF' },
  fascia: { bg: '#2A2140', ink: '#B48CFF' },
  optional: { bg: '#232A33', ink: '#8A97A5' },
  physio: { bg: '#38290F', ink: '#FFB84A' },
};

export const TAG_LABELS: Record<string, string> = {
  hipext: 'HIP EXT',
  joints: 'JOINTS',
  fascia: 'FASCIA',
  optional: 'OPTIONAL',
  physio: 'PHYSIO',
};
