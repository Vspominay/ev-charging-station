import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'sidebar.management',
    isTitle: true
  },
  {
    label: 'sidebar.depots',
    link: 'depots/list',
    icon: 'emoji_transportation',
  },
  {
    label: 'sidebar.dashboard',
    link: 'dashboard',
    icon: 'dashboard',
  },
  {
    label: 'sidebar.statistics',
    icon: 'query_stats',
    link: 'dashboard/stats',
  },
  {
    label: 'sidebar.depot-config',
    link: 'configuration',
    icon: 'manufacturing'
  },
  {
    label: 'sidebar.users',
    link: 'users',
    icon: 'group',
  },
  {
    label: 'sidebar.ocpp-tags',
    link: 'ocpp-tags',
    icon: 'sell',
  },
  {
    label: 'sidebar.reservations',
    link: 'reservations',
    icon: 'today'
  }
];

export const DEPOT_SCOPED_LINKS: Set<string> = new Set([
  'dashboard',
  'dashboard/stats',
  'configuration',
  'users',
  'ocpp-tags',
  'reservations'
]);
