// components/GuardedDrawerItem.tsx
import { useThemeColors } from '@/context/themeContext';
import type { DrawerItem } from '@/services/models/types/navigation';
import { Ionicons } from '@expo/vector-icons';
import React, { memo, use } from 'react';
import { Text, TouchableOpacity } from 'react-native';

type Props = {
  item: DrawerItem;
  isActive: boolean;
  isDark: boolean;
  canView: boolean;
  onPress: () => void;
};

const GuardedDrawerItem = ({ item, isActive, isDark, canView, onPress }: Props) => {
  const themeColors = useThemeColors();
  if (!canView) return null;

  return (
    <TouchableOpacity
      className={`flex-row items-center px-5 py-3 border-b border-border ${isActive ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isActive ? item.activeIcon : item.icon}
        size={20}
        color={isActive ? themeColors['--color-primary'] : isDark ? 'white' : 'black'}
        style={{ marginRight: 20 }}
      />
      <Text className={`text-[14px] flex-1 ${isActive ? 'text-primary font-medium' : 'text-text'}`}>{item.name}</Text>
    </TouchableOpacity>
  );
};

export default memo(GuardedDrawerItem);