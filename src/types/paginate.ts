export interface PaginateQuery {
    page?: number;
    limit?: number;
    filters?: Record<string, any>;
}

export interface PaginateResult<T> {
    data: T[];
    pagination: {
        totalItems: number;
        page: number;
        pages: number;
        limit: number;
    };
}
