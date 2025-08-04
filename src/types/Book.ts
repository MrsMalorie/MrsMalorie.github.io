export default interface Book {
    title: string;
    authors: string[];
    genres: string[];
    reading_level: number;
    ar_data?: {
        points: number;
        quiz_id: number;
    };
};