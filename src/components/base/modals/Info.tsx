import React from 'react';
import { Modal, View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface InfoModalProps {
  visible: boolean;
  onConfirm: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ visible, onConfirm }) => {
  const colorSchemaObject = useColorScheme();

  return (
    <Modal transparent={true} visible={visible} animationType='fade' onRequestClose={() => {}} statusBarTranslucent>
      <View className='items-center justify-center flex-1 px-4 bg-black/65'>
        <View className='items-center w-full max-w-sm p-6 shadow-lg bg-background rounded-xl'>
          <MaterialIcons
            name='email'
            size={48}
            color={colorSchemaObject === 'dark' ? 'white' : 'black'}
            className='mb-4'
          />
          <Text className='mb-3 text-xl font-bold text-center text-foreground'>Cadastro Realizado!</Text>
          <Text className='mb-4 text-base text-center text-foreground'>
            Você receberá um e-mail em breve para cadastrar sua senha de acesso.
          </Text>
          <Text className='mb-4 text-base text-center text-foreground'>
            Lembre-se de verificar sua caixa de spam (lixo eletrônico).
          </Text>
          <TouchableOpacity activeOpacity={0.7} className='w-full bg-[#3B82F6] py-3 rounded-lg' onPress={onConfirm}>
            <Text className='text-base font-bold text-center text-white'>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default InfoModal;
