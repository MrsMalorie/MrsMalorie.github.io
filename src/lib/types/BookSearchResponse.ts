import Book from "./Book";

export default interface BookSearchResponse {
    books: Book[];
    pageCount: number;
}