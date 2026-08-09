import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import LoadSpinner from "../components/LoadSpinner";
import BookController from "../lib/controllers/BookController";
import Book from "../lib/types/Book";
import ChevronLeft from "lucide-solid/icons/chevron-left";
import ChevronRight from "lucide-solid/icons/chevron-right";
import BadgeCheck from "lucide-solid/icons/badge-check";
import BadgeX from "lucide-solid/icons/badge-x";
import { count } from "../lib/utils/array";
import TextInput from "../components/TextInput";
import { Search, Undo2 } from "lucide-solid";

const NULL_GENRE: string = "N/A";

const LOWEST_READING_LEVEL: number = 0.0;
const HIGHEST_READING_LEVEL: number = 13.0;

const LOWEST_AR_POINTS: number = 0.0;
const HIGHEST_AR_POINTS: number = 170; // Highest Point Value Computed Using World-Record Highest Word Count (August 2025)

const PAGE_SIZE: number = 50;

const SEARCH_TIMEOUT_MS: number = 500;

function BookTableRow(book: Book, index: number) {
    const has_ar = book.ar_data != undefined;
    const points = has_ar ? book.ar_data?.points : "N/A";
    const quiz_id = has_ar ? book.ar_data?.quiz_id : "N/A";

    return (<>
        <Show when={index > 0}>
            <tr>
                <td class="h-4"></td>
            </tr>
            <tr class="border-t-4 border-dashed border-[#d7a350]">
                <td class="h-4"></td>
            </tr>
        </Show>

        <tr class="hidden md:table-row">
            <td class="flex items-center">{has_ar
                ? <BadgeCheck class="w-4 h-4 text-green-500" />
                : <BadgeX class="w-4 h-4 text-red-500" />
            }&nbsp;AR</td>
            <td>{book.genres}</td>
            <td>Level:&nbsp;{book.reading_level}</td>
            <td>AR Points:&nbsp;{points}</td>
            {quiz_id === "N/A"
                ? <td>Quiz:&nbsp;{quiz_id}</td>
                : <td>Quiz:&nbsp;
                    <a
                        href={`https://www.arbookfind.com/bookdetail.aspx?q=${quiz_id}&l=EN`}
                        class="pointer-cursor text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >{quiz_id}</a>
                </td>
            }
        </tr>

        <tr class="md:hidden">
            <td class="flex items-center" colSpan={2}>{has_ar
                ? <BadgeCheck class="w-4 h-4 text-green-500" />
                : <BadgeX class="w-4 h-4 text-red-500" />
            }&nbsp;AR</td>
            <td colSpan={3} class="text-right">{book.genres}</td>
        </tr>

        <tr class="md:hidden">
            <td colSpan={2}>Level:&nbsp;{book.reading_level}</td>
            <td colSpan={3} class="text-right">AR Points:&nbsp;{points}</td>
        </tr>

        <tr class="md:hidden">
            {quiz_id === "N/A"
                ? <td colSpan={5}>Quiz:&nbsp;{quiz_id}</td>
                : <td colSpan={5}>Quiz:&nbsp;
                    <a
                        href={`https://www.arbookfind.com/bookdetail.aspx?q=${quiz_id}&l=EN`}
                        class="pointer-cursor text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >{quiz_id}</a>
                </td>
            }
        </tr>

        <tr>
            <td colSpan={5} class="font-bold">{book.title}</td>
        </tr>
        <tr>
            <td colSpan={5} class="font-bold">By:&nbsp;{book.author}</td>
        </tr>
    </>);
}

export default function ClassLibraryPage() {
    let searchTimeout: ReturnType<typeof setTimeout> | null = null;

    const [loadingGenres, setLoadingGenres] = createSignal<boolean>(true);
    const [loadingBooks, setLoadingBooks] = createSignal<boolean>(true);

    const [searchError, setSearchError] = createSignal<string | null>(null);

    const [books, setBooks] = createSignal<Book[]>([]);
    const [pageIndex, setPageIndex] = createSignal<number>(0);
    const [pageCount, setPageCount] = createSignal<number>(0);

    const [genres, setGenres] = createSignal<string[]>([NULL_GENRE]);

    const [searchTerm, setSearchTerm] = createSignal<string>("");
    const [filterGenre, setFilterGenre] = createSignal<string>(NULL_GENRE);
    const [filterAr, setFilterAr] = createSignal<boolean>(false);

    const [lowLevel, setLowLevel] = createSignal<number>(LOWEST_READING_LEVEL);
    const [highLevel, setHighLevel] = createSignal<number>(HIGHEST_READING_LEVEL);

    const [lowPoints, setLowPoints] = createSignal<number>(LOWEST_AR_POINTS);
    const [highPoints, setHighPoints] = createSignal<number>(HIGHEST_AR_POINTS);

    onMount(async () => {
        setLoadingGenres(true);

        try {
            setGenres(await BookController.getAllGenres([NULL_GENRE]));
            setLoadingGenres(false);
        } catch (ex) {
            setSearchError(`An error occured while getting genres from the library: ${ex}`);
        } finally {
            setLoadingGenres(false);
        }
    });

    createEffect(async () => {
        if (searchTimeout !== null) {
            clearTimeout(searchTimeout);
            searchTimeout = null;
        }

        const _searchTerm = searchTerm().trim().toLowerCase();
        const _filterGenre = filterGenre() === NULL_GENRE ? undefined : filterGenre();
        const _filterAr = filterAr();
        const _lowLevel = lowLevel();
        const _highLevel = highLevel();
        const _lowPoints = lowPoints();
        const _highPoints = highPoints();
        const _pageIndex = pageIndex();

        searchTimeout = setTimeout(async () => {
            setLoadingBooks(true);

            try {
                const response = await BookController.searchBooks({
                    term: _searchTerm,
                    genre: _filterGenre,
                    filter_ar: _filterAr,
                    level_range: {
                        low: _lowLevel,
                        high: _highLevel,
                    },
                    point_range: {
                        low: _lowPoints,
                        high: _highPoints,
                    },
                    page: _pageIndex,
                    page_size: PAGE_SIZE,
                });

                setBooks(response.books);
                setPageCount(response.pageCount);
            } catch (ex) {
                setSearchError(`An error occured while searching the library: ${ex}`);
            } finally {
                setLoadingBooks(false);
            }
        }, SEARCH_TIMEOUT_MS);
    });

    onCleanup(() => {
        if (searchTimeout !== null) {
            clearTimeout(searchTimeout);
            searchTimeout = null;
        }
    });

    return (
        <main class="bg-gradient-to-b from-blue-300 to-white min-h-screen px-4 sm:px-8">
            <div class="min-h-screen striped-background border-x-20 border-x-[#d7a350] bg-blend-overlay bg-white/90 px-4 sm:px-8 py-16 flex flex-col gap-4">
                <div class="space-y-2">
                    <div class="flex flex-wrap items-end w-full gap-2">
                        <h1 class="font-bold text-3xl">Search the Class Library</h1>
                        <a href="/" class="ml-auto inline-flex gap-2 items-center text-blue-700 hover:underline">
                            <Undo2 class="w-5 h-5" />
                            Back Home
                        </a>
                    </div>
                    <hr />
                </div>

                <div class="space-y-4">
                    <TextInput
                        icon={<Search class="w-4 h-4" />}
                        placeholder="Search..."
                        value={searchTerm()}
                        onValueChange={setSearchTerm}
                    />

                    <div class="flex flex-wrap gap-8 items-start justify-between">
                        
                    </div>
                </div>

                <div>
                    <Show when={loadingGenres() || loadingBooks()} fallback={<Show when={searchError() === null} fallback={
                        <div class="bg-red-200 text-red-600 px-3 py-2 rounded-md border border-red-600">
                            {searchError()}
                        </div>
                    }>
                        <table class="w-full">
                            <tbody>
                                {books().map(BookTableRow)}
                            </tbody>
                        </table>

                        <div class="flex flex-wrap items-center justify-center gap-4">
                            <button
                                class="cursor-pointer"
                                onClick={() => {
                                    const _pageIndex = pageIndex();
                                    if (_pageIndex > 0) {
                                        setPageIndex(_pageIndex - 1);
                                    }
                                }}
                            >
                                <ChevronLeft />
                            </button>

                            {count(
                                Math.max(0, pageIndex() - 2),
                                Math.min(5, pageCount())
                            ).map((p_idx: number) => (
                                <button
                                    class={`${p_idx === pageIndex()
                                        ? "text-gray-400"
                                        : "cursor-pointer hover:underline"
                                    }`}
                                    onClick={() => {
                                        if (p_idx !== pageIndex()) {
                                            setPageIndex(p_idx);
                                        }
                                    }}
                                >
                                    {p_idx + 1}
                                </button>
                            ))}

                            <button
                                class="cursor-pointer"
                                onClick={() => {
                                    const _pageIndex = pageIndex();
                                    if (_pageIndex < pageCount() - 1) {
                                        setPageIndex(_pageIndex + 1);
                                    }
                                }}
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    </Show>}>
                        <LoadSpinner />
                    </Show>
                </div>
            </div>
        </main>
    );
}