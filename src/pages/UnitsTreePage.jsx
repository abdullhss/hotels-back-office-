import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChevronDown,
  Home,
  Layers,
  LayoutGrid,
  Plus,
  Trash2,
} from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion.jsx'
import AddUnitNodeDialog from '../components/AddUnitNodeDialog.jsx'
import { cn } from '../lib/utils'

const INITIAL_TREE = [
  {
    id: 'floor-1',
    type: 'floor',
    nameAr: 'الدور',
    children: [
      {
        id: 'suite-1',
        type: 'suite',
        nameAr: 'جناح',
        children: [
          { id: 'room-1', type: 'room', nameAr: 'غرفة', children: [] },
        ],
      },
    ],
  },
]

function uid() {
  return `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

function makeUnits({ nameAr, type, count, startNumber }) {
  if (count === 1) {
    return [{ id: uid(), type, nameAr, children: [] }]
  }
  return Array.from({ length: count }, (_, i) => ({
    id: uid(),
    type,
    nameAr: `${nameAr} ${startNumber + i}`,
    children: [],
  }))
}

function findFirstNode(nodes, predicate) {
  for (const n of nodes) {
    if (predicate(n)) return n
    if (n.children?.length) {
      const found = findFirstNode(n.children, predicate)
      if (found) return found
    }
  }
  return null
}

function removeNodeById(nodes, id) {
  const next = []
  for (const n of nodes) {
    if (n.id === id) continue
    next.push({
      ...n,
      children: n.children?.length ? removeNodeById(n.children, id) : [],
    })
  }
  return next
}

function insertUnits(tree, payload) {
  const units = makeUnits(payload)
  const { type } = payload

  if (type === 'floor') {
    return [...tree, ...units]
  }

  const draft = structuredClone(tree)

  if (type === 'suite') {
    const floor = findFirstNode(draft, (n) => n.type === 'floor')
    if (floor) {
      floor.children = [...(floor.children || []), ...units]
      return draft
    }
    return [
      ...draft,
      {
        id: uid(),
        type: 'floor',
        nameAr: 'الدور',
        children: units,
      },
    ]
  }

  if (type === 'room') {
    const suite = findFirstNode(draft, (n) => n.type === 'suite')
    if (suite) {
      suite.children = [...(suite.children || []), ...units]
      return draft
    }
    const floor = findFirstNode(draft, (n) => n.type === 'floor')
    if (floor) {
      const newSuite = {
        id: uid(),
        type: 'suite',
        nameAr: 'جناح',
        children: units,
      }
      floor.children = [...(floor.children || []), newSuite]
      return draft
    }
    return [
      ...draft,
      {
        id: uid(),
        type: 'floor',
        nameAr: 'الدور',
        children: [
          {
            id: uid(),
            type: 'suite',
            nameAr: 'جناح',
            children: units,
          },
        ],
      },
    ]
  }

  return draft
}

const TYPE_ICON = {
  floor: Layers,
  suite: LayoutGrid,
  room: Home,
}

const TYPE_ICON_CLASS = {
  floor: 'text-violet-600',
  suite: 'text-orange-500',
  room: 'text-emerald-600',
}

function RoomRow({ node, isArabic, onDelete, onAdd }) {
  const Icon = TYPE_ICON[node.type] ?? Home
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg border border-transparent bg-[#eef2ff] px-3 py-2.5',
        'transition-colors hover:bg-[#e8ebff]'
      )}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onAdd?.(node)}
          className="rounded-md p-1.5 text-emerald-600 transition hover:bg-emerald-50"
          aria-label={isArabic ? 'إضافة' : 'Add'}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(node.id)}
          className="rounded-md p-1.5 text-red-500 transition hover:bg-red-50"
          aria-label={isArabic ? 'حذف' : 'Delete'}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
        <span className="truncate text-sm font-medium text-gray-900">{node.nameAr}</span>
        <Icon className={cn('h-5 w-5 shrink-0', TYPE_ICON_CLASS.room)} strokeWidth={1.75} aria-hidden />
      </div>
    </div>
  )
}

function TreeBranch({ nodes, defaultOpenIds, isArabic, onDelete, onAddChild }) {
  if (!nodes?.length) return null

  const allLeafRooms = nodes.every((n) => n.type === 'room' && !(n.children?.length > 0))
  if (allLeafRooms) {
    return (
      <div className="space-y-1 py-1">
        {nodes.map((room) => (
          <RoomRow
            key={room.id}
            node={room}
            isArabic={isArabic}
            onDelete={onDelete}
            onAdd={() => onAddChild?.(room)}
          />
        ))}
      </div>
    )
  }

  return (
    <Accordion type="multiple" defaultValue={defaultOpenIds} className="space-y-1">
      {nodes.map((node) => {
        const Icon = TYPE_ICON[node.type] ?? Layers
        const iconClass = TYPE_ICON_CLASS[node.type] ?? 'text-gray-600'
        const childOpenIds = (node.children || []).filter((c) => c.type !== 'room').map((c) => c.id)

        return (
          <AccordionItem key={node.id} value={node.id} className="border-0">
            <AccordionTrigger className="flex w-full items-center gap-2 rounded-lg py-2 pe-2 ps-3 text-start hover:bg-gray-50 hover:no-underline data-[state=open]:bg-gray-50 [&[data-state=open]>svg]:rotate-180">
              <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200" />
              <Icon className={cn('h-5 w-5 shrink-0', iconClass)} strokeWidth={1.75} aria-hidden />
              <span className="flex-1 text-sm font-medium text-gray-900">{node.nameAr}</span>
            </AccordionTrigger>
            <AccordionContent className="pb-1 pt-0">
              <div className="border-e-2 border-gray-100 pe-2 ps-4 md:ps-8">
                <TreeBranch
                  nodes={node.children}
                  defaultOpenIds={childOpenIds}
                  isArabic={isArabic}
                  onDelete={onDelete}
                  onAddChild={onAddChild}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export default function UnitsTreePage() {
  const { i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  const [tree, setTree] = useState(() => structuredClone(INITIAL_TREE))
  const [addOpen, setAddOpen] = useState(false)

  const defaultOpenRoot = useMemo(() => INITIAL_TREE.map((n) => n.id), [])

  const copy = useMemo(
    () =>
      isArabic
        ? {
            title: 'شجرة الوحدات',
            subtitle: 'تعريف هيكل الفندق من أدوار وأجنحة وغرف',
            addNew: 'إضافة جديد',
          }
        : {
            title: 'Units tree',
            subtitle: 'Define the hotel structure: floors, suites, and rooms',
            addNew: 'Add new',
          },
    [isArabic]
  )

  const handleSave = useCallback((payload) => {
    setTree((prev) => insertUnits(prev, payload))
  }, [])

  const handleDelete = useCallback((id) => {
    setTree((prev) => removeNodeById(prev, id))
  }, [])

  const handleAddFromRoom = useCallback(() => {
    setAddOpen(true)
  }, [])

  return (
    <div className="space-y-6">
      <AddUnitNodeDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleSave}
        isArabic={isArabic}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">{copy.title}</h1>
          <p className="text-sm text-gray-600">{copy.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-brand-primary-hover ms-auto"
        >
          <Plus className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
          {copy.addNew}
        </button>
      </div>

      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm md:p-6">
        <TreeBranch
          nodes={tree}
          defaultOpenIds={defaultOpenRoot}
          isArabic={isArabic}
          onDelete={handleDelete}
          onAddChild={handleAddFromRoom}
        />
      </div>
    </div>
  )
}
