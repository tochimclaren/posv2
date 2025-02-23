import request from 'supertest';
import express from 'express';
import { signUp, loginUser, logoutUser, getProfile } from '../src/controllers/user.controller';
import db from '../models';
import { authentication, random } from '../src/helpers/index';
import { app } from '../index';

const MOCK_SALT = 'mock-salt';
const MOCK_HASH = 'hashed-password';

jest.mock('../models');
jest.mock('../src/helpers/index', () => ({
  random: jest.fn().mockReturnValue('mock-salt'),
  authentication: jest.fn().mockReturnValue('hashed-password')
}));


describe('Sign Up Controller', () => {
  beforeEach(() => {
    app.use(express.json());
    app.post('/api/signup', signUp);
    jest.clearAllMocks();
  });

  it('should successfully create a new user', async () => {
    const mockUserData = {
      username: 'testuser',
      password: 'password123',
      role: 'user'
    };

    const mockCreatedUser = {
      id: 1,
      username: 'testuser',
      role: 'user',
      salt: 'mock-salt',
      password: 'hashed-password',
      toJSON: () => ({
        id: 1,
        username: 'testuser',
        role: 'user'
      })
    };

    (db.User.findOne as jest.Mock).mockResolvedValue(null);

    (db.User.create as jest.Mock).mockResolvedValue(mockCreatedUser);

    const response = await request(app)
      .post('/api/signup')
      .send(mockUserData)
      .expect(200);

    expect(db.User.findOne).toHaveBeenCalledWith({
      where: { username: mockUserData.username }
    });

    expect(db.User.create).toHaveBeenCalledWith({
      username: mockUserData.username,
      password: 'hashed-password',
      salt: 'mock-salt',
      role: mockUserData.role
    });

    expect(response.body).toEqual({
      id: 1,
      username: 'testuser',
      role: 'user'
    });
  });

  it('should return 403 if username already exists', async () => {
    const existingUser = {
      id: 1,
      username: 'existinguser',
      role: 'user'
    };

    const mockUserData = {
      username: 'existinguser',
      password: 'password123',
      role: 'user'
    };

    (db.User.findOne as jest.Mock).mockResolvedValue(existingUser);

    const response = await request(app)
      .post('/api/signup')
      .send(mockUserData)
      .expect(403);

    expect(response.body).toEqual({
      message: "Already have an account? Login"
    });
    expect(db.User.create).not.toHaveBeenCalled();
  });

  it('should return 400 on validation error', async () => {
    (db.User.findOne as jest.Mock).mockRejectedValue(new Error('Validation error'));

    await request(app)
      .post('/api/signup')
      .send({
        username: 'testuser',
        password: 'password123',
        role: 'user'
      })
      .expect(400);
  });

  it('should handle missing required fields', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        username: 'testuser'
      })
      .expect(400);
  });

  it('should verify password hashing process', async () => {
    const mockUserData = {
      username: 'testuser',
      password: 'password123',
      role: 'user'
    };

    (db.User.findOne as jest.Mock).mockResolvedValue(null);

    await request(app)
      .post('/api/signup')
      .send(mockUserData);

    expect(random).toHaveBeenCalled();
    expect(authentication).toHaveBeenCalledWith('mock-salt', mockUserData.password);
  });
});

describe('Authentication Controllers', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post('/api/signup', signUp);
    app.post('/api/login', loginUser);
    jest.clearAllMocks();
  });

  describe('Sign Up Controller', () => {
    it('should successfully create a new user', async () => {
      const mockUserData = {
        username: 'testuser',
        password: 'password123',
        role: 'user'
      };

      const mockCreatedUser = {
        id: 1,
        username: 'testuser',
        role: 'user',
        salt: MOCK_SALT,
        password: MOCK_HASH,
        toJSON: () => ({
          id: 1,
          username: 'testuser',
          role: 'user'
        })
      };

      (db.User.findOne as jest.Mock).mockResolvedValue(null);
      (db.User.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const response = await request(app)
        .post('/api/signup')
        .send(mockUserData)
        .expect(200);

      expect(db.User.create).toHaveBeenCalledWith({
        username: mockUserData.username,
        password: MOCK_HASH,
        salt: MOCK_SALT,
        role: mockUserData.role
      });

      expect(response.body).toEqual({
        id: 1,
        username: 'testuser',
        role: 'user'
      });
    });

    it('should verify password hashing process', async () => {
      const mockUserData = {
        username: 'testuser',
        password: 'password123',
        role: 'user'
      };

      (db.User.findOne as jest.Mock).mockResolvedValue(null);

      await request(app)
        .post('/api/signup')
        .send(mockUserData);

      expect(random).toHaveBeenCalled();
      expect(authentication).toHaveBeenCalledWith(MOCK_SALT, mockUserData.password);
    });
  });

  describe('Login Controller', () => {
    it('should return 400 when user not found', async () => {
      (db.User.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'nonexistent',
          password: 'password123'
        });
      expect(response.status).toBe(400);
    });

    it('should successfully login user with valid credentials', async () => {
      const mockLoginData = {
        username: 'testuser',
        password: 'password123'
      };

      const mockUser = {
        id: 1,
        username: 'testuser',
        password: MOCK_HASH,
        salt: MOCK_SALT,
        sessionToken: null,
        save: jest.fn().mockResolvedValue(true),
        toJSON: () => ({
          id: 1,
          username: 'testuser',
          password: MOCK_HASH,
          salt: MOCK_SALT
        })
      };

      (db.User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/login')
        .send(mockLoginData)
        .expect(200);

      expect(response.body).toEqual({
        username: 'testuser'
      });

      expect(response.headers['set-cookie'][0]).toContain('AUTH-COOKIE');
    });
  });
});


describe('Logout Controller', () => {

  beforeEach(() => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
    app.post('/api/logout', logoutUser);

    app.use((err: any, req: any, res: any, next: any) => {
      console.error('Error:', err);
      res.status(500).json({ error: err.message });
    });
    app.use((req, res) => {
      console.log('404 for path:', req.path);
      res.status(404).send('Not found');
    });
  });

  it('should clear auth cookie and return success message', async () => {
    console.log('Mounted routes:',
      app._router.stack
        .filter((r: any) => r.route)
        .map((r: any) => `${Object.keys(r.route.methods)} ${r.route.path}`)
    );

    const expectedResponse = {
      message: 'You logged out!'
    };
    const response = await request(app)
      .post('/api/logout')
      .set('Cookie', ['AUTH-COOKIE=some-token']);

    console.log('Response:', {
      status: response.status,
      body: response.body,
      headers: response.headers
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);

    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toMatch(/AUTH-COOKIE=;/);
  });

  it('should return 200 even if no cookie exists', async () => {
    const response = await request(app)
      .post('/api/logout');
    console.log('Response:', {
      status: response.status,
      body: response.body
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'You logged out!'
    });
  });
});


describe('Get Profile Controller', () => {
  jest.mock('../models', () => ({
    db: {
      User: {
        findOne: jest.fn()
      }
    }
  }));

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword123',
    sessionToken: 'valid-session-token',
    salt: 'randomSalt123',
    toJSON: function () {
      return {
        id: this.id,
        email: this.email,
        name: this.name,
        password: this.password,
        sessionToken: this.sessionToken,
        salt: this.salt
      };
    }
  };

  beforeEach(() => {

    app.get('/api/profile', getProfile);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.unmock('../models');
  });

  it('should return user profile when valid session token is provided', async () => {
    // Arrange
    const mockDbResponse = mockUser;
    (db.User.findOne as jest.Mock).mockResolvedValue(mockDbResponse);

    const expectedResponse = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User'
    };

    // Act
    const response = await request(app)
      .get('/api/profile')
      .set('Cookie', ['AUTH-COOKIE=valid-session-token']);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('sessionToken');
    expect(response.body).not.toHaveProperty('salt');
    expect(db.User.findOne).toHaveBeenCalledWith({
      where: { sessionToken: 'valid-session-token' }
    });
  });

  it('should return 400 when user not found with session token', async () => {
    // Arrange
    (db.User.findOne as jest.Mock).mockResolvedValue(null);

    // Act
    const response = await request(app)
      .get('/api/profile')
      .set('Cookie', ['AUTH-COOKIE=invalid-session-token']);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'This user does not exist' });
    expect(db.User.findOne).toHaveBeenCalledWith({
      where: { sessionToken: 'invalid-session-token' }
    });
  });

  it('should return 403 when no session token provided', async () => {
    // Act
    const response = await request(app)
      .get('/api/profile');

    // Assert
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: 'Endpoint requires authentication' });
    expect(db.User.findOne).not.toHaveBeenCalled();
  });

  it('should return 500 when database error occurs', async () => {
    // Create an error that matches what express will serialize
    const mockError = {
      name: 'DatabaseError',
      message: 'Database error',
      stack: 'Error stack trace'
    };

    (db.User.findOne as jest.Mock).mockRejectedValue(mockError);

    const response = await request(app)
      .get('/api/profile')
      .set('Cookie', ['AUTH-COOKIE=valid-session-token']);

    expect(response.status).toBe(500);
    // Only check that we get a non-empty error object
    expect(response.body).toBeDefined();
    expect(Object.keys(response.body).length).toBeGreaterThan(0);
  });
});