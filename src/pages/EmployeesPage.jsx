import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import TablePage from '../components/table/TablePage.jsx'
import AddEmployeeDialog from '../components/AddEmployeeDialog.jsx'

const EMPLOYEE_SEEDS = [
  {
    nameAr: 'أحمد محمد',
    nameEn: 'AHMED MOHAMED',
    permissionAr: 'مدير النظام',
    permissionEn: 'SYSTEM ADMIN',
    departmentAr: 'موارد بشرية',
    departmentEn: 'HUMAN RESOURCES',
    jobTitleAr: 'مدير قسم',
    jobTitleEn: 'DEPARTMENT MANAGER',
  },
  {
    nameAr: 'سارة علي',
    nameEn: 'SARA ALI',
    permissionAr: 'موظف',
    permissionEn: 'STAFF',
    departmentAr: 'الاستقبال',
    departmentEn: 'FRONT OFFICE',
    jobTitleAr: 'موظف استقبال',
    jobTitleEn: 'RECEPTIONIST',
  },
  {
    nameAr: 'محمود حسن',
    nameEn: 'MAHMOUD HASSAN',
    permissionAr: 'مشرف',
    permissionEn: 'SUPERVISOR',
    departmentAr: 'إدارة الغرف',
    departmentEn: 'HOUSEKEEPING',
    jobTitleAr: 'مشرف طوابق',
    jobTitleEn: 'FLOOR SUPERVISOR',
  },
  {
    nameAr: 'نورا كمال',
    nameEn: 'NOURA KAMAL',
    permissionAr: 'محاسب',
    permissionEn: 'ACCOUNTANT',
    departmentAr: 'مالية',
    departmentEn: 'FINANCE',
    jobTitleAr: 'محاسب أول',
    jobTitleEn: 'SENIOR ACCOUNTANT',
  },
  {
    nameAr: 'خالد إبراهيم',
    nameEn: 'KHALED IBRAHIM',
    permissionAr: 'موظف',
    permissionEn: 'STAFF',
    departmentAr: 'المطبخ',
    departmentEn: 'KITCHEN',
    jobTitleAr: 'شيف مساعد',
    jobTitleEn: 'SOUS CHEF',
  },
]

const INITIAL_ROWS = Array.from({ length: 42 }, (_, i) => {
  const seed = EMPLOYEE_SEEDS[i % EMPLOYEE_SEEDS.length]
  const repeatFirst = i % 5 === 0
  const base = EMPLOYEE_SEEDS[0]
  return {
    id: i + 1,
    ...(repeatFirst ? base : seed),
  }
})

const columnsAr = [
  { uid: 'nameAr', name: 'الاسم ( العربية )' },
  { uid: 'nameEn', name: 'الاسم ( English )' },
  { uid: 'permission', name: 'الصلاحية', sortKey: 'permissionAr' },
  { uid: 'department', name: 'القسم', sortKey: 'departmentAr' },
  { uid: 'jobTitle', name: 'المسمى الوظيفي', sortKey: 'jobTitleAr' },
  { uid: 'actions', name: 'الاجراءات' },
]

const columnsEn = [
  { uid: 'nameAr', name: 'Name (Arabic)' },
  { uid: 'nameEn', name: 'Name (English)' },
  { uid: 'permission', name: 'Permission', sortKey: 'permissionEn' },
  { uid: 'department', name: 'Department', sortKey: 'departmentEn' },
  { uid: 'jobTitle', name: 'Job title', sortKey: 'jobTitleEn' },
  { uid: 'actions', name: 'Actions' },
]

function filterRows(rows, search) {
  const q = (search ?? '').trim()
  if (!q) return rows
  const lower = q.toLowerCase()
  return rows.filter((r) => {
    const blob = [
      r.nameAr,
      r.nameEn,
      r.permissionAr,
      r.permissionEn,
      r.departmentAr,
      r.departmentEn,
      r.jobTitleAr,
      r.jobTitleEn,
    ]
      .filter(Boolean)
      .join(' ')
    return blob.includes(q) || blob.toLowerCase().includes(lower)
  })
}

export default function EmployeesPage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const rowsPerPageDefault = 10

  const [employees, setEmployees] = useState(() => INITIAL_ROWS.map((r) => ({ ...r })))
  const employeesRef = useRef(employees)
  employeesRef.current = employees

  const [addOpen, setAddOpen] = useState(false)
  const [tableResetKey, setTableResetKey] = useState(0)

  const [tableData, setTableData] = useState(() => ({
    rows: INITIAL_ROWS.slice(0, rowsPerPageDefault),
    total: INITIAL_ROWS.length,
  }))

  const fetchApi = useCallback((page, rowsPerPage, _filters, search = '') => {
    const filtered = filterRows(employeesRef.current, search)
    const start = (page - 1) * rowsPerPage
    setTableData({
      rows: filtered.slice(start, start + rowsPerPage),
      total: filtered.length,
    })
  }, [])

  const handleSaveEmployee = useCallback((payload) => {
    setEmployees((prev) => {
      const id = prev.reduce((m, c) => Math.max(m, c.id), 0) + 1
      const next = [...prev, { id, ...payload }]
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
        key: 'nameEn',
        render: (val) => <span dir="ltr">{val}</span>,
      },
      {
        key: 'permission',
        render: (_, item) => <span>{isArabic ? item.permissionAr : item.permissionEn}</span>,
      },
      {
        key: 'department',
        render: (_, item) => <span>{isArabic ? item.departmentAr : item.departmentEn}</span>,
      },
      {
        key: 'jobTitle',
        render: (_, item) => (
          <span dir={isArabic ? 'rtl' : 'ltr'}>{isArabic ? item.jobTitleAr : item.jobTitleEn}</span>
        ),
      },
    ],
    [isArabic]
  )

  return (
    <div className="min-w-0 space-y-4">
      <AddEmployeeDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleSaveEmployee}
        isArabic={isArabic}
      />

      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h1 className="min-w-0 text-xl font-bold text-gray-800 sm:text-2xl">
          {isArabic ? 'الموظفين' : 'Employees'}
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
