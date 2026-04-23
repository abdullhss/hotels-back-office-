import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Toaster } from 'sonner'
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
import TourismCompaniesPage from './pages/TourismCompaniesPage.jsx'
import HotelDataPage from './pages/HotelDataPage.jsx'
import UnitsTreePage from './pages/UnitsTreePage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import DepartmentsPage from './pages/DepartmentsPage.jsx'
import EmployeesPage from './pages/EmployeesPage.jsx'
import PermissionGroupsPage from './pages/PermissionGroupsPage.jsx'
import BookingFollowUpPage from './pages/BookingFollowUpPage.jsx'
import RoomFollowUpPage from './pages/RoomFollowUpPage.jsx'

function App() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
  }, [i18n.language, isArabic])

  return (
    <>
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
        <Route path="/tourism" element={<TourismCompaniesPage />} />
        <Route path="/hotels" element={<HotelDataPage />} />
        <Route path="/hotels/list" element={<HotelsTablePage />} />
        <Route path="/hotels/units-tree" element={<UnitsTreePage />} />
        <Route path="/hotels/services" element={<ServicesPage />} />
        <Route path="/employees" element={<DepartmentsPage />} />
        <Route path="/employees/staff" element={<EmployeesPage />} />
        <Route path="/employees/permission-groups" element={<PermissionGroupsPage />} />
        <Route path="/follow-up" element={<BookingFollowUpPage />} />
        <Route path="/follow-up/rooms" element={<RoomFollowUpPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors position="top-center" dir={isArabic ? 'rtl' : 'ltr'} />
    </>
  )
}

export default App
