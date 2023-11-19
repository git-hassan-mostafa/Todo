import React, { useState, useRef } from 'react';
import s from './TodoCardAdd.module.css';
import { fetchData, validateDateFormat } from '@/app/Utils/utils';
import { host } from '@/app/Utils/constants';
import { Todo, useUser } from '../context';

export default function TodoCard() {

    const {importances , setTodos} = useUser()

  const titleRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const estimateRef = useRef<HTMLInputElement>(null);
  const importanceRef = useRef<HTMLSelectElement>(null);

  const [dateError, setDateError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [isLoading , setIsLoading] = useState(false)

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!titleRef.current?.value ) {
      setTitleError("title is required")
      return
    } 

    // Check date format before making the API call
    if (!validateDateFormat(dateRef.current?.value)) {
      setDateError('Invalid date format.');
      return;
    } else {
      setDateError(null);
    }


    setIsLoading(true)

    const newTodo:Todo =  {
      title: titleRef.current?.value as string,
      category: categoryRef.current?.value as string,
      dueDate: dateRef.current?.value as string,
      estimate: estimateRef.current?.value as string,
      importanceID: parseInt(importanceRef.current?.value as string) ,
      statusID:1,
      userID:1
    }

    const res = await fetchData<any>(`${host}/Todo`,newTodo, 'POST');
    setIsLoading(false)

    newTodo.id 
    if (res) {
      setTodos(prev=>[newTodo , ...prev as Todo[]] as Todo[])
    };
  };


  return (
    <form onSubmit={handleFormSubmit} className={s.todo}>
       <input placeholder='Title' ref={titleRef} className={s.title} />
       {titleError && <div className={s.error}>{titleError}</div>}
      <table className={s.table}>
        <tbody className={s.tbody}>
          <tr className={s.tr}>
            <td className={s.td}><span className={s.key}> Category </span></td>
            <td className={s.td}><input ref={categoryRef} className={s['field-input']} /></td>
          </tr>
          <tr className={s.tr}>
            <td className={s.td}><span className={s.key}> Due Date </span></td>
            <td className={s.td}>
              <input
                ref={dateRef}
                className={`${s['field-input']} ${dateError ? s['input-error'] : ''}`}
                onBlur={() => setDateError(null)}
              />
              {dateError && <div className={s.error}>{dateError}</div>}
            </td>
          </tr>
          <tr className={s.tr}>
            <td className={s.td}><span className={s.key}> Estimate </span></td>
            <td className={s.td}><input ref={estimateRef} className={s['field-input']} /></td>
          </tr>
          <tr className={s.tr}>
            <td className={s.td}><span className={s.key}> Importance </span></td>
            <td className={s.td}>
              <select
                ref={importanceRef}
                className={s['importances-select']}
                name="importances">
                {importances?.map(i => (
                  <option key={i.id} className={`${s[`importance-${i.name}`]} ${s['importance']}`} value={i.id}> {i.name} </option>
                ))}
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <button disabled={isLoading} className={s.submit} type='submit'> { isLoading ? 'Loading...' :'Submit'} </button>
    </form>
  );
}
