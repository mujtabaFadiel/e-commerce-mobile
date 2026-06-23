import { StyleSheet, View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '../constants/theme';

const SafeScreen = ({children}: {children:React.ReactNode}) => {
  const insets = useSafeAreaInsets()
    return (
    <View
        style={{
          paddingTop: insets.top, 
          flex: 1,
          backgroundColor: colors.background.DEFAULT
          //backgroundColor: '#0f0d1a'
        }}
    >
        {children}
    </View>
  )
}

export default SafeScreen

const styles = StyleSheet.create({})