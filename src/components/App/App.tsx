import { useEffect, useState, type ChangeEvent } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import NoteForm from '../NoteForm/NoteForm';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import css from './App.module.css';
import { fetchNotes } from '../../services/noteService';

const NOTES_PER_PAGE = 12;

export default function App() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
  }, 500);

  useEffect(() => {
    return () => {
      updateSearchQuery.cancel();
    };
  }, [updateSearchQuery]);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['notes', page, searchQuery],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: NOTES_PER_PAGE,
        search: searchQuery,
      }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;

    setSearchInput(nextValue);
    setPage(1);
    updateSearchQuery(nextValue.trim());
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            pageCount={totalPages}
            onPageChange={setPage}
          />
        )}
        <button
          className={css.button}
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>{(error as Error).message}</p>}
      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}
      {!isLoading && !isError && notes.length === 0 && <p>No notes found.</p>}
      {isFetching && !isLoading && <p>Updating notes...</p>}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSuccess={() => {
              setPage(1);
              setIsModalOpen(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
