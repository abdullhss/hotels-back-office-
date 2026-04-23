import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChefHat,
  Mail,
  MapPin,
  Phone,
  Plus,
  Snowflake,
  Star,
  Trash2,
  Tv,
  WashingMachine,
  Wifi,
  Trees,
  ImagePlus,
} from 'lucide-react'
import AddHotelFeatureDialog from '../components/AddHotelFeatureDialog.jsx'
import { cn } from '../lib/utils'

const ICON_KEYS = ['chef-hat', 'snowflake', 'washer', 'tv', 'wifi', 'trees']

const ICON_MAP = {
  'chef-hat': ChefHat,
  snowflake: Snowflake,
  washer: WashingMachine,
  tv: Tv,
  wifi: Wifi,
  trees: Trees,
}

const INITIAL_FEATURES = [
  { id: 1, nameAr: 'مطبخ', nameEn: 'Kitchen', iconKey: 'chef-hat' },
  { id: 2, nameAr: 'مكيف هواء', nameEn: 'Air conditioning', iconKey: 'snowflake' },
  { id: 3, nameAr: 'غسالة', nameEn: 'Washing machine', iconKey: 'washer' },
  { id: 4, nameAr: 'تلفاز', nameEn: 'TV', iconKey: 'tv' },
  { id: 5, nameAr: 'إنترنت', nameEn: 'Internet', iconKey: 'wifi' },
  { id: 6, nameAr: 'شرفة', nameEn: 'Balcony', iconKey: 'trees' },
]

const GALLERY_MAIN = 'https://picsum.photos/seed/grandplaza-main/960/720'
const GALLERY_SMALL = [
  'https://picsum.photos/seed/grandplaza-pool/400/400',
  'https://picsum.photos/seed/grandplaza-room/400/400',
  'https://picsum.photos/seed/grandplaza-view/400/400',
]

export default function HotelDataPage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const [features, setFeatures] = useState(() => [...INITIAL_FEATURES])
  const [addFeatureOpen, setAddFeatureOpen] = useState(false)

  const handleSaveFeature = useCallback(({ nameAr, nameEn }) => {
    setFeatures((prev) => {
      const nextId = prev.reduce((m, f) => Math.max(m, f.id), 0) + 1
      const iconKey = ICON_KEYS[prev.length % ICON_KEYS.length]
      return [...prev, { id: nextId, nameAr, nameEn, iconKey }]
    })
  }, [])

  const removeFeature = useCallback((id) => {
    setFeatures((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const copy = useMemo(
    () =>
      isArabic
        ? {
            pageTitle: 'الفندق',
            pageSubtitle: 'عرض بيانات الفندق وإدارة المميزات والصور',
            addPhotos: 'إضافة صور',
            addPhotosSoon: 'قريباً',
            active: 'نشط',
            descriptionHeading: 'الوصف',
            descAr: `يقع فندق جراند بلازا على كورنيش النيل ويقدم إقامة فاخرة مع إطلالات خلابة، مطاعم متنوعة، ومرافق عائلية ممتازة قرب أهم المعالم.`,
            descEn: `Grand Plaza stands on the Nile Corniche and offers luxury stays with stunning views, diverse dining, and excellent family facilities near major landmarks.`,
            phoneLabel: 'رقم الهاتف',
            addressLabel: 'العنوان',
            emailLabel: 'البريد الإلكتروني',
            featuresHeading: 'المميزات والخصائص',
            addFeature: 'إضافة ميزة',
            morePhotos: 'المزيد من الصور',
            morePhotosCount: '+2',
            starTagline: 'فندق فاخر من فئة 5 نجوم',
          }
        : {
            pageTitle: 'The hotel',
            pageSubtitle: 'View hotel details and manage features and photos',
            addPhotos: 'Add photos',
            addPhotosSoon: 'Coming soon',
            active: 'Active',
            descriptionHeading: 'Description',
            descAr: `يقع فندق جراند بلازا على كورنيش النيل ويقدم إقامة فاخرة مع إطلالات خلابة، مطاعم متنوعة، ومرافق عائلية ممتازة قرب أهم المعالم.`,
            descEn: `Grand Plaza stands on the Nile Corniche and offers luxury stays with stunning views, diverse dining, and excellent family facilities near major landmarks.`,
            phoneLabel: 'Phone',
            addressLabel: 'Address',
            emailLabel: 'Email',
            featuresHeading: 'Features & amenities',
            addFeature: 'Add feature',
            morePhotos: 'More photos',
            morePhotosCount: '+2',
            starTagline: '5-Star Luxury Hotel',
          },
    [isArabic]
  )

  const hotelName = 'Grand Plaza Hotel & Resort'
  const phone = '+200000000000'
  const address = '123 Nile Corniche, Cairo, Egypt'
  const email = 'info@grandplaza.com'

  return (
    <div className="space-y-8">
      <AddHotelFeatureDialog
        open={addFeatureOpen}
        onOpenChange={setAddFeatureOpen}
        onSave={handleSaveFeature}
        isArabic={isArabic}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">{copy.pageTitle}</h1>
          <p className="text-sm text-gray-600">{copy.pageSubtitle}</p>
        </div>
        <button
          type="button"
          disabled
          title={copy.addPhotosSoon}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-3 text-sm font-medium text-white shadow-sm opacity-70 cursor-not-allowed ms-auto"
        >
          <ImagePlus className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
          {copy.addPhotos}
        </button>
      </div>

      {/* Gallery */}
      <section className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="relative min-h-[220px] overflow-hidden rounded-xl bg-gray-100 md:min-h-[280px]">
            <img
              src={GALLERY_MAIN}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {GALLERY_SMALL.map((src, i) => (
              <div key={src} className="aspect-square overflow-hidden rounded-xl bg-gray-100">
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            <button
              type="button"
              className="relative flex aspect-square flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-gray-900/75 text-center text-white transition hover:bg-gray-900/85"
            >
              <span className="text-lg font-bold">{copy.morePhotosCount}</span>
              <span className="px-2 text-xs font-medium leading-tight">{copy.morePhotos}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Hotel headline */}
      <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 md:text-2xl" dir="ltr">
              {hotelName}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">{copy.starTagline}</span>
              <div className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                    strokeWidth={1.5}
                  />
                ))}
              </div>
            </div>
          </div>
          <span className="inline-flex items-center rounded-lg border border-emerald-500/40 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            {copy.active}
          </span>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-6">
          <h3 className="mb-3 text-base font-semibold text-gray-900">{copy.descriptionHeading}</h3>
          <div className="space-y-4 text-sm leading-relaxed text-gray-700">
            <p>{copy.descAr}</p>
            <p dir="ltr" className="text-gray-600">
              {copy.descEn}
            </p>
          </div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-start gap-3 rounded-2xl border border-[#e8ecf1] bg-[#f8fafc] p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
            <Phone className="h-5 w-5 text-brand-primary" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-500">{copy.phoneLabel}</p>
            <p className="mt-1 font-semibold text-gray-900" dir="ltr">
              {phone}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-[#e8ecf1] bg-[#f8fafc] p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
            <MapPin className="h-5 w-5 text-brand-primary" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-500">{copy.addressLabel}</p>
            <p className="mt-1 font-semibold text-gray-900" dir="ltr">
              {address}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-[#e8ecf1] bg-[#f8fafc] p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
            <Mail className="h-5 w-5 text-brand-primary" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-500">{copy.emailLabel}</p>
            <p className="mt-1 font-semibold text-gray-900 break-all" dir="ltr">
              {email}
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-900">{copy.featuresHeading}</h3>
          <button
            type="button"
            onClick={() => setAddFeatureOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-primary-hover ms-auto"
          >
            <Plus className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
            {copy.addFeature}
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {features.map((f) => {
            const Icon = ICON_MAP[f.iconKey] ?? ChefHat
            const label = isArabic ? f.nameAr : f.nameEn
            return (
              <div
                key={f.id}
                className="flex min-w-[200px] flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm sm:max-w-[280px]"
              >
                <Icon className="h-5 w-5 shrink-0 text-gray-500" strokeWidth={1.75} aria-hidden />
                <span className="flex-1 text-sm font-medium text-gray-800">{label}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(f.id)}
                  className={cn(
                    'shrink-0 rounded-lg p-1.5 text-red-500 transition hover:bg-red-50',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400'
                  )}
                  aria-label={isArabic ? 'حذف' : 'Remove'}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
