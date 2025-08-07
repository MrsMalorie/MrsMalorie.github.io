export default interface Book {
    title: string;
    author: string;
    genres: string;
    reading_level: number;
    ar_data?: {
        points: number;
        quiz_id: number;
    };
};