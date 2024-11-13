'use client';

import { Input } from '@nextui-org/input';
import debounce from 'lodash.debounce';
import { useCallback } from 'react';
import { SearchIcon } from './icons';

interface Props {
  onSearch: (query: string) => void;
}

const Search = ({ onSearch }: Props) => {
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 500), // 500ms debounce time
    [onSearch]
  );

  return (
    <Input
      isClearable
      radius='lg'
      startContent={
        <SearchIcon className='text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0' />
      }
      onValueChange={debouncedSearch}
      placeholder='Type to search...'
    />
  );
};

export default Search;
