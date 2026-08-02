export default interface BookSearchRequest {
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

    page: number;
    page_size: number;
}