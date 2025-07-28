import { type Book } from "../types/Book"

type BookRowProps = {
    book: Book;
}

export default function BookRow({
    book
}: BookRowProps) {
    return (
        <tr>
            <td>{book.title}</td>
            <td>{book.authors.join("; ")}</td>
            <td>{book.genres.join("; ")}</td>
            <td>{book.reading_level.toFixed(1)}</td>
            <td>{book.testable ? "Yes" : "No"}</td>
            <td>{book.test_points ?? "N/A"}</td>
            <td>{book.quiz_id ?? "N/A"}</td>
        </tr>
    );
}