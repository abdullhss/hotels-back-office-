import { useEffect, useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { Dialog, DialogContent, DialogClose } from './ui/dialog.jsx'
import { cn } from '../lib/utils'

const EMPTY_ERR = {
  nameAr: '',
  nameEn: '',
  permissionAr: '',
  permissionEn: '',
  departmentAr: '',
  departmentEn: '',
  jobTitleAr: '',
  jobTitleEn: '',
}

const copy = {
  ar: {
    title: 'إضافة جديد',
    subtitle: 'إضافة موظف جديد',
    nameArLabel: 'الاسم ( العربية )',
    nameEnLabel: 'الاسم ( English )',
    permissionArLabel: 'الصلاحية ( العربية )',
    permissionEnLabel: 'الصلاحية ( English )',
    departmentArLabel: 'القسم ( العربية )',
    departmentEnLabel: 'القسم ( English )',
    jobTitleArLabel: 'المسمى الوظيفي ( العربية )',
    jobTitleEnLabel: 'المسمى الوظيفي ( English )',
    placeholderAr: 'ادخل النص بالعربية',
    placeholderEn: 'Enter text in English',
    add: 'إضافة',
    cancel: 'إلغاء',
    required: 'هذا الحقل مطلوب',
  },
  en: {
    title: 'Add new',
    subtitle: 'Add a new employee',
    nameArLabel: 'Name (Arabic)',
    nameEnLabel: 'Name (English)',
    permissionArLabel: 'Permission (Arabic)',
    permissionEnLabel: 'Permission (English)',
    departmentArLabel: 'Department (Arabic)',
    departmentEnLabel: 'Department (English)',
    jobTitleArLabel: 'Job title (Arabic)',
    jobTitleEnLabel: 'Job title (English)',
    placeholderAr: 'Arabic text',
    placeholderEn: 'English text',
    add: 'Add',
    cancel: 'Cancel',
    required: 'This field is required',
  },
}

export default function AddEmployeeDialog({ open, onOpenChange, onSave, isArabic }) {
  const t = copy[isArabic ? 'ar' : 'en']
  const [nameAr, setNameAr] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [permissionAr, setPermissionAr] = useState('')
  const [permissionEn, setPermissionEn] = useState('')
  const [departmentAr, setDepartmentAr] = useState('')
  const [departmentEn, setDepartmentEn] = useState('')
  const [jobTitleAr, setJobTitleAr] = useState('')
  const [jobTitleEn, setJobTitleEn] = useState('')
  const [errors, setErrors] = useState(() => ({ ...EMPTY_ERR }))

  useEffect(() => {
    if (!open) return
    setNameAr('')
    setNameEn('')
    setPermissionAr('')
    setPermissionEn('')
    setDepartmentAr('')
    setDepartmentEn('')
    setJobTitleAr('')
    setJobTitleEn('')
    setErrors({ ...EMPTY_ERR })
  }, [open])

  const handleSubmit = (e) => {
    e.preventDefault()
    const vals = {
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim(),
      permissionAr: permissionAr.trim(),
      permissionEn: permissionEn.trim(),
      departmentAr: departmentAr.trim(),
      departmentEn: departmentEn.trim(),
      jobTitleAr: jobTitleAr.trim(),
      jobTitleEn: jobTitleEn.trim(),
    }
    const next = { ...EMPTY_ERR }
    for (const key of Object.keys(vals)) {
      if (!vals[key]) next[key] = t.required
    }
    if (Object.values(next).some(Boolean)) {
      setErrors(next)
      return
    }
    onSave(vals)
    onOpenChange(false)
  }

  const dir = isArabic ? 'rtl' : 'ltr'

  const inputClass = cn(
    'w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400',
    'focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/25'
  )

  const clear = (key) => setErrors((p) => ({ ...p, [key]: '' }))

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
              <label htmlFor="emp-name-ar" className="text-sm font-medium text-gray-800">
                {t.nameArLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="emp-name-ar"
                type="text"
                value={nameAr}
                onChange={(e) => {
                  setNameAr(e.target.value)
                  if (errors.nameAr) clear('nameAr')
                }}
                placeholder={t.placeholderAr}
                className={inputClass}
                autoComplete="off"
              />
              {errors.nameAr ? <p className="text-xs text-red-600">{errors.nameAr}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="emp-name-en" className="text-sm font-medium text-gray-800">
                {t.nameEnLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="emp-name-en"
                type="text"
                value={nameEn}
                onChange={(e) => {
                  setNameEn(e.target.value)
                  if (errors.nameEn) clear('nameEn')
                }}
                placeholder={t.placeholderEn}
                dir="ltr"
                className={inputClass}
                autoComplete="off"
              />
              {errors.nameEn ? <p className="text-xs text-red-600">{errors.nameEn}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="emp-perm-ar" className="text-sm font-medium text-gray-800">
                {t.permissionArLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="emp-perm-ar"
                type="text"
                value={permissionAr}
                onChange={(e) => {
                  setPermissionAr(e.target.value)
                  if (errors.permissionAr) clear('permissionAr')
                }}
                placeholder={t.placeholderAr}
                className={inputClass}
                autoComplete="off"
              />
              {errors.permissionAr ? <p className="text-xs text-red-600">{errors.permissionAr}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="emp-perm-en" className="text-sm font-medium text-gray-800">
                {t.permissionEnLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="emp-perm-en"
                type="text"
                value={permissionEn}
                onChange={(e) => {
                  setPermissionEn(e.target.value)
                  if (errors.permissionEn) clear('permissionEn')
                }}
                placeholder={t.placeholderEn}
                dir="ltr"
                className={inputClass}
                autoComplete="off"
              />
              {errors.permissionEn ? <p className="text-xs text-red-600">{errors.permissionEn}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="emp-dept-ar" className="text-sm font-medium text-gray-800">
                {t.departmentArLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="emp-dept-ar"
                type="text"
                value={departmentAr}
                onChange={(e) => {
                  setDepartmentAr(e.target.value)
                  if (errors.departmentAr) clear('departmentAr')
                }}
                placeholder={t.placeholderAr}
                className={inputClass}
                autoComplete="off"
              />
              {errors.departmentAr ? <p className="text-xs text-red-600">{errors.departmentAr}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="emp-dept-en" className="text-sm font-medium text-gray-800">
                {t.departmentEnLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="emp-dept-en"
                type="text"
                value={departmentEn}
                onChange={(e) => {
                  setDepartmentEn(e.target.value)
                  if (errors.departmentEn) clear('departmentEn')
                }}
                placeholder={t.placeholderEn}
                dir="ltr"
                className={inputClass}
                autoComplete="off"
              />
              {errors.departmentEn ? <p className="text-xs text-red-600">{errors.departmentEn}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="emp-job-ar" className="text-sm font-medium text-gray-800">
                {t.jobTitleArLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="emp-job-ar"
                type="text"
                value={jobTitleAr}
                onChange={(e) => {
                  setJobTitleAr(e.target.value)
                  if (errors.jobTitleAr) clear('jobTitleAr')
                }}
                placeholder={t.placeholderAr}
                className={inputClass}
                autoComplete="off"
              />
              {errors.jobTitleAr ? <p className="text-xs text-red-600">{errors.jobTitleAr}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="emp-job-en" className="text-sm font-medium text-gray-800">
                {t.jobTitleEnLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="emp-job-en"
                type="text"
                value={jobTitleEn}
                onChange={(e) => {
                  setJobTitleEn(e.target.value)
                  if (errors.jobTitleEn) clear('jobTitleEn')
                }}
                placeholder={t.placeholderEn}
                dir="ltr"
                className={inputClass}
                autoComplete="off"
              />
              {errors.jobTitleEn ? <p className="text-xs text-red-600">{errors.jobTitleEn}</p> : null}
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
