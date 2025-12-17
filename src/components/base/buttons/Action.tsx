import React, { JSX } from 'react';
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';

type ActionButtonProps = {
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  onPress?: () => void;
  leftIcon?: JSX.Element;
  className?: string;
  textClassName?: string;
  selected?: boolean;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  label = 'Ação',
  leftIcon,
  onPress,
  className = '',
  textClassName = '',
  disabled,
  selected = false,
  loading = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`flex flex-row gap-2 px-4 ${Platform.OS === 'android' ? 'py-3' : 'h-12'} rounded-xl items-center justify-center
        ${isDisabled ? 'opacity-50' : ''}
        ${selected ? 'bg-button-action' : 'bg-background border border-button-action'}
        ${className}`}
      activeOpacity={0.7}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <View className='flex-row items-center gap-2'>
          <ActivityIndicator size='small' color='#ffffff' />
          {label && (
            <Text
              className={`${selected ? 'text-text-button-primary' : 'text-blue-500'} font-semibold ${textClassName}`}
            >
              Carregando...
            </Text>
          )}
        </View>
      ) : (
        <>
          {leftIcon}
          {label && (
            <Text
              className={`${selected ? 'text-text-button-primary' : 'text-primary'} font-semibold ${textClassName}`}
            >
              {label}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default ActionButton;
