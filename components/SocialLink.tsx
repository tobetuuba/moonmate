import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacings';

interface SocialLinkProps {
  platform: 'instagram' | 'spotify' | 'twitter' | 'linkedin';
  username?: string;
  onPress?: () => void;
  isConnected?: boolean;
}

const PLATFORM_CONFIG = {
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

export default function SocialLink({
  platform,
  username,
  onPress,
  isConnected = false,
}: SocialLinkProps) {
  const config = PLATFORM_CONFIG[platform];

  if (!isConnected) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
          <Ionicons name={config.icon as any} size={20} color={config.color} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.label}>{config.label}</Text>
          {username && (
            <Text style={styles.username}>@{username}</Text>
          )}
        </View>
        
        <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: spacing.card.borderRadius,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: typography.weights.semibold,
  },
  username: {
    ...typography.styles.bodySmall,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
}); 