import { CloseIcon } from '@/components/Icons';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';

interface BookmarkData {
  id: number;
  tag: string;
  link: string;
}

function Banner() {
  const [bookmarkList, setBookmarkList] = useState<BookmarkData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookmarkData>();

  const handleClickBookmarkButton = (url: string) => {
    window.open(url);
  };

  const handleAddBookmark = (newBookmark: BookmarkData) => {
    // TODO: Axios GET or POST 요청으로 변경
    const newList = [...bookmarkList, newBookmark];
    setBookmarkList(newList);
    localStorage.setItem('bookmark', JSON.stringify(newList));
    reset();
    setShowModal(false);
  };

  const handleDeleteBookmark = (e: React.MouseEvent, index: number) => {
    // TODO: Axios DELETE 요청으로 변경
    e.stopPropagation();
    if (confirm('북마크를 삭제하시겠습니까?')) {
      const newList = bookmarkList.filter((_, idx) => idx !== index);
      setBookmarkList(newList);
      localStorage.setItem('bookmark', JSON.stringify(newList));
    }
  };

  useEffect(() => {
    // TODO: Axios GET 요청으로 변경
    const stored = localStorage.getItem('bookmark');
    if (stored) {
      setBookmarkList(JSON.parse(stored) as BookmarkData[]);
    }
  }, []);

  return (
    <div className="flex w-full h-96 bg-gradient-to-r from-surface-alt to-transparent">
      <div className="flex flex-row justify-between w-full h-96 p-5">
        <div className="font-bold text-4xl text-text-strong flex flex-row items-center">
          <img src="/images/camon_character_200.png" alt="CamOn 배너 캐릭터" />
          <div>
            <p>출석부 관리부터, 소통까지!</p>
            <p>
              부담 없이 함께하는 <span className="text-text-point">네부캠 전용</span> 온라인 캠퍼스
            </p>
          </div>
        </div>
        <div className="flex flex-col h-full gap-3 p-3">
          {bookmarkList &&
            bookmarkList.map((data, idx) => (
              <Button
                key={data.id}
                onClick={() => handleClickBookmarkButton(data.link)}
                className="h-14 w-52 bg-surface-alt hover:bg-surface-alt-light relative flex items-center justify-between"
              >
                <span className="truncate flex-1">{data.tag}</span>
                <button
                  onClick={e => handleDeleteBookmark(e, idx)}
                  className="flex items-center p-1 hover:text-text-strong"
                >
                  <CloseIcon size={36} />
                </button>
              </Button>
            ))}

          {bookmarkList.length < 5 && (
            <Button onClick={() => setShowModal(true)} className="h-14 w-52 bg-surface-alt hover:bg-surface-alt-light">
              +
            </Button>
          )}
        </div>
      </div>
      {showModal &&
        createPortal(
          <Modal setShowModal={setShowModal} modalClassName="h-fit w-1/3">
            <div className="flex w-full h-full p-4">
              <form onSubmit={handleSubmit(handleAddBookmark)} className="flex flex-col gap-2 w-full">
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex flex-col w-full">
                    <label>사이트명</label>
                    <input
                      {...register('tag', {
                        required: '북마크 이름을 입력해주세요',
                      })}
                      className="w-full h-10 bg-transparent border border-default rounded-md focus:border-bold px-3"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label>URL</label>
                    <input
                      {...register('link', {
                        required: '저장할 사이트 URL을 입력해주세요',
                      })}
                      className="w-full h-10 bg-transparent border border-default rounded-md focus:border-bold px-3"
                    />
                  </div>
                  {(errors.tag || errors.link) && (
                    <p className="absolute top-11 text-text-danger font-medium text-display-medium12">
                      {errors.tag ? errors.tag.message : errors.link?.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="h-10 shrink-0">
                    저장
                  </Button>
                </div>
              </form>
            </div>
          </Modal>,
          document.body,
        )}
    </div>
  );
}

export default Banner;
