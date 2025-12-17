// exemplos de uso
//   const handleSave = async () => {
//     try {
//       await api.save(data);
//       toast.success('Dados salvos com sucesso!');
//     } catch (error) {
//       toast.error('Erro ao salvar dados');
//     }
//   };
//  Com titulo personalizado
// const toast = useToast();

// toast.success('Usuário criado', 'Cadastro Completo');
// toast.error('Email já existe', 'Erro de Validação');
// toast.warning('Campos obrigatórios vazios', 'Atenção');
// toast.info('Versão 2.0 disponível', 'Atualização');

import { useAppDispatch } from '@/store/store';
import { showMessage } from '@/store/slices/snackbarSlice';

type MessageType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title?: string;
  message: string;
  duration?: number;
}

type ToastArgs = {
  duration?: number;
};

export const useToast = () => {
  const dispatch = useAppDispatch();

  const showToast = (messageType: MessageType, options: ToastOptions) => {
    dispatch(
      showMessage({
        messageType,
        message: options.message,
        title: options.title,
        duration: options.duration,
      })
    );
  };

  // Métodos de atalho para cada tipo
  const success = (message: string, title?: string, options?: ToastArgs) => {
    showToast('success', {
      message,
      title: title || 'Sucesso!',
      duration: options?.duration,
    });
  };

  const error = (message: string, title?: string) => {
    showToast('error', { message, title: title || 'Erro!' });
  };

  const warning = (message: string, title?: string) => {
    showToast('warning', { message, title: title || 'Atenção!' });
  };

  const info = (message: string, title?: string) => {
    showToast('info', { message, title: title || 'Informação' });
  };

  return {
    showToast,
    success,
    error,
    warning,
    info,
  };
};
