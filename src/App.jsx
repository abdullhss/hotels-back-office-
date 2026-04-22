import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Login from './components/Login.jsx'
import AppLayout from './components/AppLayout.jsx'
import DashboardHome from './components/DashboardHome.jsx'
import SimplePage from './components/SimplePage.jsx'
import HotelsTablePage from './components/HotelsTablePage.jsx'
import CountriesPage from './pages/CountriesPage.jsx'

function App() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
  }, [i18n.language, isArabic])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/settings" element={<SimplePage title={isArabic ? 'الإعدادات' : 'Settings'} />} />
        <Route path="/settings/countries" element={<CountriesPage />} />
        <Route
          path="/tourism"
          element={<SimplePage title={isArabic ? 'شركات السياحة' : 'Tourism Companies'} />}
        />
        <Route path="/hotels" element={<HotelsTablePage />} />
        <Route
          path="/employees"
          element={<SimplePage title={isArabic ? 'الموظفين والصلاحيات' : 'Employees & Roles'} />}
        />
        <Route path="/follow-up" element={<SimplePage title={isArabic ? 'المتابعة' : 'Follow-up'} />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
