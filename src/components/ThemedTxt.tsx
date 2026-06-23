import { StyleSheet, Text, TextStyle, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/theme';

const Typo = ({
    size = 16,
    color = colors.text.primary,
    fontWeight = '400',
    children,
    style,
    textProps = {}
}: any) => {
    
    const textStyle: TextStyle = {
        color,
        fontWeight,
    }
  return (
    <Text style={[textStyle, style]} {...textProps}>
        {children}
    </Text>
  )
}

export default Typo

const styles = StyleSheet.create({})