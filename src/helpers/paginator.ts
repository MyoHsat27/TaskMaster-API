import { Document, Model } from "mongoose";
import { PaginateQuery, PaginateResult } from "../types/paginate.js";
import { throwError } from "./errorHandler.js";

/**
 * Paginates and filters data based on query parameters for any model.
 * @param model - The Mongoose model to paginate.
 * @param query - The query object containing filters and pagination info.
 * @returns A promise that resolves to an object containing paginated data and pagination info.
 */
export async function paginator<T extends Document>(
    model: Model<T>,
    query: PaginateQuery<Record<string, unknown>>
): Promise<PaginateResult<T>> {
    const { page = 1, limit = 10, filters = {}, sortBy = "createdAt", order = "asc" } = query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page.toString(), 10);
    const pageSize = parseInt(limit.toString(), 10);

    // Calculate the skip value
    const skip = (pageNumber - 1) * pageSize;

    // Build the filter query
    const filterQuery: Record<string, unknown> = { ...filters };

    if (typeof filters.title === "string") {
        filterQuery.title = { $regex: new RegExp(filters.title, "i") };
    }

    // Validate and set sort field
    const validSortFields = ["createdAt", "updatedAt", "priority"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    try {
        const [data, totalItems] = await Promise.all([
            model
                .find(filterQuery)
                .sort({ [sortField]: sortOrder })
                .skip(skip)
                .limit(pageSize)
                .exec(),
            model.countDocuments(filterQuery).exec()
        ]);

        return {
            data,
            pagination: {
                totalItems,
                page: pageNumber,
                pages: Math.ceil(totalItems / pageSize),
                limit: pageSize
            }
        };
    } catch (error) {
        throwError(error);
    }
}
