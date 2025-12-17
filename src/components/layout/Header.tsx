import { useThemeMode } from '@/context/themeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { RelativePathString, router, useNavigation } from 'expo-router';
import { ActivityIndicator, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LogoTitle from './Logo';
import { useApi } from '@/hooks/useApi';

interface HeaderProps {
  title: string;
  subtitle: string;
  headerRight: 'logo' | 'logoutButton';
  sidebarButton?: boolean;
  backTo?: RelativePathString;
}

const Header = ({ title, subtitle, headerRight, sidebarButton, backTo }: HeaderProps) => {
  const { resolvedMode } = useThemeMode();
  const { logout, isLoggingOut } = useApi();
  const navigation = useNavigation();
  const isDark = resolvedMode === 'dark';
  const handleBack = () => {
    if (sidebarButton) {
      navigation.dispatch(DrawerActions.toggleDrawer());
      return;
    }

    if (backTo) {
      router.push(backTo);
    } else {
      router.back();
    }
  };

  const insets = useSafeAreaInsets();
  return (
    <View>
      <View style={{ paddingTop: insets.top + 14 }} className={`px-4 pb-4  border-b bg-card-secondary border-border`}>
        <View className='flex-row items-center justify-between'>
          <View className='flex-row items-center flex-1 gap-6'>
            <Pressable
              className='p-2 border rounded-full bg-background border-border'
              onPress={() => {
                handleBack();
              }}
            >
              <MaterialIcons name={sidebarButton ? 'menu' : 'arrow-back'} size={20} color={isDark ? '#AAA' : '#666'} />
            </Pressable>
            <View className='w-full'>
              <Text className='text-xl font-bold text-text'>{title}</Text>
              <Text className='text-sm text-text-muted max-w-[80%]' numberOfLines={1} ellipsizeMode='tail'>
                {subtitle}
              </Text>
            </View>
          </View>
          {headerRight === 'logo' && <LogoTitle theme={resolvedMode} />}
          {headerRight === 'logoutButton' && (
            <TouchableOpacity
              className={`flex-row items-center px-4 py-2 mr-2 rounded-lg ${isLoggingOut ? 'bg-red-300' : 'bg-danger'}`}
              onPress={logout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <ActivityIndicator size='small' color='white' />
              ) : (
                <MaterialIcons name='logout' size={20} color='white' />
              )}
              <Text className='ml-2 font-medium text-white'>{isLoggingOut ? 'Saindo...' : 'Sair'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default Header;
