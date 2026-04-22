import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, ChevronDown, Search, X } from 'lucide-react'
import { cn } from '../../../lib/utils'
import * as XLSX from 'xlsx'

const SEARCH_DEBOUNCE_MS = 300

const getCleanedFilters = (filterState) => {
  const cleaned = {}
  for (const key in filterState) {
    const val = filterState[key]
    if (val != null && val !== '' && val !== '-1') {
      cleaned[key] = val
    }
  }
  return cleaned
}

const sortByDescriptor = (list, sortDescriptor) => {
  if (!list?.length || !sortDescriptor?.column) return list
  return [...list].sort((a, b) => {
    const first = a[sortDescriptor.column]
    const second = b[sortDescriptor.column]
    const cmp = first < second ? -1 : first > second ? 1 : 0
    return sortDescriptor.direction === 'descending' ? -cmp : cmp
  })
}

const buildAndDownloadExcel = (columns, data, filename = 'export') => {
  const visibleColumns = columns.filter((c) => c.uid !== 'actions')
  const headers = visibleColumns.map((c) => c.name ?? c.uid)
  const rows = data.map((item) =>
    visibleColumns.map((c) => {
      const val = item[c.uid]
      return val != null && typeof val === 'object' && !(val instanceof Date) ? JSON.stringify(val) : val
    })
  )
  const sheetData = [headers, ...rows]
  const ws = XLSX.utils.aoa_to_sheet(sheetData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

export const useTablePage = ({
  data = [],
  total = 0,
  specialCells = [],
  fetchApi,
  rowsPerPageDefault = 10,
  filters = [],
  hideSearch = true,
  exportAsExcel,
  columns = [],
}) => {
  const { t } = useTranslation()

  const initialFilterState = useMemo(() => {
    const state = {}
    filters.forEach((f) => {
      if (f?.key && f.hide !== true) {
        const firstVal =
          f.defaultToFirstOption && f.options?.[0]?.value != null ? String(f.options[0].value) : '-1'
        state[f.key] = firstVal
      }
    })
    return state
  }, [filters])

  const [selectedKeys, setSelectedKeys] = useState(new Set([]))
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageDefault)
  const [page, setPage] = useState(1)
  const [filterState, setFilterState] = useState(initialFilterState)
  const [searchValue, setSearchValue] = useState('')
  const searchDebounceRef = useRef(null)

  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'id',
    direction: 'descending',
  })
  const [exportExcelLoading, setExportExcelLoading] = useState(false)

  const hasFilters = filters?.filter((f) => !f.hide)?.length > 0
  const passFilters = useCallback(
    (p, rp, state, search = undefined) => {
      if (!fetchApi) return
      const cleaned = hasFilters ? getCleanedFilters(state) : undefined
      if (hideSearch) {
        if (cleaned && Object.keys(cleaned).length > 0) {
          fetchApi(p, rp, cleaned)
        } else {
          fetchApi(p, rp)
        }
      } else {
        if (cleaned && Object.keys(cleaned).length > 0) {
          fetchApi(p, rp, cleaned, search ?? searchValue)
        } else {
          fetchApi(p, rp, undefined, search ?? searchValue)
        }
      }
    },
    [fetchApi, hasFilters, hideSearch, searchValue]
  )

  /* When filter options load after mount, apply defaultToFirstOption (bundle behavior). */
  /* eslint-disable react-hooks/set-state-in-effect -- sync filter defaults from async options */
  React.useEffect(() => {
    let updated = null
    filters.forEach((f) => {
      if (f?.key && f.hide !== true && f.defaultToFirstOption && f.options?.[0]?.value != null) {
        const firstVal = String(f.options[0].value)
        if ((filterState[f.key] ?? '-1') === '-1') {
          updated = { ...(updated ?? filterState), [f.key]: firstVal }
        }
      }
    })
    if (updated) {
      setFilterState(updated)
      setPage(1)
      passFilters(1, rowsPerPage, updated)
    }
  }, [filters, filterState, rowsPerPage, passFilters])
  /* eslint-enable react-hooks/set-state-in-effect */

  const pages = useMemo(() => {
    return Math.max(1, Math.ceil(total / rowsPerPage))
  }, [total, rowsPerPage])

  const filteredItems = useMemo(() => {
    return [...data]
  }, [data])

  const sortedItems = useMemo(() => {
    const sortCol = columns.find((c) => c.uid === sortDescriptor.column)
    const key = sortCol?.sortKey ?? sortDescriptor.column
    return [...filteredItems].sort((a, b) => {
      const first = a[key]
      const second = b[key]
      const cmp = first < second ? -1 : first > second ? 1 : 0
      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [filteredItems, sortDescriptor, columns])

  const renderCell = useCallback(
    (item, columnKey) => {
      const special = specialCells?.find((c) => c.key === columnKey)

      if (special) {
        return special.render(item[columnKey], item)
      }

      if (columnKey === 'actions') {
        return null
      }

      if (columnKey.includes('phone')) {
        return <span dir="ltr">{item[columnKey]}</span>
      }

      return item[columnKey]
    },
    [specialCells]
  )

  const handlePageChange = useCallback(
    (newPage) => {
      setPage(newPage)
      setSelectedKeys(new Set([]))
      passFilters(newPage, rowsPerPage, filterState)
    },
    [passFilters, rowsPerPage, filterState]
  )

  const handleRowsPerPageChange = useCallback(
    (value) => {
      const newRowsPerPage = Number(value)
      setRowsPerPage(newRowsPerPage)
      setPage(1)
      passFilters(1, newRowsPerPage, filterState)
    },
    [passFilters, filterState]
  )

  const handleFilterChange = useCallback(
    (filterKey, value) => {
      const updated = { ...filterState, [filterKey]: value }
      setFilterState(updated)
      setPage(1)
      passFilters(1, rowsPerPage, updated)
    },
    [filterState, rowsPerPage, passFilters]
  )

  const handleSearchChange = useCallback(
    (value) => {
      setSearchValue(value)
      setSelectedKeys(new Set([]))
      setPage(1)
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
      searchDebounceRef.current = setTimeout(() => {
        passFilters(1, rowsPerPage, filterState, value)
        searchDebounceRef.current = null
      }, SEARCH_DEBOUNCE_MS)
    },
    [rowsPerPage, filterState, passFilters]
  )

  const handleSearchClear = useCallback(() => {
    setSearchValue('')
    setSelectedKeys(new Set([]))
    setPage(1)
    passFilters(1, rowsPerPage, filterState, '')
  }, [rowsPerPage, filterState, passFilters])

  const handleSearchTrigger = useCallback(() => {
    setSelectedKeys(new Set([]))
    setPage(1)
    passFilters(1, rowsPerPage, filterState, searchValue)
  }, [rowsPerPage, filterState, passFilters, searchValue])

  const bottomContent = useMemo(() => {
    const pagingOptions = ['10', '20', '50']
    if (total > 50) {
      pagingOptions.push(String(total))
    }

    const pageNumbers = []
    const maxVisiblePages = 5
    if (pages <= maxVisiblePages) {
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i)
      }
    } else if (page <= 3) {
      for (let i = 1; i <= 5; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push('...')
      pageNumbers.push(pages)
    } else if (page >= pages - 2) {
      pageNumbers.push(1)
      pageNumbers.push('...')
      for (let i = pages - 4; i <= pages; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(1)
      pageNumbers.push('...')
      for (let i = page - 1; i <= page + 1; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push('...')
      pageNumbers.push(pages)
    }

    return (
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div dir="ltr" className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {pageNumbers.map((pageNum, index) => (
            <React.Fragment key={index}>
              {pageNum === '...' ? (
                <span className="px-2 text-gray-500">...</span>
              ) : (
                <button
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={cn(
                    'px-3 py-1 rounded-md text-sm transition-colors',
                    page === pageNum ? 'bg-brand-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {pageNum}
                </button>
              )}
            </React.Fragment>
          ))}

          <button
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= pages}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">{t('table.rowsPerPage')}</span>
          <div className="relative">
            <select
              dir="ltr"
              value={String(rowsPerPage)}
              onChange={(e) => handleRowsPerPageChange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1.5 rtl:pr-8 ltr:pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              {pagingOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>
    )
  }, [page, pages, rowsPerPage, total, handlePageChange, handleRowsPerPageChange, t])

  const handleSort = useCallback((columnKey) => {
    setSortDescriptor((prev) => {
      const direction =
        prev.column === columnKey && prev.direction === 'ascending' ? 'descending' : 'ascending'
      return { column: columnKey, direction }
    })
  }, [])

  const handleExportExcel = useCallback(async () => {
    const cleaned = getCleanedFilters(filterState)
    const params = { searchValue, filterState: cleaned, sortDescriptor, total }
    if (exportAsExcel?.onClick) {
      await exportAsExcel.onClick(params)
      return
    }
    if (exportAsExcel?.fetchAllData && columns?.length > 0) {
      setExportExcelLoading(true)
      try {
        const result = await exportAsExcel.fetchAllData(cleaned, searchValue)
        const list = Array.isArray(result) ? result : (result?.data ?? [])
        const sortedList = sortByDescriptor(list, sortDescriptor)
        buildAndDownloadExcel(columns, sortedList, exportAsExcel.filename ?? 'export')
      } finally {
        setExportExcelLoading(false)
      }
    }
  }, [exportAsExcel, filterState, searchValue, sortDescriptor, total, columns])

  const exportExcelProps = useMemo(
    () => ({
      display: !!exportAsExcel?.display,
      loading: exportExcelLoading || !!exportAsExcel?.loading,
      onClick: handleExportExcel,
    }),
    [exportAsExcel?.display, exportAsExcel?.loading, exportExcelLoading, handleExportExcel]
  )

  const filtersContent = useMemo(() => {
    const visibleFilters = filters?.filter((f) => !f.hide) ?? []
    const showSearch = !hideSearch
    if (!showSearch && visibleFilters.length === 0) return null
    return (
      <div className="flex flex-wrap items-center gap-3">
        {showSearch && (
          <div className="flex flex-col gap-2 flex-1 min-w-[220px]">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 flex items-center">
                {!searchValue && (
                  <Search className="absolute rtl:left-3 ltr:right-3 w-4 h-4 text-gray-400 pointer-events-none" />
                )}
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t('table.searchPlaceholder')}
                  className={cn(
                    'w-full bg-white border border-gray-300 rounded-md py-2 text-sm text-gray-700',
                    'rtl:pl-10 rtl:pr-3 ltr:pr-10 ltr:pl-3',
                    searchValue && 'rtl:pr-8 ltr:pl-8',
                    'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent'
                  )}
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={handleSearchClear}
                    className="absolute rtl:left-2 ltr:right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 text-gray-500"
                    aria-label={t('table.clearSearchAria')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={handleSearchTrigger}
                className="whitespace-nowrap px-3 py-2 bg-brand-primary text-white rounded-md text-sm font-medium hover:bg-brand-primary-hover transition-colors"
              >
                {t('table.searchSubmit')}
              </button>
            </div>
          </div>
        )}
        {visibleFilters.map((filter, index) => {
          const placeholderLabel =
            filter.placeholder ??
            filter.allLabel ??
            `${t('table.filterSelectPrefix')} ${filter.label ?? ''}`.trim()
          const filterOptions = [
            ...(!filter.defaultToFirstOption ? [{ label: placeholderLabel, value: '-1' }] : []),
            ...(filter.options || []),
          ]
          const currentValue = filterState[filter.key] ?? '-1'
          return (
            <div key={filter.key ?? index} className="flex flex-col gap-2 flex-1 min-w-[160px] max-w-[250px]">
              {filter.label && (
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">{filter.label}</label>
              )}
              <div className="relative flex-1">
                <select
                  value={currentValue}
                  disabled={filter.loading}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="appearance-none w-full bg-white border border-gray-300 rounded-md px-3 py-2 rtl:pl-8 ltr:pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 text-gray-700"
                >
                  {filterOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute rtl:left-2 ltr:right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          )
        })}
      </div>
    )
  }, [
    filters,
    filterState,
    handleFilterChange,
    hideSearch,
    searchValue,
    handleSearchChange,
    handleSearchClear,
    handleSearchTrigger,
    t,
  ])

  return {
    sortedItems,
    bottomContent,
    renderCell,
    selectedKeys,
    setSelectedKeys,
    sortDescriptor,
    setSortDescriptor: handleSort,
    page,
    rowsPerPage,
    filtersContent,
    filterState,
    setFilterState,
    getCleanedFilters: () => getCleanedFilters(filterState),
    searchValue,
    setSearchValue,
    exportExcelProps,
  }
}
