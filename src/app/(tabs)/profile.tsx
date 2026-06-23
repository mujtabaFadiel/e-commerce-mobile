import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import SafeScreen from '@/components/SafeScreen'
import { colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as SecureStore from 'expo-secure-store';
import { Href, useRouter } from 'expo-router';


const MENU_ITEMS = [
  { id: 1, icon: "person-outline", title: "Edit Profile", color: "#3B82F6", action: "/profile" },
  { id: 2, icon: "list-outline", title: "Orders", color: "#10B981", action: "/orders" },
  { id: 3, icon: "heart-outline", title: "Wishlist", color: "#EF4444", action: "/wishlist" },
  //{ id: 4, icon: "location-outline", title: "Addresses", color: "#F59E0B", action: "/addresses" },
] as const;

const defaultImg = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'

const Profile = () => {

  const router = useRouter()

  const [user, setUser]: any = useState()

  const handleMenuPress = (action: (typeof MENU_ITEMS)[number]["action"]) => {
    if(action === '/profile') return;
    router.push(`/(profile)${action}` as Href)
  }

  const getUser = async () => {
    const data: any = await SecureStore.getItemAsync('user')
    setUser(JSON.parse(data))
  }
  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('token')
      await SecureStore.deleteItemAsync('user')

      router.replace('/(auth)/login')
    } catch (error) {
      console.error("Error during sign out:", error)
    }
  }

  useEffect(() => {
    getUser()
  }, [])
  return (
    <SafeScreen>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/*HEADER*/}
        <View style={{ paddingHorizontal: 24, paddingBottom: 32, paddingTop: 12 }}>
          <View style={{
            backgroundColor: colors.surface.DEFAULT,
            borderRadius: 24,
            padding: 24
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.container}>
                <Image
                  source={{ uri: defaultImg }}
                  style={styles.avatar}
                // transition={200}
                />
                <View style={styles.badge}>
                  <Ionicons name="checkmark" size={14} color="#121212" />
                </View>
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.userName} numberOfLines={1}>
                  {user?.username}
                </Text>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {user?.email}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/*Menu items*/}
        <View style={styles.menuItems}>
          {
            MENU_ITEMS.map(item => (
              <TouchableOpacity
                style={styles.cardContainer}
                key={item.id}
                activeOpacity={0.7}
                onPress={()=>handleMenuPress(item.action)}
              >
                <View style={styles.content}>
                  <View
                    style={[styles.iconContainer,
                    { backgroundColor: item.color + "20" }]}
                  >
                    <Ionicons name={item.icon} size={28} color={item.color} />
                  </View>
                  <Text style={styles.title}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            ))
          }
        </View>

        <View style={styles.wrapper}>
          {/* NOTIFICATIONS LINK */}
          <View style={styles.linkCard}>
            <TouchableOpacity
              style={styles.rowBetween}
              activeOpacity={0.7}
            >
              <View style={styles.rowCenter}>
                <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
                <Text style={styles.linkText}>Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* PRIVACY AND SECURITY LINK */}
          <View style={styles.linkCard}>
            <TouchableOpacity
              style={styles.rowBetween}
              activeOpacity={0.7}
            >
              <View style={styles.rowCenter}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#FFFFFF" />
                <Text style={styles.linkText}>Privacy & Security</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* SIGNOUT BTN */}
          <TouchableOpacity
            style={styles.signOutBtn}
            activeOpacity={0.8}
            onPress={() => signOut()}
          >
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>

          {/* VERSION TEXT */}
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeScreen>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40, // دائرة كاملة (نصف القطر)
    backgroundColor: '#282828', // خلفية مؤقتة للصورة أثناء التحميل
  },
  badge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.primary.DEFAULT, // اللون الأساسي المضيء لديك
    width: 26,  // ما يقابل size-7 تقريباً
    height: 26,
    borderRadius: 13, // نصف القطر لجعله دائرياً تماماً
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface.DEFAULT, // لون الكارت أو الخلفية اللي خلفه عشان يفصل الـ Badge عن الصورة
  },
  textContainer: {
    flex: 1,           // ما يقابل flex-1 ليأخذ المساحة المتبقية بجانب الـ Avatar
    marginLeft: 16,    // ما يقابل ml-4 (4 * 4 = 16px)
    justifyContent: 'center', // لتوسيط النصوص عمودياً مع الصورة
  },
  userName: {
    color: colors.text.primary, // ما يقابل text-text-primary
    fontSize: 24,               // ما يقابل text-2xl
    fontWeight: 'bold',         // ما يقابل font-bold
    marginBottom: 4,            // ما يقابل mb-1 (1 * 4 = 4px)
  },
  userEmail: {
    color: colors.text.secondary, // ما يقابل text-text-secondary
    fontSize: 14,                 // ما يقابل text-sm
  },
  menuItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginHorizontal: 24,
    marginBottom: 12,
  },
  cardContainer: {
    backgroundColor: colors.surface.DEFAULT,
    borderRadius: 16,
    padding: 24,
    justifyContent: 'center',
    width: '48%'
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: colors.text.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  wrapper: {
    width: '100%',
  },
  linkCard: {
    backgroundColor: colors.surface.DEFAULT,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: colors.text.primary,
    fontWeight: '600',
    marginLeft: 12,
  },
  signOutBtn: {
    backgroundColor: colors.surface.DEFAULT,
    borderRadius: 16,
    paddingVertical: 15,
    marginHorizontal: 24,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  signOutText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  versionText: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 24,
    marginBottom: 12,
  },
});