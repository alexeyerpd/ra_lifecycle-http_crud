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
                Notes <button onClick={updateNotes}>Update</button>
            </h1>
            <ul>
                {notes.map((n) => (
                    <div key={n.id}>
                        {n.content}
                        <button type="button" onClick={() => handleDelete(n.id)}>
                            delete
                        </button>
                    </div>
                ))}
            </ul>
            <form ref={formRef} onSubmit={onNoteAdd}>
                <textarea name="note" id="note" cols={30} rows={10}></textarea>
                <button type="submit">Add</button>
            </form>
        </div>
    );
}
