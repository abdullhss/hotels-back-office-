import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeftRight,
  Bed,
  Search,
  Snowflake,
  Tv,
  WashingMachine,
  Wifi,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../lib/utils'

const STATUS_ORDER = ['available', 'occupied', 'reserved', 'cleaning', 'maintenance']

const STATUS_THEME = {
  available: {
    bar: 'border-emerald-500',
    dot: 'bg-emerald-500',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  },
  occupied: {
    bar: 'border-red-500',
    dot: 'bg-red-500',
    badge: 'border-red-200 bg-red-50 text-red-800',
  },
  reserved: {
    bar: 'border-amber-400',
    dot: 'bg-amber-400',
    badge: 'border-amber-200 bg-amber-50 text-amber-900',
  },
  cleaning: {
    bar: 'border-orange-500',
    dot: 'bg-orange-500',
    badge: 'border-orange-200 bg-orange-50 text-orange-900',
  },
  maintenance: {
    bar: 'border-fuchsia-600',
    dot: 'bg-fuchsia-600',
    badge: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-900',
  },
}

const AMENITY_ICON = {
  wifi: Wifi,
  tv: Tv,
  ac: Snowflake,
  washer: WashingMachine,
}

function formatLy(amount) {
  const n = Number(amount)
  if (Number.isNaN(n)) return `${amount} د.ل`
  return `${n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} د.ل`
}

function nextStatus(current) {
  const i = STATUS_ORDER.indexOf(current)
  return STATUS_ORDER[(i + 1) % STATUS_ORDER.length]
}

const SEED_ROOMS = [
  {
    id: 1,
    number: '101',
    categoryAr: 'غرفة',
    categoryEn: 'Room',
    unitTypeAr: 'فردي',
    unitTypeEn: 'Single',
    price: 450,
    status: 'occupied',
    amenities: ['wifi', 'tv', 'ac', 'washer', 'wifi'],
  },
  {
    id: 2,
    number: '105',
    categoryAr: 'غرفة',
    categoryEn: 'Room',
    unitTypeAr: 'مزدوج',
    unitTypeEn: 'Double',
    price: 580,
    status: 'cleaning',
    amenities: ['wifi', 'tv', 'ac'],
  },
  {
    id: 3,
    number: '203',
    categoryAr: 'سويت',
    categoryEn: 'Suite',
    unitTypeAr: 'جناح ملكي',
    unitTypeEn: 'Royal suite',
    price: 1500,
    status: 'available',
    amenities: ['wifi', 'tv', 'ac', 'washer'],
  },
  {
    id: 4,
    number: '208',
    categoryAr: 'غرفة',
    categoryEn: 'Room',
    unitTypeAr: 'مزدوج',
    unitTypeEn: 'Double',
    price: 620,
    status: 'reserved',
    amenities: ['wifi', 'tv'],
  },
  {
    id: 5,
    number: '305',
    categoryAr: 'سويت',
    categoryEn: 'Suite',
    unitTypeAr: 'تنفيذي',
    unitTypeEn: 'Executive',
    price: 980,
    status: 'cleaning',
    amenities: ['wifi', 'tv', 'ac', 'washer'],
  },
  {
    id: 6,
    number: '312',
    categoryAr: 'غرفة',
    categoryEn: 'Room',
    unitTypeAr: 'فردي',
    unitTypeEn: 'Single',
    price: 410,
    status: 'maintenance',
    amenities: ['wifi', 'ac'],
  },
  {
    id: 7,
    number: '401',
    categoryAr: 'غرفة',
    categoryEn: 'Room',
    unitTypeAr: 'ثلاثي',
    unitTypeEn: 'Triple',
    price: 720,
    status: 'available',
    amenities: ['wifi', 'tv', 'ac', 'washer'],
  },
  {
    id: 8,
    number: '415',
    categoryAr: 'سويت',
    categoryEn: 'Suite',
    unitTypeAr: 'جونيور',
    unitTypeEn: 'Junior suite',
    price: 1100,
    status: 'occupied',
    amenities: ['wifi', 'tv', 'ac'],
  },
]

export default function RoomFollowUpPage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const copy = useMemo(
    () =>
      isArabic
        ? {
            title: 'متابعة الغرف',
            subtitle: 'متابعة حالة الغرف في الوقت الفعلي',
            searchPlaceholder: '...ابحث هنا',
            unitType: 'نوع الوحدة',
            availability: 'التوافر',
            changeStatus: 'تغيير حالة الوحدة',
            statusNames: {
              available: 'متاحة',
              occupied: 'مشغولة',
              reserved: 'محجوزة',
              cleaning: 'تنظيف',
              maintenance: 'صيانة',
            },
            legendAvailable: 'متاحة',
            legendOccupied: 'مشغولة',
            legendReserved: 'محجوزة',
            legendCleaning: 'تنظيف',
            legendMaintenance: 'صيانة',
            toastStatus: (room, label) => `تم تحديث الغرفة ${room} إلى: ${label}`,
            toastAvailability: (room) => `فتح التوافر للغرفة ${room} (قريباً)`,
            amenityLabels: {
              wifi: 'إنترنت',
              tv: 'تلفاز',
              ac: 'تكييف',
              washer: 'غسالة',
            },
          }
        : {
            title: 'Room monitoring',
            subtitle: 'Real-time monitoring of room status',
            searchPlaceholder: 'Search here…',
            unitType: 'Unit type',
            availability: 'Availability',
            changeStatus: 'Change unit status',
            statusNames: {
              available: 'Available',
              occupied: 'Occupied',
              reserved: 'Reserved',
              cleaning: 'Cleaning',
              maintenance: 'Maintenance',
            },
            legendAvailable: 'Available',
            legendOccupied: 'Occupied',
            legendReserved: 'Reserved',
            legendCleaning: 'Cleaning',
            legendMaintenance: 'Maintenance',
            toastStatus: (room, label) => `Room ${room} is now: ${label}`,
            toastAvailability: (room) => `Availability for room ${room} (coming soon)`,
            amenityLabels: {
              wifi: 'Internet',
              tv: 'TV',
              ac: 'A/C',
              washer: 'Laundry',
            },
          },
    [isArabic]
  )

  const [rooms, setRooms] = useState(() => SEED_ROOMS.map((r) => ({ ...r })))
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rooms
    return rooms.filter((r) => {
      const blob = [
        r.number,
        isArabic ? r.categoryAr : r.categoryEn,
        isArabic ? r.unitTypeAr : r.unitTypeEn,
        copy.statusNames[r.status],
      ]
        .join(' ')
        .toLowerCase()
      return blob.includes(q)
    })
  }, [rooms, query, isArabic, copy])

  const statusLabel = useCallback((s) => copy.statusNames[s] ?? s, [copy])

  const handleCycleStatus = useCallback(
    (room) => {
      const ns = nextStatus(room.status)
      setRooms((prev) => prev.map((x) => (x.id === room.id ? { ...x, status: ns } : x)))
      toast.success(copy.toastStatus(room.number, statusLabel(ns)))
    },
    [copy, statusLabel]
  )

  const handleAvailability = useCallback(
    (room) => {
      toast.message(copy.toastAvailability(room.number))
    },
    [copy]
  )

  const legendItems = useMemo(
    () =>
      STATUS_ORDER.map((key) => ({
        key,
        label:
          key === 'available'
            ? copy.legendAvailable
            : key === 'occupied'
              ? copy.legendOccupied
              : key === 'reserved'
                ? copy.legendReserved
                : key === 'cleaning'
                  ? copy.legendCleaning
                  : copy.legendMaintenance,
        dot: STATUS_THEME[key].dot,
      })),
    [copy]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">{copy.title}</h1>
          <p className="text-sm text-gray-600">{copy.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:max-w-[min(100%,32rem)] lg:justify-end">
          {legendItems.map((item) => (
            <div key={item.key} className="flex items-center gap-2 text-sm text-gray-700">
              <span className={cn('h-3 w-3 shrink-0 rounded-full', item.dot)} aria-hidden />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute inset-s-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          strokeWidth={2}
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={copy.searchPlaceholder}
          className={cn(
            'w-full rounded-full border border-[#e2e8f0] bg-white py-3.5 pe-4 ps-12 text-sm text-gray-900 shadow-sm outline-none transition',
            'placeholder:text-gray-400 focus:border-[#c7d2fe] focus:ring-2 focus:ring-[#c7d2fe]/60'
          )}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filtered.map((room) => {
          const theme = STATUS_THEME[room.status] ?? STATUS_THEME.available
          const amenities = room.amenities ?? []
          const shown = amenities.slice(0, 4)
          const extra = Math.max(0, amenities.length - 4)

          return (
            <article
              key={room.id}
              className={cn(
                'flex flex-col overflow-hidden rounded-2xl border border-[#e8ecf1] bg-white shadow-sm',
                'border-t-4',
                theme.bar
              )}
            >
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 text-start">
                    <p className="text-sm font-medium text-gray-600">
                      {isArabic ? room.categoryAr : room.categoryEn}
                    </p>
                    <p className="text-2xl font-bold tabular-nums text-gray-900">{room.number}</p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-lg border px-2.5 py-1 text-xs font-semibold',
                      theme.badge
                    )}
                  >
                    {statusLabel(room.status)}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {isArabic ? room.unitTypeAr : room.unitTypeEn}
                  </span>
                  <span className="text-xs font-medium text-gray-500">{copy.unitType}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-1.5 text-[#2563eb]">
                    <Bed className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
                    <span className="text-base font-semibold tabular-nums text-gray-900">
                      {formatLy(room.price)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  {shown.map((key, idx) => {
                    const Icon = AMENITY_ICON[key] ?? Wifi
                    const label = copy.amenityLabels[key] ?? key
                    return (
                      <span key={`${room.id}-${key}-${idx}`} className="flex items-center gap-1">
                        <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
                        {label}
                      </span>
                    )
                  })}
                  {extra > 0 && (
                    <span className="font-semibold text-gray-400" aria-label={`+${extra}`}>
                      +{extra}
                    </span>
                  )}
                </div>

                <div className="mt-auto flex items-stretch gap-2 pt-1">
                  <button
                    type="button"
                    title={copy.changeStatus}
                    onClick={() => handleCycleStatus(room)}
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-600',
                      'transition hover:bg-orange-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400'
                    )}
                    aria-label={copy.changeStatus}
                  >
                    <ArrowLeftRight className="h-5 w-5" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAvailability(room)}
                    className={cn(
                      'min-h-11 flex-1 rounded-xl px-4 text-sm font-semibold transition',
                      'bg-[#eef2ff] text-brand-primary hover:bg-[#e0e7ff]',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary/40'
                    )}
                  >
                    {copy.availability}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-gray-500">
          {isArabic ? 'لا توجد غرف مطابقة لبحثك.' : 'No rooms match your search.'}
        </p>
      )}
    </div>
  )
}
