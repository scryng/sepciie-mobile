import { useApi } from '@/hooks/useApi';
import { Redirect, router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const Index = () => {
  const { isAuthenticated, isLoading } = useApi(); 
  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1 bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  useEffect(() => {
    router.replace('/(drawer)/users');
  }, []);

  return (
    <View className="items-center justify-center flex-1 bg-background">
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Index;