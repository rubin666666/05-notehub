import ReactPaginateImport from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (selectedPage: number) => void;
}

function unwrapModule<T>(module: T): T {
  let current = module;

  while (
    current &&
    typeof current === 'object' &&
    'default' in (current as Record<string, unknown>)
  ) {
    current = (current as unknown as { default: T }).default;
  }

  return current;
}

const ReactPaginate = unwrapModule(ReactPaginateImport);

export default function Pagination({
  currentPage,
  pageCount,
  onPageChange,
}: PaginationProps) {
  if (typeof ReactPaginate !== 'function') {
    return (
      <ul className={css.pagination}>
        {Array.from({ length: pageCount }, (_, index) => {
          const pageNumber = index + 1;

          return (
            <li
              key={pageNumber}
              className={pageNumber === currentPage ? css.active : undefined}
            >
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  onPageChange(pageNumber);
                }}
              >
                {pageNumber}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      previousLabel="<"
      pageRangeDisplayed={2}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={({ selected }: { selected: number }) =>
        onPageChange(selected + 1)
      }
      containerClassName={css.pagination}
      pageClassName={css.page}
      previousClassName={css.page}
      nextClassName={css.page}
      breakClassName={css.page}
      activeClassName={css.active}
    />
  );
}
