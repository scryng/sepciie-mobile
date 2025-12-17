import { Image, View } from 'react-native';

interface LogoTitleProps {
  theme: 'light' | 'dark';
}

const LogoTitle = ({ theme }: LogoTitleProps) => {
  const isDark = theme === 'dark';
  const img = isDark
    ? require('@/assets/images/stefanini-dark.png')
    : require('@/assets/images/stefanini-light.png');
  return (
    <View className='items-center justify-center mr-4'>
      <Image source={img} style={{ width: 85, height: 40 }} resizeMode='contain' />
    </View>
  );
};

export default LogoTitle;
