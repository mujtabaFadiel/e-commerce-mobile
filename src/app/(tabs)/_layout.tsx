import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BlurView } from 'expo-blur';

const TabsLayout = () => {

    const insets = useSafeAreaInsets()
  return (
    <Tabs
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#108954',
            tabBarInactiveTintColor: '#B3B3B3',
            tabBarStyle: {
                position: 'absolute',
                backgroundColor: 'transparent',
                borderTopWidth: 0,
                borderBottomWidth: 0,
                height: 60,
                marginHorizontal: 100,
                paddingTop: 4,
                marginBottom: 30,
                borderRadius: 24, 
                overflow: 'hidden'
            },
            tabBarBackground:() => (
                <BlurView intensity={80} tint='dark'
                    style={StyleSheet.absoluteFill}
                />
            ),
            tabBarLabelStyle: {
                fontSize: 10,
                fontWeight: 600,
            },

        }}
    >
        <Tabs.Screen 
            name='index'
            options={{
                title: 'Shop',
                tabBarIcon: ({color, size}) => <Ionicons name='grid' size={size} color={color} />
            }}
        />
        <Tabs.Screen 
            name='cart'
            options={{
                title: 'Cart',
                tabBarIcon: ({color, size}) => <Ionicons name='cart' size={size} color={color} />
            }}
        />
        <Tabs.Screen 
            name='profile'
            options={{
                title: 'Profile',
                tabBarIcon: ({color, size}) => <Ionicons name='person' size={size} color={color} />
            }}
        />
    </Tabs>
  )
}

export default TabsLayout

const styles = StyleSheet.create({})