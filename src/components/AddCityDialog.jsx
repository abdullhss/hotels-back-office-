import { useEffect, useMemo, useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { Dialog, DialogContent, DialogClose } from './ui/dialog.jsx'
import { cn } from '../lib/utils'

const copy = {
  ar: {
    title: 'إضافة جديد',
    subtitle: 'إضافة مدينة جديدة',
    nameArLabel: 'الاسم ( العربية )',
    nameEnLabel: 'الاسم ( English )',
    countryLabel: 'الدولة',
    countryPlaceholder: 'اختر الدولة',
    nameArPlaceholder: 'ادخل الاسم ( العربية )',
    nameEnPlaceholder: 'ادخل الاسم ( English )',
    add: 'إضافة',
    cancel: 'إلغاء',
    required: 'هذا الحقل مطلوب',
    countryRequired: 'اختر الدولة',
  },
  en: {
    title: 'Add new',
    subtitle: 'Add a new city',
    nameArLabel: 'Name (Arabic)',
    nameEnLabel: 'Name (English)',
    countryLabel: 'Country',
    countryPlaceholder: 'Select country',
    nameArPlaceholder: 'Enter name (Arabic)',
    nameEnPlaceholder: 'Enter name (English)',
    add: 'Add',
    cancel: 'Cancel',
    required: 'This field is required',
    countryRequired: 'Select a country',
  },
}

export default function AddCityDialog({ open, onOpenChange, onSave, isArabic, countries = [] }) {
  const t = copy[isArabic ? 'ar' : 'en']
  const [nameAr, setNameAr] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [countryId, setCountryId] = useState('')
  const [errors, setErrors] = useState({ nameAr: '', nameEn: '', countryId: '' })

  const sortedCountries = useMemo(
    () =>
      [...countries].sort((a, b) =>
        (isArabic ? a.nameAr : a.nameEn).localeCompare(isArabic ? b.nameAr : b.nameEn, isArabic ? 'ar' : 'en')
      ),
    [countries, isArabic]
  )

  useEffect(() => {
    if (!open) return
    setNameAr('')
    setNameEn('')
    setCountryId('')
    setErrors({ nameAr: '', nameEn: '', countryId: '' })
  }, [open])

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = { nameAr: '', nameEn: '', countryId: '' }
    const ar = nameAr.trim()
    const en = nameEn.trim()
    if (!ar) next.nameAr = t.required
    if (!en) next.nameEn = t.required
    if (!countryId) next.countryId = t.countryRequired
    if (next.nameAr || next.nameEn || next.countryId) {
      setErrors(next)
      return
    }
    const id = parseInt(countryId, 10)
    onSave({ nameAr: ar, nameEn: en.toUpperCase(), countryId: id })
    onOpenChange(false)
  }

  const dir = isArabic ? 'rtl' : 'ltr'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[min(100vw-1.5rem,520px)] overflow-hidden p-0" dir={dir}>
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-primary text-white shadow-sm">
              <Plus className="h-6 w-6 stroke-[2.5]" aria-hidden />
            </div>
            <div className="min-w-0 pt-0.5">
              <h2 className="text-lg font-bold text-gray-900">{t.title}</h2>
              <p className="mt-0.5 text-sm text-gray-500">{t.subtitle}</p>
            </div>
          </div>
          <DialogClose
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-white shadow-sm transition hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            aria-label={isArabic ? 'إغلاق' : 'Close'}
          >
            <X className="h-4 w-4" />
          </DialogClose>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pb-5 pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="city-country" className="text-sm font-medium text-gray-800">
                {t.countryLabel} <span className="text-red-600">*</span>
              </label>
              <select
                id="city-country"
                value={countryId}
                onChange={(e) => {
                  setCountryId(e.target.value)
                  if (errors.countryId) setErrors((prev) => ({ ...prev, countryId: '' }))
                }}
                className={cn(
                  'w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900',
                  'focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/25',
                  !countryId && 'text-gray-400'
                )}
              >
                <option value="">{t.countryPlaceholder}</option>
                {sortedCountries.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {isArabic ? c.nameAr : c.nameEn}
                  </option>
                ))}
              </select>
              {errors.countryId ? <p className="text-xs text-red-600">{errors.countryId}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="city-name-ar" className="text-sm font-medium text-gray-800">
                {t.nameArLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="city-name-ar"
                type="text"
                value={nameAr}
                onChange={(e) => {
                  setNameAr(e.target.value)
                  if (errors.nameAr) setErrors((prev) => ({ ...prev, nameAr: '' }))
                }}
                placeholder={t.nameArPlaceholder}
                className={cn(
                  'w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400',
                  'focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/25'
                )}
                autoComplete="off"
              />
              {errors.nameAr ? <p className="text-xs text-red-600">{errors.nameAr}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="city-name-en" className="text-sm font-medium text-gray-800">
                {t.nameEnLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="city-name-en"
                type="text"
                value={nameEn}
                onChange={(e) => {
                  setNameEn(e.target.value)
                  if (errors.nameEn) setErrors((prev) => ({ ...prev, nameEn: '' }))
                }}
                placeholder={t.nameEnPlaceholder}
                dir="ltr"
                className={cn(
                  'w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400',
                  'focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/25'
                )}
                autoComplete="off"
              />
              {errors.nameEn ? <p className="text-xs text-red-600">{errors.nameEn}</p> : null}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-red-500 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/80 bg-white/15">
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
              </span>
              {t.add}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
