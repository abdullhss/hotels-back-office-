import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plane, CircleCheck, XCircle, Plus } from 'lucide-react'
import TablePage from '../components/table/TablePage.jsx'
import AddTourismCompanyDialog from '../components/AddTourismCompanyDialog.jsx'
import { cn } from '../lib/utils'

const INITIAL_COMPANIES = [
  {
    id: 1,
    nameAr: 'إكسبيديا',
    nameEn: 'Expedia',
    value: 1,
    descAr: 'شركة سياحة عالمية',
    descEn: 'Global travel agency',
    address: 'القاهرة، مصر — شارع التحرير',
    phone1: '+20225760000',
    phone2: '+20225760001',
    website: 'https://www.expedia.com',
    email: 'support@expedia.com',
    facebookUrl: 'https://facebook.com/expedia',
    whatsapp: '+201234567890',
    managerName: 'أحمد محمد',
    managerPhone: '+201098765432',
    isBanned: false,
  },
  {
    id: 2,
    nameAr: 'بوكينج',
    nameEn: 'Booking.com',
    value: 2,
    descAr: 'منصة حجوزات فنادق وسفر',
    descEn: 'Travel and accommodation booking platform',
    address: 'أمستردام، هولندا — شارع أوفير',
    phone1: '+31203707970',
    phone2: '+31203707971',
    website: 'https://www.booking.com',
    email: 'customer.service@booking.com',
    facebookUrl: 'https://facebook.com/bookingcom',
    whatsapp: '+31612345678',
    managerName: 'سارة علي',
    managerPhone: '+201112223334',
    isBanned: false,
  },
]

const columnsAr = [
  { uid: 'nameAr', name: 'الاسم ( العربية )' },
  { uid: 'nameEn', name: 'الاسم ( English )' },
  { uid: 'value', name: 'كود الجنسية' },
  { uid: 'descAr', name: 'الوصف ( بالعربية )' },
  { uid: 'descEn', name: 'الوصف ( English )' },
  { uid: 'actions', name: 'الاجراءات' },
]

const columnsEn = [
  { uid: 'nameAr', name: 'Name (Arabic)' },
  { uid: 'nameEn', name: 'Name (English)' },
  { uid: 'value', name: 'Nationality code' },
  { uid: 'descAr', name: 'Description (Arabic)' },
  { uid: 'descEn', name: 'Description (English)' },
  { uid: 'actions', name: 'Actions' },
]

function filterRows(rows, search) {
  const q = (search ?? '').trim()
  if (!q) return rows
  const lower = q.toLowerCase()
  return rows.filter((r) => {
    const codeStr = r.value != null ? String(r.value) : ''
    const hay = [
      r.nameAr,
      r.nameEn,
      r.descAr,
      r.descEn,
      r.address,
      r.phone1,
      r.phone2,
      r.website,
      r.email,
      r.facebookUrl,
      r.whatsapp,
      r.managerName,
      r.managerPhone,
      codeStr,
    ]
      .filter(Boolean)
      .join(' ')
    return hay.includes(q) || hay.toLowerCase().includes(lower)
  })
}

function StatCard({ title, value, icon: Icon, iconWrapClass, iconClass }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
      <div
        className={cn(
          'flex h-14 w-14 shrink-0 items-center justify-center rounded-full',
          iconWrapClass
        )}
      >
        <Icon className={cn('h-7 w-7', iconClass)} strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold tracking-tight text-gray-900">{value}</p>
      </div>
    </div>
  )
}

export default function TourismCompaniesPage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const rowsPerPageDefault = 10

  const [companies, setCompanies] = useState(() => INITIAL_COMPANIES.map((r) => ({ ...r })))
  const companiesRef = useRef(companies)
  companiesRef.current = companies

  const [addOpen, setAddOpen] = useState(false)
  const [tableResetKey, setTableResetKey] = useState(0)

  const [tableData, setTableData] = useState(() => ({
    rows: INITIAL_COMPANIES.slice(0, rowsPerPageDefault),
    total: INITIAL_COMPANIES.length,
  }))

  const stats = useMemo(() => {
    const total = companies.length
    const banned = companies.filter((c) => c.isBanned).length
    return { total, active: total - banned, banned }
  }, [companies])

  const fetchApi = useCallback((page, rowsPerPage, _filters, search = '') => {
    const filtered = filterRows(companiesRef.current, search)
    const start = (page - 1) * rowsPerPage
    setTableData({
      rows: filtered.slice(start, start + rowsPerPage),
      total: filtered.length,
    })
  }, [])

  const handleSaveCompany = useCallback(
    (payload) => {
      setCompanies((prev) => {
        const id = prev.reduce((m, c) => Math.max(m, c.id), 0) + 1
        const next = [...prev, { ...payload, id }]
        const filtered = filterRows(next, '')
        setTableData({
          rows: filtered.slice(0, rowsPerPageDefault),
          total: filtered.length,
        })
        setTableResetKey((k) => k + 1)
        return next
      })
    },
    [rowsPerPageDefault]
  )

  const actionsConfig = useMemo(
    () => [
      {
        label: isArabic ? 'تعديل' : 'Edit',
        onClick: () => {},
      },
      {
        label: isArabic ? 'حذف' : 'Delete',
        variant: 'destructive',
        onClick: () => {},
      },
    ],
    [isArabic]
  )

  const titledColumns = useMemo(() => (isArabic ? columnsAr : columnsEn), [isArabic])

  const specialCells = useMemo(
    () => [
      {
        key: 'nameEn',
        render: (val) => <span dir="ltr">{val}</span>,
      },
      {
        key: 'descEn',
        render: (val) => <span dir="ltr">{val}</span>,
      },
    ],
    []
  )

  const statLabels = isArabic
    ? {
        total: 'شركات السياحة',
        active: 'الشركات النشطة',
        banned: 'الشركات المحظورة',
      }
    : {
        total: 'Tourism companies',
        active: 'Active companies',
        banned: 'Banned companies',
      }

  const subtitle = isArabic
    ? 'إدارة شركات السياحة في النظام'
    : 'Manage tourism companies in the system'

  return (
    <div className="space-y-6">
      <AddTourismCompanyDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleSaveCompany}
        isArabic={isArabic}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {isArabic ? 'شركات السياحة' : 'Tourism companies'}
          </h1>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-brand-primary px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-primary-hover ms-auto"
        >
          <Plus className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
          {isArabic ? 'إضافة جديد' : 'Add new'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title={statLabels.total}
          value={stats.total}
          icon={Plane}
          iconWrapClass="bg-sky-100"
          iconClass="text-indigo-600"
        />
        <StatCard
          title={statLabels.active}
          value={stats.active}
          icon={CircleCheck}
          iconWrapClass="bg-emerald-100"
          iconClass="text-emerald-600"
        />
        <StatCard
          title={statLabels.banned}
          value={stats.banned}
          icon={XCircle}
          iconWrapClass="bg-red-100"
          iconClass="text-red-600"
        />
      </div>

      <TablePage
        key={tableResetKey}
        columns={titledColumns}
        data={tableData.rows}
        total={tableData.total}
        fetchApi={fetchApi}
        actionsConfig={actionsConfig}
        specialCells={specialCells}
        hideSearch={false}
        rowsPerPageDefault={rowsPerPageDefault}
        searchPanelClassName=""
        tablePanelClassName=""
      />
    </div>
  )
}
