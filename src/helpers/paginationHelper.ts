import mongoose, { Document, Model } from "mongoose";
import { PaginateQuery, PaginateResult } from "../types/paginate";

/**
 * Paginates and filters data based on query parameters for any model.
 * @param model - The Mongoose model to paginate.
 * @param query - The query object containing filters and pagination info.
 * @returns A promise that resolves to an object containing paginated data and pagination info.
 */
export async function paginate<T extends Document>(model: Model<T>, query: PaginateQuery): Promise<PaginateResult<T>> {
    const { page = 1, limit = 10, filters = {} } = query;

    // Convert page and limit to numbers
    const pageNumber = parseInt(page.toString(), 10);
    const pageSize = parseInt(limit.toString(), 10);

    // Calculate the skip value
    const skip = (pageNumber - 1) * pageSize;

    try {
        const data = await model.find(filters).skip(skip).limit(pageSize).exec();

        const totalItems = await model.countDocuments(filters).exec();

        return {
            data,
            pagination: {
                totalItems,
                page: pageNumber,
                pages: Math.ceil(totalItems / pageSize),
                limit: pageSize
            }
        };
    } catch (error: any) {
        throw new Error(`Error retrieving data: ${error.message}`);
    }
}
