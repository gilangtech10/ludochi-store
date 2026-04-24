import clsx from 'clsx';
import { FC, ReactNode, useEffect } from 'react';
import { Link } from 'react-router';
import { usePagination } from './react-use-pagination';

export interface PaginationConfig {
  prefix?: string;
  count: number;
  offset: number;
  limit: number;
}

interface PaginationButtonProps {
  href: string;
}
export interface PaginationProps {
  getNextProps: ({ currentPage }: { currentPage: number }) => PaginationButtonProps;
  getPaginationItemProps: ({ page }: { page: number }) => PaginationButtonProps;
  getPreviousProps: ({ currentPage }: { currentPage: number }) => PaginationButtonProps;
  paginationConfig: PaginationConfig;
}

export type RenderPaginationItem = FC<{ page: number; className?: string } & React.HTMLProps<HTMLAnchorElement>>;

export type RenderPreviousPaginationButton = FC<
  {
    currentPage: number;
    isDisabled: boolean;
    className?: string;
  } & React.HTMLProps<HTMLAnchorElement>
>;

export type RenderNextPaginationButton = FC<
  {
    page: number;
    isDisabled: boolean;
    className?: string;
  } & React.HTMLProps<HTMLAnchorElement>
>;

export interface PaginationItemProps extends PaginationButtonProps {
  className?: string;
  currentPage: number;
  page: number;
}

const PaginationItem: FC<PaginationItemProps> = ({ className, currentPage, page, ...props }) => {
  const isCurrent = page === currentPage;

  return (
    <Link
      viewTransition
      className={clsx(
        className,
        'relative inline-flex items-center justify-center w-9 h-9 text-sm rounded-lg border transition-colors duration-200',
        isCurrent
          ? 'border-[#6B3A1F]'
          : 'border-[#E2CCB0] hover:border-[#C47C3A]',
      )}
      style={{
        fontFamily: 'var(--font-label)',
        fontSize: '0.7rem',
        letterSpacing: '0.05em',
        backgroundColor: isCurrent ? '#6B3A1F' : '#FFFFFF',
        color: isCurrent ? '#FFFAF4' : '#9C8070',
      }}
      aria-current={isCurrent ? 'page' : 'false'}
      to={props.href}
      prefetch="viewport"
    >
      {page}
    </Link>
  );
};

export interface PaginationArrowButtonProps extends PaginationButtonProps {
  currentPage: number;
  className?: string;
  isDisabled: boolean;
  children: ReactNode;
}

const PaginationButton: FC<PaginationArrowButtonProps> = ({
  currentPage: _currentPage,
  className: _className,
  isDisabled,
  href,
  children,
}) => {
  const className = clsx(
    _className,
    'relative inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors duration-200',
    isDisabled
      ? 'opacity-40 pointer-events-none cursor-not-allowed border-[#E2CCB0]'
      : 'border-[#E2CCB0] hover:border-[#C47C3A]',
  );

  const style = { backgroundColor: '#FFFFFF', color: '#9C8070' };

  if (isDisabled)
    return (
      <button aria-disabled={isDisabled} disabled className={className} style={style}>
        {children}
      </button>
    );

  return (
    <Link
      viewTransition
      aria-disabled={isDisabled}
      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
        if (isDisabled) event.preventDefault();
      }}
      className={className}
      style={style}
      to={href}
      prefetch="viewport"
    >
      {children}
    </Link>
  );
};

export const Pagination: FC<PaginationProps> = ({
  paginationConfig,
  getNextProps,
  getPaginationItemProps,
  getPreviousProps,
}) => {
  const { totalPages, startIndex, endIndex, setPage } = usePagination({
    totalItems: paginationConfig.count,
    initialPageSize: paginationConfig.limit,
  });

  const currentPage = Math.floor(paginationConfig.offset / paginationConfig.limit) + 1;

  useEffect(() => {
    setPage(currentPage - 1);
  }, [currentPage, setPage]);

  if (paginationConfig.count <= paginationConfig.limit) return null;

  const startPage = totalPages <= 5 ? 1 : Math.max(1, currentPage - 1);
  const endPage = totalPages <= 5 ? totalPages : Math.min(totalPages, currentPage + 1);

  const hasNextPage = currentPage < totalPages;

  return (
    <div className="mt-8 pt-6 border-t" style={{ borderColor: '#F0E6D6' }}>
      {/* ── Mobile: Load More ── */}
      <div className="md:hidden">
        {hasNextPage ? (
          <Link
            viewTransition
            to={getNextProps({ currentPage }).href}
            prefetch="viewport"
            className="flex items-center justify-center w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.98] active:shadow-inner"
            style={{
              backgroundColor: '#6B3A1F',
              color: '#FFFAF4',
              fontFamily: 'var(--font-label)',
              boxShadow: '0 4px 14px rgba(107,58,31,0.25)',
            }}
          >
            Muat Lebih Banyak
          </Link>
        ) : (
          <p
            className="text-center text-xs py-2"
            style={{ color: '#9C8070', fontFamily: 'var(--font-body)' }}
          >
            Sudah menampilkan semua produk
          </p>
        )}
      </div>

      {/* ── Desktop: Full Pagination ── */}
      <div className="hidden md:flex flex-row items-center justify-between gap-4">
        {/* Count */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: '#9C8070',
          }}
        >
          Menampilkan{' '}
          <span style={{ color: '#6B3A1F', fontWeight: 600 }}>{startIndex + 1}</span>
          {' '}–{' '}
          <span style={{ color: '#6B3A1F', fontWeight: 600 }}>{endIndex + 1}</span>
          {' '}dari{' '}
          <span style={{ color: '#3D2B1F', fontWeight: 600 }}>{paginationConfig.count}</span>
          {' '}produk
        </p>

        {/* Navigation */}
        <nav className="inline-flex items-center gap-1.5" aria-label="Navigasi halaman">
          {/* Previous */}
          <PaginationButton
            currentPage={currentPage}
            isDisabled={currentPage === 1}
            {...getPreviousProps({ currentPage })}
          >
            <span className="sr-only">Sebelumnya</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </PaginationButton>

          {startPage > 2 && (
            <>
              <PaginationItem page={1} currentPage={currentPage} {...getPaginationItemProps({ page: 1 })} />
              <span className="text-sm" style={{ color: '#C4A882' }}>…</span>
            </>
          )}

          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
            <PaginationItem key={page} page={page} currentPage={currentPage} {...getPaginationItemProps({ page })} />
          ))}

          {endPage < totalPages - 1 && (
            <>
              <span className="text-sm" style={{ color: '#C4A882' }}>…</span>
              <PaginationItem
                page={totalPages}
                currentPage={currentPage}
                {...getPaginationItemProps({ page: totalPages })}
              />
            </>
          )}

          {/* Next */}
          <PaginationButton
            currentPage={currentPage}
            isDisabled={currentPage === totalPages}
            {...getNextProps({ currentPage })}
          >
            <span className="sr-only">Selanjutnya</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </PaginationButton>
        </nav>
      </div>
    </div>
  );
};
