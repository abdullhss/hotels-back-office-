import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Settings,
  Building2,
  Hotel,
  Users,
  ClipboardList,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion.jsx'
import { cn } from '../lib/utils.js'

const navItems = [
  { key: 'dashboard', labelAr: 'لوحة التحكم', labelEn: 'Dashboard', path: '/', icon: LayoutDashboard },
  {
    key: 'settings',
    labelAr: 'الإعدادات',
    labelEn: 'Settings',
    path: '/settings',
    icon: Settings,
    children: [
      { key: 'countries', labelAr: 'الدول', labelEn: 'Countries', path: '/settings/countries' },
      { key: 'cities', labelAr: 'المدن', labelEn: 'Cities', path: '/settings/cities' },
      { key: 'nationalities', labelAr: 'الجنسيات', labelEn: 'Nationalities', path: '/settings/nationalities' },
      { key: 'unit-titles', labelAr: 'مسميات الوحدات', labelEn: 'Unit Titles', path: '/settings/unit-titles' },
      { key: 'unit-statuses', labelAr: 'حالات الوحدات', labelEn: 'Unit Statuses', path: '/settings/unit-statuses' },
      { key: 'extra-features', labelAr: 'الخصائص الاضافية', labelEn: 'Additional Features', path: '/settings/extra-features' },
      { key: 'booking-types', labelAr: 'أنواع الحجوزات', labelEn: 'Booking Types', path: '/settings/booking-types' },
    ],
  },
  { key: 'tourism', labelAr: 'شركات السياحة', labelEn: 'Tourism Companies', path: '/tourism', icon: Building2 },
  {
    key: 'hotels',
    labelAr: 'الفنادق',
    labelEn: 'Hotels',
    path: '/hotels',
    icon: Hotel,
    children: [
      { key: 'hotel-details', labelAr: 'بيانات الفندق', labelEn: 'Hotel Details', path: '/hotels' },
      { key: 'units-tree', labelAr: 'شجرة الوحدات', labelEn: 'Units Tree', path: '/hotels/units-tree' },
      { key: 'hotel-services', labelAr: 'الخدمات', labelEn: 'Services', path: '/hotels/services' },
    ],
  },
  {
    key: 'employees',
    labelAr: 'الموظفين والصلاحيات',
    labelEn: 'Employees & Roles',
    path: '/employees',
    icon: Users,
    children: [
      { key: 'departments', labelAr: 'الاقسام', labelEn: 'Departments', path: '/employees' },
      { key: 'staff', labelAr: 'الموظفين', labelEn: 'Employees', path: '/employees/staff' },
      {
        key: 'permission-groups',
        labelAr: 'مجموعات الصلاحيات',
        labelEn: 'Permission Groups',
        path: '/employees/permission-groups',
      },
    ],
  },
  {
    key: 'followup',
    labelAr: 'المتابعة',
    labelEn: 'Follow-up',
    path: '/follow-up',
    icon: ClipboardList,
    children: [
      {
        key: 'follow-bookings',
        labelAr: 'متابعة الحجوزات',
        labelEn: 'Booking Follow-up',
        path: '/follow-up',
      },
      {
        key: 'follow-rooms',
        labelAr: 'متابعة الغرف',
        labelEn: 'Room Follow-up',
        path: '/follow-up/rooms',
      },
    ],
  },
]

function isParentActive(item, pathname) {
  if (item.path === '/') return pathname === '/'
  if (item.path && (pathname === item.path || pathname.startsWith(`${item.path}/`))) {
    return true
  }
  if (Array.isArray(item.children) && item.children.length > 0) {
    return item.children.some(
      (child) => pathname === child.path || pathname.startsWith(`${child.path}/`)
    )
  }
  return false
}

function SidebarLeafLink({ item, location, isArabic, onNavigate }) {
  const Icon = item.icon
  const active = isParentActive(item, location.pathname)
  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
        active
          ? 'bg-[#5b56f7] text-white shadow-md'
          : 'text-[#374151] hover:bg-[#eef2ff] hover:text-[#5b56f7]'
      )}
    >
      <Icon size={20} strokeWidth={1.75} />
      <span>{isArabic ? item.labelAr : item.labelEn}</span>
    </Link>
  )
}

function NavAccordionGroup({ items, location, isArabic, onNavigate }) {
  const openFromRoute = useMemo(
    () => items.find((i) => isParentActive(i, location.pathname))?.key ?? '',
    [items, location.pathname]
  )

  const [value, setValue] = useState(openFromRoute)

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setValue(openFromRoute)
    })
    return () => cancelAnimationFrame(id)
  }, [location.pathname, openFromRoute])

  return (
    <Accordion
      type="single"
      collapsible
      value={value}
      onValueChange={(next) => setValue(next ?? '')}
      className="space-y-1.5"
    >
      {items.map((item) => {
        const Icon = item.icon
        const parentActive = isParentActive(item, location.pathname)
        return (
          <AccordionItem key={item.key} value={item.key} className="border-0">
            <AccordionTrigger
              type="button"
              className={cn(
                'rounded-xl py-3 hover:no-underline',
                'flex w-full items-center justify-between gap-2 px-4 text-sm font-medium transition-all [&[data-state=open]>svg]:rotate-180',
                parentActive
                  ? 'bg-[#5b56f7] text-white shadow-md data-[state=open]:bg-[#5b56f7]'
                  : 'text-[#374151] hover:bg-[#eef2ff] hover:text-[#5b56f7]'
              )}
            >
              <span className="flex min-w-0 flex-1 items-center gap-3">
                <Icon size={20} strokeWidth={1.75} />
                <span>{isArabic ? item.labelAr : item.labelEn}</span>
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-current transition-transform duration-200" />
            </AccordionTrigger>
            <AccordionContent className="pb-0 pt-0">
              <div className="mt-1 space-y-1 ps-5">
                {item.children.map((child) => {
                  const childActive = location.pathname === child.path
                  return (
                    <Link
                      key={child.key}
                      to={child.path}
                      onClick={onNavigate}
                      className={cn(
                        'block rounded-lg px-3 py-2 text-sm transition',
                        childActive
                          ? 'bg-[#e8e7ff] font-medium text-[#4338ca]'
                          : 'text-[#4b5563] hover:bg-[#eef2ff] hover:text-[#5b56f7]'
                      )}
                    >
                      {isArabic ? child.labelAr : child.labelEn}
                    </Link>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

function buildSidebarNav(navItems, location, isArabic, onNavigate) {
  const nodes = []
  for (const item of navItems) {
    if (Array.isArray(item.children) && item.children.length > 0) {
      nodes.push(
        <NavAccordionGroup
          key={item.key}
          items={[item]}
          location={location}
          isArabic={isArabic}
          onNavigate={onNavigate}
        />
      )
    } else {
      nodes.push(
        <SidebarLeafLink
          key={item.key}
          item={item}
          location={location}
          isArabic={isArabic}
          onNavigate={onNavigate}
        />
      )
    }
  }
  return nodes
}

function AppLayout() {
  const location = useLocation()
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const closeMobileNav = () => setMobileNavOpen(false)

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileNavOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileNavOpen])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const menuLabel = isArabic ? 'القائمة' : 'Menu'

  return (
    <div className="min-h-screen bg-[#eef2f7] text-[#1f2937]" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header - enhanced spacing */}
      <header className="sticky top-0 z-30 border-b border-[#dce3ee] bg-white/90 backdrop-blur-sm px-4 py-3 shadow-sm sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dce3ee] bg-white text-[#374151] shadow-sm transition hover:bg-[#eef2ff] hover:text-[#5b56f7] md:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-expanded={mobileNavOpen}
              aria-controls="app-sidebar"
              aria-label={menuLabel}
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </button>

            {/* Brand */}
            <div className="flex min-w-0 items-center gap-2">
              <div className="truncate rounded-xl bg-linear-to-r from-[#5b56f7] to-[#7c6eff] px-3 py-2 text-xs font-semibold text-white shadow-sm sm:px-4 sm:text-sm">
                LuxeStay
              </div>
            </div>
          </div>

          {/* Language toggles */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              className={`rounded-xl px-2 py-1.5 text-xs font-medium transition sm:px-3 sm:text-sm ${
                isArabic ? 'bg-[#5b56f7] text-white' : 'bg-[#f1f5f9] text-[#4b5563] hover:bg-[#e2e8f0]'
              }`}
              onClick={() => i18n.changeLanguage('ar')}
            >
              العربية
            </button>
            <button
              type="button"
              className={`rounded-xl px-2 py-1.5 text-xs font-medium transition sm:px-3 sm:text-sm ${
                !isArabic ? 'bg-[#5b56f7] text-white' : 'bg-[#f1f5f9] text-[#4b5563] hover:bg-[#e2e8f0]'
              }`}
              onClick={() => i18n.changeLanguage('en')}
            >
              English
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity md:hidden',
          mobileNavOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={closeMobileNav}
      />

      <div className="flex min-h-[calc(100vh-76px)]">
        {/* Sidebar — drawer on small screens, static from md */}
        <aside
          id="app-sidebar"
          className={cn(
            'border-[#dce3ee] bg-[#f8fafc] shadow-sm motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out',
            'fixed top-0 z-50 h-full w-[min(280px,88vw)] overflow-y-auto p-5 motion-reduce:transition-none',
            isArabic ? 'border-s' : 'border-e',
            'start-0',
            mobileNavOpen
              ? 'translate-x-0'
              : isArabic
                ? 'translate-x-full md:translate-x-0'
                : '-translate-x-full md:translate-x-0',
            'md:static md:z-0 md:h-auto md:min-h-[calc(100vh-76px)] md:w-[280px] md:translate-x-0 md:overflow-visible md:border-[#dce3ee] md:shadow-sm',
            isArabic ? 'md:border-s' : 'md:border-e'
          )}
        >
          <div className="flex items-center justify-between gap-2 pb-4 md:hidden">
            <span className="text-sm font-semibold text-[#1f2937]">
              {isArabic ? 'التنقل' : 'Navigation'}
            </span>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#4b5563] transition hover:bg-[#eef2ff] hover:text-[#5b56f7]"
              onClick={closeMobileNav}
              aria-label={isArabic ? 'إغلاق القائمة' : 'Close menu'}
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
          <nav className="space-y-1.5">{buildSidebarNav(navItems, location, isArabic, closeMobileNav)}</nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-3 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
