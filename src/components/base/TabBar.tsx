import React from 'react';
import { StyleSheet, View } from 'react-native';
import TabBarButton from './buttons/TabBar';

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const primaryColor = '#00cf00';
  const greyColor = '#737373';
  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

        if (['_sitemap', '+not-found'].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Garante que label seja string ou number para evitar erro no Animated.Text
        const safeLabel = typeof label === 'string' || typeof label === 'number' ? label : '';
        return <TabBarButton key={route.name} style={styles.tabbarItem} onPress={onPress} onLongPress={onLongPress} isFocused={isFocused} routeName={route.name} color={isFocused ? primaryColor : greyColor} label={safeLabel} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    opacity: 0.95,
    marginHorizontal: 0,
    paddingVertical: 15,
    borderRadius: 2,
    borderCurve: 'continuous',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabBar;
