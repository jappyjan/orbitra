import { Circle } from '@/models/Circle';

export const DEFAULT_CIRCLES: Circle[] = [
  { id: 'circle-family', name: 'Family', color: '#E74C3C', isDefault: true },
  { id: 'circle-friends', name: 'Friends', color: '#3498DB', isDefault: true },
  { id: 'circle-work', name: 'Work', color: '#2ECC71', isDefault: true },
  { id: 'circle-community', name: 'Community', color: '#9B59B6', isDefault: true },
  { id: 'circle-other', name: 'Other', color: '#95A5A6', isDefault: true },
];

export const OTHER_CIRCLE_ID = 'circle-other';
