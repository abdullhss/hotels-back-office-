import { useEffect, useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { Dialog, DialogContent, DialogClose } from './ui/dialog.jsx'
import { cn } from '../lib/utils'

const emailOk = (s) => /\S+@\S+\.\S+/.test(s.trim())

const copy = {
  ar: {
    title: 'إضافة جديد',
    subtitle: 'إضافة شركة سياحة جديدة',
    nameArLabel: 'الاسم ( العربية )',
    nameEnLabel: 'الاسم ( English )',
    codeLabel: 'كود الجنسية',
    descArLabel: 'الوصف ( بالعربية )',
    descEnLabel: 'الوصف ( English )',
    addressLabel: 'العنوان',
    phone1Label: 'رقم الهاتف ( 1)',
    phone2Label: 'رقم الهاتف ( 2)',
    websiteLabel: 'الموقع الإلكتروني',
    emailLabel: 'البريد الإلكتروني',
    facebookLabel: 'رابط الفيس بوك',
    whatsappLabel: 'رقم الواتس',
    managerNameLabel: 'اسم المسؤول',
    managerPhoneLabel: 'رقم الهاتف المسؤول',
    statusLabel: 'الحالة',
    statusActive: 'نشط',
    statusBanned: 'محظور',
    nameArPlaceholder: 'ادخل الاسم ( العربية )',
    nameEnPlaceholder: 'ادخل الاسم ( English )',
    codePlaceholder: '1',
    descArPlaceholder: 'ادخل الوصف بالعربية',
    descEnPlaceholder: 'Enter description in English',
    addressPlaceholder: 'ادخل العنوان الكامل',
    phonePlaceholder: '01xxxxxxxxx',
    websitePlaceholder: 'https://…',
    emailPlaceholder: 'name@company.com',
    facebookPlaceholder: 'https://facebook.com/…',
    whatsappPlaceholder: '+20…',
    managerNamePlaceholder: 'اسم الشخص المسؤول',
    managerPhonePlaceholder: '01xxxxxxxxx',
    add: 'إضافة',
    cancel: 'إلغاء',
    required: 'هذا الحقل مطلوب',
    codeInvalid: 'أدخل رقماً صحيحاً',
    emailInvalid: 'البريد الإلكتروني غير صالح',
  },
  en: {
    title: 'Add new',
    subtitle: 'Add a new tourism company',
    nameArLabel: 'Name (Arabic)',
    nameEnLabel: 'Name (English)',
    codeLabel: 'Nationality code',
    descArLabel: 'Description (Arabic)',
    descEnLabel: 'Description (English)',
    addressLabel: 'Address',
    phone1Label: 'Phone number (1)',
    phone2Label: 'Phone number (2)',
    websiteLabel: 'Website',
    emailLabel: 'Email',
    facebookLabel: 'Facebook link',
    whatsappLabel: 'WhatsApp number',
    managerNameLabel: 'Contact person name',
    managerPhoneLabel: 'Contact phone',
    statusLabel: 'Status',
    statusActive: 'Active',
    statusBanned: 'Banned',
    nameArPlaceholder: 'Enter name (Arabic)',
    nameEnPlaceholder: 'Enter name (English)',
    codePlaceholder: '1',
    descArPlaceholder: 'Enter Arabic description',
    descEnPlaceholder: 'Enter English description',
    addressPlaceholder: 'Full address',
    phonePlaceholder: '+20 …',
    websitePlaceholder: 'https://…',
    emailPlaceholder: 'name@company.com',
    facebookPlaceholder: 'https://facebook.com/…',
    whatsappPlaceholder: '+20 …',
    managerNamePlaceholder: 'Responsible person',
    managerPhonePlaceholder: '+20 …',
    add: 'Add',
    cancel: 'Cancel',
    required: 'This field is required',
    codeInvalid: 'Enter a valid positive number',
    emailInvalid: 'Invalid email address',
  },
}

const initialErrors = () => ({
  nameAr: '',
  nameEn: '',
  value: '',
  descAr: '',
  descEn: '',
  address: '',
  phone1: '',
  phone2: '',
  website: '',
  email: '',
  facebookUrl: '',
  whatsapp: '',
  managerName: '',
  managerPhone: '',
})

export default function AddTourismCompanyDialog({ open, onOpenChange, onSave, isArabic }) {
  const t = copy[isArabic ? 'ar' : 'en']
  const [nameAr, setNameAr] = useState('')
  const [nameEn, setNameEn] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [descAr, setDescAr] = useState('')
  const [descEn, setDescEn] = useState('')
  const [address, setAddress] = useState('')
  const [phone1, setPhone1] = useState('')
  const [phone2, setPhone2] = useState('')
  const [website, setWebsite] = useState('')
  const [email, setEmail] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [managerName, setManagerName] = useState('')
  const [managerPhone, setManagerPhone] = useState('')
  const [status, setStatus] = useState('active')
  const [errors, setErrors] = useState(() => initialErrors())

  useEffect(() => {
    if (!open) return
    setNameAr('')
    setNameEn('')
    setCodeInput('')
    setDescAr('')
    setDescEn('')
    setAddress('')
    setPhone1('')
    setPhone2('')
    setWebsite('')
    setEmail('')
    setFacebookUrl('')
    setWhatsapp('')
    setManagerName('')
    setManagerPhone('')
    setStatus('active')
    setErrors(initialErrors())
  }, [open])

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = initialErrors()
    const ar = nameAr.trim()
    const en = nameEn.trim()
    const dar = descAr.trim()
    const den = descEn.trim()
    const addr = address.trim()
    const p1 = phone1.trim()
    const p2 = phone2.trim()
    const ws = website.trim()
    const em = email.trim()
    const fb = facebookUrl.trim()
    const wa = whatsapp.trim()
    const mn = managerName.trim()
    const mp = managerPhone.trim()
    const raw = codeInput.trim()
    const parsed = raw === '' ? NaN : Number.parseInt(raw, 10)

    if (!ar) next.nameAr = t.required
    if (!en) next.nameEn = t.required
    if (!dar) next.descAr = t.required
    if (!den) next.descEn = t.required
    if (!addr) next.address = t.required
    if (!p1) next.phone1 = t.required
    if (!p2) next.phone2 = t.required
    if (!ws) next.website = t.required
    if (!em) next.email = t.required
    else if (!emailOk(em)) next.email = t.emailInvalid
    if (!fb) next.facebookUrl = t.required
    if (!wa) next.whatsapp = t.required
    if (!mn) next.managerName = t.required
    if (!mp) next.managerPhone = t.required
    if (raw === '' || Number.isNaN(parsed) || parsed < 1) next.value = t.codeInvalid

    if (Object.values(next).some(Boolean)) {
      setErrors(next)
      return
    }

    onSave({
      nameAr: ar,
      nameEn: en,
      value: parsed,
      descAr: dar,
      descEn: den,
      address: addr,
      phone1: p1,
      phone2: p2,
      website: ws,
      email: em,
      facebookUrl: fb,
      whatsapp: wa,
      managerName: mn,
      managerPhone: mp,
      isBanned: status === 'banned',
    })
    onOpenChange(false)
  }

  const dir = isArabic ? 'rtl' : 'ltr'

  const inputClass = cn(
    'w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400',
    'focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/25'
  )

  const textareaClass = cn(inputClass, 'min-h-[88px] resize-y')

  const clearErr = (key) => setErrors((prev) => ({ ...prev, [key]: '' }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[min(92vh,800px)] max-w-[min(100vw-1.5rem,640px)] overflow-y-auto overflow-x-hidden p-0"
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
                  if (errors.nameAr) clearErr('nameAr')
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
                  if (errors.nameEn) clearErr('nameEn')
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
                  if (errors.value) clearErr('value')
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
                  if (errors.descAr) clearErr('descAr')
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
                  if (errors.descEn) clearErr('descEn')
                }}
                placeholder={t.descEnPlaceholder}
                dir="ltr"
                className={textareaClass}
                rows={3}
              />
              {errors.descEn ? <p className="text-xs text-red-600">{errors.descEn}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="tourism-address" className="text-sm font-medium text-gray-800">
                {t.addressLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="tourism-address"
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value)
                  if (errors.address) clearErr('address')
                }}
                placeholder={t.addressPlaceholder}
                className={inputClass}
                autoComplete="street-address"
              />
              {errors.address ? <p className="text-xs text-red-600">{errors.address}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="tourism-phone1" className="text-sm font-medium text-gray-800">
                {t.phone1Label} <span className="text-red-600">*</span>
              </label>
              <input
                id="tourism-phone1"
                type="text"
                inputMode="tel"
                value={phone1}
                onChange={(e) => {
                  setPhone1(e.target.value)
                  if (errors.phone1) clearErr('phone1')
                }}
                placeholder={t.phonePlaceholder}
                dir="ltr"
                className={inputClass}
                autoComplete="tel"
              />
              {errors.phone1 ? <p className="text-xs text-red-600">{errors.phone1}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tourism-phone2" className="text-sm font-medium text-gray-800">
                {t.phone2Label} <span className="text-red-600">*</span>
              </label>
              <input
                id="tourism-phone2"
                type="text"
                inputMode="tel"
                value={phone2}
                onChange={(e) => {
                  setPhone2(e.target.value)
                  if (errors.phone2) clearErr('phone2')
                }}
                placeholder={t.phonePlaceholder}
                dir="ltr"
                className={inputClass}
                autoComplete="tel"
              />
              {errors.phone2 ? <p className="text-xs text-red-600">{errors.phone2}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="tourism-website" className="text-sm font-medium text-gray-800">
                {t.websiteLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="tourism-website"
                type="text"
                value={website}
                onChange={(e) => {
                  setWebsite(e.target.value)
                  if (errors.website) clearErr('website')
                }}
                placeholder={t.websitePlaceholder}
                dir="ltr"
                className={inputClass}
                autoComplete="url"
              />
              {errors.website ? <p className="text-xs text-red-600">{errors.website}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tourism-email" className="text-sm font-medium text-gray-800">
                {t.emailLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="tourism-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) clearErr('email')
                }}
                placeholder={t.emailPlaceholder}
                dir="ltr"
                className={inputClass}
                autoComplete="email"
              />
              {errors.email ? <p className="text-xs text-red-600">{errors.email}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="tourism-facebook" className="text-sm font-medium text-gray-800">
                {t.facebookLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="tourism-facebook"
                type="text"
                value={facebookUrl}
                onChange={(e) => {
                  setFacebookUrl(e.target.value)
                  if (errors.facebookUrl) clearErr('facebookUrl')
                }}
                placeholder={t.facebookPlaceholder}
                dir="ltr"
                className={inputClass}
                autoComplete="off"
              />
              {errors.facebookUrl ? <p className="text-xs text-red-600">{errors.facebookUrl}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tourism-whatsapp" className="text-sm font-medium text-gray-800">
                {t.whatsappLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="tourism-whatsapp"
                type="text"
                inputMode="tel"
                value={whatsapp}
                onChange={(e) => {
                  setWhatsapp(e.target.value)
                  if (errors.whatsapp) clearErr('whatsapp')
                }}
                placeholder={t.whatsappPlaceholder}
                dir="ltr"
                className={inputClass}
                autoComplete="off"
              />
              {errors.whatsapp ? <p className="text-xs text-red-600">{errors.whatsapp}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="tourism-manager-name" className="text-sm font-medium text-gray-800">
                {t.managerNameLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="tourism-manager-name"
                type="text"
                value={managerName}
                onChange={(e) => {
                  setManagerName(e.target.value)
                  if (errors.managerName) clearErr('managerName')
                }}
                placeholder={t.managerNamePlaceholder}
                className={inputClass}
                autoComplete="name"
              />
              {errors.managerName ? <p className="text-xs text-red-600">{errors.managerName}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tourism-manager-phone" className="text-sm font-medium text-gray-800">
                {t.managerPhoneLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="tourism-manager-phone"
                type="text"
                inputMode="tel"
                value={managerPhone}
                onChange={(e) => {
                  setManagerPhone(e.target.value)
                  if (errors.managerPhone) clearErr('managerPhone')
                }}
                placeholder={t.managerPhonePlaceholder}
                dir="ltr"
                className={inputClass}
                autoComplete="tel"
              />
              {errors.managerPhone ? <p className="text-xs text-red-600">{errors.managerPhone}</p> : null}
            </div>

            <fieldset className="sm:col-span-2">
              <legend className="mb-2 text-sm font-medium text-gray-800">
                {t.statusLabel} <span className="text-red-600">*</span>
              </legend>
              <div className="flex flex-wrap gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
                  <input
                    type="radio"
                    name="tourism-company-status"
                    value="active"
                    checked={status === 'active'}
                    onChange={() => setStatus('active')}
                    className="h-4 w-4 border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                  {t.statusActive}
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
                  <input
                    type="radio"
                    name="tourism-company-status"
                    value="banned"
                    checked={status === 'banned'}
                    onChange={() => setStatus('banned')}
                    className="h-4 w-4 border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                  {t.statusBanned}
                </label>
              </div>
            </fieldset>
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
