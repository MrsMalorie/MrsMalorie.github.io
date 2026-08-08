import Book from "../types/Book";
import BookSearchRequest from "../types/BookSearchRequest";
import BookSearchResponse from "../types/BookSearchResponse";

const SHEET_NAME: string = "Alphabetical%20by%20Title";
const SHEET_ID: string = "1kO82qGyNM81LYWyR2rlc3YA4T_Mvaz4OanGQFzumD3k";

const SHEET_BASE_URL: string = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/`;
const SHEET_SANITIZATION_MATCH: RegExp = /(?<=\().*(?=\);)/s;

export default class BookController {
    private static buildSheetLink(query?: string): string {
        if (!query) {
            return `${SHEET_BASE_URL}sheet=${SHEET_NAME}`;
        }

        return `${SHEET_BASE_URL}tq?tq=${encodeURIComponent(query)}&sheet=${SHEET_NAME}`;
    }

    public static async getAllGenres(static_genres?: string[]): Promise<string[]> {
        const response = await fetch(
            BookController.buildSheetLink("SELECT D, COUNT(D) WHERE D IS NOT NULL GROUP BY D")
        );

        if (!response.ok) throw new Error("Failed to query genre data.");

        const text = await response.text();
        const matched_text = text.match(SHEET_SANITIZATION_MATCH);
        if (!matched_text) return static_genres ?? [];

        const json = JSON.parse(matched_text[0]);
        const rows = json?.table?.rows;
        if (!rows) return static_genres ?? [];

        const genre_data: string[] = rows.map((raw: any) => (
            raw.c[0]?.v
        )).filter(Boolean);

        const unique_genres: Set<string> = new Set();
        for (const genre of genre_data) {
            const genres = genre.split("/");

            if (genres.length > 1) {
                for (const sub of genres) {
                    unique_genres.add(sub.trim());
                }

                continue;
            }

            unique_genres.add(genre.trim());
        }

        return [...(static_genres ?? []), ...[...unique_genres].sort()];
    }

    public static async searchBooks(request: BookSearchRequest): Promise<BookSearchResponse> {
        const totalQuery = (
            "SELECT * WHERE " +
            `C >= ${request.level_range.low} AND C <= ${request.level_range.high} ` +
            `AND (F IS NULL OR (F >= ${request.point_range.low} AND F <= ${request.point_range.high})) ` +
            (request.genre === undefined ? "" : `AND D CONTAINS '${request.genre}' `) +
            (request.term === '' ? "" : `AND (LOWER(A) CONTAINS '${request.term}' OR LOWER(B) CONTAINS '${request.term}') `) +
            (request.filter_ar ? "AND E = 'Yes' " : "")
        );

        const pageQuery = `${totalQuery} ORDER BY LOWER(A) ASC LIMIT ${request.page_size} OFFSET ${request.page * request.page_size}`;

        const totalPromise = fetch(BookController.buildSheetLink(totalQuery));
        const pagePromise = fetch(BookController.buildSheetLink(pageQuery));

        const [totalResponse, pageResponse] = await Promise.all([totalPromise, pagePromise]);

        if (!totalResponse.ok) throw new Error("Failed to search books (total response).");
        if (!pageResponse.ok) throw new Error("Failed to search books (page response).");

        const [totalText, pageText] = await Promise.all([totalResponse.text(), pageResponse.text()]);
        
        const totalMatch = totalText.match(SHEET_SANITIZATION_MATCH);
        if (!totalMatch) return { books: [], pageCount: 0 };

        const pageMatch = pageText.match(SHEET_SANITIZATION_MATCH);
        if (!pageMatch) return { books: [], pageCount: 0 };

        const totalJson = JSON.parse(totalMatch[0]);
        const totalRows = totalJson?.table?.rows;
        if (!totalRows) return { books: [], pageCount: 0 };

        const pageCount = Math.ceil(totalRows.length / request.page_size);
        if (pageCount <= 0) return { books: [], pageCount: 0 };

        const pageJson = JSON.parse(pageMatch[0]);
        const pageRows = pageJson?.table?.rows;
        if (!pageRows) return { books: [], pageCount: 0 };

        return {
            books: pageRows.map((raw: any): Book => ({
                title: raw.c[0]?.v ?? "",
                author: raw.c[1]?.v ?? "",
                genres: raw.c[3]?.v ?? "",
                reading_level: raw.c[2]?.v ?? 0,
                ar_data: (raw.c[4]?.v === "Yes"
                    ? {
                        points: raw.c[5]?.v ?? 0,
                        quiz_id: raw.c[6]?.v ?? 0,
                    }
                    : undefined
                ),
            })),
            pageCount: pageCount,
        };
    }
}