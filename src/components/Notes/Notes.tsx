import * as React from 'react';
import {cn} from 'utils/classname';

import './Notes.scss';

const block = cn('notes');

interface Note {
    id: number;
    content: string;
}

export function Notes() {
    const [notes, setNotes] = React.useState<Note[]>([]);

    const formRef = React.useRef<HTMLFormElement>(null);

    const updateNotes = () => {
        fetch('http://localhost:7070/notes')
            .then((res) => res.json())
            .then(setNotes);
    };

    const onNoteAdd = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fd = new FormData(e.target);
        const content = [...fd.values()][0];
        if (!content) {
            return;
        }
        fetch('http://localhost:7070/notes', {
            method: 'POST',
            body: JSON.stringify({
                id: 0,
                content,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(() => {
            updateNotes();
        });

        formRef.current?.reset();
    };

    const handleDelete = (id: number) => {
        fetch(`http://localhost:7070/notes/${id}`, {method: 'DELETE'}).then(updateNotes);
    };

    React.useEffect(() => {
        updateNotes();
    }, []);

    return (
        <div className={block()}>
            <h1>
                Notes{' '}
                <button className={block('btn-update')} onClick={updateNotes}>
                    Upd
                </button>
            </h1>
            <ul className={block('note-list')}>
                {notes.map((n) => (
                    <li key={n.id} className={block('note')}>
                        {n.content}
                        <button
                            className={block('btn-delete')}
                            type="button"
                            onClick={() => handleDelete(n.id)}
                        >
                            X
                        </button>
                    </li>
                ))}
            </ul>
            <form ref={formRef} className={block('form')} onSubmit={onNoteAdd}>
                <label className={block('form-label')}>
                    <span className={block('form-title')}>New Note</span>
                    <textarea
                        className={block('form-control')}
                        name="note"
                        id="note"
                        cols={30}
                        rows={10}
                    ></textarea>
                    <button className={block('form-btn-submit')} type="submit">
                        Add
                    </button>
                </label>
            </form>
        </div>
    );
}
