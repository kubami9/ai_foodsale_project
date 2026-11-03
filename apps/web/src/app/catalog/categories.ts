import type { Category } from '@foodsale/contracts';
export const categoryDetails: Record<Category, { label: string; icon: string; color: string }> = {
  dairy: { label: 'Nabiał i sery', icon: '🧀', color: '#eee4c5' },
  bakery: { label: 'Pieczywo', icon: '🍞', color: '#eddbc5' },
  produce: { label: 'Warzywa i owoce', icon: '🥕', color: '#dce4ce' },
  pantry: { label: 'Spiżarnia', icon: '🫙', color: '#eacfc6' },
  meals: { label: 'Gotowe dania', icon: '🥟', color: '#e8ddcd' },
};
export const categories = Object.entries(categoryDetails).map(([id, details]) => ({
  id,
  ...details,
}));
