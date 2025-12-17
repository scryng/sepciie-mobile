import { View, ActivityIndicator } from 'react-native';
import { useLoading } from '@/context/LoadingContext';

export const GlobalSpinner = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <View className="absolute inset-0 z-[9999] items-center justify-center">
      <ActivityIndicator size="large" className='color-primary' />
    </View>
  );
};
