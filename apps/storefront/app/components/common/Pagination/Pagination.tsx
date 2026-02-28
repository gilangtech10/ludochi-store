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
        'relative inline-flex items-center justify-center w-10 h-10 text-sm border transition-colors duration-200',
        isCurrent
          ? 'border-[#C9A962] text-[#1C1714] font-medium'
          : 'border-[#4A3F35] text-[#9C8B7A] hover:border-[#C9A962]/50 hover:text-[#E8DFD4]',
      )}
      style={{
        fontFamily: 'var(--font-label)',
        fontSize: '0.65rem',
        letterSpacing: '0.1em',
        backgroundColor: isCurrent ? '#C9A962' : '#251E19',
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
    'relative inline-flex items-center justify-center w-10 h-10 border transition-colors duration-200',
    isDisabled
      ? 'opacity-40 pointer-events-none cursor-not-allowed border-[#4A3F35] text-[#9C8B7A]'
      : 'border-[#4A3F35] text-[#9C8B7A] hover:border-[#C9A962]/50 hover:text-[#C9A962]',
  );

  const style = { backgroundColor: '#251E19' };

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

  return (
    <div className="mt-20 pt-10 border-t border-[#4A3F35]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

        {/* Entry count */}
        <p
          style={{
            fontFamily: 'var(--font-label)',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#9C8B7A',
          }}
        >
          Entries{' '}
          <span style={{ color: '#C9A962' }}>{startIndex + 1}</span>
          {' '}–{' '}
          <span style={{ color: '#C9A962' }}>{endIndex + 1}</span>
          {' '}of{' '}
          <span style={{ color: '#E8DFD4' }}>{paginationConfig.count}</span>
        </p>

        {/* Navigation */}
        <nav
          className="inline-flex items-center gap-1"
          aria-label="Catalogue pagination"
        >
          {/* Previous */}
          <PaginationButton
            currentPage={currentPage}
            isDisabled={currentPage === 1}
            {...getPreviousProps({ currentPage })}
          >
            <span className="sr-only">Previous</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </PaginationButton>

          {startPage > 2 && (
            <>
              <PaginationItem page={1} currentPage={currentPage} {...getPaginationItemProps({ page: 1 })} />
              <span
                className="inline-flex items-center justify-center w-8 text-sm"
                style={{ color: '#4A3F35', fontFamily: 'var(--font-body)' }}
              >
                …
              </span>
            </>
          )}

          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
            <PaginationItem key={page} page={page} currentPage={currentPage} {...getPaginationItemProps({ page })} />
          ))}

          {endPage < totalPages - 1 && (
            <>
              <span
                className="inline-flex items-center justify-center w-8 text-sm"
                style={{ color: '#4A3F35', fontFamily: 'var(--font-body)' }}
              >
                …
              </span>
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
            <span className="sr-only">Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </PaginationButton>
        </nav>
      </div>
    </div>
  );
};
