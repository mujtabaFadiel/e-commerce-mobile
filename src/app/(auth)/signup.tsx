import {
  Pressable, ScrollView, Text, TextInput,
  TouchableOpacity, View, StatusBar, StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import api from '../../api/axios'
import { router, useRouter } from 'expo-router'
import { colors } from '@/constants/theme'

const DARK = '#0f0d1a'

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPass] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const route = useRouter()

  const handleSubmit = async () => {
    setIsLoading(true)
    if (!username || !email || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await api.post('/users/register', {
        username: username,
        email: email,
        password: password
      });

      route.replace('/(auth)/login')

    } catch (error: any) {
      setIsLoading(true)
      console.log("Axios Error Object:", JSON.stringify(error, null, 2));

      if (error.response) {
        console.log("Server Error Data:", error.response.data);
        console.log("Server Status:", error.response.status);

        const errorMessage = error.response.data?.message;
        const formattedError = Array.isArray(errorMessage)
          ? errorMessage.join('\n')
          : errorMessage || 'Validation failed';

        Alert.alert(
          error.response.status === 409 ? 'Conflict' : 'Validation Error',
          formattedError
        );
      }
      else if (error.request) {
        console.log("No response received. Request details:", error.request);
        Alert.alert('Network Error', 'No response from server. Check your tunnel connection.');
      }
      else {
        console.log('Error Message:', error.message);
        Alert.alert('Error', error.message);
      }
      setIsLoading(false)
    }
  }


  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Dark header */}
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Ionicons name="sparkles" size={18} color="white" />
        </View>
        <Text style={styles.eyebrow}>Welcome</Text>
        <Text style={styles.title}>Create your{'\n'}account</Text>
      </View>

      {/* White card */}
      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >

          {/* Username */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputRow}>
              <Ionicons name="person-outline" size={16} color="#bbb" />
              <TextInput
                placeholder="your_username"
                placeholderTextColor="#bbb"
                style={styles.input}
                autoCapitalize="none"
                onChangeText={(value) => setUsername(value)}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={16} color="#bbb" />
              <TextInput
                placeholder="hello@email.com"
                placeholderTextColor="#bbb"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(value) => setEmail(value)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={[styles.fieldWrap, { marginBottom: 28 }]}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={16} color="#bbb" />
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#bbb"
                style={styles.input}
                secureTextEntry={!showPassword}
                onChangeText={(value) => setPass(value)}
              />
              <Pressable onPress={() => setShowPassword(p => !p)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={16} color="#bbb"
                />
              </Pressable>
            </View>
          </View>

          {/* Sign up button */}
          {!isLoading ? (<TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={handleSubmit}
          >
            <Text style={styles.primaryBtnText}>Sign up</Text>
          </TouchableOpacity>) : (
            <ActivityIndicator color={'#222'} size={'large'} />
          )}

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google */}
          <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
            <Ionicons name="logo-google" size={16} color="#555" />
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerLink}>Log in</Text>
            </Pressable>
          </View>

        </ScrollView>
      </View>
    </View>
  )
}

export default Signup

const styles = StyleSheet.create({
  root: {
    flex: 1,
    //backgroundColor: DARK 
    backgroundColor: colors.background.DEFAULT
  },
  header: {
    paddingHorizontal: 28,
    paddingTop: 64,
    paddingBottom: 40,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  eyebrow: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '500',
    lineHeight: 32,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 32,
  },
  fieldWrap: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#aaa',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ececec',
    borderRadius: 14,
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#222',
  },
  primaryBtn: {
    height: 52,
    backgroundColor: DARK,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  dividerText: {
    fontSize: 12,
    color: '#ccc',
  },
  googleBtn: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ececec',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 28,
  },
  googleBtnText: {
    fontSize: 14,
    color: '#444',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    color: '#aaa',
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '500',
    color: DARK,
  },
})