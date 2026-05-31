import { cn } from '@/lib/utils/cn';

// ADMIN-007 (TASK_ADMIN) — reusable data table

export type ColumnDef<T> = {
  key: string;
  header: string;
  /** Return a ReactNode to render for this cell */
  render: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  /** Hide on small screens */
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
};

type AdminDataTableProps<T> = {
  columns: readonly ColumnDef<T>[];
  rows: readonly T[];
  /** Key extractor — must be unique per row */
  getRowKey: (row: T) => string;
  emptyMessage?: string;
  className?: string;
};

export function AdminDataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage = 'ไม่มีข้อมูล',
  className,
}: AdminDataTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-forest-800/8 bg-sand-100/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-2.5 text-left font-medium text-muted',
                  col.hideOnMobile && 'hidden sm:table-cell',
                  col.hideOnTablet && 'hidden md:table-cell',
                  col.headerClassName,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-forest-800/6">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-xs text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={getRowKey(row)} className="hover:bg-sand-100/30 transition-colors">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3',
                      col.hideOnMobile && 'hidden sm:table-cell',
                      col.hideOnTablet && 'hidden md:table-cell',
                      col.className,
                    )}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
