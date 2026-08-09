import { createEffect, createSignal, onMount, Show } from "solid-js";
import LoadSpinner from "../components/LoadSpinner";
import BookController from "../lib/controllers/BookController";
import Book from "../lib/types/Book";
import ChevronLeft from "lucide-solid/icons/chevron-left";
import ChevronRight from "lucide-solid/icons/chevron-right";
import BadgeCheck from "lucide-solid/icons/badge-check";
import BadgeX from "lucide-solid/icons/badge-x";
import { count } from "../lib/utils/array";

const NULL_GENRE: string = "N/A";

const LOWEST_READING_LEVEL: number = 0.0;
const HIGHEST_READING_LEVEL: number = 13.0;

const LOWEST_AR_POINTS: number = 0.0;
const HIGHEST_AR_POINTS: number = 170; // Highest Point Value Computed Using World-Record Highest Word Count (August 2025)

const PAGE_SIZE: number = 50;

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
    const [loadingGenres, setLoadingGenres] = createSignal<boolean>(true);
    const [loadingBooks, setLoadingBooks] = createSignal<boolean>(true);

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
        setGenres(await BookController.getAllGenres([NULL_GENRE]));
        setLoadingGenres(false);
    });

    createEffect(async () => {
        setLoadingBooks(true);

        const response = await BookController.searchBooks({
            term: searchTerm().trim().toLowerCase(),
            genre: filterGenre() === NULL_GENRE ? undefined : filterGenre(),
            filter_ar: filterAr(),
            level_range: {
                low: lowLevel(),
                high: highLevel(),
            },
            point_range: {
                low: lowPoints(),
                high: highPoints(),
            },
            page: pageIndex(),
            page_size: PAGE_SIZE,
        });

        setBooks(response.books);
        setPageCount(response.pageCount);

        setLoadingBooks(false);
    });

    return (
        <main class="bg-gradient-to-b from-blue-300 to-white min-h-screen px-4 sm:px-8">
            <div class="min-h-screen striped-background border-x-20 border-x-[#d7a350] bg-blend-overlay bg-white/90 px-4 sm:px-8 py-16 flex flex-col gap-4">
                <div class="space-y-2">
                    <h1 class="font-bold text-3xl">Search the Class Library</h1>
                    <hr />
                </div>

                <div>
                    
                </div>

                <div>
                    <Show when={loadingGenres() || loadingBooks()} fallback={<>
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
                    </>}>
                        <LoadSpinner />
                    </Show>
                </div>
            </div>
        </main>
    );
}