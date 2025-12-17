import { Platform, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import clsx from 'clsx';
import { useThemeColors } from '@/context/themeContext';

type SearchBarProps = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  className?: string;
};

const SearchBar = ({ placeholder = 'Buscar...', value, onChangeText, className }: SearchBarProps) => {
  const isIOS = Platform.OS === 'ios';

  const themeColors = useThemeColors();
  return (
    <View
      className={clsx(
        `flex-row items-center gap-2 bg-card-secondary px-4 border border-border rounded-xl  ${className || ''}`,
        isIOS && 'py-4'
      )}
    >
      <Text className='text-text'>
        <MaterialIcons name='search' size={20} />
      </Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={`${themeColors['--color-text']}`}
        value={value}
        onChangeText={onChangeText}
        className='flex-1 text-bandw'
      />
    </View>
  );
};

export default SearchBar;
