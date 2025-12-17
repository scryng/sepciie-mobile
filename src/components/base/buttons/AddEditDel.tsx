import { HasPermission } from '@/components/layout/HasPermission';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface ButtonProps {
  isActive?: boolean;
  page:
    | 'ListOnusPermitido'
    | 'Empresas'
    | 'Usuarios'
    | 'Endereco'
    | 'Rotas'
    | 'Saldo'
    | 'CertificadoAvulso'
    | 'Veiculos';
  onPress?: () => void;
  disabled?: boolean;
  isDeleting?: boolean;
}

export const DeleteButton = ({ page, onPress, disabled, isDeleting }: ButtonProps) => {
  return (
    <HasPermission page={page} action='d'>
      <TouchableOpacity
        className={`flex-row items-center px-3 py-2 rounded-lg bg-button-delete ${disabled ? 'opacity-50' : ''}`}
        onPress={onPress}
        disabled={disabled}
      >
        {isDeleting ? (
          <View className='items-center justify-center'>
            <ActivityIndicator size={16} color='#ffffff' />
          </View>
        ) : (
          <>
            <MaterialIcons name='delete-forever' size={16} color='#fff' />
            <Text className='ml-1 text-sm font-medium text-white'>{isDeleting ? 'Deletando...' : 'Deletar'}</Text>
          </>
        )}
      </TouchableOpacity>
    </HasPermission>
  );
};

export const EditButton = ({ page, onPress, disabled }: ButtonProps) => {
  return (
    <HasPermission page={page} action="e">
      <TouchableOpacity
        className={`flex-row items-center px-3 py-2 rounded-lg bg-button-edit ${disabled ? 'opacity-50' : ''}`}
        onPress={onPress}
        disabled={disabled}
      >
        <MaterialIcons name="edit" size={16} color='#fff' />
        <Text className="ml-1 text-sm font-medium text-white">Editar</Text>
      </TouchableOpacity>
    </HasPermission>
  );
};

export const StatusButton = ({ isActive, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity
      className={`
            px-3 py-2 rounded-lg flex-row items-center border
            ${isActive ? 'border-button-deactivate bg-button-deactivate/10' : 'border-button-activate bg-button-activate/10'}
          `}
      onPress={onPress}
    >
      <Text
        className={`mr-1 ${isActive ? 'text-button-deactivate' : 'text-button-activate'}`}
      >
        <MaterialIcons
          name={isActive ? 'visibility-off' : 'visibility'}
          size={16}
        />
      </Text>
      <Text
        className={`text-sm font-medium ${
          isActive ? 'text-button-deactivate' : 'text-button-activate'
        }`}
      >
        {isActive ? 'Desativar' : 'Ativar'}
      </Text>
    </TouchableOpacity>
  );
};
