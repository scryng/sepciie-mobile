import { DrawerSection } from '@/services/models/types/navigation';
import { RelativePathString } from 'expo-router';
import { Text, View } from 'react-native';
import GuardedDrawerItem from './GuardedDrawerItem';
import { memo } from 'react';

function DrawerSectionBlock({
  section,
  pathname,
  isDark,
  navigateToScreen,
}: {
  section: DrawerSection;
  pathname: string;
  isDark: boolean;
  navigateToScreen: (r: RelativePathString) => void;
}) {
  // Removemos completamente sectionPermissions do props

  return (
    <View key={section.section} className="mb-0">
      {/* Sempre mostra o título da seção */}
      <Text className="px-5 py-2 text-xs font-semibold tracking-wider uppercase text-primary bg-card">
        {section.section}
      </Text>

      {/* Todos os itens são exibidos, sem verificação de permissão */}
      {section.items.map((item) => (
        <GuardedDrawerItem
          key={item.name}
          item={item}
          isActive={pathname === item.route}
          isDark={isDark}
          canView={true} // Sempre permitido
          onPress={() => navigateToScreen(item.route)}
        />
      ))}
    </View>
  );
}

export default memo(DrawerSectionBlock);