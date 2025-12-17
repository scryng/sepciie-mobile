import { useThemeColors, useThemeMode } from '@/context/themeContext';
import { DrawerSection } from '@/services/models/types/navigation';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { RelativePathString, usePathname, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import DrawerSectionBlock from './CustomDrawerSectionBlock';
import { SafeAreaView } from 'react-native-safe-area-context';
import DrawerHeader from './DrawerHeader';
import { useApi } from '@/hooks/useApi';

const drawerItems: DrawerSection[] = [
  {
    section: 'GESTÃO',
    items: [
      {
        name: 'Departamentos',
        icon: 'business-outline',
        activeIcon: 'business',
        route: '/departments' as RelativePathString,
      },
      {
        name: 'Usuários',
        icon: 'person-outline',
        activeIcon: 'person',
        route: '/users' as RelativePathString,
      },
    ],
  },
  {
    section: 'Comunicação',
    items: [
      {
        name: 'Comunicados',
        icon: 'newspaper-outline',
        activeIcon: 'newspaper',
        route: '/communications' as RelativePathString,
      },
      {
        name: 'Tipos de comunicados',
        icon: 'at-circle-outline',
        activeIcon: 'at-circle',
        route: '/types' as RelativePathString,
      },
      {
        name: 'Níveis de comunicados',
        icon: 'podium-outline',
        activeIcon: 'podium',
        route: '/levels' as RelativePathString,
      },
    ],
  },
];

const CustomDrawerContent = (props: any) => {
  const { logout, isLoggingOut, currentUser, isLoading: isCheckingAuth } = useApi();

  const { resolvedMode } = useThemeMode();
  const isDark = resolvedMode === 'dark';
  const router = useRouter();
  const pathname = usePathname();
  const themeColors = useThemeColors();

  const navigateToScreen = (screenName: RelativePathString) => {
    router.push({ pathname: screenName });
    props.navigation.closeDrawer();
  };

  if (isCheckingAuth) {
    return (
      <DrawerContentScrollView {...props}>
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" />
        </View>
      </DrawerContentScrollView>
    );
  }

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flexGrow: 1 }}
      style={{
        flex: 1,
        borderRightWidth: 1,
        borderColor: isDark ? '#374151' : '#E5E7EB',
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        overflow: 'hidden',
        backgroundColor: themeColors['--color-card'],
      }}
    >
      <SafeAreaView edges={['bottom']} style={{ flexGrow: 1 }}>
        <DrawerHeader
          userProfile={currentUser}
          isLoadingProfile={false}
          profileError={null}
          isDark={isDark}
          currentUser={currentUser}
          navigateToScreen={navigateToScreen}
          logout={logout}
          isLoggingOut={isLoggingOut}
        />

        {/* Suas seções do drawer */}
        {drawerItems.map((section) => (
          <DrawerSectionBlock
            key={section.section}
            section={section}
            pathname={pathname}
            isDark={isDark}
            navigateToScreen={navigateToScreen}
          />
        ))}
      </SafeAreaView>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;