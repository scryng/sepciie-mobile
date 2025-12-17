import ActionButton from '@/components/base/buttons/Action';
import { brasil } from '@/services/api';
import type React from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { ActivityIndicator, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomToast } from '@/components/CustomToast';
import { useToast } from '@/hooks/useToast';
import { Company } from '@/types/common';
import FormMaskInput from '../inputs/FormMask';
import FormInput from '../inputs/Form';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { ApiResponseV2 } from '@/types/api';
import { useThemeColors } from '@/context/themeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getCpfCnpjMask, getPhoneOrCellMask } from '@/utils';
import { LoginApiResponse, LoginRequest } from '@/services/models/types/login';
import { Masks } from 'react-native-mask-input';
import PdfRendererView from 'react-native-pdf-renderer';
import * as FileSystem from 'expo-file-system';
import { DOCS } from '@/constants/docs';
import { useLazyCheckExistingUserDocumentQuery } from '@/store/api/usersApi';
import { AuthLoginRequest, AuthLoginResponse } from '@/types/api/auth';
import { ApiResponse } from '@/types/api/path/ApiResponse.types';

interface RegisterFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Partial<Company>) => Promise<ApiResponseV2<{ id_login: bigint }>>;
  onLogin?: (data: AuthLoginRequest) => Promise<ApiResponse<AuthLoginResponse>>;
  loading: boolean;
}

const CONFIG = {
  title: 'Dados Gerais',
  description: 'Preencha as informações abaixo:',
};

const RegisterFormModal: React.FC<RegisterFormModalProps> = ({ visible, onClose, onSave, onLogin, loading }) => {
  const toast = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isCheckingDocument, setIsCheckingDocument] = useState(false);
  const themeColors = useThemeColors();
  const [checkExistingDocument] = useLazyCheckExistingUserDocumentQuery();

  const defaultForm: Partial<Company> = {
    pf_pj: '',
    telefone: '',
    telefonePj: '',
    email: '',
    cpf_cnpj: '',
    cpf: '',
    cnpj: '',
    nome: '',
    nomeFantasia: '',
    razaoSocial: '',
    id_tipo: 0n,
    celular: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  };

  const [form, setForm] = useState<Partial<Company>>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);

  const nomeInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const telefoneInputRef = useRef<TextInput>(null);
  const cepInputRef = useRef<TextInput>(null);
  const logradouroInputRef = useRef<TextInput>(null);
  const numeroInputRef = useRef<TextInput>(null);
  const complementoInputRef = useRef<TextInput>(null);
  const bairroInputRef = useRef<TextInput>(null);
  const cidadeInputRef = useRef<TextInput>(null);
  const estadoInputRef = useRef<TextInput>(null);

  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const [showTerms, setShowTerms] = useState(false);
  const [termsPdfUri, setTermsPdfUri] = useState<string | null>(null);
  const [isDownloadingTerms, setIsDownloadingTerms] = useState(false);
  const termosDeUso = DOCS.Termos_de_Uso;
  const notFilledText = 'Preencha o campo!';
  const invalidFormatText = 'Dado inválido!';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.cpf_cnpj?.trim()) {
      newErrors.cpf_cnpj = notFilledText;
    } else {
      if (form.pf_pj === 'FÍSICA') {
        if (!cpf.isValid(cpf.strip(form.cpf_cnpj))) {
          newErrors.cpf_cnpj = invalidFormatText;
        }
      } else if (form.pf_pj === 'JURÍDICA') {
        if (!cnpj.isValid(cnpj.strip(form.cpf_cnpj))) {
          newErrors.cpf_cnpj = invalidFormatText;
        }
      }
    }
    if (!form.nome?.trim()) newErrors.nome = notFilledText;
    if (form.pf_pj === 'JURÍDICA' && !form.razaoSocial?.trim()) newErrors.razaoSocial = notFilledText;

    const hasEmail = !!form.email?.trim();
    const hasPhone = !!form.telefone?.trim() || !!form.celular?.trim();

    if (!hasEmail && !hasPhone) {
      newErrors.email = notFilledText;
      newErrors.telefone = notFilledText;
      newErrors.celular = notFilledText;
    } else {
      if (hasEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email!)) {
          newErrors.email = invalidFormatText;
        }
      }

      if (hasPhone) {
        const rawPhone = (form.telefone || form.celular || '').replace(/[^\d]/g, '');
        if (rawPhone.length < 10 || rawPhone.length > 11) {
          newErrors.telefone = invalidFormatText;
          newErrors.celular = invalidFormatText;
        }
      }
    }

    if (!form.password?.trim()) {
      newErrors.password = notFilledText;
    } else if (form.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    if (!form.confirmPassword?.trim()) {
      newErrors.confirmPassword = notFilledText;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (!agreeToTerms) {
      newErrors.agreeToTerms = 'É necessário marcar a caixa acima para prosseguir.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const userExists = async (document: string, type: 'cpf' | 'cnpj'): Promise<boolean> => {
    try {
      setIsCheckingDocument(true);
      const checkResult = await checkExistingDocument({ cpf_cnpj: document }).unwrap();

      let errorMessage = '';

      if (!checkResult.meta?.success) {
        if (type === 'cpf') {
          errorMessage = 'CPF já cadastrado no sistema.';
        }
        if (type === 'cnpj') {
          errorMessage = 'CNPJ já cadastrado no sistema.';
        }
        setErrors((prev) => ({ ...prev, cpf_cnpj: errorMessage }));
        toast.error(errorMessage, 'Documento já cadastrado');
        return false;
      }
      return true;
    } catch (err: any) {
      // A API retorna erro quando o documento JÁ EXISTE
      const errorMessage = type === 'cpf' ? 'CPF já cadastrado no sistema.' : 'CNPJ já cadastrado no sistema.';
      setErrors((prev) => ({ ...prev, cpf_cnpj: errorMessage }));
      toast.error(errorMessage, 'Documento já cadastrado');
      return false;
    } finally {
      setIsCheckingDocument(false);
    }
  };

  const handleCnpjChange = useCallback(
    async (cnpjVal: string) => {
      const cleanedCnpj = cnpjVal.replace(/[^\d]+/g, '');

      // Primeiro verifica se o CNPJ é válido
      if (cleanedCnpj.length !== 14) {
        return;
      }

      if (!cnpj.isValid(cleanedCnpj)) {
        return;
      }

      // Só então verifica se já existe no sistema
      const canProceed = await userExists(cleanedCnpj, 'cnpj');

      if (!canProceed) {
        return;
      }

      setIsFetching(true);

      try {
        const cnpjData = await brasil.getCNPJ(cleanedCnpj);
        setForm((prev) => ({
          ...prev,
          pf_pj: 'JURÍDICA',
          email: cnpjData.email || '',
          nomeFantasia: cnpjData.nome_fantasia,
          razaoSocial: cnpjData.razao_social,
          telefone: cnpjData.ddd_telefone_1,
          nome: (cnpjData.nome_fantasia || cnpjData.razao_social || '').toUpperCase(),
          cep: cnpjData.cep || '',
          logradouro: (cnpjData.logradouro || '').toUpperCase(),
          numero: cnpjData.numero || '',
          complemento: (cnpjData.complemento || '').toUpperCase(),
          bairro: (cnpjData.bairro || '').toUpperCase(),
          cidade: (cnpjData.municipio || '').toUpperCase(),
          estado: (cnpjData.uf || '').toUpperCase(),
        }));
        toast.success('CNPJ encontrado, campos preenchidos.');
      } catch (error) {
        console.error('Erro ao buscar CNPJ:', error);
        toast.error('CNPJ não encontrado. Verifique o número digitado.');
      } finally {
        setIsFetching(false);
      }
    },
    [toast]
  );

  const handleCpfChange = useCallback(
    async (cpfVal: string) => {
      const cleanedCpf = cpfVal.replace(/[^\d]+/g, '');

      // Primeiro verifica se o CPF é válido
      if (cleanedCpf.length !== 11 || !cpf.isValid(cleanedCpf)) {
        return;
      }

      // Só então verifica se já existe no sistema
      const canProceed = await userExists(cleanedCpf, 'cpf');
      if (!canProceed) {
        return;
      }

      setIsFetching(true);

      try {
        const cpfData = await brasil.getCPF(cleanedCpf);
        if (cpfData.status === 1) {
          setForm((prev) => ({
            ...prev,
            pf_pj: 'FÍSICA',
            nome: (cpfData.nome || '').toUpperCase(),
            logradouro: (cpfData.endereco || '').toUpperCase(),
            numero: cpfData.numero,
            complemento: (cpfData.complemento || '').toUpperCase(),
            bairro: (cpfData.bairro || '').toUpperCase(),
            cep: cpfData.cep,
            cidade: (cpfData.cidade || '').toUpperCase(),
            estado: (cpfData.uf || '').toUpperCase(),
          }));
          toast.success('CPF encontrado, dados preenchidos.');
        } else {
          toast.warning('CPF válido, mas sem dados de endereço na base.');
          setForm((prev) => ({ ...prev, pf_pj: 'FÍSICA' }));
        }
      } catch (error) {
        console.error('Erro ao buscar CPF:', error);
        setForm((prev) => ({ ...prev, pf_pj: 'FÍSICA' }));
        toast.error('Erro ao buscar dados do CPF. Preencha manualmente.');
      } finally {
        setIsFetching(false);
      }
    },
    [toast]
  );

  const handleCpfCnpjBlur = useCallback(() => {
    const rawCpfCnpj = form.cpf_cnpj || '';
    const cleaned = rawCpfCnpj.replace(/[^\d]+/g, '');
    const length = cleaned.length;

    if (length === 11) {
      if (cpf.isValid(cleaned)) {
        handleCpfChange(rawCpfCnpj);
      } else {
        setErrors((prev) => ({ ...prev, cpf_cnpj: 'CPF inválido' }));
      }
    } else if (length === 14) {
      if (cnpj.isValid(cleaned)) {
        handleCnpjChange(rawCpfCnpj);
      } else {
        setErrors((prev) => ({ ...prev, cpf_cnpj: 'CNPJ inválido' }));
      }
    } else if (length > 0) {
      setErrors((prev) => ({ ...prev, cpf_cnpj: 'CPF/CNPJ incompleto' }));
    }
  }, [form.cpf_cnpj, handleCpfChange, handleCnpjChange]);

  const handleSave = async () => {
    if (!validate()) {
      toast.error('Por favor, preencha todos os campos obrigatórios corretamente');
      return;
    }

    // Uso de 'any' para permitir a conversão de BigInt para Number (necessário para JSON.stringify)
    const companyData: any = {
      pf_pj: form.pf_pj || '',
      telefone: form.telefone?.replace(/[^\d]/g, '') || '',
      celular: form.celular?.replace(/[^\d]/g, '') || '',
      email: form.email || '',
      cpf_cnpj: form.cpf_cnpj?.replace(/[^\d]/g, '') || '',
      cpf: form.pf_pj === 'FÍSICA' ? form.cpf_cnpj?.replace(/[^\d]/g, '') : '',
      cnpj: form.pf_pj === 'JURÍDICA' ? form.cpf_cnpj?.replace(/[^\d]/g, '') : '',
      nome: form.nome || '',
      nomeFantasia: form.pf_pj === 'JURÍDICA' ? form.nomeFantasia : '',
      razaoSocial: form.pf_pj === 'JURÍDICA' ? form.razaoSocial : '',
      // Conversão de 0n para 0 para evitar erro de serialização do BigInt
      id_tipo: Number(form.id_tipo || 0),
      password: form.password,
      confirmPassword: form.confirmPassword,

      cep: form.cep || '',
      logradouro: form.logradouro || '',
      numero: form.numero || '',
      complemento: form.complemento || '',
      bairro: form.bairro || '',
      cidade: form.cidade || '',
      estado: form.estado || '',
    };

    try {
      const response = await onSave(companyData);

      if (response.error) {
        const fieldErrors: Record<string, string> = {};

        const detailsArray = Array.isArray(response.error.details) ? response.error.details : [response.error.details];

        detailsArray.forEach((detail) => {
          if (detail?.field && detail?.issue) {
            fieldErrors[detail.field] = detail.issue;
          }
        });

        setErrors(fieldErrors);

        const detailsText = detailsArray
          .map((d) => (d?.field && d?.issue ? `${d.issue}` : ''))
          .filter(Boolean)
          .join('\n');

        toast.error(detailsText || '', response.error.message);

        return;
      }

      if (response.meta?.success && response.data) {
        toast.success(response.meta.message || 'Usuário criado com sucesso!');

        if (onLogin && form.cpf_cnpj && form.password) {
          try {
            setIsLoggingIn(true);
            toast.info('Realizando login...');

            const loginData: AuthLoginRequest = {
              email: form.email ?? '',
              password: form.password,
            };

            await onLogin(loginData);
            handleFinish();
          } catch (loginError) {
            toast.warning('Cadastro realizado! Faça login manualmente.');
            handleFinish();
          } finally {
            setIsLoggingIn(false);
          }
        } else {
          handleFinish();
        }
      }
    } catch (err: any) {
      toast.error('Erro inesperado ao cadastrar a empresa.');
    }
  };

  const handleFinish = () => {
    setErrors({});
    setForm(defaultForm);
    setAgreeToTerms(false);
    onClose();
  };

  const handleOpenTermsModal = async () => {
    setShowTerms(true);
    setIsDownloadingTerms(true);
    setTermsPdfUri(null);

    try {
      const fileName = `termos_uso_${Date.now()}.pdf`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      const downloadResult = await FileSystem.downloadAsync(termosDeUso.url, fileUri);

      if (downloadResult.status === 200) {
        setTermsPdfUri(downloadResult.uri);
      } else {
        throw new Error('Falha ao baixar o PDF');
      }
    } catch (error) {
      console.error('Erro ao baixar PDF dos Termos:', error);
      toast.error('Não foi possível carregar os Termos de Uso. Tente novamente.');
    } finally {
      setIsDownloadingTerms(false);
    }
  };

  const handleCloseTermsModal = () => {
    setShowTerms(false);
    if (termsPdfUri) {
      FileSystem.deleteAsync(termsPdfUri, { idempotent: true }).catch(() => {});
      setTermsPdfUri(null);
    }
  };

  useEffect(() => {
    const digits = (form.cpf_cnpj || '').replace(/\D/g, '');

    if (digits.length === 14) {
      if (form.pf_pj !== 'JURÍDICA') {
        setForm((prev) => ({ ...prev, pf_pj: 'JURÍDICA' }));
      }
      return;
    }

    if (digits.length === 11) {
      if (form.pf_pj !== 'FÍSICA') {
        setForm((prev) => ({ ...prev, pf_pj: 'FÍSICA' }));
      }
      return;
    }

    if (form.pf_pj !== '') {
      setForm((prev) => ({ ...prev, pf_pj: '' }));
    }
  }, [form.cpf_cnpj]);

  const renderContent = () => {
    const currentNumberValue = form.celular || form.telefone || '';
    const currentDigits = currentNumberValue.replace(/\D/g, '');
    const dynamicTitle =
      currentDigits.length === 11 ? 'Celular' : currentDigits.length > 0 ? 'Telefone' : 'Celular / Telefone';

    if (isFetching) {
      return (
        <View className='items-center justify-center flex-1 py-20'>
          <ActivityIndicator size='large' color={themeColors['--color-primary']} />
          <Text className='mt-4 text-base font-medium text-text-muted'>Buscando dados...</Text>
        </View>
      );
    }

    return (
      <View className='gap-4 mb-4'>
        <FormMaskInput
          key='cpf_cnpj_input'
          title={form.pf_pj === 'JURÍDICA' ? 'CNPJ' : form.pf_pj === 'FÍSICA' ? 'CPF' : 'CPF / CNPJ'}
          required
          placeholderTextColor={themeColors['--color-foreground-muted']}
          placeholder={form.pf_pj === 'JURÍDICA' ? '12.345.678/0001-99' : '123.456.789-00'}
          value={form.cpf_cnpj}
          onChangeText={(formatted, raw) => {
            const cleaned = raw?.replace(/\D/g, '') || '';

            setForm((prev) => ({
              ...prev,
              cpf_cnpj: formatted,
              nome: '',
              nomeFantasia: '',
              razaoSocial: '',
              email: '',
              telefone: '',
              celular: '',
              cep: '',
              logradouro: '',
              numero: '',
              complemento: '',
              bairro: '',
              cidade: '',
              estado: '',
            }));

            let error = '';
            if (cleaned.length > 0) {
              if (cleaned.length === 11) {
                if (!cpf.isValid(cleaned)) error = 'CPF inválido';
              } else if (cleaned.length === 14) {
                if (!cnpj.isValid(cleaned)) error = 'CNPJ inválido';
              }
            }

            setErrors((prev) => ({
              ...prev,
              cpf_cnpj: error,
            }));
          }}
          onBlur={handleCpfCnpjBlur}
          mask={getCpfCnpjMask}
          keyboardType='numeric'
          maxLength={18}
          error={errors.cpf_cnpj}
          returnKeyType='next'
          onSubmitEditing={() => nomeInputRef.current?.focus()}
        />

        <FormInput
          ref={nomeInputRef}
          title={'Nome'}
          required
          placeholder={'João da Silva'}
          value={form.nome}
          placeholderTextColor={themeColors['--color-foreground-muted']}
          onChangeText={(text) =>
            setForm((prev) => ({
              ...prev,
              nome: text,
              ...(form.pf_pj === 'JURÍDICA' && { nomeFantasia: text }),
            }))
          }
          upperCase
          error={errors.nome}
          returnKeyType='next'
          onSubmitEditing={() => emailInputRef.current?.focus()}
        />

        <FormInput
          ref={emailInputRef}
          title='Email'
          required={!form.telefone?.trim() && !form.celular?.trim()}
          placeholderTextColor={themeColors['--color-foreground-muted']}
          placeholder='exemplo@email.com'
          value={form.email}
          onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
          keyboardType='email-address'
          upperCase
          error={errors.email}
          returnKeyType='next'
          onSubmitEditing={() => telefoneInputRef.current?.focus()}
        />

        <FormMaskInput
          ref={telefoneInputRef}
          title={dynamicTitle}
          required={!form.email?.trim()}
          placeholderTextColor={themeColors['--color-foreground-muted']}
          placeholder={dynamicTitle === 'Telefone' ? '(12) 1234-1234' : '(12) 12345-1234'}
          value={currentNumberValue}
          onChangeText={(formatted, raw) => {
            const digits = raw?.replace(/\D/g, '') || '';
            if (digits.length === 11) {
              setForm((prev) => ({ ...prev, celular: formatted, telefone: '' }));
            } else {
              setForm((prev) => ({ ...prev, telefone: formatted, celular: '' }));
            }
            setErrors((prev) => ({ ...prev, telefone: '' }));
          }}
          mask={getPhoneOrCellMask}
          keyboardType='numeric'
          maxLength={15}
          error={errors.telefone || errors.celular}
          returnKeyType='next'
          onSubmitEditing={() => logradouroInputRef.current?.focus()}
        />

        <View className='flex-row gap-2'>
          <FormMaskInput
            ref={cepInputRef}
            viewClassName='flex-1'
            replaceViewClassName={true}
            title='CEP'
            // required
            placeholder='12345-123'
            placeholderTextColor={themeColors['--color-foreground-muted']}
            value={form.cep}
            onChangeText={(formatted) => setForm((prev) => ({ ...prev, cep: formatted }))}
            mask={Masks.ZIP_CODE}
            keyboardType='numeric'
            maxLength={9}
            // error={errors.cep}
            returnKeyType='next'
            onSubmitEditing={() => numeroInputRef.current?.focus()}
          />

          <FormInput
            ref={numeroInputRef}
            viewClassName='w-1/2'
            replaceViewClassName={true}
            title='Número'
            // required
            placeholderTextColor={themeColors['--color-foreground-muted']}
            placeholder='123'
            value={form.numero}
            onChangeText={(text) =>
              setForm((prev) => ({
                ...prev,
                numero: text,
              }))
            }
            // error={errors.numero}
            upperCase
            returnKeyType='next'
            onSubmitEditing={() => logradouroInputRef.current?.focus()}
          />
        </View>

        <FormInput
          ref={logradouroInputRef}
          title='Logradouro'
          // required
          placeholderTextColor={themeColors['--color-foreground-muted']}
          placeholder='Rua Exemplo'
          value={form.logradouro}
          onChangeText={(text) =>
            setForm((prev) => ({
              ...prev,
              logradouro: text,
            }))
          }
          // error={errors.logradouro}
          upperCase
          returnKeyType='next'
          onSubmitEditing={() => bairroInputRef.current?.focus()}
        />

        <FormInput
          ref={bairroInputRef}
          title='Bairro'
          // required
          placeholderTextColor={themeColors['--color-foreground-muted']}
          placeholder='Centro'
          value={form.bairro}
          onChangeText={(text) =>
            setForm((prev) => ({
              ...prev,
              bairro: text,
            }))
          }
          // error={errors.bairro}
          upperCase
          returnKeyType='next'
          onSubmitEditing={() => cidadeInputRef.current?.focus()}
        />

        <View className='flex-row gap-2'>
          <FormInput
            ref={cidadeInputRef}
            viewClassName='flex-1'
            replaceViewClassName={true}
            title='Cidade'
            // required
            placeholderTextColor={themeColors['--color-foreground-muted']}
            placeholder='São Paulo'
            value={form.cidade}
            onChangeText={(text) =>
              setForm((prev) => ({
                ...prev,
                cidade: text,
              }))
            }
            upperCase
            // error={errors.cidade}
            returnKeyType='next'
            onSubmitEditing={() => estadoInputRef.current?.focus()}
          />

          <FormInput
            ref={estadoInputRef}
            viewClassName='w-1/4'
            replaceViewClassName={true}
            title='UF'
            // required
            placeholder='SP'
            placeholderTextColor={themeColors['--color-foreground-muted']}
            value={form.estado}
            onChangeText={(text) =>
              setForm((prev) => ({
                ...prev,
                estado: text,
              }))
            }
            upperCase
            // error={errors.estado}
            maxLength={2}
            returnKeyType='next'
            onSubmitEditing={() => complementoInputRef.current?.focus()}
          />
        </View>

        <FormInput
          ref={complementoInputRef}
          title='Complemento'
          placeholder='Sala 101'
          placeholderTextColor={themeColors['--color-foreground-muted']}
          value={form.complemento}
          onChangeText={(text) =>
            setForm((prev) => ({
              ...prev,
              complemento: text,
            }))
          }
          upperCase
          // error={errors.complemento}
          returnKeyType='next'
          onSubmitEditing={() => passwordInputRef.current?.focus()}
        />

        <FormInput
          ref={passwordInputRef}
          title='Senha'
          required
          placeholderTextColor={themeColors['--color-foreground-muted']}
          placeholder='**********'
          value={form.password}
          onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
          keyboardType='default'
          maxLength={16}
          error={errors.password}
          autoCorrect={false}
          submitBehavior='submit'
          returnKeyType='next'
          onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
          passwordToggle
          secureTextEntry
        />

        <FormInput
          ref={confirmPasswordInputRef}
          title='Confirmação de senha'
          required
          placeholderTextColor={themeColors['--color-foreground-muted']}
          placeholder='**********'
          value={form.confirmPassword}
          onChangeText={(text) => setForm((prev) => ({ ...prev, confirmPassword: text }))}
          keyboardType='default'
          maxLength={16}
          error={errors.confirmPassword}
          autoCorrect={false}
          submitBehavior='submit'
          returnKeyType='done'
          onSubmitEditing={handleSave}
          passwordToggle
          secureTextEntry
        />

        <View className='flex-row items-start mb-8'>
          <TouchableOpacity
            onPress={() => {
              const newValue = !agreeToTerms;
              setAgreeToTerms(newValue);
              if (newValue) {
                setErrors((prev) => ({ ...prev, agreeToTerms: '' }));
              }
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className={`w-6 h-6 border rounded-md mr-3 flex items-center justify-center mt-0.5 
              ${errors.agreeToTerms && !agreeToTerms ? 'border-danger' : agreeToTerms ? 'bg-primary border-primary' : 'border-border'}
            `}
          >
            {agreeToTerms && <Ionicons name='checkmark-outline' size={18} color='#fff' />}
          </TouchableOpacity>

          <View className='flex-1'>
            <Text className='text-sm leading-5 text-text-muted'>
              Ao continuar, você declara que leu e concorda com os{' '}
              <Text className='font-bold underline text-primary' onPress={handleOpenTermsModal}>
                Termos de Uso
              </Text>{' '}
              e a Política de Privacidade.
              <Text className='text-danger'> *</Text>
            </Text>
          </View>
        </View>

        {errors.agreeToTerms && <Text className='mb-4 -mt-6 text-xs text-danger ml-9'>{errors.agreeToTerms}</Text>}
      </View>
    );
  };

  return (
    <Modal transparent={true} visible={visible} animationType='fade' statusBarTranslucent>
      <SafeAreaView className='items-center justify-center flex-1 px-4 bg-black/50'>
        <CustomToast />
        <View className='bg-card rounded-xl w-full max-w-4xl h-[90vh] shadow-2xl border border-border'>
          <View className='p-6 pt-10 pb-4 border-b border-border'>
            <Text className='text-xl font-bold text-primary'>Ainda não cadastrado</Text>
          </View>
          <View className='p-6 pt-4 pb-0 border-border'>
            <View>
              <Text className='text-lg font-semibold text-text'>{CONFIG.title}</Text>
              <Text className='text-sm text-text-muted'>{CONFIG.description}</Text>
            </View>
          </View>
          <KeyboardAwareScrollView className='flex-1 p-6' showsVerticalScrollIndicator={false}>
            {renderContent()}
          </KeyboardAwareScrollView>
          <View className='flex-row justify-between p-6 border-t border-border'>
            <ActionButton label='Cancelar' onPress={handleFinish} />
            <View className='flex-row'>
              <ActionButton
                label={
                  isCheckingDocument
                    ? 'Verificando...'
                    : isLoggingIn
                      ? 'Entrando...'
                      : loading
                        ? 'Cadastrando...'
                        : 'Cadastrar'
                }
                selected={!loading && !isLoggingIn && !isCheckingDocument}
                onPress={handleSave}
                disabled={loading || isFetching || isCheckingDocument}
                leftIcon={
                  loading || isCheckingDocument ? (
                    <ActivityIndicator size='small' color='#ffffff' className='mr-2' />
                  ) : undefined
                }
              />
            </View>
          </View>
        </View>
        <Modal visible={showTerms} animationType='fade' transparent={true} onRequestClose={handleCloseTermsModal}>
          <View className='items-center justify-center flex-1 px-5 bg-black/50'>
            <View className='bg-card-secondary w-full max-w-2xl h-[85%] rounded-2xl shadow-lg overflow-hidden'>
              {/* Cabeçalho */}
              <View className='flex-row items-center justify-between p-4 border-b border-border'>
                <Text className='text-xl font-bold text-foreground'>Termos de Uso</Text>
                <TouchableOpacity onPress={handleCloseTermsModal} className='p-1'>
                  <MaterialIcons name='close' size={25} color={themeColors['--color-foreground']} />
                </TouchableOpacity>
              </View>

              {/* PDF Viewer */}
              <View className='flex-1'>
                {isDownloadingTerms ? (
                  <View className='items-center justify-center flex-1'>
                    <ActivityIndicator size='large' color={themeColors['--color-primary']} />
                    <Text className='mt-4 text-base text-text-muted'>Carregando documento...</Text>
                  </View>
                ) : termsPdfUri ? (
                  <PdfRendererView
                    // @ts-ignore
                    className='flex-1 bg-slate-500'
                    source={termsPdfUri}
                    maxZoom={5}
                    singlePage={false}
                  />
                ) : (
                  <View className='items-center justify-center flex-1'>
                    <MaterialIcons name='error-outline' size={48} color='#EF4444' />
                    <Text className='mt-4 text-base text-center text-text-muted'>
                      Não foi possível carregar o documento
                    </Text>
                  </View>
                )}
              </View>

              {/* Rodapé com Botão */}
              <View className='p-4 border-t border-border'>
                <ActionButton
                  label='Li e Concordo'
                  onPress={() => {
                    handleCloseTermsModal();
                    setAgreeToTerms(true);
                    setErrors((prev) => ({ ...prev, agreeToTerms: '' }));
                  }}
                  selected
                />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};

export default RegisterFormModal;