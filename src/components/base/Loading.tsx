import { useThemeMode } from '@/context/themeContext';
import React from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
interface LoadingProps {
  text: string;
  color?: string;
}

const Loading = ({ text, color = 'text-gray-600' }: LoadingProps) => {
  const { resolvedMode } = useThemeMode();
  return (
    <SafeAreaView className='relative flex-1 pt-5 bg-background'>
      <View className='flex-row items-center justify-center gap-4'>
        <Image
          source={
            resolvedMode === 'dark'
              ? require('@/assets/images/stefanini-dark-mini.png')
              : require('@/assets/images/stefanini-light-mini.png')
          }
          style={{ height: 100, width: 140 }}
          resizeMode='contain'
        />
      </View>

      <View className='items-center justify-center flex-1'>
        <ActivityIndicator size='large' color='#367DC1' />
        <Text className={`mt-4 ${color}`}>{text}</Text>
      </View>
    </SafeAreaView>
  );
};

export default Loading;
