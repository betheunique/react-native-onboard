import React, { FC, useEffect, useState } from 'react'
import { ColorValue, StyleSheet, Text, TextInput, View } from 'react-native'
import { HORIZONTAL_PADDING_DEFAULT, VERTICAL_PADDING_DEFAULT } from '../../constants'
import { TextStyles } from '../../types'

export interface FormEntryField {
  label?: string
  placeHolder?: string
  type: string
  /**
   * @deprecated Use onSaveData instead
   */
  onSetText?: (text: string) => void
  onSaveData?: (data: any) => void
  getErrorMessage?: (text: string) => string
  isRequired?: boolean
  prefill?: string
  id: string
  primaryColor?: string
  secondaryColor?: string
  canContinue?: boolean
  setCanContinue?: (value: boolean) => void
  setHasError?: (value: boolean) => void
  autoFocus?: boolean
  backgroundColor?: ColorValue
  currentPage?: number
  pageIndex?: number
  totalPages?: number
  props?: any
}

const FAIL_SILENTLY = 'failedSilently'
export const InputField: FC<FormEntryField & TextStyles> = ({
  label,
  placeHolder,
  type,
  onSetText,
  getErrorMessage,
  textStyle,
  id,
  primaryColor,
  secondaryColor,
  prefill,
  backgroundColor,
  canContinue,
  setHasError,
  setCanContinue,
  isRequired,
  onSaveData,
  autoFocus,
}) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [text, setText] = useState(prefill ?? '')

  function getKeyboardType(inputType: string) {
    if (inputType == 'email') {
      return 'email-address'
    }

    return 'default'
  }

  function getTextContentType(inputType: string) {
    if (inputType == 'email') {
      return 'emailAddress'
    }

    if (inputType == 'password') {
      return 'password'
    }

    return 'none'
  }

  function getDataDetectorType(inputType: string) {
    return undefined
  }

  function validateTextBasedOnInput(string: string, includeError: boolean) {
    if (type == 'password') {
      // Validate password meets minimum requirements otherwise setError
      const re = new RegExp('^(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$')
      const isOk = re.test(string)
      handleErrorState(
        includeError,
        isOk,
        'Your password must be at least 8 characters and include a number and a special character'
      )
    } else if (type == 'email') {
      const re = new RegExp(/(.+)@(.+){2,}\.(.+){2,}/)
      const isOk = re.test(string)
      handleErrorState(includeError, isOk, 'Invalid e-mail address')
    } else if (type == 'text') {
      const isOk = string.trim().length > 0 // include isRequired check
      handleErrorState(includeError, isOk, FAIL_SILENTLY)
    } else if (type == 'handle') {
      // Validate that only allowed characters are used similar to instagram handles
      const re = new RegExp(/^[a-zA-Z0-9_.]+$/)
      const isOk = re.test(string) && string.length >= 2
      handleErrorState(includeError, isOk, 'Invalid handle')
    }
  }

  function handleErrorState(includeError: boolean, isOk: boolean, errorString: string) {
    if (!isOk) {
      setHasError(true)
    } else {
      setErrorMessage('')
      setHasError(false)
    }
    if (includeError) {
      if (!isOk) {
        setErrorMessage(errorString)
      } else {
        setErrorMessage('')
      }
    }
  }

  useEffect(() => {
    if (isRequired) {
      validateTextBasedOnInput(text, false)
    }
  }, [])

  return (
    <View style={{ marginTop: -6 }}>
      <Text
        style={[
          {
            color: secondaryColor,
            fontSize: 12,
            backgroundColor: backgroundColor ?? '#FFFFFF',
            alignSelf: 'flex-start',
            position: 'relative',
            paddingHorizontal: 4,
            bottom: -22,
            left: 12,
            zIndex: 5,
            opacity: isFocused ? 1 : 0.0,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
      <TextInput
        autoFocus={autoFocus}
        onFocus={() => {
          setIsFocused(true)
        }}
        onBlur={() => {
          validateTextBasedOnInput(text, true)
          setIsFocused(false)
        }}
        value={text}
        textContentType={getTextContentType(type)}
        dataDetectorTypes={getDataDetectorType(type)}
        maxLength={255}
        placeholder={placeHolder}
        style={[
          styles.option,
          {
            paddingVertical: VERTICAL_PADDING_DEFAULT,
            paddingHorizontal: HORIZONTAL_PADDING_DEFAULT,
            marginTop: VERTICAL_PADDING_DEFAULT,
          },
          { borderColor: isFocused ? ( errorMessage && errorMessage != FAIL_SILENTLY ? primaryColor : 'red' ) : secondaryColor },
          textStyle,
        ]}
        keyboardType={getKeyboardType(type)}
        secureTextEntry={type == 'password'}
        onChangeText={(string) => {
          const error = getErrorMessage ? getErrorMessage(string) : null
          if (error) {
            setErrorMessage(error)
          }
          setText(string)
          if (onSetText) {
            onSetText(string)
          }
          if (onSaveData) {
            onSaveData({ text: string })
          }
          // if (!getErrorMessage) {
            // if (isRequired) {
              validateTextBasedOnInput(string, true)
            // }
          // }
        }}
      />
      {errorMessage && errorMessage != FAIL_SILENTLY ? (
        <Text style={[textStyle, styles.errorText]}>{errorMessage}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  option: {
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 12,
    fontSize: 18,
  },
  errorText: {
    fontSize: 14,
    color: '#a60202',
    paddingTop: 8,
  },
})
