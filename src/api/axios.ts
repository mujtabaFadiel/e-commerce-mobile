import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
    baseURL: 'http://10.15.5.119:3000', // رابط الـ tunnel الخاص بك
    timeout: 10000
});

// الـ Request Interceptor لقراءة التوكن بأمان وبدون أخطاء ناتيف
api.interceptors.request.use(async (config) => {
  try {
    // استخدام SecureStore البديل المتوافق تماماً مع Expo Go
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.log("Error reading token", e);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// الـ Response Interceptor المحدث للتعامل مع الـ Refresh Token تلقائياً عند حدوث خطأ 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // التحقق مما إذا كان الخطأ 401 (Unauthorized) ولم يتم إعادة المحاولة مسبقاً
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // قراءة الـ refresh_token المخزن
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        
        // إرسال طلب التجديد إلى السيرفر
        const res = await axios.post('http://10.15.5.119:3000/auth/refresh', {
          refresh_token: refreshToken,
        });

        if (res.data.access_token) {
          // تحديث الـ access token (الذي تسميه 'token' في مشروعك)
          await SecureStore.setItemAsync('token', res.data.access_token);
          
          // تحديث التوكن في الطلب الحالي وإعادة تنفيذه فوراً
          originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.log('Refresh token expired or invalid', refreshError);
        // في حال فشل التجديد بالكامل، يمكنك مسح التوكنز لتوجيه المستخدم لتسجيل الدخول
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('refresh_token');
      }
    }

    return Promise.reject(error); 
  },
);

export default api;