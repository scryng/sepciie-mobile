// src/app/(drawer)/users/index.tsx
import React, { useState, useEffect } from 'react'; // adicione useEffect
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from '@/components/base/Loading';
import ActionButton from '@/components/base/buttons/Action';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColors } from '@/context/themeContext';
import { useApi } from '@/hooks/useApi';
import {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetDepartmentsQuery,
  useGetDepartmentsByUserQuery,
  useAssignUserToDepartmentMutation,
  useRemoveUserFromDepartmentMutation,
} from '@/store/api/mainApi';

export default function UsersScreen() {
  const themeColors = useThemeColors();
  const { currentUser } = useApi();
  const isAdmin = currentUser?.role === 'ADMIN';

  const { data: users = [], isLoading, refetch } = useGetUsersQuery();
  const { data: departments = [] } = useGetDepartmentsQuery();

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [assignUserToDepartment] = useAssignUserToDepartmentMutation();
  const [removeUserFromDepartment] = useRemoveUserFromDepartmentMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
  });

  const { data: userDetail, isFetching: isFetchingDetail } = useGetUserQuery(editingUser?.id || '', {
    skip: !editingUser?.id,
  });

  const { data: userDepartments = [], refetch: refetchUserDepartments } = useGetDepartmentsByUserQuery(
    editingUser?.id || '',
    {
      skip: !editingUser?.id,
    }
  );

  useEffect(() => {
    if (editingUser && userDetail) {
      setForm({
        name: userDetail.name || '',
        email: userDetail.email || '',
        password: '',
        age: userDetail.age?.toString() || '',
      });
    }
  }, [editingUser, userDetail]);

  const openModal = (user?: any) => {
    setEditingUser(user || null);
    if (!user) {
      setForm({ name: '', email: '', password: '', age: '' });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingUser(null);
    setForm({ name: '', email: '', password: '', age: '' });
  };

  const handleSave = async () => {};

  const handleDelete = (id: string, name: string) => {};

  if (isLoading) return <Loading text='Carregando usuários...' />;

  return (
    <SafeAreaView className='flex-1 bg-background'>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View className='p-6'>
            <Text className='mb-6 text-3xl font-bold text-foreground'>Usuários</Text>
            {isAdmin && <ActionButton label='Novo Usuário' onPress={() => openModal()} />}
          </View>
        }
        renderItem={({ item }) => (
          <View className='p-4 mx-4 mb-4 rounded-lg bg-card'>
            <View className='flex-row items-start justify-between'>
              <View className='flex-1'>
                <Text className='text-lg font-bold text-foreground'>{item.name}</Text>
                <Text className='text-text-muted'>{item.email}</Text>
                {item.age && <Text className='text-sm text-text-muted'>Idade: {item.age}</Text>}
                <View className='px-3 py-1 mt-2 rounded-full bg-primary/10'>
                  <Text className='text-sm font-medium text-primary'>{item.role || 'USER'}</Text>
                </View>
              </View>

              {isAdmin && (
                <View className='flex-row gap-4'>
                  <TouchableOpacity onPress={() => openModal(item)}>
                    <MaterialIcons name='edit' size={24} color={themeColors['--color-primary']} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id, item.name)}>
                    <MaterialIcons name='delete' size={24} color='red' />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className='items-center py-10'>
            <Text className='text-lg text-text-muted'>Nenhum usuário cadastrado</Text>
          </View>
        }
      />

      {isAdmin && (
        <Modal visible={modalVisible} animationType='slide' transparent>
          <View className='items-center justify-center flex-1 px-6 bg-black/50'>
            <View className='w-full max-w-lg p-6 bg-card rounded-2xl'>
              <Text className='mb-6 text-2xl font-bold text-foreground'>
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </Text>

              {isFetchingDetail && editingUser ? (
                <Loading text='Carregando dados...' />
              ) : (
                <>
                  <TextInput
                    className='px-4 py-3 mb-4 border rounded-lg bg-background border-border text-foreground'
                    placeholder='Nome completo *'
                    placeholderTextColor={themeColors['--color-text-muted']}
                    value={form.name}
                    onChangeText={(text) => setForm({ ...form, name: text })}
                  />

                  <TextInput
                    className='px-4 py-3 mb-4 border rounded-lg bg-background border-border text-foreground'
                    placeholder='E-mail *'
                    placeholderTextColor={themeColors['--color-text-muted']}
                    value={form.email}
                    onChangeText={(text) => setForm({ ...form, email: text })}
                    keyboardType='email-address'
                    autoCapitalize='none'
                  />

                  <TextInput
                    className='px-4 py-3 mb-4 border rounded-lg bg-background border-border text-foreground'
                    placeholder={editingUser ? 'Nova senha (deixe vazio para manter)' : 'Senha *'}
                    placeholderTextColor={themeColors['--color-text-muted']}
                    value={form.password}
                    onChangeText={(text) => setForm({ ...form, password: text })}
                    secureTextEntry
                  />

                  <TextInput
                    className='px-4 py-3 mb-6 border rounded-lg bg-background border-border text-foreground'
                    placeholder='Idade (opcional)'
                    placeholderTextColor={themeColors['--color-text-muted']}
                    value={form.age}
                    onChangeText={(text) => setForm({ ...form, age: text.replace(/[^0-9]/g, '') })}
                    keyboardType='numeric'
                    maxLength={3}
                  />

                  <View className='mb-6'>
                    <Text className='mb-2 font-semibold text-foreground'>Departamentos</Text>
                    <View className='border rounded-lg border-border bg-background max-h-48'>
                      <FlatList
                        data={departments}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item: dept }) => {
                          const isAssigned = userDepartments?.some((d) => d.id === dept.id);
                          return (
                            <TouchableOpacity
                              className={`p-3 border-b border-border/50 flex-row justify-between ${isAssigned ? 'bg-primary/10' : ''}`}
                              onPress={async () => {
                                try {
                                  if (isAssigned) {
                                    await removeUserFromDepartment({
                                      userId: editingUser.id,
                                      departmentId: dept.id,
                                    }).unwrap();
                                  } else {
                                    await assignUserToDepartment({
                                      userId: editingUser.id,
                                      departmentId: dept.id,
                                    }).unwrap();
                                  }
                                  refetchUserDepartments();
                                } catch (err) {
                                  Alert.alert('Erro', 'Falha ao atualizar departamentos');
                                }
                              }}
                            >
                              <Text className={`text-foreground ${isAssigned ? 'font-bold' : ''}`}>{dept.name}</Text>
                              {isAssigned && (
                                <MaterialIcons name='check' size={20} color={themeColors['--color-primary']} />
                              )}
                            </TouchableOpacity>
                          );
                        }}
                        ListEmptyComponent={
                          <Text className='p-4 text-center text-text-muted'>Nenhum departamento disponível</Text>
                        }
                      />
                    </View>
                  </View>

                  <View className='flex-row justify-end gap-4'>
                    <ActionButton label='Cancelar' onPress={closeModal} />
                    <ActionButton label='Salvar' onPress={handleSave} selected />
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}
