import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from '@/components/base/Loading';
import ActionButton from '@/components/base/buttons/Action';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColors } from '@/context/themeContext';
import { useApi } from '@/hooks/useApi';
import {
  useGetCommunicationsQuery,
  useCreateCommunicationMutation,
  useUpdateCommunicationMutation,
  useDeleteCommunicationMutation,
  useGetTypesQuery,
  useGetLevelsQuery,
  useMarkCommunicationAsReadMutation,
} from '@/store/api/mainApi';

export default function CommunicationsScreen() {
  const themeColors = useThemeColors();
  const { currentUser } = useApi();
  const isAdmin = currentUser?.role === 'ADMIN';

  const { data: comms = [], isLoading: loadingComms, refetch } = useGetCommunicationsQuery();
  const { data: types = [] } = useGetTypesQuery();
  const { data: levels = [] } = useGetLevelsQuery();

  const [createComm] = useCreateCommunicationMutation();
  const [updateComm] = useUpdateCommunicationMutation();
  const [deleteComm] = useDeleteCommunicationMutation();
  const [markAsRead] = useMarkCommunicationAsReadMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingComm, setEditingComm] = useState<any>(null);
  const [form, setForm] = useState({
    title: '',
    message: '',
    typeId: '',
    levelId: '',
  });

  const openModal = (comm?: any) => {
    if (comm) {
      setEditingComm(comm);
      setForm({
        title: comm.title || '',
        message: comm.message || '',
        typeId: comm.type?.id?.toString() || '',
        levelId: comm.level?.id?.toString() || '',
      });
    } else {
      setEditingComm(null);
      setForm({ title: '', message: '', typeId: '', levelId: '' });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingComm(null);
    setForm({ title: '', message: '', typeId: '', levelId: '' });
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.message.trim() || !form.typeId || !form.levelId) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    const payload = {
      title: form.title.trim(),
      content: form.message.trim(),
      id_user: currentUser?.id,
      id_type: form.typeId,
      id_level: form.levelId,
    };

    try {
      if (editingComm) {
        await updateComm({ id: editingComm.id, body: payload }).unwrap();
        Alert.alert('Sucesso', 'Comunicado atualizado!');
      } else {
        await createComm(payload).unwrap();
        Alert.alert('Sucesso', 'Comunicado criado e enviado!');
      }
      closeModal();
      refetch();
    } catch (error: any) {
      Alert.alert('Erro', error.data?.message || 'Falha ao salvar comunicado');
    }
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Excluir Comunicado', `Tem certeza que deseja excluir "${title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteComm(id).unwrap();
            Alert.alert('Sucesso', 'Comunicado excluído');
            refetch();
          } catch {
            Alert.alert('Erro', 'Falha ao excluir');
          }
        },
      },
    ]);
  };

  const handlePressCommunication = async (item: any) => {
    if (item.read) {
      Alert.alert(item.title, item.message);
      return;
    }

    try {
      const readId = item.communicationUserId || item.readId;

      if (readId) {
        await markAsRead(readId).unwrap();
      }
    } catch (err) {
      console.error('Erro ao marcar como lido', err);
    }

    Alert.alert(item.title, item.message);
  };

  if (loadingComms) return <Loading text='Carregando comunicados...' />;

  return (
    <SafeAreaView className='flex-1 bg-background'>
      <FlatList
        data={comms}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View className='p-6'>
            <Text className='mb-6 text-3xl font-bold text-foreground'>Comunicados</Text>
            {isAdmin && <ActionButton label='Novo Comunicado' onPress={() => openModal()} />}
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePressCommunication(item)}
            className={`mx-4 mb-4 p-4 rounded-lg bg-card ${item.read ? 'opacity-60' : ''}`}
          >
            <View className='flex-row items-start justify-between'>
              <View className='flex-1 pr-4'>
                <View className='flex-row items-center'>
                  {!item.read && <View className='w-3 h-3 mr-2 rounded-full bg-primary' />}
                  <Text className={`text-lg font-bold text-foreground ${!item.read ? 'font-extrabold' : ''}`}>
                    {item.title}
                  </Text>
                </View>
                <Text className='mt-2 text-text-muted'>{item.message}</Text>
                <View className='flex-row justify-between mt-4'>
                  <Text className='text-sm font-medium text-primary'>Tipo: {item.type?.name || 'Sem tipo'}</Text>
                  <Text className='text-sm font-medium text-danger'>Nível: {item.level?.name || 'Sem nível'}</Text>
                </View>
                <Text className='mt-2 text-xs text-text-muted'>
                  Enviado em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                </Text>
              </View>

              {isAdmin && (
                <View className='flex-row gap-4'>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      openModal(item);
                    }}
                  >
                    <MaterialIcons name='edit' size={24} color={themeColors['--color-primary']} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id, item.title);
                    }}
                  >
                    <MaterialIcons name='delete' size={24} color='red' />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className='items-center py-10'>
            <Text className='text-lg text-text-muted'>Nenhum comunicado enviado</Text>
          </View>
        }
      />

      {/* Modal Criar/Editar (igual ao seu, sem mudanças) */}
      {isAdmin && (
        <Modal visible={modalVisible} animationType='slide' transparent>
          <View className='items-center justify-center flex-1 px-6 bg-black/50'>
            <View className='w-full max-w-lg p-6 bg-card rounded-2xl'>
              <Text className='mb-6 text-2xl font-bold text-foreground'>
                {editingComm ? 'Editar' : 'Novo'} Comunicado
              </Text>

              <TextInput
                className='px-4 py-3 mb-4 border rounded-lg bg-background border-border text-foreground'
                placeholder='Título *'
                placeholderTextColor={themeColors['--color-text-muted']}
                value={form.title}
                onChangeText={(text) => setForm({ ...form, title: text })}
              />

              <TextInput
                className='px-4 py-3 mb-4 border rounded-lg bg-background border-border text-foreground'
                placeholder='Mensagem *'
                placeholderTextColor={themeColors['--color-text-muted']}
                value={form.message}
                onChangeText={(text) => setForm({ ...form, message: text })}
                multiline
                numberOfLines={4}
              />

              <View className='mb-4'>
                <Text className='mb-2 text-foreground'>Tipo *</Text>
                <View className='border rounded-lg border-border bg-background'>
                  {types.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      className={`p-3 border-b border-border/50 ${form.typeId === type.id.toString() ? 'bg-primary/10' : ''}`}
                      onPress={() => setForm({ ...form, typeId: type.id.toString() })}
                    >
                      <Text className={`text-foreground ${form.typeId === type.id.toString() ? 'font-bold' : ''}`}>
                        {type.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className='mb-6'>
                <Text className='mb-2 text-foreground'>Nível *</Text>
                <View className='border rounded-lg border-border bg-background'>
                  {levels.map((level) => (
                    <TouchableOpacity
                      key={level.id}
                      className={`p-3 border-b border-border/50 ${form.levelId === level.id.toString() ? 'bg-primary/10' : ''}`}
                      onPress={() => setForm({ ...form, levelId: level.id.toString() })}
                    >
                      <Text className={`text-foreground ${form.levelId === level.id.toString() ? 'font-bold' : ''}`}>
                        {level.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className='flex-row justify-end gap-4'>
                <ActionButton label='Cancelar' onPress={closeModal} />
                <ActionButton label='Salvar' onPress={handleSave} selected />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}
