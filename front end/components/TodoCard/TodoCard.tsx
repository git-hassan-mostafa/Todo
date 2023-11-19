'use client'
import React, { useEffect, useRef, useState } from 'react'
import s from './TodoCard.module.css'
import { fetchData, validateDateFormat } from '@/app/Utils/utils'
import { host } from '@/app/Utils/constants'
import { Todo, useUser } from '../context'
import Mark from 'mark.js'
import { Stringifier } from 'postcss'

export default function TodoCard({ todo }: { todo: Todo }) {

    const [IsfirstRender, setIsFirstRender] = useState(true)
    const { importances , search } = useUser()

    const importanceName = importances?.find(i => i.id === todo.importanceID)

    const [title, setTitle] = useState<string | null>(todo.title)
    const [debouncedTitleValue, setDebouncedTitleValue] = React.useState<string>("");

    const [category, setCategory] = useState<string | null>(todo.category)
    const [debouncedCategoryValue, setDebouncedCategoryValue] = React.useState<string>("");

    const [date, setDate] = useState<string | null>(todo.dueDate)
    const [debouncedDateValue, setDebouncedDateValue] = React.useState<string>("");

    const [estimate, setEstimate] = useState<string | null>(todo.estimate)
    const [debouncedEstimateValue, setDebouncedEstimateValue] = React.useState<string>("");

    const [showInputTitle, setShowInputTitle] = useState(false)

    const [importance, setImportance] = useState<any>(importanceName?.name)

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategory(e.target.value)
    }
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value)
    }
    const handleEstimateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEstimate(e.target.value)
    }
    const handleImportanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImportance(e.target.value)
    }

    //update the category 5 seconds after the last input change
    useEffect(() => {
        if (IsfirstRender) return
        const timeoutId = setTimeout(() => {
            if(!title) return
            (async function () {
                const data = await fetchData<{ title: string | null }>(`${host}/Todo/${todo.id}`, { title }, 'PUT')
                if (data) console.log('title updated successfully');

            })()
            setDebouncedTitleValue(title);
        }, 3000);
        return () => clearTimeout(timeoutId);
    }, [title, 3000]);


    useEffect(() => {
        if (IsfirstRender) return
        const timeoutId = setTimeout(() => {
            (async function () {
                const data = await fetchData<{ category: string }>(`${host}/Todo/${todo.id}`, { category : category as string }, 'PUT')
                if (data) console.log('category updated successfully');

            })()
            setDebouncedCategoryValue(category as string);
        }, 3000);
        return () => clearTimeout(timeoutId);
    }, [category, 3000]);


    useEffect(() => {
        if (IsfirstRender) return
        if(!validateDateFormat(date as string)) return
        const timeoutId = setTimeout(() => {
            
            (async function () {
                const data = await fetchData<{ dueDate: string}>(`${host}/Todo/${todo.id}`, { dueDate: date as string }, 'PUT')
                if (data) console.log('date updated successfully');

            })()
            setDebouncedDateValue(date as string);
        }, 3000);
        return () => clearTimeout(timeoutId);
    }, [date, 3000]);


    useEffect(() => {
        if (IsfirstRender) {
            setIsFirstRender(false);
            return
        }
        const timeoutId = setTimeout(() => {
            (async function () {
                const data = await fetchData<{ estimate: string }>(`${host}/Todo/${todo.id}`, { estimate : estimate as string }, 'PUT')
                if (data) console.log('estimate updated successfully');
            })()
            setDebouncedEstimateValue(estimate as string);
        }, 3000);
        return () => clearTimeout(timeoutId);
    }, [estimate, 3000]);

    const TitleRef = useRef<HTMLDivElement | null>(null)

    const highlightText = () => {
        const instance = new Mark(TitleRef.current as HTMLElement);
    
        // Custom options for mark.js
        const options = {
          element: 'span',
          className: s['highligted-text'],
          separateWordSearch: false,
        };
    
        instance.mark(search, options);
      };
    
      useEffect(() => {
        highlightText()
        return () => {
          const instance = new Mark(TitleRef.current as HTMLElement);
          instance.unmark();
        };
      }, [search]);

      const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(todo));
      };

    return (
        <div
        draggable
        onDragStart={handleDragStart}
        className={s.todo}>
            <div>
                {
                    !showInputTitle ?
                        <div ref={TitleRef} onMouseOver={() => setShowInputTitle(true)} className={title ? s.title : s['title-empty']}> {title || 'h'} </div> :
                        <input onBlur={() => setShowInputTitle(false)} onChange={handleTitleChange} className={s.titleInput} value={title as string} />
                }
            </div>


            <table>
                <tbody>
                    <tr>
                        <td className={s.td}><span className={s.key}> Category </span></td>
                        <td className={s.td}><input onChange={handleCategoryChange} className={s['field-input']} value={category as string} /></td>
                    </tr>
                    <tr>
                        <td className={s.td}><span className={s.key}> Due Date </span></td>
                        <td className={s.td}><input onChange={handleDateChange} className={s['field-input']} value={date as string} /></td>
                    </tr>
                    <tr>
                        <td className={s.td}><span className={s.key}> Estimate </span></td>
                        <td className={s.td}><input onChange={handleEstimateChange} className={s['field-input']} value={estimate as string} /></td>
                    </tr>
                    <tr>
                        <td className={s.td}><span className={s.key}> Importance </span></td>
                        <td className={s.td}><span className={`${s[`value-${importanceName?.name}`]} ${s.value} ${s['value-importance']}`}>{importanceName?.name} </span></td>
                    </tr>
                </tbody>
            </table>

        </div>
    )
}
