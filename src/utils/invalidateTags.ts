// store/invalidatePermissions.ts
import { accessApi } from '@/store/api/accessApi';
import { onusApi } from '@/store/api/onusApi';
import { usersApi } from '@/store/api/usersApi';
import { AppDispatch } from '@/store/store';

export const invalidatePermissions = () => (dispatch: AppDispatch) => {
  // Invalidar todas as tags de Access, não apenas LIST
  dispatch(accessApi.util.invalidateTags(['Access']));

  // Também invalidar outras APIs relacionadas
  dispatch(usersApi.util.invalidateTags(['Users']));
  dispatch(onusApi.util.invalidateTags(['Onus']));
};
