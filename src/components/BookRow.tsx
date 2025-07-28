import { type Book } from "../types/Book"

type BookRowProps = {
    book: Book;
}

export default function BookRow({
    book
}: BookRowProps) {
    return (<>
        <tr><td className="h-5"></td></tr>
        
        <tr>
            <td className="flex items-center">
                {book.testable
                    ? <img src="/images/checked.png" className="w-4 h-4" />
                    : <img src="/images/cancel.png" className="w-4 h-4" />
                }&nbsp;AR
            </td>

            <td>{book.genres.join("; ")}</td>

            <td>RL:&nbsp;{Number.isNaN(book.reading_level) ? "N/A" : book.reading_level}</td>

            <td>
                Pts:&nbsp;{
                    book.test_points == null || Number.isNaN(book.test_points)
                    ? "N/A" : book.test_points
                }
            </td>

            <td>
                AR Quiz:&nbsp;{
                    book.quiz_id == null || Number.isNaN(book.quiz_id)
                    ? "N/A" : book.quiz_id
                }
            </td>
        </tr>

        <tr>
            <td className="font-bold" colSpan={5}>{book.title}</td>
        </tr>

        <tr>
            <td className="font-bold" colSpan={5}>By:&nbsp;{book.authors.join("; ")}</td>
        </tr>

        <tr><td className="h-5"></td></tr>
    </>);
}