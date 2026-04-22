import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TablePage from '../components/table/TablePage.jsx'
import AddUnitStatusDialog from '../components/AddUnitStatusDialog.jsx'

const UNIT_STATUS_SEEDS = [
  { nameAr: 'تعمل', nameEn: 'OPERATIONAL' },
  { nameAr: 'صيانة', nameEn: 'MAINTENANCE' },
]

const INITIAL_ROWS = Array.from({ length: 42 }, (_, i) => {
  const seed = UNIT_STATUS_SEEDS[i % UNIT_STATUS_SEEDS.length]
  const repeatOperational = i % 5 === 0
  return {
    id: i + 1,
    nameAr: repeatOperational ? 'تعمل' : seed.nameAr,
    nameEn: repeatOperational ? 'OPERATIONAL' : seed.nameEn,
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

export default function UnitStatusesPage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const rowsPerPageDefault = 10

  const [unitStatuses, setUnitStatuses] = useState(() => INITIAL_ROWS.map((r) => ({ ...r })))
  const unitStatusesRef = useRef(unitStatuses)
  unitStatusesRef.current = unitStatuses

  const [addOpen, setAddOpen] = useState(false)
  const [tableResetKey, setTableResetKey] = useState(0)

  const [tableData, setTableData] = useState(() => ({
    rows: INITIAL_ROWS.slice(0, rowsPerPageDefault),
    total: INITIAL_ROWS.length,
  }))

  const fetchApi = useCallback((page, rowsPerPage, _filters, search = '') => {
    const filtered = filterRows(unitStatusesRef.current, search)
    const start = (page - 1) * rowsPerPage
    setTableData({
      rows: filtered.slice(start, start + rowsPerPage),
      total: filtered.length,
    })
  }, [])

  const handleSaveUnitStatus = useCallback(({ nameAr, nameEn }) => {
    setUnitStatuses((prev) => {
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
      <AddUnitStatusDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleSaveUnitStatus}
        isArabic={isArabic}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800">
          {isArabic ? 'حالات الوحدات' : 'Unit Statuses'}
        </h1>
        <div className="flex flex-wrap items-center gap-2 ms-auto">
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="rounded-md bg-brand-primary px-4 py-3 font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand-primary"
          >
            {isArabic ? '+ إضافة جديد' : '+ Add new'}
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
