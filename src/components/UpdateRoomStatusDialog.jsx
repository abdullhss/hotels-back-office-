import { useEffect, useMemo, useState } from 'react'
import { CalendarCheck, CheckCircle2, Users, Wand2, Wrench, ArrowLeftRight, X } from 'lucide-react'
import { Dialog, DialogContent } from './ui/dialog.jsx'
import { cn } from '../lib/utils'

const STATUS_KEYS = ['available', 'occupied', 'reserved', 'cleaning', 'maintenance']

const OPTION_META = {
  available: {
    Icon: CheckCircle2,
    iconWrap: 'bg-emerald-100 text-emerald-600',
  },
  occupied: {
    Icon: Users,
    iconWrap: 'bg-rose-100 text-rose-600',
  },
  reserved: {
    Icon: CalendarCheck,
    iconWrap: 'bg-amber-100 text-amber-700',
  },
  cleaning: {
    Icon: Wand2,
    iconWrap: 'bg-orange-100 text-orange-600',
  },
  maintenance: {
    Icon: Wrench,
    iconWrap: 'bg-rose-100 text-rose-700',
  },
}

function dialogCopy(isArabic) {
  if (isArabic) {
    return {
      title: 'تحديث حالة الوحدة',
      update: 'تحديث الحالة',
      cancel: 'إلغاء',
      options: {
        available: {
          title: 'متاحة',
          desc: 'الوحدة جاهزة لاستقبال النزلاء',
        },
        occupied: {
          title: 'مشغولة',
          desc: 'الوحدة مشغولة حالياً بنزلاء',
        },
        reserved: {
          title: 'محجوزة',
          desc: 'الوحدة محجوزة لموعد قادم',
        },
        cleaning: {
          title: 'تنظيف',
          desc: 'الوحدة قيد التنظيف',
        },
        maintenance: {
          title: 'صيانة',
          desc: 'الوحدة تحت الصيانة وغير متاحة',
        },
      },
    }
  }
  return {
    title: 'Update unit status',
    update: 'Update status',
    cancel: 'Cancel',
    options: {
      available: {
        title: 'Available',
        desc: 'The unit is ready to receive guests',
      },
      occupied: {
        title: 'Occupied',
        desc: 'The unit is currently occupied by guests',
      },
      reserved: {
        title: 'Reserved',
        desc: 'The unit is reserved for a future stay',
      },
      cleaning: {
        title: 'Cleaning',
        desc: 'The unit is being cleaned',
      },
      maintenance: {
        title: 'Maintenance',
        desc: 'The unit is under maintenance and unavailable',
      },
    },
  }
}

function unitSubtitle(room, isArabic) {
  if (!room) return ''
  const cat = isArabic ? room.categoryAr : room.categoryEn
  return `${cat} ${room.number}`
}

export default function UpdateRoomStatusDialog({ open, onOpenChange, room, isArabic, onConfirm }) {
  const t = useMemo(() => dialogCopy(isArabic), [isArabic])
  const [selected, setSelected] = useState(room?.status ?? 'available')

  useEffect(() => {
    if (room) setSelected(room.status)
  }, [room])

  const handleConfirm = () => {
    if (!room) return
    onConfirm?.(room, selected)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir={isArabic ? 'rtl' : 'ltr'}
        className="max-h-[min(90dvh,720px)] w-[calc(100vw-2rem)] max-w-md gap-0 overflow-hidden p-0 sm:w-full"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#eef2f7] px-4 pb-4 pt-5 sm:px-5">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600"
              aria-hidden
            >
              <ArrowLeftRight className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0 space-y-0.5">
              <h2 className="text-lg font-bold text-gray-900">{t.title}</h2>
              <p className="text-sm text-gray-500">{unitSubtitle(room, isArabic)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-white shadow-sm transition hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            aria-label={t.cancel}
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="max-h-[min(52vh,420px)] space-y-2 overflow-y-auto px-4 py-4 sm:px-5">
          {STATUS_KEYS.map((key) => {
            const { Icon, iconWrap } = OPTION_META[key]
            const opt = t.options[key]
            const active = selected === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-start transition',
                  'border-[#e8ecf1] bg-white hover:border-[#c7d2fe] hover:bg-[#fafbff]',
                  active && 'border-brand-primary bg-[#f5f4ff] ring-1 ring-brand-primary/30'
                )}
              >
                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', iconWrap)}>
                  <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{opt.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-gray-600">{opt.desc}</p>
                </div>
              </button>
            )
          })}
        </div>

        <div
          dir="ltr"
          className="flex flex-col gap-2 border-t border-[#eef2f7] bg-[#fafbfc] px-4 py-4 sm:flex-row sm:items-stretch sm:gap-3 sm:px-5"
        >
          <button
            type="button"
            dir={isArabic ? 'rtl' : 'ltr'}
            onClick={handleConfirm}
            className="w-full flex-1 rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary-hover sm:min-h-[48px]"
          >
            {t.update}
          </button>
          <button
            type="button"
            dir={isArabic ? 'rtl' : 'ltr'}
            onClick={() => onOpenChange(false)}
            className="w-full shrink-0 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 sm:w-auto"
          >
            {t.cancel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
