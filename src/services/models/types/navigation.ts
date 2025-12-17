// src/types/navigation.ts
import type { RelativePathString } from 'expo-router';

export type DrawerItem = {
  name: string;
  icon: any;
  activeIcon: any;
  route: RelativePathString;
};

export type DrawerSection = { section: string; items: DrawerItem[] };
