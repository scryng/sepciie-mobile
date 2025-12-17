import React, { useState } from 'react';
import { View, TextInput, Platform, ActivityIndicator } from 'react-native';
import { ActionButton } from './buttons';
import { useThemeColors } from '@/context/themeContext';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  loading?: boolean;
};

const Pagination = ({ page, totalPages, onChange, loading = false }: Props) => {
  const [inputPage, setInputPage] = useState(String(page));

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    onChange(p);
    setInputPage(String(p));
  };

  const themeColors = useThemeColors();

  return (
    <View className='flex-row items-center justify-center gap-3 p-3 mx-5 border-t border-border'>
      {loading ? (
        <View className='items-center justify-center w-full h-12'>
          <ActivityIndicator size='small' />
        </View>
      ) : (
        <>
          {page !== 1 && (
            <ActionButton
              label='1'
              onPress={() => goToPage(1)}
              className='border-foreground-muted bg-surface'
              textClassName='text-foreground-muted'
            />
          )}

          <ActionButton
            label=''
            leftIcon={<MaterialIcons name='chevron-left' size={20} color={themeColors['--color-foreground-muted']} />}
            disabled={page === 1}
            onPress={() => goToPage(page - 1)}
            selected={false}
            className='border-foreground-muted bg-surface'
            textClassName='text-foreground-muted'
          />

          <TextInput
            keyboardType='numeric'
            value={inputPage}
            onChangeText={setInputPage}
            onSubmitEditing={() => {
              const numberPage = Number(inputPage);
              if (!isNaN(numberPage)) goToPage(numberPage);
            }}
            placeholder='Ir para...'
            placeholderTextColor={themeColors['--color-bandw']}
            className={`
                            flex flex-row gap-4 px-4 
                            ${Platform.OS === 'android' ? 'py-3' : 'h-12'} 
                            rounded-xl items-center justify-center
                            bg-background-muted border border-bandw
                            text-bandw font-semibold
                        `}
          />

          <ActionButton
            label=''
            leftIcon={<MaterialIcons name='chevron-right' size={20} color={themeColors['--color-foreground-muted']} />}
            disabled={page === totalPages}
            onPress={() => goToPage(page + 1)}
            className='border-foreground-muted bg-surface'
            textClassName='text-foreground-muted'
          />

          {page !== totalPages && (
            <ActionButton
              label={String(totalPages)}
              onPress={() => goToPage(totalPages)}
              className='border-foreground-muted bg-surface'
              textClassName='text-foreground-muted'
            />
          )}
        </>
      )}
    </View>
  );
};

export default Pagination;
