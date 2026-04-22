import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TablePage from '../components/table/TablePage.jsx'
import AddBookingTypeDialog from '../components/AddBookingTypeDialog.jsx'
import { Plus } from 'lucide-react'

const BOOKING_TYPE_SEEDS = [
  { nameAr: 'حجز فردي', nameEn: 'INDIVIDUAL BOOKING' },
  { nameAr: 'حجز عائلي', nameEn: 'FAMILY BOOKING' },
  { nameAr: 'حجز جماعي', nameEn: 'GROUP BOOKING' },
  { nameAr: 'حجز شركات', nameEn: 'CORPORATE BOOKING' },
  { nameAr: 'إقامة طويلة', nameEn: 'LONG STAY' },
  { nameAr: 'حجز يوم واحد', nameEn: 'DAY USE' },
  { nameAr: 'حزمة سياحة', nameEn: 'TOUR PACKAGE' },
  { nameAr: 'حجز زفاف', nameEn: 'WEDDING PACKAGE' },
]

const INITIAL_ROWS = Array.from({ length: 42 }, (_, i) => {
  const seed = BOOKING_TYPE_SEEDS[i % BOOKING_TYPE_SEEDS.length]
  const repeatIndividual = i % 5 === 0
  const base = BOOKING_TYPE_SEEDS[0]
  return {
    id: i + 1,
    nameAr: repeatIndividual ? base.nameAr : seed.nameAr,
    nameEn: repeatIndividual ? base.nameEn : seed.nameEn,
  }
})

const columnsAr = [
  { uid: 'nameAr', name: 'الاسم ( العربية )' },
  { uid: 'nameEn', name: 'الاسم ( English )' },
  { uid: 'actions', name: 'الاجراءات' },
]

const columnsEn = [
  { uid: 'nameAr', name: 'Name (Arabic)' },
  { uid: 'nameEn', name: 'Name (English)' },
  { uid: 'actions', name: 'Actions' },
]

function filterRows(rows, search) {
  const q = (search ?? '').trim()
  if (!q) return rows
  const lower = q.toLowerCase()
  return rows.filter(
    (r) =>
      (r.nameAr && r.nameAr.includes(q)) ||
      (r.nameEn && r.nameEn.toLowerCase().includes(lower))
  )
}

export default function BookingTypesPage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const rowsPerPageDefault = 10

  const [bookingTypes, setBookingTypes] = useState(() => INITIAL_ROWS.map((r) => ({ ...r })))
  const bookingTypesRef = useRef(bookingTypes)
  bookingTypesRef.current = bookingTypes

  const [addOpen, setAddOpen] = useState(false)
  const [tableResetKey, setTableResetKey] = useState(0)

  const [tableData, setTableData] = useState(() => ({
    rows: INITIAL_ROWS.slice(0, rowsPerPageDefault),
    total: INITIAL_ROWS.length,
  }))

  const fetchApi = useCallback((page, rowsPerPage, _filters, search = '') => {
    const filtered = filterRows(bookingTypesRef.current, search)
    const start = (page - 1) * rowsPerPage
    setTableData({
      rows: filtered.slice(start, start + rowsPerPage),
      total: filtered.length,
    })
  }, [])

  const handleSaveBookingType = useCallback(({ nameAr, nameEn }) => {
    setBookingTypes((prev) => {
      const id = prev.reduce((m, c) => Math.max(m, c.id), 0) + 1
      const next = [...prev, { id, nameAr, nameEn }]
      const filtered = filterRows(next, '')
      setTableData({
        rows: filtered.slice(0, rowsPerPageDefault),
        total: filtered.length,
      })
      setTableResetKey((k) => k + 1)
      return next
    })
  }, [rowsPerPageDefault])

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

  return (
    <div className="space-y-4">
      <AddBookingTypeDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleSaveBookingType}
        isArabic={isArabic}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800">
          {isArabic ? 'أنواع الحجوزات' : 'Booking Types'}
        </h1>
        <div className="flex flex-wrap items-center gap-2 ms-auto">
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="rounded-md inline-flex items-center gap-2 bg-brand-primary px-4 py-3 font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-primary"
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
        hideSearch={false}
        rowsPerPageDefault={rowsPerPageDefault}
        searchPanelClassName=""
        tablePanelClassName=""
      />
    </div>
  )
}
