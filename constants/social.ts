import { SocialPlatformConfig } from '../types/profile';

export const PLATFORM_CONFIG: Record<string, SocialPlatformConfig> = {
  instagram: {
    icon: 'logo-instagram',
    label: 'Instagram',
    color: '#E4405F',
    gradient: ['#833AB4', '#FD1D1D', '#F77737'],
  },
  spotify: {
    icon: 'logo-spotify',
    label: 'Spotify',
    color: '#1DB954',
    gradient: ['#1DB954', '#1ed760'],
  },
  twitter: {
    icon: 'logo-twitter',
    label: 'Twitter',
    color: '#1DA1F2',
    gradient: ['#1DA1F2', '#0d8bd9'],
  },
  linkedin: {
    icon: 'logo-linkedin',
    label: 'LinkedIn',
    color: '#0077B5',
    gradient: ['#0077B5', '#005885'],
  },
}; 