import { ActivityIndicator, Text, TouchableOpacity, View, Animated } from 'react-native';
import React, { useState, useRef } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RelativePathString, router } from 'expo-router';
import { GetUserByIdResponse } from '@/services/models/types/users';
import { useThemeColors } from '@/context/themeContext';
import { AuthLoginUserData } from '@/types/api';

interface DrawerHeaderProps {
  isLoadingProfile: boolean;
  userProfile: AuthLoginUserData | null;
  profileError: unknown;
  isDark: boolean;
  currentUser: AuthLoginUserData | null;
  navigateToScreen: (screen: RelativePathString) => void;
  logout: () => void;
  isLoggingOut: boolean;
}

const DrawerHeader = ({
  isLoadingProfile,
  userProfile,
  profileError,
  isDark,
  currentUser,
  navigateToScreen,
  logout,
  isLoggingOut,
}: DrawerHeaderProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;
  const themeColors = useThemeColors();

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;

    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(heightAnim, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();

    setIsExpanded(!isExpanded);
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const maxHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight || 200],
  });

  const handleProfilePress = () => {
    router.push({
      pathname: '/users/[profile]' as RelativePathString,
      params: {
        profile: String(userProfile?.id || ''),
        mode: 'edit',
      },
    });
  };

  return (
    <View className='px-4 pt-2 pb-3 mb-2 border-b border-border '>
      {/* Avatar e Nome */}
      <TouchableOpacity className='flex-row items-center gap-3 mb-3' onPress={toggleExpanded} activeOpacity={0.7}>
        <View className='relative'>
          <View className='items-center justify-center p-2 overflow-hidden rounded-full shadow-2xl shadow-card-foreground bg-card-foreground w-14 h-14'>
            <ActivityIndicator size='small' color='white' />
          </View>
          <View className='absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 rounded-full border-surface' />
        </View>

        <View className='flex-1'>
          <Text className='text-base font-bold text-foreground' numberOfLines={1}>
            {userProfile?.name || currentUser?.name || 'Carregando...'}
          </Text>
          <Text className='text-xs text-foreground-muted'>{userProfile?.name || ''}</Text>
          <Text className='text-xs text-foreground-muted'>
            {isLoadingProfile ? 'Carregando...' : profileError ? 'Erro ao carregar' : 'Ver perfil'}
          </Text>
        </View>

        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons name='chevron-forward' size={20} color={themeColors['--color-foreground-muted']} />
        </Animated.View>
      </TouchableOpacity>

      {/* Área Expansível com Botões */}
      <Animated.View
        style={{
          maxHeight,
          overflow: 'hidden',
        }}
      >
        <View
          className='gap-2'
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setContentHeight(height);
          }}
        >
          {/* Botão Ver Perfil */}
          <TouchableOpacity
            onPress={() => {
              handleProfilePress();
              toggleExpanded();
            }}
            activeOpacity={0.7}
            className='flex-row items-center gap-3 px-3 py-2 border rounded-xl'
            style={{
              backgroundColor: `${themeColors['--color-primary']}15`,
              borderColor: `${themeColors['--color-primary']}30`,
            }}
          >
            <View
              className='items-center justify-center w-8 h-8 rounded-lg'
              style={{ backgroundColor: `${themeColors['--color-primary']}25` }}
            >
              <Ionicons name='person-outline' size={18} color={themeColors['--color-primary']} />
            </View>
            <Text className='flex-1 text-sm font-semibold text-primary'>Ver Perfil</Text>
            <Ionicons name='chevron-forward' size={16} color={themeColors['--color-primary']} />
          </TouchableOpacity>

          {/* Botão Configurações */}
          <TouchableOpacity
            onPress={() => {
              navigateToScreen('./settings');
              toggleExpanded();
            }}
            activeOpacity={0.7}
            className='flex-row items-center gap-3 px-3 py-2 border rounded-xl border-border bg-secondary'
          >
            <View
              className='items-center justify-center w-8 h-8 rounded-lg'
              style={{ backgroundColor: `${themeColors['--color-foreground-muted']}20` }}
            >
              <Ionicons name='settings-outline' size={18} color={themeColors['--color-foreground']} />
            </View>
            <Text className='flex-1 text-sm font-semibold text-foreground'>Configurações</Text>
            <Ionicons name='chevron-forward' size={16} color={themeColors['--color-foreground-muted']} />
          </TouchableOpacity>

          {/* Botão Sair */}
          <TouchableOpacity
            onPress={() => {
              logout();
              toggleExpanded();
            }}
            disabled={isLoggingOut}
            activeOpacity={0.7}
            className={`flex-row items-center gap-3 px-3 py-2 rounded-xl ${
              isLoggingOut ? 'bg-red-400/90' : 'bg-danger '
            } shadow-lg`}
          >
            <View className='items-center justify-center w-8 h-8 rounded-lg bg-white/20'>
              {isLoggingOut ? (
                <ActivityIndicator size='small' color='#FFF' />
              ) : (
                <MaterialIcons name='logout' size={18} color='#FFF' />
              )}
            </View>
            <Text className='flex-1 text-sm font-bold text-white'>{isLoggingOut ? 'Saindo...' : 'Sair'}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default DrawerHeader;
