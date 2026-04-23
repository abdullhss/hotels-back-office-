import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'
import TablePage from '../components/table/TablePage.jsx'
import { cn } from '../lib/utils'

const STATUS = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
}

function formatDate(isoDate) {
  const d = new Date(isoDate + (isoDate.includes('T') ? '' : 'T12:00:00'))
  if (Number.isNaN(d.getTime())) return isoDate
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd} - ${mm} - ${yyyy}`
}

const SEED_BOOKINGS = [
  {
    guestAr: 'محمد علي المغربي',
    guestEn: 'Mohamed Ali El-Maghribi',
    roomTypeAr: 'سويت',
    roomTypeEn: 'SUITE',
    checkIn: '2026-04-01',
    checkOut: '2026-04-05',
    basicPrice: 500,
    status: STATUS.pending,
  },
  {
    guestAr: 'فاطمة حسن',
    guestEn: 'Fatima Hassan',
    roomTypeAr: 'غرفة مزدوجة',
    roomTypeEn: 'DOUBLE ROOM',
    checkIn: '2026-03-28',
    checkOut: '2026-03-31',
    basicPrice: 320,
    status: STATUS.pending,
  },
  {
    guestAr: 'خالد عمر',
    guestEn: 'Khaled Omar',
    roomTypeAr: 'جناح تنفيذي',
    roomTypeEn: 'EXECUTIVE SUITE',
    checkIn: '2026-04-10',
    checkOut: '2026-04-15',
    basicPrice: 1200,
    status: STATUS.pending,
  },
]

const INITIAL_ROWS = Array.from({ length: 24 }, (_, i) => {
  const seed = SEED_BOOKINGS[i % SEED_BOOKINGS.length]
  return {
    id: i + 1,
    ...seed,
    basicPrice: seed.basicPrice + (i % 7) * 50,
  }
})

const columnsAr = [
  { uid: 'guest', name: 'النزيل', sortKey: 'guestAr' },
  { uid: 'roomType', name: 'نوع الغرفة', sortKey: 'roomTypeAr' },
  { uid: 'checkIn', name: 'تسجيل الدخول' },
  { uid: 'checkOut', name: 'تسجيل الخروج' },
  { uid: 'basicPrice', name: 'المبلغ', sortKey: 'basicPrice' },
  { uid: 'status', name: 'الحالة', sortKey: 'status' },
  { uid: 'actions', name: 'الاجراءات' },
]

const columnsEn = [
  { uid: 'guest', name: 'Guest', sortKey: 'guestEn' },
  { uid: 'roomType', name: 'Room type', sortKey: 'roomTypeEn' },
  { uid: 'checkIn', name: 'Check-in' },
  { uid: 'checkOut', name: 'Check-out' },
  { uid: 'basicPrice', name: 'Amount', sortKey: 'basicPrice' },
  { uid: 'status', name: 'Status', sortKey: 'status' },
  { uid: 'actions', name: 'Actions' },
]

function filterRows(rows, search) {
  const q = (search ?? '').trim()
  if (!q) return rows
  const lower = q.toLowerCase()
  return rows.filter((r) => {
    const blob = [
      r.guestAr,
      r.guestEn,
      r.roomTypeAr,
      r.roomTypeEn,
      r.checkIn,
      r.checkOut,
      String(r.basicPrice ?? ''),
    ]
      .filter(Boolean)
      .join(' ')
    return blob.includes(q) || blob.toLowerCase().includes(lower)
  })
}

export default function BookingFollowUpPage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const rowsPerPageDefault = 10

  const [rows, setRows] = useState(() => INITIAL_ROWS.map((r) => ({ ...r })))
  const rowsRef = useRef(rows)
  rowsRef.current = rows

  const lastQueryRef = useRef({ page: 1, rowsPerPage: rowsPerPageDefault, search: '' })

  const [tableData, setTableData] = useState(() => ({
    rows: INITIAL_ROWS.slice(0, rowsPerPageDefault),
    total: INITIAL_ROWS.length,
  }))

  const titledColumns = useMemo(() => (isArabic ? columnsAr : columnsEn), [isArabic])

  const statusLabel = useCallback(
    (status) => {
      if (isArabic) {
        if (status === STATUS.approved) return 'تمت الموافقة'
        if (status === STATUS.rejected) return 'مرفوض'
        return 'قيد الانتظار'
      }
      if (status === STATUS.approved) return 'Approved'
      if (status === STATUS.rejected) return 'Rejected'
      return 'Pending'
    },
    [isArabic]
  )

  const patchStatus = useCallback((id, status) => {
    setRows((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, status } : r))
      rowsRef.current = next
      const { page, rowsPerPage, search } = lastQueryRef.current
      const filtered = filterRows(next, search)
      const start = (page - 1) * rowsPerPage
      setTableData({
        rows: filtered.slice(start, start + rowsPerPage),
        total: filtered.length,
      })
      return next
    })
  }, [])

  const fetchApi = useCallback((page, rowsPerPage, _filters, search = '') => {
    lastQueryRef.current = { page, rowsPerPage, search }
    const filtered = filterRows(rowsRef.current, search)
    const start = (page - 1) * rowsPerPage
    setTableData({
      rows: filtered.slice(start, start + rowsPerPage),
      total: filtered.length,
    })
  }, [])

  const handleApprove = useCallback(
    (item) => {
      if (item.status !== STATUS.pending) return
      patchStatus(item.id, STATUS.approved)
      const name = isArabic ? item.guestAr : item.guestEn
      toast.success(
        isArabic ? `تمت الموافقة على حجز ${name}` : `Booking approved for ${name}`
      )
    },
    [isArabic, patchStatus]
  )

  const handleReject = useCallback(
    (item) => {
      if (item.status !== STATUS.pending) return
      patchStatus(item.id, STATUS.rejected)
      const name = isArabic ? item.guestAr : item.guestEn
      toast.error(isArabic ? `تم رفض حجز ${name}` : `Booking rejected for ${name}`)
    },
    [isArabic, patchStatus]
  )

  const specialCells = useMemo(
    () => [
      {
        key: 'guest',
        render: (_, item) => (isArabic ? item.guestAr : item.guestEn),
      },
      {
        key: 'roomType',
        render: (_, item) => (isArabic ? item.roomTypeAr : item.roomTypeEn),
      },
      {
        key: 'checkIn',
        render: (val) => <span dir="ltr">{formatDate(val)}</span>,
      },
      {
        key: 'checkOut',
        render: (val) => <span dir="ltr">{formatDate(val)}</span>,
      },
      {
        key: 'basicPrice',
        render: (val) =>
          val != null && !Number.isNaN(Number(val)) ? (
            <span dir="ltr">
              {Number(val).toLocaleString(isArabic ? 'ar-EG' : 'en-US')} د.ل.
            </span>
          ) : (
            '—'
          ),
      },
      {
        key: 'status',
        render: (_, item) => {
          const s = item.status
          return (
            <span
              className={cn(
                'inline-flex rounded-lg border px-3 py-1 text-xs font-semibold',
                s === STATUS.pending &&
                  'border-amber-400 bg-amber-50 text-amber-800',
                s === STATUS.approved &&
                  'border-emerald-400 bg-emerald-50 text-emerald-800',
                s === STATUS.rejected && 'border-red-400 bg-red-50 text-red-800'
              )}
            >
              {statusLabel(s)}
            </span>
          )
        },
      },
      {
        key: 'actions',
        render: (_, item) => {
          const pending = item.status === STATUS.pending
          return (
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={!pending}
                onClick={(e) => {
                  e.stopPropagation()
                  handleApprove(item)
                }}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 transition',
                  pending
                    ? 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'
                    : 'cursor-not-allowed border-gray-200 text-gray-300 opacity-50'
                )}
                aria-label={isArabic ? 'موافقة' : 'Approve'}
              >
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                disabled={!pending}
                onClick={(e) => {
                  e.stopPropagation()
                  handleReject(item)
                }}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 transition',
                  pending
                    ? 'border-red-500 text-red-600 hover:bg-red-50'
                    : 'cursor-not-allowed border-gray-200 text-gray-300 opacity-50'
                )}
                aria-label={isArabic ? 'رفض' : 'Reject'}
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          )
        },
      },
    ],
    [handleApprove, handleReject, isArabic, statusLabel]
  )

  const header = useMemo(
    () =>
      isArabic
        ? {
            title: 'متابعة الحجوزات',
            subtitle: 'الحجوزات التي تحتاج إلى موافقة الإدارة',
          }
        : {
            title: 'Booking follow-up',
            subtitle: 'Bookings pending management approval',
          },
    [isArabic]
  )

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">{header.title}</h1>
        <p className="text-sm text-gray-600">{header.subtitle}</p>
      </div>

      <TablePage
        columns={titledColumns}
        data={tableData.rows}
        total={tableData.total}
        fetchApi={fetchApi}
        specialCells={specialCells}
        hideSearch={false}
        rowsPerPageDefault={rowsPerPageDefault}
        searchPanelClassName=""
        tablePanelClassName=""
      />
    </div>
  )
}
