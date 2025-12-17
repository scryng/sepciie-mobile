import { useToast } from '@/hooks/useToast';
import { SelectOption } from '@/types/common';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  FlatList,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Modal,
} from 'react-native';

type LegacyItem = string | { label: string; value: string };

interface DropdownProps {
  placeholder: string;
  items: (LegacyItem | SelectOption)[];
  selectedItem: string | number;
  onSelect: (item: string) => void;
  isLoading: boolean;

  required?: boolean;
  disabled?: boolean;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  className?: string;
  triggerClassName?: string;
  itemClassName?: string;

  iconColor?: string;
  title?: string;
  emptyStateText?: string;
  disabledStateToastText?: string;
  dropdownMaxHeight?: number;
  triggerHeightStyle?: string;
  triggerTextStyle?: string;
  toastType?: 'success' | 'warning' | 'error' | 'info';
}

function DropdownItem({
  label,
  id,
  isLast,
  isSelected,
  onPress,
  itemClassName,
}: {
  label: string;
  id: string | number | bigint;
  isLast: boolean;
  isSelected: boolean;
  onPress: (id: string | number | bigint) => void;
  itemClassName: string;
}) {
  const press = useRef(new Animated.Value(0)).current;

  const onPressIn = () =>
    Animated.timing(press, {
      toValue: 1,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

  const onPressOut = () =>
    Animated.timing(press, {
      toValue: 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

  const scale = press.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.97],
  });

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => onPress(id)}
      android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
    >
      <Animated.View
        style={{ transform: [{ scale }] }}
        className={`${itemClassName} ${isLast ? '' : 'border-b border-border'} ${isSelected ? 'bg-muted' : ''}`}
      >
        <Text className='text-text' numberOfLines={1}>
          {label}
        </Text>
        {isSelected && <MaterialIcons name='check' size={20} color='#3B82F6' />}
      </Animated.View>
    </Pressable>
  );
}

const Dropdown = ({
  placeholder,
  items,
  selectedItem,
  title,
  onSelect,
  required,
  disabled: disabledProp,
  isLoading,
  open: openProp,
  onOpenChange,
  className = 'relative',
  triggerClassName = 'flex-row items-center justify-between border rounded-lg bg-input',
  itemClassName = 'p-4 flex-row items-center justify-between',
  iconColor,
  emptyStateText,
  disabledStateToastText,
  dropdownMaxHeight = 400,
  triggerHeightStyle = 'h-16',
  triggerTextStyle = 'text-sm',
  toastType = 'warning',
}: DropdownProps) => {
  const scheme = useColorScheme();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof openProp === 'boolean';
  const open = isControlled ? openProp : internalOpen;
  const toast = useToast();

  const setOpen = (v: boolean) => (onOpenChange ? onOpenChange(v) : setInternalOpen(v));

  const isDisabled = (disabledProp ?? false) || items.length === 0;

  const handlePress = () => {
    if (isDisabled) {
      toast[toastType](
        `${disabledStateToastText || `Você não possui ${title?.toLowerCase() || 'dados'} cadastrados.`}`,
        `Dados indisponíveis.`
      );
      return;
    }
    setOpen(!open);
  };

  useEffect(() => {
    if (isDisabled && open) {
      setOpen(false);
    }
  }, [isDisabled]);

  const iconTint = iconColor ?? (scheme === 'dark' ? '#9CA3AF' : '#6B7280');

  const normalizedItems: SelectOption[] = useMemo(() => {
    return items.map((item) => {
      if (typeof item === 'string') {
        return { id: item, label: item };
      } else if ('value' in item) {
        return { id: item.value, label: item.label };
      } else {
        return item as SelectOption;
      }
    });
  }, [items]);

  const currentLabel = useMemo(
    () => normalizedItems.find((i) => String(i.id) === String(selectedItem))?.label || '',
    [normalizedItems, selectedItem]
  );

  const openProg = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(openProg, {
      toValue: open ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [open]);

  const arrowRotate = openProg.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View className={className}>
      {title && (
        <Text className='mb-1 font-medium text-text-muted'>
          {title} {required && <Text className='text-danger'>*</Text>}
        </Text>
      )}

      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className={`${triggerClassName} ${triggerHeightStyle} ${isDisabled ? 'opacity-60' : ''}`}
        // disabled={isDisabled}
      >
        <Text
          className={`flex-1 ${triggerTextStyle ?? ''} ${selectedItem ? 'text-text' : 'text-foreground-muted'}`}
          numberOfLines={1}
        >
          {isLoading
            ? 'Carregando...'
            : isDisabled && !isLoading
              ? emptyStateText || `Nenhuma opção de ${title?.toLowerCase()} disponível.`
              : currentLabel || placeholder}
        </Text>
        <Animated.View style={{ transform: [{ rotate: arrowRotate }] }}>
          <MaterialIcons name='keyboard-arrow-down' size={24} color={iconTint} />
        </Animated.View>
      </TouchableOpacity>

      <Modal
        visible={open && !isDisabled}
        transparent
        animationType='fade'
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent
      >
        <Pressable className='flex-1 bg-black/50' onPress={() => setOpen(false)}>
          <View className='justify-center flex-1 px-4'>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View className='overflow-hidden border rounded-lg shadow-2xl bg-card border-border'>
                <View className='flex-row items-center justify-between px-4 py-3 border-b bg-card-secondary border-border'>
                  <Text className='text-base font-semibold text-text'>{title || 'Selecione'}</Text>
                  <Pressable onPress={() => setOpen(false)} className='p-1'>
                    <MaterialIcons name='close' size={24} color={iconTint} />
                  </Pressable>
                </View>

                <FlatList
                  data={normalizedItems}
                  style={{ maxHeight: dropdownMaxHeight }}
                  showsVerticalScrollIndicator={true}
                  keyboardShouldPersistTaps='handled'
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item, index }) => (
                    <DropdownItem
                      label={item.label}
                      id={item.id}
                      isLast={index === normalizedItems.length - 1}
                      isSelected={String(item.id) === selectedItem}
                      onPress={(id) => {
                        onSelect(String(id));
                        setOpen(false);
                      }}
                      itemClassName={itemClassName}
                    />
                  )}
                />
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Dropdown;
