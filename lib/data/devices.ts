// Static data - kept as-is since devices/apps don't change frequently
export interface Device {
  name: string;
  icon: string;
  category: string;
}

export interface App {
  name: string;
  platforms: string[];
  description: string;
}

export const DEVICES: Device[] = [
  { name: 'Smart TV', icon: 'Tv', category: 'Television' },
  { name: 'Fire TV Stick', icon: 'Flame', category: 'Streaming' },
  { name: 'Android', icon: 'Smartphone', category: 'Mobile' },
  { name: 'iPhone/iPad', icon: 'Apple', category: 'Mobile' },
  { name: 'MAG Box', icon: 'Box', category: 'Set-top Box' },
  { name: 'PC/Mac', icon: 'Monitor', category: 'Computer' },
  { name: 'Kodi', icon: 'PlayCircle', category: 'Media Center' },
  { name: 'Android Box', icon: 'Box', category: 'Set-top Box' },
];

export const APPS: App[] = [
  {
    name: 'Smarters Pro',
    platforms: ['Android', 'iOS', 'Smart TV', 'Fire TV'],
    description: 'Application IPTV la plus populaire avec interface moderne et EPG complet.',
  },
  {
    name: 'TiviMate',
    platforms: ['Android TV', 'Fire TV'],
    description: 'Meilleure application pour Android TV et Firestick avec catch-up TV.',
  },
  {
    name: 'GSE Smart IPTV',
    platforms: ['iOS', 'Android'],
    description: 'Application légère et performante pour iPhone, iPad et Android.',
  },
  {
    name: 'SS IPTV',
    platforms: ['Samsung Smart TV', 'LG Smart TV'],
    description: 'Application native pour Smart TV Samsung et LG.',
  },
  {
    name: 'Flix IPTV',
    platforms: ['Samsung Smart TV', 'LG Smart TV'],
    description: 'Interface moderne avec support EPG avancé.',
  },
  {
    name: 'Smart One IPTV',
    platforms: ['Samsung Smart TV', 'LG Smart TV'],
    description: 'Application polyvalente avec catch-up TV.',
  },
  {
    name: 'VLC',
    platforms: ['PC', 'Mac', 'Android', 'iOS'],
    description: 'Lecteur multimédia universel compatible M3U.',
  },
  {
    name: 'Xtream Pro',
    platforms: ['Android', 'iOS', 'Smart TV'],
    description: 'Application officielle Xtream Codes avec interface intuitive.',
  },
];

export function getAllDevices(): Device[] {
  return DEVICES;
}

export function getAllApps(): App[] {
  return APPS;
}

export function getAppsByPlatform(platform: string): App[] {
  return APPS.filter((app) => app.platforms.includes(platform));
}
