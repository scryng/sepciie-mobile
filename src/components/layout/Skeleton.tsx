import React from 'react';
import { TouchableOpacity, View } from 'react-native';

const SkeletonLoader = () => {
  return (
    <View className="flex-1 p-4 bg-surface">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="w-12 h-12 bg-gray-300 rounded-full" />
        <View className="w-24 h-6 bg-gray-300 rounded-md" />
      </View>

      {/* Skeleton Sections */}
      {[1, 2, 3].map((_, index) => (
        <View key={index} className="mb-4">
          <View className="px-5 py-2 text-xs font-semibold tracking-wider uppercase text-primary bg-surface">
            <View className="w-24 h-4 bg-gray-300 rounded-md" />
          </View>

          {[1, 2, 3].map((itemIndex) => (
            <TouchableOpacity
              key={itemIndex}
              className="flex-row items-center px-5 py-3 border-b border-border animate-pulse"
            >
              <View className="w-6 h-6 mr-4 bg-gray-300 rounded-full" />
              <View className="w-32 h-4 bg-gray-300 rounded-md" />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

export default SkeletonLoader;
