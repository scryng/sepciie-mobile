// src/app/(drawer)/departments/index.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert, Modal, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from '@/components/base/Loading';
import ActionButton from '@/components/base/buttons/Action';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColors } from '@/context/themeContext';
import { useApi } from '@/hooks/useApi'; // para pegar o role do usuário
import {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} from '@/store/api/mainApi';

export default function DepartmentsScreen() {
  const themeColors = useThemeColors();
  const { currentUser } = useApi(); // pega o role do usuário logado
  const isAdmin = currentUser?.role === 'ADMIN';

  const { data: departments = [], isLoading, refetch } = useGetDepartmentsQuery();
  const [createDepartment] = useCreateDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();
  const [deleteDepartment] = useDeleteDepartmentMutation();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const [form, setForm] = useState({ 
    tag: '', 
    name: '', 
    description: '', 
    active: true // default ativo
  });

  const openModal = (dept?: any) => {
    if (dept) {
      setEditingDepartment(dept);
      setForm({ 
        tag: dept.tag || '', 
        name: dept.name, 
        description: dept.description || '',
        active: dept.active ?? true
      });
    } else {
      setEditingDepartment(null);
      setForm({ tag: '', name: '', description: '', active: true });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingDepartment(null);
    setForm({ tag: '', name: '', description: '', active: true });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Erro', 'O nome é obrigatório');
      return;
    }

    try {
      const payload = {
        tag: form.tag.trim() || null,
        name: form.name.trim(),
        description: form.description.trim() || null,
        active: form.active,
      };

      if (editingDepartment) {
        await updateDepartment({
          id: editingDepartment.id,
          body: payload,
        }).unwrap();
        Alert.alert('Sucesso', 'Departamento atualizado!');
      } else {
        await createDepartment(payload).unwrap();
        Alert.alert('Sucesso', 'Departamento criado!');
      }
      closeModal();
      refetch();
    } catch (error: any) {
      Alert.alert('Erro', error.data?.message || 'Falha ao salvar departamento');
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Excluir Departamento',
      `Tem certeza que deseja excluir "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDepartment(id).unwrap();
              Alert.alert('Sucesso', 'Departamento excluído');
              refetch();
            } catch {
              Alert.alert('Erro', 'Falha ao excluir');
            }
          },
        },
      ]
    );
  };

  if (isLoading) return <Loading text="Carregando departamentos..." />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={departments}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View className="p-6">
            <Text className="mb-6 text-3xl font-bold text-foreground">Departamentos</Text>
            {isAdmin && <ActionButton label="Novo Departamento" onPress={() => openModal()} />}
          </View>
        }
        renderItem={({ item }) => (
          <View className={`mx-4 mb-4 p-4 rounded-lg bg-card ${!item.active ? 'opacity-60' : ''}`}>
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-lg font-bold text-foreground">{item.name}</Text>
                {item.tag && <Text className="text-sm text-primary">{item.tag}</Text>}
                {item.description && <Text className="mt-1 text-sm text-text-muted">{item.description}</Text>}
                <Text className={`mt-2 text-sm font-medium ${item.active ? 'text-green-600' : 'text-red-600'}`}>
                  {item.active ? 'Ativo' : 'Inativo'}
                </Text>
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
            <Text className="text-lg text-text-muted">Nenhum departamento cadastrado</Text>
          </View>
        }
      />

      {/* Modal de Criar/Editar - apenas para admin */}
      {isAdmin && (
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View className="items-center justify-center flex-1 px-6 bg-black/50">
            <View className="w-full max-w-lg p-6 bg-card rounded-2xl">
              <Text className="mb-6 text-2xl font-bold text-foreground">
                {editingDepartment ? 'Editar' : 'Novo'} Departamento
              </Text>

              <TextInput
                className="px-4 py-3 mb-4 border rounded-lg bg-background border-border text-foreground"
                placeholder="Tag (ex: RH, TI)"
                placeholderTextColor={themeColors['--color-text-muted']}
                value={form.tag}
                onChangeText={(text) => setForm({ ...form, tag: text })}
              />

              <TextInput
                className="px-4 py-3 mb-4 border rounded-lg bg-background border-border text-foreground"
                placeholder="Nome *"
                placeholderTextColor={themeColors['--color-text-muted']}
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
              />

              <TextInput
                className="px-4 py-3 mb-6 border rounded-lg bg-background border-border text-foreground"
                placeholder="Descrição"
                placeholderTextColor={themeColors['--color-text-muted']}
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
                multiline
              />

              {/* Campo Ativo/Inativo - apenas admin */}
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-lg text-foreground">Departamento ativo</Text>
                <Switch
                  value={form.active}
                  onValueChange={(value) => setForm({ ...form, active: value })}
                  trackColor={{ false: '#767577', true: themeColors['--color-primary'] }}
                  thumbColor={form.active ? '#fff' : '#f4f3f4'}
                />
              </View>

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