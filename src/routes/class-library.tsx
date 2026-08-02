import { MetaProvider, Title } from "@solidjs/meta";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import LoadSpinner from "~/components/LoadSpinner";
import BookController from "~/lib/controllers/BookController";
import Book from "~/lib/types/Book";
import ChevronLeft from "lucide-solid/icons/chevron-left";
import ChevronRight from "lucide-solid/icons/chevron-right";
import { count } from "~/lib/utils/array";

const NULL_GENRE: string = "N/A";

const LOWEST_READING_LEVEL: number = 0.0;
const HIGHEST_READING_LEVEL: number = 13.0;

const LOWEST_AR_POINTS: number = 0.0;
const HIGHEST_AR_POINTS: number = 170; // Highest Point Value Computed Using World-Record Highest Word Count (August 2025)

const PAGE_SIZE: number = 50;

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
            <MetaProvider>
                <Title>Class Library</Title>
            </MetaProvider>

            <div class="min-h-screen striped-background border-x-20 border-x-[#d7a350] bg-blend-overlay bg-white/80 px-4 sm:px-8 py-16 flex flex-col gap-4">
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