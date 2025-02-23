import { Server } from 'http';
import request from 'supertest';
import db from '../models';
import { startServer, stopServer, app } from '../index';
// import { v4 as uuidv4 } from 'uuid';

let server: Server;
let testProduct: any;

beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = await startServer();

    testProduct = await db.Product.create({
        name: "Old Product",
        price: 100,
        isAvailable: true,
    });
});

afterAll(async () => {
    await stopServer();
});

afterEach(async () => {
    await db.Product.destroy({ where: {} });
});

describe('GET /api/products/:id', () => {
    it('should return the product when a valid id is provided', async () => {
        const product = await db.Product.create({ name: 'Test Product', price: 100 });
        const response = await request(app).get(`/api/products/${product.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', product.id);
        expect(response.body.name).toBe('Test Product');
        expect(response.body.price).toBe(100);
    });

    it('should return a 404 error when the product is not found', async () => {
        const response = await request(app).get('/api/products/999999');
        expect(response.status).toBe(404);
    });

    it('should return a 500 error if there is a server error', async () => {
        jest.spyOn(db.Product, 'findOne').mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app).get('/api/products/1');
        expect(response.status).toBe(500);
    });
});

describe("GET /api/products", () => {
    beforeEach(async () => {
        await db.Product.bulkCreate([
            { name: "Product A", price: 10.0 },
            { name: "Product B", price: 20.0 },
            { name: "Product C", price: 30.0 },
        ]);
    });

    afterEach(async () => {
        await db.Product.destroy({ where: {} });
    });

    it("should return paginated products with default values", async () => {
        const res = await request(app).get("/api/products");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("products");
        expect(res.body.products.length).toBeGreaterThan(0);
        expect(res.body).toHaveProperty("totalCount");
        expect(res.body).toHaveProperty("totalPages");
        expect(res.body.currentPage).toBe(1);
    });

    it("should return paginated products with custom page & pageSize", async () => {
        const res = await request(app).get("/api/products?page=1&pageSize=2");

        expect(res.statusCode).toBe(200);
        expect(res.body.products.length).toBe(2);
        expect(res.body.currentPage).toBe(1);
    });

    it("should return 500 if an error occurs", async () => {
        jest.spyOn(db.Product, "findAll").mockRejectedValue(new Error("Database error"));
        const res = await request(app).get("/api/products");
        expect(res.statusCode).toBe(500);
        jest.restoreAllMocks();
    });
});