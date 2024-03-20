import { FiSearch } from 'react-icons/fi';
import style from './Form.module.css';
import { useState } from 'react';

export const Form = ({ onSubmit }) => {
  const [query, setQuery] = useState('');
  const handleChange = event => {
    setQuery(event.target.value);
    /*// сетери асинхронні, тому якщо тут у консолі викликати значення query, то ми не побачимо букву 'к',яку щойно ввели.
    Ми побачимо попереднє значення стану. Бо консольлог це синхронний процес і він виведеться одразу, а сеттер ще не встигне 
    змінити значення квері. Коли введемо ще одну букву, то в консолі вже побачимо попередньо введену 'к', бо асинхронний код вже відпрацював.*/
  };
  const handleSubmit = event => {
    event.preventDefault();
    if (!query.trim()) {
      return alert('can`t be empty!');
    }
    onSubmit(query);
    setQuery('');
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <button className={style.button} type="submit">
        <FiSearch size="16px" />
      </button>

      <input
        className={style.input}
        placeholder="What do you want to write?"
        name="search"
        required
        autoFocus
        onChange={handleChange}
        value={query}
      />
    </form>
  );
};
