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
  { key: 'employees', labelAr: 'الموظفين والصلاحيات', labelEn: 'Employees & Roles', path: '/employees', icon: Users },
  { key: 'followup', labelAr: 'المتابعة', labelEn: 'Follow-up', path: '/follow-up', icon: ClipboardList },
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

function SidebarLeafLink({ item, location, isArabic }) {
  const Icon = item.icon
  const active = isParentActive(item, location.pathname)
  return (
    <Link
      to={item.path}
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

function NavAccordionGroup({ items, location, isArabic }) {
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

function buildSidebarNav(navItems, location, isArabic) {
  const nodes = []
  let bucket = []

  const flushBucket = () => {
    if (bucket.length === 0) return
    const key = bucket.map((i) => i.key).join('|')
    nodes.push(
      <NavAccordionGroup
        key={`accordion-${key}`}
        items={bucket}
        location={location}
        isArabic={isArabic}
      />
    )
    bucket = []
  }

  for (const item of navItems) {
    if (Array.isArray(item.children) && item.children.length > 0) {
      bucket.push(item)
    } else {
      flushBucket()
      nodes.push(<SidebarLeafLink key={item.key} item={item} location={location} isArabic={isArabic} />)
    }
  }
  flushBucket()
  return nodes
}

function AppLayout() {
  const location = useLocation()
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  return (
    <div className="min-h-screen bg-[#eef2f7] text-[#1f2937]" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header - enhanced spacing */}
      <header className="sticky top-0 z-30 border-b border-[#dce3ee] bg-white/90 backdrop-blur-sm px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          {/* Language toggles */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
                isArabic ? 'bg-[#5b56f7] text-white' : 'bg-[#f1f5f9] text-[#4b5563] hover:bg-[#e2e8f0]'
              }`}
              onClick={() => i18n.changeLanguage('ar')}
            >
              العربية
            </button>
            <button
              type="button"
              className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
                !isArabic ? 'bg-[#5b56f7] text-white' : 'bg-[#f1f5f9] text-[#4b5563] hover:bg-[#e2e8f0]'
              }`}
              onClick={() => i18n.changeLanguage('en')}
            >
              English
            </button>
          </div>

          {/* Search bar - wider and better spacing */}
          {/* <div className="w-full max-w-md">
            <input
              type="search"
              placeholder={isArabic ? 'بحث...' : 'Search...'}
              className="h-11 w-full rounded-2xl border border-[#dce3ee] bg-white px-5 text-sm outline-none focus:border-[#5b56f7] focus:ring-1 focus:ring-[#5b56f7] transition"
            />
          </div> */}

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-linear-to-r from-[#5b56f7] to-[#7c6eff] px-4 py-2 text-sm font-semibold text-white shadow-sm">
              LuxeStay
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-76px)]">
        {/* Sidebar - enhanced width, spacing, and RTL border */}
        <aside
          className={`w-[280px] ${
            isArabic ? 'border-r' : 'border-l'
          } border-[#dce3ee] bg-[#f8fafc] p-5 shadow-sm`}
        >
          <nav className="space-y-1.5">{buildSidebarNav(navItems, location, isArabic)}</nav>
        </aside>

        {/* Main content - enhanced padding */}
        <main className="flex-1 p-6">
          {/* <div className="min-h-full rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm"> */}
            <Outlet />
          {/* </div> */}
        </main>
      </div>
    </div>
  )
}

export default AppLayout
