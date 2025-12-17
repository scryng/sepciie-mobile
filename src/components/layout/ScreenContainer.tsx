import { ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
}

export default function ScreenContainer({
  children,
  ...props
}: ScreenContainerProps) {
  return (
    <SafeAreaView
      edges={['left', 'right']}
      className="flex-1 bg-background"
      {...props}
    >
      {children}
    </SafeAreaView>
  );
}
