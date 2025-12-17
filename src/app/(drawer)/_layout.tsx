import CustomDrawerContent from '@/components/layout/CustomDrawer';
import Header from '@/components/layout/Header';
import ScreenContainer from '@/components/layout/ScreenContainer';
import { useLogoutRedirect } from '@/hooks/useLogoutRedirect';
import { Drawer } from 'expo-router/drawer';

const META: Record<
  string,
  {
    title: string;
    subtitle?: string;
    headerRight?: 'logo' | 'logoutButton';
    hidden?: boolean;
  }
> = {
  'departments/index': {
    title: 'Departamentos',
    subtitle: 'Listagem de departamentos criados',
    headerRight: 'logo',
  },
  'users/index': {
    title: 'Usuários',
    subtitle: 'Gerencie seus Usuários',
    headerRight: 'logo',
  },
  'communications/index': {
    title: 'Comunicados',
    subtitle: 'Veja aqui os comunicados',
    headerRight: 'logo',
  },
  'types/index': {
    title: 'Tipos de comunicados',
    subtitle: 'Gerencie os tipos de comunicados',
    headerRight: 'logo',
  },
  'levels/index': {
    title: 'Níveis de comunicados',
    subtitle: 'Veja aqui os níveis de comunicados',
    headerRight: 'logo',
  },
};

const humanize = (name: string) => {
  const last = name.split('/').pop() || name;
  return last.replace(/[-_]/g, ' ').replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
};

export default function Layout() {
  const initialRoute = 'index';

  useLogoutRedirect();

  return (
    <>
      <ScreenContainer>
        <Drawer
          backBehavior='history'
          drawerContent={CustomDrawerContent}
          initialRouteName={initialRoute}
          screenOptions={({ route }) => {
            const meta = META[route.name] ?? { title: humanize(route.name) };
            return {
              // Header único para TODAS as telas
              header: () => (
                <Header title={meta.title} subtitle={meta.subtitle ?? ''} headerRight='logo' sidebarButton />
              ),
              // label do drawer usando o mesmo título
              drawerLabel: meta.title,
              // se quiser esconder alguma rota do menu
              drawerItemStyle: meta.hidden ? { display: 'none' } : undefined,

              // demais padrões globais (se quiser):
              swipeEnabled: true,
              swipeEdgeWidth: 100,
              // drawerHideStatusBarOnOpen: true,
              drawerStatusBarAnimation: 'fade',
              drawerType: 'front',
              drawerLabelStyle: { fontSize: 14 },
              drawerStyle: { backgroundColor: '#transparent' },
            };
          }}
        >
          <Drawer.Screen
            name='settings/index'
            options={{
              drawerItemStyle: { display: 'none' },
              header: () => (
                <Header title='Configurações' subtitle='Gerencie suas preferências de sistema' headerRight='logo' />
              ),
            }}
          />
          <Drawer.Screen
            name='users/[profile]'
            options={({ route }) => {
              // Tipagem opcional só pra ajudar no TS
              const params = (route.params ?? {}) as {
                mode?: 'create' | 'edit';
                name?: string; // nome do usuário (pra mostrar no subtítulo)
              };

              const isCreate = params.mode === 'create'; // permite usar /users/new como "create"

              const title = isCreate ? 'Cadastrar usuário' : 'Editar usuário';
              const subtitle = isCreate ? 'Preencha os dados do usuário' : `Editando ${params.name ?? 'usuário'}`;

              return {
                drawerItemStyle: { display: 'none' },
                header: () => <Header title={title} subtitle={subtitle} headerRight='logo' />,
              };
            }}
          />
        </Drawer>
      </ScreenContainer>
    </>
  );
}
