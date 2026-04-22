import { useEffect, useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { Dialog, DialogContent, DialogClose } from './ui/dialog.jsx'
import { cn } from '../lib/utils'

const copy = {
  ar: {
    title: 'إضافة جديد',
    subtitle: 'إضافة شركة سياحة جديدة',
    nameArLabel: 'الاسم ( العربية )',
    nameEnLabel: 'الاسم ( English )',
    codeLabel: 'كود الجنسية',
    descArLabel: 'الوصف ( بالعربية )',
    descEnLabel: 'الوصف ( English )',
    nameArPlaceholder: 'ادخل الاسم ( العربية )',
    nameEnPlaceholder: 'ادخل الاسم ( English )',
    codePlaceholder: '1',
    descArPlaceholder: 'ادخل الوصف بالعربية',
    descEnPlaceholder: 'Enter description in English',
    add: 'إضافة',
    cancel: 'إلغاء',
    required: 'هذا الحقل مطلوب',
    codeInvalid: 'أدخل رقماً صحيحاً',
  },
  en: {
    title: 'Add new',
    subtitle: 'Add a new tourism company',
    nameArLabel: 'Name (Arabic)',
    nameEnLabel: 'Name (English)',
    codeLabel: 'Nationality code',
    descArLabel: 'Description (Arabic)',
    descEnLabel: 'Description (English)',
    nameArPlaceholder: 'Enter name (Arabic)',
    nameEnPlaceholder: 'Enter name (English)',
    codePlaceholder: '1',
    descArPlaceholder: 'Enter Arabic description',
    descEnPlaceholder: 'Enter English description',
    add: 'Add',
    cancel: 'Cancel',
    required: 'This field is required',
    codeInvalid: 'Enter a valid positive number',
  },
}

export default function AddTourismCompanyDialog({ open, onOpenChange, onSave, isArabic }) {
  const t = copy[isArabic ? 'ar' : 'en']
  const [nameAr, setNameAr] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [descAr, setDescAr] = useState('')
  const [descEn, setDescEn] = useState('')
  const [errors, setErrors] = useState({
    nameAr: '',
    nameEn: '',
    value: '',
    descAr: '',
    descEn: '',
  })

  useEffect(() => {
    if (!open) return
    setNameAr('')
    setNameEn('')
    setCodeInput('')
    setDescAr('')
    setDescEn('')
    setErrors({ nameAr: '', nameEn: '', value: '', descAr: '', descEn: '' })
  }, [open])

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = { nameAr: '', nameEn: '', value: '', descAr: '', descEn: '' }
    const ar = nameAr.trim()
    const en = nameEn.trim()
    const dar = descAr.trim()
    const den = descEn.trim()
    const raw = codeInput.trim()
    const parsed = raw === '' ? NaN : Number.parseInt(raw, 10)
    if (!ar) next.nameAr = t.required
    if (!en) next.nameEn = t.required
    if (!dar) next.descAr = t.required
    if (!den) next.descEn = t.required
    if (raw === '' || Number.isNaN(parsed) || parsed < 1) next.value = t.codeInvalid
    if (next.nameAr || next.nameEn || next.value || next.descAr || next.descEn) {
      setErrors(next)
      return
    }
    onSave({
      nameAr: ar,
      nameEn: en,
      value: parsed,
      descAr: dar,
      descEn: den,
      isBanned: false,
    })
    onOpenChange(false)
  }

  const dir = isArabic ? 'rtl' : 'ltr'

  const inputClass = cn(
    'w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400',
    'focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/25'
  )

  const textareaClass = cn(inputClass, 'min-h-[88px] resize-y')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(90vh,720px)] max-w-[min(100vw-1.5rem,560px)] overflow-y-auto overflow-x-hidden p-0"
        dir={dir}
      >
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
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tourism-name-ar" className="text-sm font-medium text-gray-800">
                {t.nameArLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="tourism-name-ar"
                type="text"
                value={nameAr}
                onChange={(e) => {
                  setNameAr(e.target.value)
                  if (errors.nameAr) setErrors((prev) => ({ ...prev, nameAr: '' }))
                }}
                placeholder={t.nameArPlaceholder}
                className={inputClass}
                autoComplete="off"
              />
              {errors.nameAr ? <p className="text-xs text-red-600">{errors.nameAr}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tourism-name-en" className="text-sm font-medium text-gray-800">
                {t.nameEnLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="tourism-name-en"
                type="text"
                value={nameEn}
                onChange={(e) => {
                  setNameEn(e.target.value)
                  if (errors.nameEn) setErrors((prev) => ({ ...prev, nameEn: '' }))
                }}
                placeholder={t.nameEnPlaceholder}
                dir="ltr"
                className={inputClass}
                autoComplete="off"
              />
              {errors.nameEn ? <p className="text-xs text-red-600">{errors.nameEn}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2 sm:max-w-xs">
              <label htmlFor="tourism-code" className="text-sm font-medium text-gray-800">
                {t.codeLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="tourism-code"
                type="text"
                inputMode="numeric"
                value={codeInput}
                onChange={(e) => {
                  setCodeInput(e.target.value)
                  if (errors.value) setErrors((prev) => ({ ...prev, value: '' }))
                }}
                placeholder={t.codePlaceholder}
                dir="ltr"
                className={inputClass}
                autoComplete="off"
              />
              {errors.value ? <p className="text-xs text-red-600">{errors.value}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="tourism-desc-ar" className="text-sm font-medium text-gray-800">
                {t.descArLabel} <span className="text-red-600">*</span>
              </label>
              <textarea
                id="tourism-desc-ar"
                value={descAr}
                onChange={(e) => {
                  setDescAr(e.target.value)
                  if (errors.descAr) setErrors((prev) => ({ ...prev, descAr: '' }))
                }}
                placeholder={t.descArPlaceholder}
                className={textareaClass}
                rows={3}
              />
              {errors.descAr ? <p className="text-xs text-red-600">{errors.descAr}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tourism-desc-en" className="text-sm font-medium text-gray-800">
                {t.descEnLabel} <span className="text-red-600">*</span>
              </label>
              <textarea
                id="tourism-desc-en"
                value={descEn}
                onChange={(e) => {
                  setDescEn(e.target.value)
                  if (errors.descEn) setErrors((prev) => ({ ...prev, descEn: '' }))
                }}
                placeholder={t.descEnPlaceholder}
                dir="ltr"
                className={textareaClass}
                rows={3}
              />
              {errors.descEn ? <p className="text-xs text-red-600">{errors.descEn}</p> : null}
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
