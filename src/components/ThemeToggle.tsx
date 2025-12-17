import { MaterialIcons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useThemeColors } from '@/context/themeContext';

export interface ThemeToggleButtonProps {
  theme?: 'light' | 'dark';
  showLabel?: boolean;
  className?: string;
  onPress?: () => void;
}
export const ThemeToggleButton = ({
  theme = 'light',
  showLabel = false,
  className,
  onPress,
}: ThemeToggleButtonProps) => {
  const themeColors = useThemeColors();

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`flex-row items-center justify-center px-4 py-2 rounded-lg border border-border bg-surface ${className || ''}`}
      activeOpacity={0.7}
      accessibilityRole='button'
    >
      <View className='flex-row items-center gap-2'>
        {theme === 'light' ? (
          <MaterialIcons name='wb-sunny' size={20} color={themeColors['--color-text']} />
        ) : (
          <MaterialIcons name='nightlight-round' size={20} color={themeColors['--color-text']} />
        )}
        {showLabel && <Text className='text-sm font-medium text-text'>{theme === 'light' ? 'Claro' : 'Escuro'}</Text>}
      </View>
    </TouchableOpacity>
  );
};
