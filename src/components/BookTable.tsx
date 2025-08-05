import { useState, useEffect } from "react";
import InputBar from "./InputBar";
import Dropdown from "./Dropdown";
import type Book from "../types/Book"
import LoadSpinner from "./LoadSpinner";
import SelectSlider from "./SelectSlider";
import RangeInputBar from "./RangeInputBar";

import check_mark from "../assets/images/checked.webp";
import cross_mark from "../assets/images/cancel.webp";

export function BookRow({ book }: { book: Book }) {
    const has_ar = book.ar_data != undefined;
    const points = has_ar ? book.ar_data?.points : "N/A";
    const quiz_id = has_ar ? book.ar_data?.quiz_id : "N/A";

    return <>
        <tr>
            <td className="flex items-center">{has_ar
                ? <img src={check_mark.src} className="size-4" />
                : <img src={cross_mark.src} className="size-4" />
            }&nbsp;AR</td>
            <td>{book.genres.join("; ")}</td>
            <td>RL:&nbsp;{book.reading_level}</td>
            <td>Pts:&nbsp;{points}</td>
            <td>Quiz:&nbsp;{quiz_id}</td>
        </tr>
        <tr>
            <td colSpan={5} className="font-bold">{book.title}</td>
        </tr>
        <tr>
            <td colSpan={5} className="font-bold">By:&nbsp;{book.authors.join("; ")}</td>
        </tr>
    </>
}

export default function BookTable() {
    const [is_loading, setLoading] = useState<boolean>(true);
    const [books, setBooks] = useState<Book[]>([]);

    const [search_term, setSearchTerm] = useState<string>("");
    const [filter_genres, setFilterGenres] = useState<string[]>([]);
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
        setLoading(true);
        let temp: Book[] = [{
            title: "A Series of Unfortunate Events: The Bad Beginning",
            authors: ["Lemony Snicket", "John Doe"],
            genres: ["Fiction", "Mystery"],
            reading_level: 6.4,
            ar_data: {
                points: 4,
                quiz_id: 41281,
            },
        }, {
            title: "A Series of Unfortunate Events: The Bad Beginning",
            authors: ["Lemony Snicket"],
            genres: ["Fiction"],
            reading_level: 6.4,
            ar_data: undefined,
        }];

        for (let i = 0; i < 100; ++i) {
            temp.push({
                title: "A Series of Unfortunate Events: The Bad Beginning",
                authors: ["Lemony Snicket"],
                genres: ["Fiction", "Mystery"],
                reading_level: 6.4,
                ar_data: {
                    points: 4,
                    quiz_id: 41281,
                },
            })
        }
        setBooks(temp);

        setLoading(false);
    }, [
        search_term,
        filter_genres,
        filter_ar,
        low_level,
        high_level,
        low_points,
        high_points
    ]);

    return <>
        <div>
            <InputBar
                value={search_term}
                onValueChange={setSearchTerm}
                placeholder="Search title or author..."
                input_type="text"
                bar_icon={undefined}
                class="mx-6"
            />

            <div className="flex flex-wrap items-center justify-between mt-3 mx-6">
                <SelectSlider />

                <Dropdown />

                <RangeInputBar
                    low_value={low_level}
                    high_value={high_level}
                    onLowValueChange={setLevelLow}
                    onHighValueChange={setLevelHigh}
                    lower_bound={LOWEST_LEVEL}
                    upper_bound={HIGHEST_LEVEL}
                />

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

        <div className="w-full px-6 py-8">
            <LoadSpinner
                is_loading={is_loading}
                loaded_content={books.length > 0 ? (
                    <table className="w-full">
                        <tbody>
                            {books.map((book: Book, index: number) => index > 0
                            ? (<>
                                <tr>
                                    <td className="h-4"></td>
                                </tr>
                                <tr className="border-t-4 border-dashed border-[#d7a350]">
                                    <td className="h-4"></td>
                                </tr>
                                <BookRow book={book} key={`Book-Row-${index}`} />
                            </>) : (
                                <BookRow book={book} key={`Book-Row-${index}`} />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center">No Available Books...</div>
                )}
            />
        </div>
    </>
}