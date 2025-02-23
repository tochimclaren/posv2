import db from "../../models";

export const paginateProduct = async (page: number, pageSize: number) => {

    // TODO: make this a generic function
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const products = await db.Product.findAll({
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']],
    });

    const totalCount = await db.Product.count();

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
        products,
        totalCount,
        totalPages,
        currentPage: page
    };
};
