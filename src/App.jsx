import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Login from './components/Login.jsx'
import AppLayout from './components/AppLayout.jsx'
import DashboardHome from './components/DashboardHome.jsx'
import SimplePage from './components/SimplePage.jsx'
import HotelsTablePage from './components/HotelsTablePage.jsx'
import CountriesPage from './pages/CountriesPage.jsx'
import CitiesPage from './pages/CitiesPage.jsx'
import NationalitiesPage from './pages/NationalitiesPage.jsx'
import UnitTitlesPage from './pages/UnitTitlesPage.jsx'
import UnitStatusesPage from './pages/UnitStatusesPage.jsx'
import ExtraFeaturesPage from './pages/ExtraFeaturesPage.jsx'
import BookingTypesPage from './pages/BookingTypesPage.jsx'

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
        <Route path="/settings/cities" element={<CitiesPage />} />
        <Route path="/settings/nationalities" element={<NationalitiesPage />} />
        <Route path="/settings/unit-titles" element={<UnitTitlesPage />} />
        <Route path="/settings/unit-statuses" element={<UnitStatusesPage />} />
        <Route path="/settings/extra-features" element={<ExtraFeaturesPage />} />
        <Route path="/settings/booking-types" element={<BookingTypesPage />} />
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
