import IconButton from '@/components/IconButton';
import { SearchIcon } from '@/components/Icons';
import { useForm } from 'react-hook-form';

interface SearchProps {
  onSearch: (keyword: string) => void;
}

interface FormInput {
  keyword: string;
}

function Search({ onSearch }: SearchProps) {
  const { register, handleSubmit } = useForm<FormInput>();

  const hanldeSearchSubmit = ({ keyword }: FormInput) => {
    onSearch(keyword);
  };

  return (
    <div className="flex flex-row justify-between items-center w-80 h-10">
      <form
        onSubmit={handleSubmit(hanldeSearchSubmit)}
        className="flex flex-row h-full w-full border border-1 border-border-bold rounded-circle pl-5 pr-2"
      >
        <input
          {...register('keyword')}
          className="flex-1 bg-transparent focus-visible:outline-none"
          placeholder="검색할 방송 제목을 입력해주세요"
        />
        <IconButton>
          <SearchIcon />
        </IconButton>
      </form>
    </div>
  );
}

export default Search;
