import { getPhotos } from 'apiService/photos';
import { Button, Form, Loader, PhotosGallery, Text } from 'components';
import ModalImage from 'components/ModalImage/ModalImage';
import { useEffect, useState } from 'react';

export const Photos = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  // стани isLoading та erro є обов'язковими!!! треба щоб користувач бачив, що йде завантаження а не пусту сторінку і якщо щось нетак - бачив помилку
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  /*створили стан empty,щоб коли не було результату для користувача (н-д при введенні 'ловріпвл') ми могли показати 
  відповідно повідомлення користувачу (в нас це компонент <Empty/>).*/
  const [empty, setEmpty] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalUrl, setModalUrl] = useState('');
  const [modalAlt, setModalAlt] = useState('');

  // у нас запит відбувається у двох випадках:коли змінилась query запиту або page запиту, тому масив залежностей відповідний
  useEffect(() => {
    /* useEffect з масивом залежностей спрацьовує при монтуванні компонента і при зміні будь-якого значення масиву. 
    При першому монтуванні у нас query ще немає, воно = '', якщо не зробити перевірку, то при першому монтуванні 
    піде запит по пустому рядку.*/
    if (!query) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { photos, total_results, per_page } = await getPhotos(
          query,
          page,
        );
        if (photos.length === 0) {
          setEmpty(true);
          return;
        }
        /* задаємо setImages так, щоб при кліку на кнопку LoadMore в нас зберігалась поточна галерея і до неї додавався наступний стек результатів запиту. 
        Н-д написали cat,отримали 10 картинок котиків, далі натиснули ЛоадМор, і до попереднії 10ти котиків додались ще нових 10.*/
        setImages(prevState => [...prevState, ...photos]);
        setIsVisible(page < Math.ceil(total_results / per_page));
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [query, page]);

  const handleSubmit = value => {
    /*перевірка, що якщо попередній квері такий самий як зараз, тобто ти два рази хочеш ввести cat, то щоб не виконувався повторний запит */
    if (value === query) {
      return;
    }
    setQuery(value);
    /* коли ми отримуємо нове квері (це відбувається після сабміту форми), то нам треба очистити попередні результати запиту, 
    щоб нам показувався новий результат, а не попередні картинки + нові. Так само,якщо ми наклацали котиків на 10 сторінок і ввели нову квері,
    то треба щоб все починалось з першої сторінки, тому скидаємо page до 1. І скидаємо решту логіки:якщо в попер запиті було пусто,то 
    при зміні квері треба скинути цю емпті. Так само якщо була помилка. І щоб не було видно кнопку LoadMore при новому квері і сабміті. */
    setImages([]);
    setPage(1);
    setEmpty(false);
    setError(false);
    setIsVisible(false);
  };

  const loadMore = () => {
    setPage(prevState => prevState + 1);
  };
  // обробник кліку по картинці (при кліку змінюємо значення станів і ці стани ми передаємо далі пропсами в саме модальне вікно)
  const handleOpen = (url, alt) => {
    setShowModal(true);
    setModalUrl(url);
    setModalAlt(alt);
  };
  const handleClose = () => {
    setShowModal(false);
    setModalUrl('');
    setModalAlt('');
  };

  return (
    <>
      <Form onSubmit={handleSubmit} />
      {images.length > 0 && (
        <PhotosGallery images={images} modalOpen={handleOpen} />
      )}
      {isVisible && (
        <Button onClick={loadMore} disabled={isLoading}>
          {isLoading ? 'Loading' : 'Load More'}
        </Button>
      )}
      {/* умова для того, щоб на початковому екрані відображався надпис. В нас
      спочатку images===[], empty===false */}
      {!images.length && !empty && (
        <Text textAlign="center">Let`s begin search 🔎</Text>
      )}
      {isLoading && <Loader />}
      {error && (
        <Text textAlign="center">❌ Something went wrong - {error}</Text>
      )}
      {empty && (
        <Text textAlign="center">Sorry. There are no images ... 😭</Text>
      )}
      <ModalImage
        modalIsOpen={showModal}
        closeModal={handleClose}
        src={modalUrl}
        alt={modalAlt}
      />
    </>
  );
};
