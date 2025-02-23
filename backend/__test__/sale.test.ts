import request from 'supertest';
import { Response } from 'express';
import { createSale } from '../src/controllers/sale.controller';
import db from '../models';
import { app } from '../index';
import { AuthRequest } from '../src/types/express';

// Mock the database
jest.mock('../models', () => ({
  User: {
    findOne: jest.fn()
  },
  Sale: {
    bulkCreate: jest.fn()
  }
}));

describe('createSale Controller', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  const mockUser = { id: 1, sessionToken: 'valid-token' };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock request
    mockRequest = {
      identity: {
        sessionToken: 'valid-token'
      },
      body: {
        data: [
          { id: 1, quantity: 2, price: 10.99 },
          { id: 2, quantity: 1, price: 20.50 }
        ]
      }
    };

    // Setup mock response
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis()
    };
  });

  it('should create sales successfully', async () => {
    // Mock database responses
    const mockSales = [
      { id: 1, userId: 1, productId: 1, quantity: 2, price: 10.99 },
      { id: 2, userId: 1, productId: 2, quantity: 1, price: 20.50 }
    ];

    (db.User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (db.Sale.bulkCreate as jest.Mock).mockResolvedValue(mockSales);

    await createSale(mockRequest as AuthRequest, mockResponse as Response);

    // Verify user was looked up with correct token
    expect(db.User.findOne).toHaveBeenCalledWith({
      where: { sessionToken: 'valid-token' }
    });

    // Verify sales were created with correct data
    expect(db.Sale.bulkCreate).toHaveBeenCalledWith([
      { productId: 1, quantity: 2, price: 10.99, userId: 1 },
      { productId: 2, quantity: 1, price: 20.50, userId: 1 }
    ], { validate: true });

    // Verify response
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith(mockSales);
  });

  it('should return 403 when user is not found', async () => {
    // Mock user not found
    (db.User.findOne as jest.Mock).mockResolvedValue(null);

    await createSale(mockRequest as AuthRequest, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Missing user' });
    expect(db.Sale.bulkCreate).not.toHaveBeenCalled();
  });

  it('should return 500 when database operation fails', async () => {
    // Mock database error
    (db.User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (db.Sale.bulkCreate as jest.Mock).mockRejectedValue(new Error('Database error'));

    await createSale(mockRequest as AuthRequest, mockResponse as Response);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(500);
  });

  it('should handle empty data array', async () => {
    // Setup request with empty data
    mockRequest.body.data = [];

    // Mock database responses
    (db.User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (db.Sale.bulkCreate as jest.Mock).mockResolvedValue([]);

    await createSale(mockRequest as AuthRequest, mockResponse as Response);

    expect(db.Sale.bulkCreate).toHaveBeenCalledWith([], { validate: true });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith([]);
  });
});
