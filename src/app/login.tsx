import ActionButton from '@/components/base/buttons/Action';
import Loading from '@/components/base/Loading';
import RegisterFormModal from '@/components/base/modals/RegisterForm';
import { ThemeToggleButton } from '@/components/ThemeToggle';
import { useThemeColors, useThemeMode } from '@/context/themeContext';
import { useApi } from '@/hooks/useApi';
import { MaterialIcons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useDispatch } from 'react-redux';
import { useToast } from '@/hooks/useToast';
import { useAppSelector } from '@/store/store';
import FormInput from '@/components/base/inputs/Form';
import { DOCS } from '@/constants/docs';
import PdfRendererView from 'react-native-pdf-renderer';
import * as FileSystem from 'expo-file-system';
import { AuthLoginRequest } from '@/types/api/auth';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { resolvedMode, setMode } = useThemeMode();
  const [isRegisterFormVisible, setRegisterFormVisible] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsPdfUri, setTermsPdfUri] = useState<string | null>(null);
  const [isDownloadingTerms, setIsDownloadingTerms] = useState(false);
  const pathname = usePathname();
  const toast = useToast();
  const themeColors = useThemeColors();
  const passwordInputRef = useRef<TextInput>(null);

  const dispatch = useDispatch();
  const showBackgroundLocationPage = useAppSelector((store) => store.location.showBackgroundLocationPage);

  const { login, isAuthenticated, isLoading: isCheckingAuth, isLoggingIn } = useApi();

  // const handleCreate = async (data: any) => {
  //   try {
  //     const response = await create(data);
  //     return response;
  //   } catch (error) {
  //     throw new Error('Não foi possível cadastrar a empresa!');
  //   }
  // };

  const handleLogin = async (data: AuthLoginRequest) => {
    try {
      const response = await login(data);
      return response;
    } catch (error) {
      throw new Error('Não foi possível efetuar o login!');
    }
  };

  const defaultForm: AuthLoginRequest = {
    email: '',
    password: '',
  };

  const [form, setForm] = useState<AuthLoginRequest>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.email?.trim()) {
      newErrors.email = 'Preencha o e-mail!';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'E-mail inválido!';
    }

    if (!form.password?.trim()) {
      newErrors.password = 'Preencha a senha!';
    } else if (form.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  const handleValidateLogin = async () => {
    if (!validate()) {
      toast.error('Por favor, preencha todos os campos corretamente');
      return;
    }

    const loginData: AuthLoginRequest = {
      email: form.email.trim(),
      password: form.password,
    };

    try {
      const response = await handleLogin(loginData);

      if (response.error) {
        const fieldErrors: Record<string, string> = {};
        const detailsArray = Array.isArray(response.error.details)
          ? response.error.details
          : response.error.details
            ? [response.error.details]
            : [];

        detailsArray.forEach((detail) => {
          if (detail?.field && detail?.issue) {
            fieldErrors[detail.field] = detail.issue;
          }
        });

        setErrors(fieldErrors);

        const errorMessage =
          detailsArray
            .map((d) => d?.issue)
            .filter(Boolean)
            .join('\n') ||
          response.error.message ||
          'Erro ao fazer login';

        toast.error(errorMessage);
        return;
      }

      if (response.meta?.success) {
        toast.success(response.meta.message || 'Login realizado com sucesso!');
        handleFinish();
      }
    } catch (err: any) {
      console.error('Erro inesperado no login:', err);
      toast.error('Erro inesperado ao fazer login.');
    }
  };

  const handleFinish = () => {
    setErrors({});
    setForm(defaultForm);
  };

  const handleOpenTermsModal = async () => {
    setShowTermsModal(true);
    setIsDownloadingTerms(true);
    setTermsPdfUri(null);

    try {
      const fileName = `termos_uso_${Date.now()}.pdf`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      const downloadResult = await FileSystem.downloadAsync(DOCS.Termos_de_Uso.url, fileUri);

      if (downloadResult.status === 200) {
        setTermsPdfUri(downloadResult.uri);
      } else {
        throw new Error('Falha ao baixar o PDF');
      }
    } catch (error) {
      console.error('Erro ao baixar PDF dos Termos:', error);
      toast.error('Não foi possível carregar os Termos de Uso.');
    } finally {
      setIsDownloadingTerms(false);
    }
  };

  const handleCloseTermsModal = () => {
    setShowTermsModal(false);
    if (termsPdfUri) {
      FileSystem.deleteAsync(termsPdfUri, { idempotent: true }).catch(() => {});
      setTermsPdfUri(null);
    }
  };

  if (isCheckingAuth) {
    return <Loading text='Verificando autenticação...' />;
  }

  if (isAuthenticated) {
    return <Loading text='Redirecionando...' />;
  }

  return (
    <SafeAreaView className='relative flex-1 bg-background-secondary'>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        keyboardShouldPersistTaps='handled'
        className='bg-background-secondary'
      >
        <View className='items-center justify-center flex-1 gap-8 px-6 py-8'>
          <View className='flex-row items-center justify-center gap-4'>
            <Image
              source={
                resolvedMode === 'dark'
                  ? require('@/assets/images/stefanini-dark.png')
                  : require('@/assets/images/stefanini-light.png')
              }
              style={{ height: 70, width: 278 }}
              resizeMode='contain'
            />
          </View>

          <View className='flex w-full max-w-sm gap-5'>
            {/* Campo de E-mail */}
            <FormInput
              title='E-mail'
              required
              placeholder='seu@email.com'
              placeholderTextColor={themeColors['--color-foreground-muted']}
              value={form.email}
              onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
              error={errors.email}
              editable={!isCheckingAuth}
              submitBehavior='submit'
              returnKeyType='next'
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />

            {/* Campo de Senha */}
            <FormInput
              ref={passwordInputRef}
              title='Senha'
              required
              placeholder='**********'
              placeholderTextColor={themeColors['--color-foreground-muted']}
              value={form.password}
              onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
              maxLength={16}
              error={errors.password}
              passwordToggle
              secureTextEntry
              editable={!isCheckingAuth}
              submitBehavior='submit'
              returnKeyType='done'
              onSubmitEditing={handleValidateLogin}
            />

            <ActionButton
              label={isLoggingIn ? 'Entrando...' : 'Entrar'}
              selected
              onPress={handleValidateLogin}
              disabled={isCheckingAuth}
              leftIcon={
                !isLoggingIn ? (
                  <MaterialIcons name='login' size={20} color={themeColors['--color-text-button-primary']} />
                ) : undefined
              }
              loading={isLoggingIn}
            />

            {/* <View className='items-center justify-center'>
              <Text className='text-text-muted'>OU</Text>
            </View> */}

            {/* <ActionButton label='Ainda não sou cadastrado' onPress={() => setRegisterFormVisible(true)} /> */}
          </View>
        </View>

        <View style={{ position: 'absolute', right: 36, bottom: 20 }}>
          <ThemeToggleButton
            theme={resolvedMode}
            showLabel={false}
            onPress={() => setMode(resolvedMode === 'dark' ? 'light' : 'dark')}
          />
        </View>

        {/* <RegisterFormModal
          visible={isRegisterFormVisible}
          onClose={() => setRegisterFormVisible(false)}
          onSave={handleCreate}
          onLogin={handleLogin}
          loading={loading}
        /> */}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
