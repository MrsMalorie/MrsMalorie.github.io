import BookRow from "./BookRow";
import Checkbox from "./Checkbox";
import Dropdown from "./Dropdown";
import InputBar from "./InputBar";
import RangeInput from "./RangeInput";
import { type Book } from "../types/Book";
import { useState, useEffect } from "react";

type BookFilterParams = {
    search_bar: string,
    genres: string[],
    testable: boolean,
    point_range: {
        low: number,
        high: number,
    },
    level_range: {
        low: number,
        high: number,
    },
};

const MIN_RANGE_VALUE: number = 0;
const MAX_RANGE_VALUE: number = 999;

const NULL_GENRE_OPTION: string = "N/A";

function searchMatchScore(value: string, search_term: string): number {
    value = value.trim().toLowerCase();
    search_term = search_term.trim().toLowerCase();
    
    if (value == search_term) {
        return 100;
    }

    return value.includes(search_term) ? 50 : 0;
}

async function loadGenres(): Promise<string[]> {
    // TODO: This really isn't the greatest 'database'
    const genre_data_path: string = "src/data/genres.json";
    const response: Response = await fetch(genre_data_path);
    const raw_data = await response.json();

    if (!raw_data.length || raw_data.length == 0) {
        return [NULL_GENRE_OPTION];
    }

    return [NULL_GENRE_OPTION, ...raw_data as string[]];
}

async function loadBooks(
    filter_params: BookFilterParams,
    sortFunc: ((book_a: Book, book_b: Book) => number) | null
): Promise<Book[]> {
    // TODO: This really isn't the greatest 'database'
    const library_data_path: string = "src/data/library.json";
    const response: Response = await fetch(library_data_path);
    const raw_data = await response.json();

    if (!raw_data.length || raw_data.length == 0) {
        return [];
    }

    const books: Book[] = Array.from({ length: raw_data.length }, () => ({
        title: '',
        authors: [],
        genres: [],
        reading_level: 0,
        testable: false,
        test_points: null,
        quiz_id: null,
    }))

    let valid_count: number = 0;
    for (let idx = 0; idx < raw_data.length; ++idx) {
        const datum = raw_data[idx];
        const book: Book = books[valid_count];

        book.genres = (datum["Genre"] || "").split(" / ");

        let has_genre: boolean = filter_params.genres.length == 0;
        outer_genre_loop: for (let jdx = 0; jdx < filter_params.genres.length; ++jdx) {
            const filter_genre: string = filter_params.genres[jdx].toLowerCase();

            for (let kdx = 0; kdx < book.genres.length; ++kdx) {
                if (book.genres[kdx].toLowerCase() == filter_genre) {
                    has_genre = true;
                    break outer_genre_loop;
                }
            }
        }
        
        if (!has_genre) {
            continue;
        }

        book.reading_level = Number(datum["Level"] ? datum["Level"] : "0.0" );
        book.testable = (datum["AR Test?"] || "").toLowerCase() == "yes";

        if (
            !book.testable && filter_params.testable ||
            filter_params.level_range.low > book.reading_level ||
            filter_params.level_range.high < book.reading_level
        ) {
            continue;
        }

        book.test_points = datum["AR Points?"] ? Number(datum["AR Points?"]) : null;

        if (book.test_points != null) {
            if (
                filter_params.point_range.low > book.test_points ||
                filter_params.point_range.high < book.test_points
            ) {
                continue;
            }
        }

        book.title = datum["Title"] || "";
        book.authors = (datum["Author"] || "").split(" & ");
        book.quiz_id = datum["Quiz Number"] ? Number(datum["Quiz Number"]) : null;

        ++valid_count;
    }

    return books.slice(0, valid_count).sort((book_a: Book, book_b: Book) => {
        const search_sort: number = filter_params.search_bar.length == 0 ? 0 : (
            searchMatchScore(book_b.title, filter_params.search_bar) +
            searchMatchScore(book_b.authors.join(';'), filter_params.search_bar) -
            searchMatchScore(book_a.title, filter_params.search_bar) -
            searchMatchScore(book_a.authors.join(';'), filter_params.search_bar)
        );

        if (search_sort != 0) {
            return search_sort;
        }

        const requested_sort: number = sortFunc == null ? 0 : sortFunc(book_a, book_b);

        if (requested_sort != 0) {
            return requested_sort;
        }

        return book_a.title.localeCompare(
            book_b.title,
            undefined,
            { sensitivity: "base" }
        );
    });
}

export default function BookTable() {
    const [books, setBooks] = useState<Book[]>([]);
    const [genres, setGenres] = useState<string[]>([]);

    const [search_text, setSearchText] = useState<string>('');
    const [filter_genres, setFilterGenres] = useState<string[]>([]);
    const [require_test, setTestRequirement] = useState<boolean>(true);

    const [pointLow, setPointLow] = useState<number>(MIN_RANGE_VALUE);
    const [pointHigh, setPointHigh] = useState<number>(MAX_RANGE_VALUE);

    const [levelLow, setLevelLow] = useState<number>(MIN_RANGE_VALUE);
    const [levelHigh, setLevelHigh] = useState<number>(MAX_RANGE_VALUE);

    async function fetchBooks() {
        setBooks(await loadBooks({
            search_bar: search_text,
            genres: filter_genres,
            testable: require_test,
            point_range: {
                low: pointLow,
                high: pointHigh,
            },
            level_range: {
                low: levelLow,
                high: levelHigh,
            },
        }, null));
    }

    async function fetchGenres() {
        setGenres(await loadGenres());
    }

    useEffect(() => { fetchBooks(); }, [
        search_text,
        filter_genres,
        require_test,
        pointLow,
        pointHigh,
        levelLow,
        levelHigh,
    ]);

    useEffect(() => { fetchGenres(); });

    return (<>
        <div>
            <InputBar
                placeholder="Search title or author..."
                value={search_text}
                label={null}
                type={"text"}
                valueChangeCallback={(text: string) => {
                    setSearchText(text);
                }}
            />

            <div className="flex">
                <Checkbox
                    value={require_test}
                    onValueChange={(value: boolean) => setTestRequirement(value)}
                />

                <Dropdown
                    options={genres}
                    label="Genre"
                    onOptionSelect={(value: string) => {
                        if (value == NULL_GENRE_OPTION) {
                            setFilterGenres([]);
                            return;
                        }

                        setFilterGenres([value]);
                    }}
                />

                <RangeInput 
                    label="AR Level Range"
                    low_value={levelLow}
                    high_value={levelHigh}
                    min_value={MIN_RANGE_VALUE}
                    max_value={MAX_RANGE_VALUE}
                    lowChangeCallback={(value: number) => setLevelLow(value)}
                    highChangeCallback={(value: number) => setLevelHigh(value)}
                />

                <RangeInput 
                    label="AR Point Range"
                    low_value={pointLow}
                    high_value={pointHigh}
                    min_value={MIN_RANGE_VALUE}
                    max_value={MAX_RANGE_VALUE}
                    lowChangeCallback={(value: number) => setPointLow(value)}
                    highChangeCallback={(value: number) => setPointHigh(value)}
                />
            </div>
        </div>

        <table className="mx-auto">
            <tbody>
                {books.map((book, index) => index == 0 ? (
                    <BookRow key={`Book-${index}`} book={book} />
                ) : (<>
                    <tr className="border-b-3 border-dashed border-[#d7a350]">
                    </tr>
                    <BookRow key={`Book-${index}`} book={book} />
                </>))}
            </tbody>
        </table>
    </>);
}