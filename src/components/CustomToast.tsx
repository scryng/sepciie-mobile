import { Portal, Snackbar } from 'react-native-paper';
import { Text, View } from 'react-native';
import { hideMessage } from '@/store/slices/snackbarSlice';
import { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Estilos e ícones para cada tipo
const getToastStyles = (messageType: string | null) => {
  switch (messageType) {
    case 'success':
      return {
        backgroundColor: '#10b981', // green-500
        iconColor: '#ffffff',
        icon: 'checkmark-circle-outline',
      };
    case 'error':
      return {
        backgroundColor: '#ef4444', // red-500
        iconColor: '#ffffff',
        icon: 'close-circle-outline',
      };
    case 'warning':
      return {
        backgroundColor: '#f59e0b', // amber-500
        iconColor: '#ffffff',
        icon: 'warning-outline',
      };
    case 'info':
      return {
        backgroundColor: '#3b82f6', // blue-500
        iconColor: '#ffffff',
        icon: 'information-circle-outline',
      };
    default:
      return {
        backgroundColor: '#6b7280', // gray-500
        iconColor: '#ffffff',
        icon: 'information-circle-outline',
      };
  }
};

export const CustomToast = () => {
  const dispatch = useDispatch();
  const snackbar = useSelector((state: RootState) => state.snackbar);
  const styles = getToastStyles(snackbar.messageType);

  return (
    <Snackbar
      visible={snackbar.visible}
      onDismiss={() => dispatch(hideMessage())}
      duration={snackbar.duration ?? 3000}
      wrapperStyle={{ top: 40, zIndex: 500, position: 'absolute' }}
      style={{
        backgroundColor: styles.backgroundColor,
        borderRadius: 12,
        marginHorizontal: 16,
      }}
      action={{
        label: 'OK',
        onPress: () => dispatch(hideMessage()),
        textColor: '#ffffff',
      }}
    >
      <View className="flex-row items-center justify-center gap-3">
        {/* Ícone */}
        <View
          className="items-center justify-center w-8 h-8 rounded-full"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <Ionicons
            name={styles.icon as any}
            size={22}
            color={styles.iconColor}
          />
        </View>

        {/* Texto */}
        <View className="flex-1">
          {snackbar.title && (
            <Text className="mb-1 text-base font-bold text-white">
              {snackbar.title}
            </Text>
          )}
          <Text className="text-sm text-white opacity-90">
            {snackbar.message}
          </Text>
        </View>
      </View>
    </Snackbar>
  );
};

// Exemplo de uso:
// dispatch(showMessage({
//   messageType: 'success',
//   title: 'Sucesso!',
//   message: 'Operação realizada com sucesso'
// }));
