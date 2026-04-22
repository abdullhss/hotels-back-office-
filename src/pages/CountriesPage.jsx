import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TablePage from '../components/table/TablePage.jsx'
import AddCountryDialog from '../components/AddCountryDialog.jsx'

const COUNTRY_SEEDS = [
  { nameAr: 'مصر', nameEn: 'EGYPT' },
  { nameAr: 'السعودية', nameEn: 'SAUDI ARABIA' },
  { nameAr: 'الإمارات', nameEn: 'UNITED ARAB EMIRATES' },
  { nameAr: 'الكويت', nameEn: 'KUWAIT' },
  { nameAr: 'قطر', nameEn: 'QATAR' },
  { nameAr: 'البحرين', nameEn: 'BAHRAIN' },
  { nameAr: 'عُمان', nameEn: 'OMAN' },
  { nameAr: 'الأردن', nameEn: 'JORDAN' },
  { nameAr: 'لبنان', nameEn: 'LEBANON' },
  { nameAr: 'العراق', nameEn: 'IRAQ' },
  { nameAr: 'سوريا', nameEn: 'SYRIA' },
  { nameAr: 'فلسطين', nameEn: 'PALESTINE' },
  { nameAr: 'المغرب', nameEn: 'MOROCCO' },
  { nameAr: 'تونس', nameEn: 'TUNISIA' },
  { nameAr: 'الجزائر', nameEn: 'ALGERIA' },
  { nameAr: 'ليبيا', nameEn: 'LIBYA' },
  { nameAr: 'السودان', nameEn: 'SUDAN' },
  { nameAr: 'اليمن', nameEn: 'YEMEN' },
  { nameAr: 'تركيا', nameEn: 'TURKEY' },
]

const INITIAL_ROWS = Array.from({ length: 42 }, (_, i) => {
  const seed = COUNTRY_SEEDS[i % COUNTRY_SEEDS.length]
  const repeatEgypt = i % 5 === 0
  return {
    id: i + 1,
    nameAr: repeatEgypt ? 'مصر' : seed.nameAr,
    nameEn: repeatEgypt ? 'EGYPT' : seed.nameEn,
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

export default function CountriesPage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const rowsPerPageDefault = 10

  const [countries, setCountries] = useState(() => INITIAL_ROWS.map((r) => ({ ...r })))
  const countriesRef = useRef(countries)
  countriesRef.current = countries

  const [addOpen, setAddOpen] = useState(false)
  const [tableResetKey, setTableResetKey] = useState(0)

  const [tableData, setTableData] = useState(() => ({
    rows: INITIAL_ROWS.slice(0, rowsPerPageDefault),
    total: INITIAL_ROWS.length,
  }))

  const fetchApi = useCallback((page, rowsPerPage, _filters, search = '') => {
    const filtered = filterRows(countriesRef.current, search)
    const start = (page - 1) * rowsPerPage
    setTableData({
      rows: filtered.slice(start, start + rowsPerPage),
      total: filtered.length,
    })
  }, [])

  const handleSaveCountry = useCallback(({ nameAr, nameEn }) => {
    setCountries((prev) => {
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
      <AddCountryDialog open={addOpen} onOpenChange={setAddOpen} onSave={handleSaveCountry} isArabic={isArabic} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800">{isArabic ? 'الدول' : 'Countries'}</h1>
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
