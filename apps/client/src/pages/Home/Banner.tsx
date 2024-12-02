import { CloseIcon } from '@/components/Icons';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/contexts/AuthContext';
import { useToast } from '@hooks/useToast';
import axiosInstance from '@/services/axios';
import { useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';

interface BookmarkData {
  bookmarkId: number;
  name: string;
  url: string;
}

function Banner() {
  const { isLoggedIn } = useContext(AuthContext);
  const [bookmarkList, setBookmarkList] = useState<BookmarkData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookmarkData>();
  const { toast } = useToast();

  const handleClickBookmarkButton = (url: string) => {
    window.open(url);
  };

  const handleAddBookmark = (newBookmark: BookmarkData) => {
    axiosInstance
      .post('/v1/bookmarks', newBookmark)
      .then(response => {
        if (response.data.success) {
          const addedBookmark = { ...newBookmark, bookmarkId: response.data.data.bookmarkId };
          const newBookmarkList = [...bookmarkList, addedBookmark];
          setBookmarkList(newBookmarkList);
        } else {
          toast({ variant: 'destructive', title: '북마크 생성 실패', description: response.data.message });
          console.error(`북마크 생성 실패: ${response.data.status}`);
        }
      })
      .finally(() => {
        reset();
        setShowModal(false);
      });
  };

  const handleDeleteBookmark = (e: React.MouseEvent, bookmarkId: number) => {
    e.stopPropagation();

    axiosInstance.delete(`/v1/bookmarks/${bookmarkId}`).then(response => {
      if (response.data.success) {
        const newBookmarkList = bookmarkList.filter((data, _) => data.bookmarkId !== bookmarkId);
        setBookmarkList(newBookmarkList);
      } else {
        toast({ variant: 'destructive', title: '북마크 삭제 실패', description: response.data.message });
        console.error(`북마크 삭제 실패: ${response.data.status}`);
      }
    });
  };

  useEffect(() => {
    axiosInstance.get('/v1/bookmarks').then(response => {
      if (response.data.success) {
        setBookmarkList(response.data.data.bookmarks);
      } else {
        toast({ variant: 'destructive', title: '북마크 조회 실패', description: response.data.message });
        console.error(`북마크 조회 실패: ${response.data.status}`);
      }
    });
  }, []);

  return (
    <div className="flex w-full h-96 bg-gradient-to-r from-surface-alt to-transparent">
      <div className="flex flex-row justify-between w-full h-96 p-5">
        <div className="font-bold text-4xl text-text-strong flex flex-row items-center ml-16 gap-12">
          <img src="/images/camon_character_200.png" alt="CamOn 배너 캐릭터" />
          <div>
            <p>출석부 관리부터, 소통까지!</p>
            <p>
              부담 없이 함께하는 <span className="text-text-point">네부캠 전용</span> 온라인 캠퍼스
            </p>
          </div>
        </div>
        {isLoggedIn && (
          <div className="flex flex-col h-full gap-3 p-3">
            {bookmarkList &&
              bookmarkList.map(data => (
                <Button
                  key={data.bookmarkId}
                  onClick={() => handleClickBookmarkButton(data.url)}
                  className="h-14 w-52 bg-surface-alt hover:bg-surface-alt-light relative flex items-center justify-between"
                >
                  <span className="truncate flex-1">{data.name}</span>
                  <div
                    onClick={e => handleDeleteBookmark(e, data.bookmarkId)}
                    className="flex items-center p-1 hover:text-text-strong hover:cursor-pointer"
                  >
                    <CloseIcon size={36} />
                  </div>
                </Button>
              ))}

            {bookmarkList.length < 5 && (
              <Button
                onClick={() => setShowModal(true)}
                className="h-14 w-52 bg-surface-alt hover:bg-surface-alt-light"
              >
                +
              </Button>
            )}
          </div>
        )}
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
                      {...register('name', {
                        required: '북마크 이름을 입력해주세요',
                      })}
                      className="w-full h-10 bg-transparent border border-default rounded-md focus:border-bold px-3"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label>URL</label>
                    <input
                      {...register('url', {
                        required: '저장할 사이트 URL을 입력해주세요',
                      })}
                      className="w-full h-10 bg-transparent border border-default rounded-md focus:border-bold px-3"
                    />
                  </div>
                  {(errors.name || errors.url) && (
                    <p className="absolute top-11 text-text-danger font-medium text-display-medium12">
                      {errors.name ? errors.name.message : errors.url?.message}
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
