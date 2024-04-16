import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'sidebar.management',
    isTitle: true
  },
  {
    id: 2,
    label: 'sidebar.depots',
    icon: 'emoji_transportation',
  },
  {
    id: 3,
    label: 'sidebar.dashboard',
    icon: 'dashboard',
  },
  {
    id: 4,
    label: 'sidebar.statistics',
    isTitle: true
  },
  {
    id: 5,
    label: 'sidebar.reports',
    icon: 'summarize',
  },
  {
    id: 6,
    label: 'sidebar.charts',
    icon: 'query_stats',
  },
];
