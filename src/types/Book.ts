type Book = {
    title: string;
    authors: string[];

    genres: string[];
    reading_level: number;

    testable: boolean;
    test_points: number | null;
    quiz_id: number | null;
}

export type { Book }