import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  ar: {
    translation: {
      common: {
        arabic: 'العربية',
        english: 'ENGLISH',
      },
      login: {
        ariaLabel: 'تسجيل الدخول',
        subtitle: 'فنادق الإدارة',
        title: 'ملاذ الفخامة',
        description: 'ادخل بيانات اعتمادك الخاصة للوصول إلى بوابة الإدارة',
        username: 'اسم المستخدم',
        password: 'كلمة المرور',
        rememberMe: 'تذكرني',
        forgotPassword: 'نسيت كلمة المرور؟',
        submit: 'تسجيل الدخول',
      },
      table: {
        rowsPerPage: 'العرض',
        searchPlaceholder: 'ابحث هنا....',
        searchSubmit: 'عرض البيانات',
        clearSearchAria: 'مسح البحث',
        empty: 'لا توجد بيانات',
        exportExcel: 'طباعة',
        filterSelectPrefix: 'برجاء اختيار',
      },
    },
  },
  en: {
    translation: {
      common: {
        arabic: 'ARABIC',
        english: 'ENGLISH',
      },
      login: {
        ariaLabel: 'Login',
        subtitle: 'Management Hotels',
        title: 'Luxury Haven',
        description: 'Enter your credentials to access the management portal',
        username: 'Username',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        submit: 'Sign in',
      },
      table: {
        rowsPerPage: 'Rows per page',
        searchPlaceholder: 'Search…',
        searchSubmit: 'Apply',
        clearSearchAria: 'Clear search',
        empty: 'No data',
        exportExcel: 'Export',
        filterSelectPrefix: 'Select',
      },
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar',
  fallbackLng: 'ar',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
