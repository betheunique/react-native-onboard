import React, { FC } from 'react'
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { OnboardComponents } from '../index'
import { PageData } from '../types'

export interface HeaderProps {
  style?: StyleProp<ViewStyle> | undefined
  Components: OnboardComponents
  primaryColor?: string
  secondaryColor?: string
  currentPage: number
  goToPreviousPage: () => void
  onClose: () => void
  pages?: PageData[]
  showFooter?: boolean
  showHeader?: boolean
  pageProgress: Animated.Value
  props?: any
}

export const Header: FC<HeaderProps> = ({
  style,
  Components,
  primaryColor,
  secondaryColor,
  currentPage,
  pages,  
  pageProgress,
  ...props
}) => {
  const totalPages = pages?.length ?? 0

  return (
    <View style={[style]} {...props}>
      <Components.PaginationComponent
        paginationColor={primaryColor}
        paginationSelectedColor={secondaryColor}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </View>
  )
}

const styles = StyleSheet.create({})
