import { useState } from "react";
import BookRow from "./BookRow";
import { type Book } from "../types/Book";

export default function BookTable() {
    const [books, setBooks] = useState<Book[]>([]);

    return (
        <table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author(s)</th>
                    <th>Genre(s)</th>
                    <th>Reading Level</th>
                    <th>AR Test</th>
                    <th>Points</th>
                    <th>Quiz ID</th>
                </tr>
            </thead>
            <tbody>
                {books.map((book, index) => (
                    <BookRow key={`Book-${index}`} book={book} />
                ))}
            </tbody>
        </table>
    );
}