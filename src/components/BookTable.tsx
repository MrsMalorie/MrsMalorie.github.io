import { useState, useEffect } from "react";
import InputBar from "./InputBar";
import Dropdown from "./Dropdown";
import type Book from "../types/Book"
import LoadSpinner from "./LoadSpinner";
import SelectSlider from "./SelectSlider";
import RangeInputBar from "./RangeInputBar";

import check_mark from "../assets/images/checked.webp";
import cross_mark from "../assets/images/cancel.webp";

import arrow_icon from "../assets/icons/arrow_icon.svg";
import magnifying_glass from "../assets/icons/magnifying_glass.svg";

const sheet_name: string = "Alphabetical%20by%20Title";
const sheet_id: string = "1kO82qGyNM81LYWyR2rlc3YA4T_Mvaz4OanGQFzumD3k";

interface BookSearchData {
    term: string;
    genre?: string;
    filter_ar: boolean;
    level_range: {
        low: number;
        high: number;
    };
    point_range: {
        low: number;
        high: number;
    };
}

function range(start: number, length: number, step: number = 1) {
    return Array.from({
        length: length
    }, ((_, idx: number) => start + idx * step))
}

export function BookRow({ book }: { book: Book }) {
    const has_ar = book.ar_data != undefined;
    const points = has_ar ? book.ar_data?.points : "N/A";
    const quiz_id = has_ar ? book.ar_data?.quiz_id : "N/A";

    return <>
        <tr className="hidden sm:table-row">
            <td className="flex items-center">{has_ar
                ? <img src={check_mark.src} className="size-4" />
                : <img src={cross_mark.src} className="size-4" />
            }&nbsp;AR</td>
            <td>{book.genres}</td>
            <td>RL:&nbsp;{book.reading_level}</td>
            <td>Pts:&nbsp;{points}</td>
            {quiz_id === "N/A"
                ? <td>Quiz:&nbsp;{quiz_id}</td>
                : <td>Quiz:&nbsp;
                    <a
                        href={`https://www.arbookfind.com/bookdetail.aspx?q=${quiz_id}&l=EN`}
                        className="pointer-cursor text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >{quiz_id}</a>
                </td>
            }
        </tr>

        <tr className="sm:hidden">
            <td className="flex items-center" colSpan={2}>{has_ar
                ? <img src={check_mark.src} className="size-4" />
                : <img src={cross_mark.src} className="size-4" />
            }&nbsp;AR</td>
            <td colSpan={3} className="text-right">{book.genres}</td>
        </tr>

        <tr className="sm:hidden">
            <td colSpan={2}>RL:&nbsp;{book.reading_level}</td>
            <td colSpan={3} className="text-right">Pts:&nbsp;{points}</td>
        </tr>

        <tr className="sm:hidden">
            {quiz_id === "N/A"
                ? <td colSpan={5}>Quiz:&nbsp;{quiz_id}</td>
                : <td colSpan={5}>Quiz:&nbsp;
                    <a
                        href={`https://www.arbookfind.com/bookdetail.aspx?q=${quiz_id}&l=EN`}
                        className="pointer-cursor text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >{quiz_id}</a>
                </td>
            }
        </tr>

        <tr>
            <td colSpan={5} className="font-bold">{book.title}</td>
        </tr>
        <tr>
            <td colSpan={5} className="font-bold">By:&nbsp;{book.author}</td>
        </tr>
    </>
}

async function pullGenreData(null_genre: string): Promise<string[]> {
    const query = encodeURIComponent(
        "SELECT D, COUNT(D) WHERE D IS NOT NULL GROUP BY D"
    );

    const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${sheet_id}/gviz/tq?tq=${query}&sheet=${sheet_name}`
    );
    const text = await response.text();
    const matched_text = text.match(/(?<=\().*(?=\);)/s);
    if (!matched_text) {
        return [null_genre];
    }

    const json = JSON.parse(matched_text[0]);
    const rows = json?.table?.rows;
    if (!rows) {
        return [null_genre];
    }

    const genre_data: string[] = rows.map((raw: any) => (
        raw.c[0]?.v.trim()
    )).filter(Boolean);

    const unique_genres: Set<string> = new Set();
    genre_data.forEach((datum: string, index: number) => {
        const genres = datum.split(" / ");
        if (genres.length > 1) {
            genres.forEach((genre: string) => unique_genres.add(genre));
        } else {
            unique_genres.add(datum);
        }
    })

    return [null_genre, ...[...unique_genres].sort()];
}

async function pullPageCount(search: BookSearchData, page_size: number): Promise<number> {
    const query = encodeURIComponent(
        "SELECT * WHERE " +
        `C >= ${search.level_range.low} AND C <= ${search.level_range.high} ` +
        `AND (F IS NULL OR (F >= ${search.point_range.low} AND F <= ${search.point_range.high})) ` +
        (search.genre === undefined ? "" : `AND D CONTAINS '${search.genre}' `) +
        (search.term === '' ? "" : `AND (LOWER(A) CONTAINS '${search.term}' OR LOWER(B) CONTAINS '${search.term}') `) +
        (search.filter_ar ? "AND E = 'Yes' " : "") +
        "ORDER BY LOWER(A) ASC"
    );

    const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${sheet_id}/gviz/tq?tq=${query}&sheet=${sheet_name}`
    );
    const text = await response.text();
    const matched_text = text.match(/(?<=\().*(?=\);)/s);
    if (!matched_text) {
        return 0;
    }

    const json = JSON.parse(matched_text[0]);
    const rows = json?.table?.rows;
    if (!rows) {
        return 0;
    }
    
    return Math.ceil(rows.length / page_size);
}

async function pullBookData(search: BookSearchData, page_index: number, page_size: number): Promise<Book[]> {
    const query = encodeURIComponent(
        "SELECT * WHERE " +
        `C >= ${search.level_range.low} AND C <= ${search.level_range.high} ` +
        `AND (F IS NULL OR (F >= ${search.point_range.low} AND F <= ${search.point_range.high})) ` +
        (search.genre === undefined ? "" : `AND D CONTAINS '${search.genre}' `) +
        (search.term === '' ? "" : `AND (LOWER(A) CONTAINS '${search.term}' OR LOWER(B) CONTAINS '${search.term}') `) +
        (search.filter_ar ? "AND E = 'Yes' " : "") +
        `ORDER BY LOWER(A) ASC LIMIT ${page_size} OFFSET ${page_index * page_size}`
    );

    const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${sheet_id}/gviz/tq?tq=${query}&sheet=${sheet_name}`
    );
    const text = await response.text();
    const matched_text = text.match(/(?<=\().*(?=\);)/s);
    if (!matched_text) {
        return [];
    }

    const json = JSON.parse(matched_text[0]);
    const rows = json?.table?.rows;
    if (!rows) {
        return [];
    }

    const book_data: Book[] = rows.map((raw: any) => {
        let book: Book = {
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
        };

        return book;
    });

    return book_data;
}

export default function BookTable() {
    const MAX_PAGE_SIZE: number = 50;

    const [loading_genres, setLoadingGenres] = useState<boolean>(true);
    const [loading_books, setLoadingBooks] = useState<boolean>(true);

    const [page_index, setPageIndex] = useState<number>(0);
    const [page_count, setPageCount] = useState<number>(0);
    const [load_flag, setLoadFlag] = useState<boolean>(true);
    const [books, setBooks] = useState<Book[]>([]);

    const NULL_GENRE: string = "N/A"

    const [genres, setGenres] = useState<string[]>([NULL_GENRE]);

    const [search_term, setSearchTerm] = useState<string>("");
    const [filter_genre, setFilterGenre] = useState<string>(NULL_GENRE);
    const [filter_ar, setFilterAR] = useState<boolean>(true);

    const LOWEST_LEVEL: number = 0.0;
    const HIGHEST_LEVEL: number = 13.0;

    const [low_level, setLevelLow] = useState<number>(LOWEST_LEVEL);
    const [high_level, setLevelHigh] = useState<number>(HIGHEST_LEVEL);

    const LOWEST_POINTS: number = 0.0;
    const HIGHEST_POINTS: number = 170;
    // Highest Point Value Computed Using World-Record Highest Word Count (August 2025)

    const [low_points, setPointsLow] = useState<number>(LOWEST_POINTS);
    const [high_points, setPointsHigh] = useState<number>(HIGHEST_POINTS);

    useEffect(() => {
        async function loadGenres() {
            setLoadingGenres(true);

            setGenres(await pullGenreData(NULL_GENRE));

            setLoadingGenres(false);
        }

        loadGenres();
    }, []);

    useEffect(() => {
        async function loadPageCount() {
            setPageCount(await pullPageCount({
                term: search_term.trim().toLowerCase(),
                genre: filter_genre === NULL_GENRE ? undefined : filter_genre,
                filter_ar: filter_ar,
                level_range: {
                    low: low_level,
                    high: high_level,
                },
                point_range: {
                    low: low_points,
                    high: high_points,
                },
            }, MAX_PAGE_SIZE));

            setPageIndex(0);
            setLoadFlag(!load_flag);
        }

        loadPageCount();
    }, [
        search_term,
        filter_genre,
        filter_ar,
        low_level,
        high_level,
        low_points,
        high_points
    ]);

    useEffect(() => {
        async function loadBooks() {
            setLoadingBooks(true);
            
            setBooks(await pullBookData({
                term: search_term.trim().toLowerCase(),
                genre: filter_genre === NULL_GENRE ? undefined : filter_genre,
                filter_ar: filter_ar,
                level_range: {
                    low: low_level,
                    high: high_level,
                },
                point_range: {
                    low: low_points,
                    high: high_points,
                },
            }, page_index, MAX_PAGE_SIZE));

            setLoadingBooks(false);
        }

        if (page_count > 0) {
            loadBooks();
        } else {
            setBooks([]);
        }
    }, [load_flag]);

    return <>
        <div className="pt-8">
            <h1 className="pb-2 px-4 font-bold text-2xl">Search the Class Library</h1>

            <InputBar
                value={search_term}
                onValueChange={setSearchTerm}
                placeholder="Search title or author..."
                input_type="text"
                bar_icon={magnifying_glass.src}
                class="mx-6"
            />

            <div className="flex flex-wrap items-center justify-between mt-3 mx-6">
                <div>
                    <label className="font-bold text-lg">AR</label>
                    <hr className="pb-2"/>
                    <SelectSlider
                        value={filter_ar}
                        onValueChange={setFilterAR}
                    />
                </div>

                <div>
                    <label className="font-bold text-lg">Genre</label>
                    <hr className="pb-2"/>
                    <Dropdown
                        value={{
                            tag: genres[0],
                            value: 0
                        }}
                        options={genres.map((genre: string, index: number) => ({
                            tag: genre,
                            value: index,
                        }))}
                        onValueChange={(genre_idx: number) => setFilterGenre(genres[genre_idx])}
                        class="max-w-50 sm:max-w-full"
                    />
                </div>

                <div>
                    <label className="font-bold text-lg">AR Level Range</label>
                    <hr className="pb-2"/>
                    <RangeInputBar
                        low_value={low_level}
                        high_value={high_level}
                        onLowValueChange={setLevelLow}
                        onHighValueChange={setLevelHigh}
                        lower_bound={LOWEST_LEVEL}
                        upper_bound={HIGHEST_LEVEL}
                    />
                </div>

                <div>
                    <label className="font-bold text-lg">AR Point Range</label>
                    <hr className="pb-2"/>
                    <RangeInputBar
                        low_value={low_points}
                        high_value={high_points}
                        onLowValueChange={setPointsLow}
                        onHighValueChange={setPointsHigh}
                        lower_bound={LOWEST_POINTS}
                        upper_bound={HIGHEST_POINTS}
                    />
                </div>
            </div>
        </div>

        <div className="w-full px-6 py-8">
            <LoadSpinner
                is_loading={loading_genres || loading_books}
                loaded_content={books.length > 0 ? (<>
                    <table className="w-full">
                        <tbody>
                            {books.map((book: Book, index: number) => index > 0
                            ? [
                                <tr key={`Upper-Book-Padding-${index}`}>
                                    <td className="h-4"></td>
                                </tr>,
                                <tr
                                    className="border-t-4 border-dashed border-[#d7a350]"
                                    key={`Lower-Book-Padding-${index}`}
                                >
                                    <td className="h-4"></td>
                                </tr>,
                                <BookRow book={book} key={`Book-Row-${index}`} />
                            ] : (
                                <BookRow book={book} key={`Book-Row-${index}`} />
                            ))}
                        </tbody>
                    </table>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button
                            className="cursor-pointer size-4 rotate-270"
                            onClick={() => {
                                if (page_index > 0) {
                                    setPageIndex(page_index - 1);
                                    setLoadFlag(!load_flag);
                                }
                            }}
                        >
                            <img src={arrow_icon.src} />
                        </button>

                        {range(
                            Math.max(0, page_index - 2),
                            Math.min(5, page_count)
                        ).map((p_idx: number) => (
                            <button
                                className={`${p_idx === page_index
                                    ? "text-gray-400"
                                    : "cursor-pointer hover:underline"
                                }`}
                                onClick={() => {
                                    if (p_idx !== page_index) {
                                        setPageIndex(p_idx);
                                        setLoadFlag(!load_flag);
                                    }
                                }}
                                key={`Page-Select-${p_idx}`}
                            >
                                {p_idx + 1}
                            </button>
                        ))}

                        <button
                            className="cursor-pointer size-4 rotate-90"
                            onClick={() => {
                                if (page_index < page_count - 1) {
                                    setPageIndex(page_index + 1);
                                    setLoadFlag(!load_flag);
                                }
                            }}
                        >
                            <img src={arrow_icon.src} />
                        </button>
                    </div>
                </>) : (
                    <div className="text-center">No Available Books...</div>
                )}
            />
        </div>
    </>
}