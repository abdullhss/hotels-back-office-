import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import TablePage from '../components/table/TablePage.jsx'
import AddServiceDialog from '../components/AddServiceDialog.jsx'

const SERVICE_SEEDS = [
  { nameAr: 'سبا ومساج', nameEn: 'Spa & massage', basicPrice: 450 },
  { nameAr: 'خدمة الغرف', nameEn: 'Room service', basicPrice: 50 },
  { nameAr: 'توصيل من المطار', nameEn: 'Airport shuttle', basicPrice: 300 },
  { nameAr: 'كونسييرج', nameEn: 'Concierge', basicPrice: 0 },
  { nameAr: 'تأجير سيارات', nameEn: 'Car rental', basicPrice: 250 },
  { nameAr: 'خدمة الطباعة', nameEn: 'Business center', basicPrice: 25 },
  { nameAr: 'بوفيه إفطار', nameEn: 'Breakfast buffet', basicPrice: 180 },
  { nameAr: 'صالة ألعاب أطفال', nameEn: 'Kids club', basicPrice: 100 },
]

const INITIAL_ROWS = Array.from({ length: 42 }, (_, i) => {
  const seed = SERVICE_SEEDS[i % SERVICE_SEEDS.length]
  const repeatFirst = i % 5 === 0
  const base = SERVICE_SEEDS[0]
  return {
    id: i + 1,
    nameAr: repeatFirst ? base.nameAr : seed.nameAr,
    nameEn: repeatFirst ? base.nameEn : seed.nameEn,
    basicPrice: repeatFirst ? base.basicPrice : seed.basicPrice,
  }
})

const columnsAr = [
  { uid: 'nameAr', name: 'الاسم ( العربية )' },
  { uid: 'nameEn', name: 'الاسم ( English )' },
  { uid: 'basicPrice', name: 'السعر' },
  { uid: 'actions', name: 'الاجراءات' },
]

const columnsEn = [
  { uid: 'nameAr', name: 'Name (Arabic)' },
  { uid: 'nameEn', name: 'Name (English)' },
  { uid: 'basicPrice', name: 'Price' },
  { uid: 'actions', name: 'Actions' },
]

function filterRows(rows, search) {
  const q = (search ?? '').trim()
  if (!q) return rows
  const lower = q.toLowerCase()
  return rows.filter((r) => {
    const priceStr = r.basicPrice != null ? String(r.basicPrice) : ''
    return (
      (r.nameAr && r.nameAr.includes(q)) ||
      (r.nameEn && r.nameEn.toLowerCase().includes(lower)) ||
      priceStr.includes(q)
    )
  })
}

export default function ServicesPage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const rowsPerPageDefault = 10

  const [services, setServices] = useState(() => INITIAL_ROWS.map((r) => ({ ...r })))
  const servicesRef = useRef(services)
  servicesRef.current = services

  const [addOpen, setAddOpen] = useState(false)
  const [tableResetKey, setTableResetKey] = useState(0)

  const [tableData, setTableData] = useState(() => ({
    rows: INITIAL_ROWS.slice(0, rowsPerPageDefault),
    total: INITIAL_ROWS.length,
  }))

  const fetchApi = useCallback((page, rowsPerPage, _filters, search = '') => {
    const filtered = filterRows(servicesRef.current, search)
    const start = (page - 1) * rowsPerPage
    setTableData({
      rows: filtered.slice(start, start + rowsPerPage),
      total: filtered.length,
    })
  }, [])

  const handleSaveService = useCallback(({ nameAr, nameEn, basicPrice }) => {
    setServices((prev) => {
      const id = prev.reduce((m, c) => Math.max(m, c.id), 0) + 1
      const next = [...prev, { id, nameAr, nameEn, basicPrice }]
      const filtered = filterRows(next, '')
      setTableData({
        rows: filtered.slice(0, rowsPerPageDefault),
        total: filtered.length,
      })
      setTableResetKey((k) => k + 1)
      return next
    })
  }, [rowsPerPageDefault])

  const titledColumns = useMemo(() => (isArabic ? columnsAr : columnsEn), [isArabic])

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

  const specialCells = useMemo(
    () => [
      {
        key: 'basicPrice',
        render: (val) =>
          val != null && !Number.isNaN(Number(val)) ? (
            <span dir="ltr">{Number(val).toLocaleString(isArabic ? 'ar-EG' : 'en-US')}</span>
          ) : (
            '—'
          ),
      },
      {
        key: 'nameEn',
        render: (val) => <span dir="ltr">{val}</span>,
      },
    ],
    [isArabic]
  )

  return (
    <div className="space-y-4">
      <AddServiceDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleSaveService}
        isArabic={isArabic}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800">
          {isArabic ? 'الخدمات' : 'Services'}
        </h1>
        <div className="flex flex-wrap items-center gap-2 ms-auto">
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-brand-primary px-4 py-3 font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-primary"
          >
            <Plus className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
            {isArabic ? 'إضافة جديد' : 'Add new'}
          </button>
        </div>
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
