import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import TablePage from '../components/table/TablePage.jsx'
import AddPermissionGroupDialog from '../components/AddPermissionGroupDialog.jsx'

const GROUP_SEEDS = [
  { nameAr: 'مدير النظام', nameEn: 'SYSTEM ADMINISTRATOR' },
  { nameAr: 'صلاحيات كاملة', nameEn: 'FULL ACCESS' },
  { nameAr: 'مدير تشغيل', nameEn: 'OPERATIONS MANAGER' },
  { nameAr: 'موظف استقبال', nameEn: 'FRONT DESK STAFF' },
  { nameAr: 'محاسب', nameEn: 'ACCOUNTANT' },
  { nameAr: 'عرض فقط', nameEn: 'VIEW ONLY' },
  { nameAr: 'مدير قسم', nameEn: 'DEPARTMENT HEAD' },
  { nameAr: 'أمن معلومات', nameEn: 'IT SECURITY' },
]

const INITIAL_ROWS = Array.from({ length: 42 }, (_, i) => {
  const seed = GROUP_SEEDS[i % GROUP_SEEDS.length]
  const repeatFirst = i % 5 === 0
  const base = GROUP_SEEDS[0]
  return {
    id: i + 1,
    nameAr: repeatFirst ? base.nameAr : seed.nameAr,
    nameEn: repeatFirst ? base.nameEn : seed.nameEn,
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

export default function PermissionGroupsPage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const rowsPerPageDefault = 10

  const [groups, setGroups] = useState(() => INITIAL_ROWS.map((r) => ({ ...r })))
  const groupsRef = useRef(groups)
  groupsRef.current = groups

  const [addOpen, setAddOpen] = useState(false)
  const [tableResetKey, setTableResetKey] = useState(0)

  const [tableData, setTableData] = useState(() => ({
    rows: INITIAL_ROWS.slice(0, rowsPerPageDefault),
    total: INITIAL_ROWS.length,
  }))

  const fetchApi = useCallback((page, rowsPerPage, _filters, search = '') => {
    const filtered = filterRows(groupsRef.current, search)
    const start = (page - 1) * rowsPerPage
    setTableData({
      rows: filtered.slice(start, start + rowsPerPage),
      total: filtered.length,
    })
  }, [])

  const handleSaveGroup = useCallback(({ nameAr, nameEn }) => {
    setGroups((prev) => {
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

  const specialCells = useMemo(
    () => [
      {
        key: 'nameEn',
        render: (val) => <span dir="ltr">{val}</span>,
      },
    ],
    []
  )

  return (
    <div className="min-w-0 space-y-4">
      <AddPermissionGroupDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleSaveGroup}
        isArabic={isArabic}
      />

      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h1 className="min-w-0 text-xl font-bold text-gray-800 sm:text-2xl">
          {isArabic ? 'مجموعات الصلاحيات' : 'Permission groups'}
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
