import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TablePage from '../components/table/TablePage.jsx'
import AddExtraFeatureDialog from '../components/AddExtraFeatureDialog.jsx'
import { Plus } from 'lucide-react'
const EXTRA_FEATURE_SEEDS = [
  { nameAr: 'إفطار في الغرفة', nameEn: 'ROOM BREAKFAST', basicPrice: 150 },
  { nameAr: 'موقف سيارات', nameEn: 'PARKING', basicPrice: 75 },
  { nameAr: 'واي فاي عالي السرعة', nameEn: 'HIGH-SPEED WIFI', basicPrice: 0 },
  { nameAr: 'خدمة الغسيل', nameEn: 'LAUNDRY', basicPrice: 120 },
  { nameAr: 'تخزين أمتعة', nameEn: 'LUGGAGE STORAGE', basicPrice: 40 },
  { nameAr: 'استقبال من المطار', nameEn: 'AIRPORT PICKUP', basicPrice: 350 },
  { nameAr: 'سرير إضافي', nameEn: 'EXTRA BED', basicPrice: 200 },
  { nameAr: 'قاعة اجتماعات', nameEn: 'MEETING ROOM', basicPrice: 500 },
]

const INITIAL_ROWS = Array.from({ length: 42 }, (_, i) => {
  const seed = EXTRA_FEATURE_SEEDS[i % EXTRA_FEATURE_SEEDS.length]
  const repeatBreakfast = i % 5 === 0
  const base = EXTRA_FEATURE_SEEDS[0]
  return {
    id: i + 1,
    nameAr: repeatBreakfast ? base.nameAr : seed.nameAr,
    nameEn: repeatBreakfast ? base.nameEn : seed.nameEn,
    basicPrice: repeatBreakfast ? base.basicPrice : seed.basicPrice,
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

export default function ExtraFeaturesPage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const rowsPerPageDefault = 10

  const [features, setFeatures] = useState(() => INITIAL_ROWS.map((r) => ({ ...r })))
  const featuresRef = useRef(features)
  featuresRef.current = features

  const [addOpen, setAddOpen] = useState(false)
  const [tableResetKey, setTableResetKey] = useState(0)

  const [tableData, setTableData] = useState(() => ({
    rows: INITIAL_ROWS.slice(0, rowsPerPageDefault),
    total: INITIAL_ROWS.length,
  }))

  const fetchApi = useCallback((page, rowsPerPage, _filters, search = '') => {
    const filtered = filterRows(featuresRef.current, search)
    const start = (page - 1) * rowsPerPage
    setTableData({
      rows: filtered.slice(start, start + rowsPerPage),
      total: filtered.length,
    })
  }, [])

  const handleSaveFeature = useCallback(({ nameAr, nameEn, basicPrice }) => {
    setFeatures((prev) => {
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
    ],
    [isArabic]
  )

  return (
    <div className="min-w-0 space-y-4">
      <AddExtraFeatureDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleSaveFeature}
        isArabic={isArabic}
      />

      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h1 className="min-w-0 text-xl font-bold text-gray-800 sm:text-2xl">
          {isArabic ? 'الخصائص الاضافية' : 'Additional Features'}
        </h1>
        <div className="flex w-full flex-wrap items-center gap-2 sm:ms-auto sm:w-auto">
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-primary px-4 py-3 font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-primary sm:w-auto"
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
