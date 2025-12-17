// src/components/base/inputs/FormMaskInput.tsx
import MaskInput, { MaskInputProps } from 'react-native-mask-input';
import { ColorValue, TextInput } from 'react-native';
import FormFieldWrapper from './FormFieldWrapper';
import React, { forwardRef } from 'react';

interface FormMaskInputProps extends MaskInputProps {
  viewClassName?: string;
  replaceViewClassName?: boolean;
  title?: string;
  titleClassName?: string;
  required?: boolean;
  inputClassName?: string;
  placeholder?: string;
  placeholderTextColor?: ColorValue;
  value?: string;
  onChangeText: (formatted: string, raw?: string) => void;
  errorClassName?: string;
  error?: string;
}

const FormMaskInput = forwardRef<TextInput, FormMaskInputProps>(
  (
    {
      viewClassName,
      replaceViewClassName,
      title,
      titleClassName,
      required,
      inputClassName = 'border rounded-lg px-3 py-3 text-sm text-bandw bg-input',
      placeholder,
      placeholderTextColor = '#808080',
      value,
      onChangeText,
      errorClassName,
      error,
      ...rest
    },
    ref
  ) => {
    return (
      <FormFieldWrapper
      title={title}
      required={required}
      titleClassName={titleClassName}
      viewClassName={viewClassName}
      replaceViewClassName={replaceViewClassName}
      error={error}
      errorClassName={errorClassName}
    >
        <MaskInput
          ref={ref as any}
          className={`${inputClassName} ${error ? 'border-danger' : 'border-input-border'}`}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
          {...rest}
        />
      </FormFieldWrapper>
    );
  }
);

FormMaskInput.displayName = 'FormMaskInput';

export default FormMaskInput;
