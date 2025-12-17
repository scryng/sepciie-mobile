import { FontAwesome } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import * as React from 'react';
type IconProps = Omit<ComponentProps<typeof FontAwesome>, 'name'>;

export const icons: Record<string, (props?: IconProps) => React.ReactElement> = {
  index: (props) => <FontAwesome name="home" size={26} {...(props || {})} />,
  qrcode: (props) => <FontAwesome name="qrcode" size={26} {...(props || {})} />,
  history: (props) => <FontAwesome name="history" size={26} {...(props || {})} />,
  map: (props) => <FontAwesome name="map" size={26} {...(props || {})} />,
  settings: (props) => <FontAwesome name="cog" size={26} {...(props || {})} />,
};
