// src/app/(drawer)/levels/index.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from '@/components/base/Loading';
import ActionButton from '@/components/base/buttons/Action';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColors } from '@/context/themeContext';
import { useApi } from '@/hooks/useApi';
import {
  useGetLevelsQuery,
  useCreateLevelMutation,
  useUpdateLevelMutation,
  useDeleteLevelMutation,
} from '@/store/api/mainApi';

export default function LevelsScreen() {
  const themeColors = useThemeColors();
  const { currentUser } = useApi();
  const isAdmin = currentUser?.role === 'ADMIN';

  const { data: levels = [], isLoading, refetch } = useGetLevelsQuery();
  const [createLevel] = useCreateLevelMutation();
  const [updateLevel] = useUpdateLevelMutation();
  const [deleteLevel] = useDeleteLevelMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingLevel, setEditingLevel] = useState<any>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const openModal = (level?: any) => {
    if (level) {
      setEditingLevel(level);
      setForm({ name: level.name, description: level.description || '' });
    } else {
      setEditingLevel(null);
      setForm({ name: '', description: '' });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingLevel(null);
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

      if (editingLevel) {
        await updateLevel({ id: editingLevel.id, body: payload }).unwrap();
        Alert.alert('Sucesso', 'Nível atualizado!');
      } else {
        await createLevel(payload).unwrap();
        Alert.alert('Sucesso', 'Nível criado!');
      }
      closeModal();
      refetch();
    } catch (error: any) {
      Alert.alert('Erro', error.data?.message || 'Falha ao salvar nível');
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Excluir Nível',
      `Tem certeza que deseja excluir o nível "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteLevel(id).unwrap();
              Alert.alert('Sucesso', 'Nível excluído');
              refetch();
            } catch {
              Alert.alert('Erro', 'Falha ao excluir nível');
            }
          },
        },
      ]
    );
  };

  if (isLoading) return <Loading text="Carregando níveis..." />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={levels}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View className="p-6">
            <Text className="mb-6 text-3xl font-bold text-foreground">
              Níveis de Comunicado
            </Text>
            {isAdmin && <ActionButton label="Novo Nível" onPress={() => openModal()} />}
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
            <Text className="text-lg text-text-muted">Nenhum nível cadastrado</Text>
          </View>
        }
      />

      {/* Modal Criar/Editar */}
      {isAdmin && (
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View className="items-center justify-center flex-1 px-6 bg-black/50">
            <View className="w-full max-w-lg p-6 bg-card rounded-2xl">
              <Text className="mb-6 text-2xl font-bold text-foreground">
                {editingLevel ? 'Editar' : 'Novo'} Nível
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