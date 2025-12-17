export type Environment = 'production' | 'development' | 'local';

export function resolveBaseUrl(
  currentEnvironment?: Environment,
  appVariant?: string
) {
  const env = (currentEnvironment || appVariant || 'production') as Environment;

  switch (env) {
    case 'production':
      return process.env.EXPO_PUBLIC_API_URL_PROD || 'não definida';
    case 'development':
      return process.env.EXPO_PUBLIC_API_URL_DEV || 'não definida';
    case 'local':
      return process.env.EXPO_PUBLIC_API_URL_LOCAL || 'http://localhost:5062';
    default:
      return (
        process.env.EXPO_PUBLIC_API_URL ||
        process.env.EXPO_PUBLIC_API_URL_DEV ||
        'http://localhost:5062'
      );
  }
}
