// src/app/(drawer)/types/index.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from '@/components/base/Loading';
import ActionButton from '@/components/base/buttons/Action';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColors } from '@/context/themeContext';
import { useApi } from '@/hooks/useApi';
import {
  useGetTypesQuery,
  useCreateTypeMutation,
  useUpdateTypeMutation,
  useDeleteTypeMutation,
} from '@/store/api/mainApi';

export default function TypesScreen() {
  const themeColors = useThemeColors();
  const { currentUser } = useApi();
  const isAdmin = currentUser?.role === 'ADMIN';

  const { data: types = [], isLoading, refetch } = useGetTypesQuery();
  const [createType] = useCreateTypeMutation();
  const [updateType] = useUpdateTypeMutation();
  const [deleteType] = useDeleteTypeMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingType, setEditingType] = useState<any>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const openModal = (type?: any) => {
    if (type) {
      setEditingType(type);
      setForm({ name: type.name, description: type.description || '' });
    } else {
      setEditingType(null);
      setForm({ name: '', description: '' });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingType(null);
    setForm({ name: '', description: '' });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Erro', 'O nome é obrigatório');
      return;
    }

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
      };

      if (editingType) {
        await updateType({ id: editingType.id, body: payload }).unwrap();
        Alert.alert('Sucesso', 'Tipo atualizado!');
      } else {
        await createType(payload).unwrap();
        Alert.alert('Sucesso', 'Tipo criado!');
      }
      closeModal();
      refetch();
    } catch (error: any) {
      Alert.alert('Erro', error.data?.message || 'Falha ao salvar tipo');
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Excluir Tipo',
      `Tem certeza que deseja excluir o tipo "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteType(id).unwrap();
              Alert.alert('Sucesso', 'Tipo excluído');
              refetch();
            } catch {
              Alert.alert('Erro', 'Falha ao excluir tipo');
            }
          },
        },
      ]
    );
  };

  if (isLoading) return <Loading text="Carregando tipos..." />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={types}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View className="p-6">
            <Text className="mb-6 text-3xl font-bold text-foreground">
              Tipos de Comunicado
            </Text>
            {isAdmin && <ActionButton label="Novo Tipo" onPress={() => openModal()} />}
          </View>
        }
        renderItem={({ item }) => (
          <View className="p-4 mx-4 mb-4 rounded-lg bg-card">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-lg font-bold text-foreground">{item.name}</Text>
                {item.description && (
                  <Text className="mt-1 text-sm text-text-muted">{item.description}</Text>
                )}
              </View>
              {isAdmin && (
                <View className="flex-row gap-4">
                  <TouchableOpacity onPress={() => openModal(item)}>
                    <MaterialIcons name="edit" size={24} color={themeColors['--color-primary']} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id, item.name)}>
                    <MaterialIcons name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center py-10">
            <Text className="text-lg text-text-muted">Nenhum tipo cadastrado</Text>
          </View>
        }
      />

      {isAdmin && (
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View className="items-center justify-center flex-1 px-6 bg-black/50">
            <View className="w-full max-w-lg p-6 bg-card rounded-2xl">
              <Text className="mb-6 text-2xl font-bold text-foreground">
                {editingType ? 'Editar' : 'Novo'} Tipo
              </Text>

              <TextInput
                className="px-4 py-3 mb-4 border rounded-lg bg-background border-border text-foreground"
                placeholder="Nome *"
                placeholderTextColor={themeColors['--color-text-muted']}
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
              />

              <TextInput
                className="px-4 py-3 mb-6 border rounded-lg bg-background border-border text-foreground"
                placeholder="Descrição (opcional)"
                placeholderTextColor={themeColors['--color-text-muted']}
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
                multiline
              />

              <View className="flex-row justify-end gap-4">
                <ActionButton label="Cancelar" onPress={closeModal} />
                <ActionButton label="Salvar" onPress={handleSave} selected />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}