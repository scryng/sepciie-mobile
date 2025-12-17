import { ColorValue, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import FormFieldWrapper from './FormFieldWrapper';
import { MaterialIcons } from '@expo/vector-icons';
import React, { forwardRef, useState } from 'react';

interface FormInputProps extends TextInputProps {
  viewClassName?: string;
  replaceViewClassName?: boolean;
  title?: string;
  titleClassName?: string;
  required?: boolean;
  inputClassName?: string;
  placeholder?: string;
  placeholderTextColor?: ColorValue;
  value?: string;
  onChangeText: (text: string) => void;
  upperCase?: boolean;
  errorClassName?: string;
  error?: string;

  /** NOVO: ativa o toggle de senha */
  passwordToggle?: boolean;
  iconColor?: string;
  iconDisabledColor?: string;
}

const FormInput = forwardRef<TextInput, FormInputProps>(
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
      upperCase = false,
      errorClassName,
      error,
      passwordToggle = false,
      iconColor = '#9ca3af',
      iconDisabledColor = '#d1d5db',
      editable = true,
      secureTextEntry,
      ...rest
    },
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const isPassword = passwordToggle;

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
      <View
        className={`flex-row items-center border rounded-lg bg-input ${
          error ? 'border-danger' : 'border-input-border'
        }`}
      >
        <TextInput
          ref={ref}
          className='flex-1 px-3 py-3 text-sm text-bandw'
          placeholder={upperCase ? placeholder?.toUpperCase() : placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={(text) => onChangeText(upperCase ? text.toUpperCase() : text)}
          autoCapitalize={upperCase ? 'characters' : 'none'}
          secureTextEntry={isPassword && !visible}
          editable={editable}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity className='px-3' onPress={() => setVisible(!visible)} disabled={!editable}>
            <MaterialIcons
              name={visible ? 'visibility' : 'visibility-off'}
              size={22}
              color={!editable ? iconDisabledColor : iconColor}
            />
          </TouchableOpacity>
        )}
      </View>
    </FormFieldWrapper>
  );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
