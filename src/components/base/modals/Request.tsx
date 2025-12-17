import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';
import { ActionButton } from '../buttons';

type Variant = 'danger' | 'warning' | 'info' | 'success';

interface RequestModalProps {
  visible: boolean | undefined;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
  dismissOnBackdrop?: boolean;
  loading?: boolean;
  testID?: string;
}

const VARIANT_MAP: Record<
  Variant,
  {
    icon: keyof typeof MaterialIcons.glyphMap;
    color: string;
    border: string;
    ring: string;
    text: string;
  }
> = {
  danger: {
    icon: 'error-outline',
    color: '#dc2626',
    border: 'border-red-300',
    ring: 'border-2 border-red-400',
    text: 'text-red-700',
  },
  warning: {
    icon: 'warning-amber',
    color: '#d97706',
    border: 'border-amber-300',
    ring: 'border-2 border-amber-400',
    text: 'text-amber-700',
  },
  info: {
    icon: 'info-outline',
    color: '#2563eb',
    border: 'border-blue-300',
    ring: 'border-2 border-blue-400',
    text: 'text-blue-700',
  },
  success: {
    icon: 'check-circle',
    color: '#16a34a',
    border: 'border-green-300',
    ring: 'border-2 border-green-400',
    text: 'text-green-700',
  },
};

const RequestModal = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'warning',
  dismissOnBackdrop = true,
  loading,
  testID,
}: RequestModalProps) => {
  const v = VARIANT_MAP[variant];
  console.log(loading);

  return (
    <Modal transparent visible={visible} animationType='fade' statusBarTranslucent onRequestClose={onCancel}>
      {/* Backdrop */}
      <Pressable
        className='items-center justify-center flex-1 px-4 bg-black/70'
        onPress={dismissOnBackdrop ? onCancel : undefined}
        testID={testID ? `${testID}-backdrop` : undefined}
      >
        <Pressable
          onPress={() => {}}
          className={`w-full max-w-md items-center rounded-xl p-6 bg-background shadow-lg border ${v.border}`}
          testID={testID}
        >
          <View className={`rounded-full p-4 mb-4 ${v.ring}`}>
            <MaterialIcons name={v.icon} size={40} color={v.color} />
          </View>

          <Text className='mb-2 text-xl font-semibold text-center text-text'>{title}</Text>
          <Text className='mb-6 text-base text-center text-text-muted'>{message}</Text>

          <View className='flex-row justify-around w-full'>
            <ActionButton
              label={cancelLabel}
              onPress={onCancel}
              disabled={loading}
              className='px-6 py-3 mb-2 bg-transparent border rounded-md border-border'
            />
            {loading ? (
              <ActivityIndicator size='small' />
            ) : (
              <ActionButton
                label={confirmLabel}
                onPress={onConfirm}
                disabled={loading}
                selected
                className={`rounded-md px-6 py-3 mb-2 ${variant === 'danger' ? 'bg-red-600' : 'bg-blue-600'}`}
              />
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default RequestModal;
