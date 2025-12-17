import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

const StatusBadge = ({ label }: { label: 'Concedida' | 'Negada' | 'Desativado' }) => (
  <View className="ml-2 px-2 py-0.5 rounded-full flex-row items-center" style={{ backgroundColor: label === 'Concedida' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)' }}>
    <MaterialIcons name={label === 'Concedida' ? 'check-circle' : 'error-outline'} size={14} color={label === 'Concedida' ? '#16a34a' : '#ef4444'} style={{ marginRight: 4 }} />
    <Text style={{ fontSize: 12, fontWeight: '600', color: label === 'Concedida' ? '#16a34a' : '#ef4444' }}>{label}</Text>
  </View>
);

export default StatusBadge;
