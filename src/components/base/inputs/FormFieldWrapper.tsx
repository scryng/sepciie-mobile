// src/components/base/inputs/FormFieldWrapper.tsx
import React from 'react';
import { Text, View } from 'react-native';

interface FormFieldWrapperProps {
  title?: string;
  required?: boolean;
  titleClassName?: string;
  viewClassName?: string;
  replaceViewClassName?: boolean;
  error?: string;
  errorClassName?: string;
  children: React.ReactNode;
}

const FormFieldWrapper = ({
  title,
  required,
  titleClassName = 'text-text-muted mb-1 font-medium',
  viewClassName,
  replaceViewClassName = false,
  error,
  errorClassName = 'text-danger text-xs mt-1',
  children,
}: FormFieldWrapperProps) => {
  const containerClass = replaceViewClassName ? viewClassName : `w-full ${viewClassName}`;

  return (
    <View className={containerClass}>
      {title && (
        <Text className={titleClassName}>
          {title} {required && <Text className='text-danger'>*</Text>}
        </Text>
      )}
      {children}
      {!!error && <Text className={errorClassName}>{error}</Text>}
    </View>
  );
};

export default FormFieldWrapper;
