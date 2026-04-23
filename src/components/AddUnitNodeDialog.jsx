import { useEffect, useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { Dialog, DialogContent, DialogClose } from './ui/dialog.jsx'
import { cn } from '../lib/utils'

const copy = {
  ar: {
    title: 'إضافة جديد',
    subtitle: 'إضافة وحدة إلى شجرة الفندق',
    nameArLabel: 'الاسم ( العربية )',
    typeLabel: 'النوع',
    countLabel: 'العدد',
    startLabel: 'بداية الترقيم',
    typeFloor: 'دور',
    typeSuite: 'جناح',
    typeRoom: 'غرفة',
    namePlaceholder: 'ادخل الاسم',
    countPlaceholder: '1',
    startPlaceholder: '101',
    add: 'إضافة',
    cancel: 'إلغاء',
    required: 'هذا الحقل مطلوب',
    numberInvalid: 'أدخل رقماً صحيحاً',
    countMin: 'العدد يجب أن يكون 1 على الأقل',
  },
  en: {
    title: 'Add new',
    subtitle: 'Add a unit to the hotel tree',
    nameArLabel: 'Name (Arabic)',
    typeLabel: 'Type',
    countLabel: 'Quantity',
    startLabel: 'Numbering starts at',
    typeFloor: 'Floor',
    typeSuite: 'Suite',
    typeRoom: 'Room',
    namePlaceholder: 'Enter name',
    countPlaceholder: '1',
    startPlaceholder: '101',
    add: 'Add',
    cancel: 'Cancel',
    required: 'This field is required',
    numberInvalid: 'Enter a valid number',
    countMin: 'Quantity must be at least 1',
  },
}

export default function AddUnitNodeDialog({ open, onOpenChange, onSave, isArabic }) {
  const t = copy[isArabic ? 'ar' : 'en']
  const [nameAr, setNameAr] = useState('')
  const [unitType, setUnitType] = useState('floor')
  const [countInput, setCountInput] = useState('1')
  const [startInput, setStartInput] = useState('1')
  const [errors, setErrors] = useState({
    nameAr: '',
    count: '',
    start: '',
  })

  useEffect(() => {
    if (!open) return
    setNameAr('')
    setUnitType('floor')
    setCountInput('1')
    setStartInput('1')
    setErrors({ nameAr: '', count: '', start: '' })
  }, [open])

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = { nameAr: '', count: '', start: '' }
    const ar = nameAr.trim()
    const cRaw = countInput.trim()
    const sRaw = startInput.trim()
    const count = cRaw === '' ? NaN : Number.parseInt(cRaw, 10)
    const startNumber = sRaw === '' ? NaN : Number.parseInt(sRaw, 10)

    if (!ar) next.nameAr = t.required
    if (cRaw === '' || Number.isNaN(count) || count < 1) next.count = count < 1 && !Number.isNaN(count) ? t.countMin : t.numberInvalid
    if (sRaw === '' || Number.isNaN(startNumber)) next.start = t.numberInvalid

    if (next.nameAr || next.count || next.start) {
      setErrors(next)
      return
    }

    onSave({
      nameAr: ar,
      type: unitType,
      count,
      startNumber,
    })
    onOpenChange(false)
  }

  const dir = isArabic ? 'rtl' : 'ltr'

  const inputClass = cn(
    'w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400',
    'focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/25'
  )

  const clear = (k) => setErrors((prev) => ({ ...prev, [k]: '' }))

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
              <label htmlFor="unit-node-name-ar" className="text-sm font-medium text-gray-800">
                {t.nameArLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="unit-node-name-ar"
                type="text"
                value={nameAr}
                onChange={(e) => {
                  setNameAr(e.target.value)
                  if (errors.nameAr) clear('nameAr')
                }}
                placeholder={t.namePlaceholder}
                className={inputClass}
                autoComplete="off"
              />
              {errors.nameAr ? <p className="text-xs text-red-600">{errors.nameAr}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="unit-node-type" className="text-sm font-medium text-gray-800">
                {t.typeLabel} <span className="text-red-600">*</span>
              </label>
              <select
                id="unit-node-type"
                value={unitType}
                onChange={(e) => setUnitType(e.target.value)}
                className={cn(inputClass, !unitType && 'text-gray-400')}
              >
                <option value="floor">{t.typeFloor}</option>
                <option value="suite">{t.typeSuite}</option>
                <option value="room">{t.typeRoom}</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="unit-node-count" className="text-sm font-medium text-gray-800">
                {t.countLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="unit-node-count"
                type="text"
                inputMode="numeric"
                value={countInput}
                onChange={(e) => {
                  setCountInput(e.target.value)
                  if (errors.count) clear('count')
                }}
                placeholder={t.countPlaceholder}
                dir="ltr"
                className={inputClass}
                autoComplete="off"
              />
              {errors.count ? <p className="text-xs text-red-600">{errors.count}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="unit-node-start" className="text-sm font-medium text-gray-800">
                {t.startLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="unit-node-start"
                type="text"
                inputMode="numeric"
                value={startInput}
                onChange={(e) => {
                  setStartInput(e.target.value)
                  if (errors.start) clear('start')
                }}
                placeholder={t.startPlaceholder}
                dir="ltr"
                className={inputClass}
                autoComplete="off"
              />
              {errors.start ? <p className="text-xs text-red-600">{errors.start}</p> : null}
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
