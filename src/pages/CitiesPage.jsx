import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TablePage from '../components/table/TablePage.jsx'
import AddCityDialog from '../components/AddCityDialog.jsx'
import { Plus } from 'lucide-react'
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

const COUNTRY_OPTIONS = COUNTRY_SEEDS.map((c, i) => ({
  id: i + 1,
  nameAr: c.nameAr,
  nameEn: c.nameEn,
}))

function countryById(id) {
  return COUNTRY_OPTIONS.find((c) => c.id === id) ?? COUNTRY_OPTIONS[0]
}

const CITY_SEEDS = [
  { nameAr: 'القاهرة', nameEn: 'CAIRO', countryId: 1 },
  { nameAr: 'الإسكندرية', nameEn: 'ALEXANDRIA', countryId: 1 },
  { nameAr: 'الرياض', nameEn: 'RIYADH', countryId: 2 },
  { nameAr: 'جدة', nameEn: 'JEDDAH', countryId: 2 },
  { nameAr: 'دبي', nameEn: 'DUBAI', countryId: 3 },
  { nameAr: 'أبوظبي', nameEn: 'ABU DHABI', countryId: 3 },
  { nameAr: 'الكويت', nameEn: 'KUWAIT CITY', countryId: 4 },
  { nameAr: 'الدوحة', nameEn: 'DOHA', countryId: 5 },
  { nameAr: 'المنامة', nameEn: 'MANAMA', countryId: 6 },
  { nameAr: 'مسقط', nameEn: 'MUSCAT', countryId: 7 },
  { nameAr: 'عَمّان', nameEn: 'AMMAN', countryId: 8 },
  { nameAr: 'بيروت', nameEn: 'BEIRUT', countryId: 9 },
  { nameAr: 'بغداد', nameEn: 'BAGHDAD', countryId: 10 },
  { nameAr: 'دمشق', nameEn: 'DAMASCUS', countryId: 11 },
  { nameAr: 'رام الله', nameEn: 'RAMALLAH', countryId: 12 },
  { nameAr: 'الدار البيضاء', nameEn: 'CASABLANCA', countryId: 13 },
  { nameAr: 'تونس', nameEn: 'TUNIS', countryId: 14 },
  { nameAr: 'الجزائر العاصمة', nameEn: 'ALGIERS', countryId: 15 },
  { nameAr: 'طرابلس', nameEn: 'TRIPOLI', countryId: 16 },
  { nameAr: 'الخرطوم', nameEn: 'KHARTOUM', countryId: 17 },
  { nameAr: 'صنعاء', nameEn: 'SANA\'A', countryId: 18 },
  { nameAr: 'إسطنبول', nameEn: 'ISTANBUL', countryId: 19 },
]

const INITIAL_ROWS = Array.from({ length: 42 }, (_, i) => {
  const seed = CITY_SEEDS[i % CITY_SEEDS.length]
  const co = countryById(seed.countryId)
  return {
    id: i + 1,
    nameAr: seed.nameAr,
    nameEn: seed.nameEn,
    countryId: seed.countryId,
    countryAr: co.nameAr,
    countryEn: co.nameEn,
  }
})

const columnsAr = [
  { uid: 'nameAr', name: 'الاسم ( العربية )' },
  { uid: 'nameEn', name: 'الاسم ( English )' },
  { uid: 'country', name: 'الدولة', sortKey: 'countryAr' },
  { uid: 'actions', name: 'الاجراءات' },
]

const columnsEn = [
  { uid: 'nameAr', name: 'Name (Arabic)' },
  { uid: 'nameEn', name: 'Name (English)' },
  { uid: 'country', name: 'Country', sortKey: 'countryEn' },
  { uid: 'actions', name: 'Actions' },
]

function filterRows(rows, search) {
  const q = (search ?? '').trim()
  if (!q) return rows
  const lower = q.toLowerCase()
  return rows.filter(
    (r) =>
      (r.nameAr && r.nameAr.includes(q)) ||
      (r.nameEn && r.nameEn.toLowerCase().includes(lower)) ||
      (r.countryAr && r.countryAr.includes(q)) ||
      (r.countryEn && r.countryEn.toLowerCase().includes(lower))
  )
}

export default function CitiesPage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const rowsPerPageDefault = 10

  const [cities, setCities] = useState(() => INITIAL_ROWS.map((r) => ({ ...r })))
  const citiesRef = useRef(cities)
  citiesRef.current = cities

  const [addOpen, setAddOpen] = useState(false)
  const [tableResetKey, setTableResetKey] = useState(0)

  const [tableData, setTableData] = useState(() => ({
    rows: INITIAL_ROWS.slice(0, rowsPerPageDefault),
    total: INITIAL_ROWS.length,
  }))

  const fetchApi = useCallback((page, rowsPerPage, _filters, search = '') => {
    const filtered = filterRows(citiesRef.current, search)
    const start = (page - 1) * rowsPerPage
    setTableData({
      rows: filtered.slice(start, start + rowsPerPage),
      total: filtered.length,
    })
  }, [])

  const handleSaveCity = useCallback(({ nameAr, nameEn, countryId }) => {
    const co = countryById(countryId)
    setCities((prev) => {
      const id = prev.reduce((m, c) => Math.max(m, c.id), 0) + 1
      const next = [
        ...prev,
        {
          id,
          nameAr,
          nameEn,
          countryId,
          countryAr: co.nameAr,
          countryEn: co.nameEn,
        },
      ]
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
        key: 'country',
        render: (_, item) => (isArabic ? item.countryAr : item.countryEn),
      },
    ],
    [isArabic]
  )

  return (
    <div className="min-w-0 space-y-4">
      <AddCityDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleSaveCity}
        isArabic={isArabic}
        countries={COUNTRY_OPTIONS}
      />

      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h1 className="min-w-0 text-xl font-bold text-gray-800 sm:text-2xl">{isArabic ? 'المدن' : 'Cities'}</h1>
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
