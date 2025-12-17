// components/RouteGuard.tsx
import { useThemeMode } from '@/context/themeContext';
import { usePageAccess } from '@/hooks/usePageAccess';
import { PageKey } from '@/services/models/types/access';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

export default function RouteGuard({
  page,
  children,
}: {
  page: PageKey;
  children: React.ReactNode;
}) {
  const { canView, isLoading } = usePageAccess(page);
  const { resolvedMode } = useThemeMode();
  const isDark = resolvedMode === 'dark';

  // Loading skeleton
  if (!canView && isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-background">
        <View className="items-center">
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text className="mt-4 text-text-muted">
            Verificando permissões...
          </Text>
        </View>
      </View>
    );
  }

  // No permission screen
  if (!canView) {
    return (
      <View className="items-center justify-center flex-1 px-6 bg-background">
        <View className="items-center max-w-sm">
          {/* Icon */}
          <View className="items-center justify-center w-20 h-20 mb-6 bg-red-100 rounded-full dark:bg-red-900/30">
            <MaterialIcons
              name="block"
              size={40}
              color={isDark ? '#F87171' : '#EF4444'}
            />
          </View>

          {/* Title */}
          <Text className="mb-3 text-2xl font-bold text-center text-text">
            Acesso Restrito
          </Text>

          {/* Subtitle */}
          <Text className="mb-6 text-base leading-6 text-center text-text-muted">
            Você não tem permissão para acessar esta funcionalidade. Entre em
            contato com o administrador da sua empresa.
          </Text>

          {/* Action Buttons */}
          <View className="w-full space-y-3">
            {/* Contact Button */}
            <Link href="./contacts" asChild>
              <TouchableOpacity
                className="w-full px-6 py-4 shadow-sm bg-primary rounded-xl"
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-center">
                  <MaterialIcons name="support-agent" size={20} color="white" />
                  <Text className="ml-2 text-base font-semibold text-white">
                    Contatar Suporte
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    );
  }

  return <>{children}</>;
}
