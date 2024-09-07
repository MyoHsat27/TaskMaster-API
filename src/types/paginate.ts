export interface PaginateQuery<T = Record<string, unknown>> {
    page?: number;
    limit?: number;
    filters?: T;
    sortBy?: string;
    order?: "desc" | "asc";
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
