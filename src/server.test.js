const request = require('supertest');
const bcrypt = require('bcrypt');
const fs = require('fs');
const app = require('./server.js');

describe('Registration endpoint', () => {
  test('it should register a new user', async () => {
    const newUser = {
      username: 'testuser1',
      password: 'testpassword',
    };

    const response = await request(app)
      .post('/register')
      .send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ message: 'Registration successful.' });
  });
});

describe('Login endpoint', () => {
  test('it should log in an existing user', async () => {
    const existingUser = {
      username: 'testuser1',
      password: 'testpassword',
    };

    const response = await request(app)
      .post('/login')
      .send(existingUser);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true, message: 'Login successful.' });
  });
});

describe('Set favorites endpoint', () => {
  test('it should set favorites for an existing user', async () => {
    const existingUser = {
      username: 'testuser1',
      favorite: 'Paris',
    };

    const response = await request(app)
      .post('/set-favorites')
      .send(existingUser);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Favorites updated successfully.' });
  });
});

// Cleanup after testing
afterAll(() => {
// Remove the user.json file created during testing
fs.unlinkSync('users.json');
});

describe('CORS Middleware Setup', () => {
  test('it should include CORS headers in response', async () => {
    const response = await request(app)
      .get('/test-cors') // Define a test route that echoes back headers
      .set('Origin', 'http://example.com') // Set an example Origin header
      .set('Access-Control-Request-Method', 'GET'); // Set an example Access-Control-Request-Method header

    expect(response.headers['access-control-allow-origin']).toBe('*');
    // Add more assertions for other CORS headers as needed
  });
});

describe('Registration Endpoint - Input Validation', () => {
  test('it should return a 400 error if username is missing', async () => {
    const response = await request(app)
      .post('/register')
      .send({ password: 'testpassword' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Username and password are required.');
  });

  test('it should return a 400 error if password is missing', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Username and password are required.');
  });
});

describe('Registration Endpoint - File IO Error Handling', () => {
  test('it should return a 500 error if there is an error writing the users file', async () => {
    // Stubbing the fs.writeFile function to simulate an error
    jest.spyOn(fs, 'writeFile').mockImplementation((path, data, callback) => {
      callback(new Error('Mock writeFile error'));
    });

    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal server error.');

    // Restore the original implementation of fs.writeFile after the test
    fs.writeFile.mockRestore();
  });

  test('it should return a 500 error if there is an error reading the users file', async () => {
    // Stubbing the fs.readFile function to simulate an error
    jest.spyOn(fs, 'readFile').mockImplementation((path, encoding, callback) => {
      callback(new Error('Mock readFile error'));
    });

    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal server error.');

    // Restore the original implementation of fs.readFile after the test
    fs.readFile.mockRestore();
  });
});

describe('Error Handling and Response Generation', () => {
  test('it should return a 400 error if username or password is missing in the register endpoint', async () => {
    const response = await request(app)
      .post('/register')
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Username and password are required.');
  });

  test('it should return a 401 error if username does not exist in the login endpoint', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'nonexistentuser', password: 'testpassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid username or password.');
  });

  test('it should return a 404 error if username does not exist in the set-favorites endpoint', async () => {
    const response = await request(app)
      .post('/set-favorites')
      .send({ username: 'nonexistentuser', favorite: 'Paris' });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found.');
  });

  test('it should return a 400 error if username or favorite is missing in the set-favorites endpoint', async () => {
    const response = await request(app)
      .post('/set-favorites')
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Username and favorite location are required.');
  });
});

describe('Registration and Login', () => {
  // Increase timeout for this test
  test('it should return a 500 error if there is an error hashing password in the register endpoint', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce((data, saltRounds, callback) => {
      callback(new Error('Test error'));
    });

    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal server error.');
  }, 10000); // Increased timeout to 10 seconds

  // Increase timeout for this test
  test('it should return a 400 error if username already exists in the register endpoint', async () => {
    jest.spyOn(fs, 'readFile').mockImplementationOnce((path, encoding, callback) => {
      callback(null, JSON.stringify([{ username: 'existinguser', password: 'hashedpassword', favorites: [] }]));
    });

    const response = await request(app)
      .post('/register')
      .send({ username: 'existinguser', password: 'testpassword' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Username already exists.');
  }, 10000); // Increased timeout to 10 seconds
});

describe('Login Endpoint', () => {
  test('it should return a 401 error if username does not exist in the login endpoint', async () => {
    jest.spyOn(fs, 'readFile').mockImplementationOnce((path, encoding, callback) => {
      callback(null, '[]');
    });

    const response = await request(app)
      .post('/login')
      .send({ username: 'nonexistentuser', password: 'testpassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid username or password.');
  });

  test('it should return a 500 error if there is an error comparing passwords in the login endpoint', async () => {
    jest.spyOn(fs, 'readFile').mockImplementationOnce((path, encoding, callback) => {
      callback(null, '[{"username":"testuser","password":"testpassword"}]');
    });

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce((password, hashedPassword, callback) => {
      callback(new Error('Test error'));
    });

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal server error.');
  });

  test('it should return a 401 error if password is incorrect in the login endpoint', async () => {
    jest.spyOn(fs, 'readFile').mockImplementationOnce((path, encoding, callback) => {
      callback(null, '[{"username":"testuser","password":"testpassword"}]');
    });

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce((password, hashedPassword, callback) => {
      callback(null, false);
    });

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'incorrectpassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid username or password.');
  });

  test('it should return a 200 status if login is successful in the login endpoint', async () => {
    jest.spyOn(fs, 'readFile').mockImplementationOnce((path, encoding, callback) => {
      callback(null, '[{"username":"testuser","password":"testpassword"}]');
    });

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce((password, hashedPassword, callback) => {
      callback(null, true);
    });

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Login successful.');
  });
});

describe('Set Favorites Endpoint', () => {
  test('it should return a 500 error if there is an error reading users file', async () => {
    jest.spyOn(fs, 'readFile').mockImplementationOnce((path, encoding, callback) => {
      callback(new Error('Test error'));
    });

    const response = await request(app)
      .post('/set-favorites')
      .send({ username: 'testuser', favorite: 'Paris' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal server error.');
  });

  test('it should return a 404 error if user is not found', async () => {
    jest.spyOn(fs, 'readFile').mockImplementationOnce((path, encoding, callback) => {
      callback(null, '[]');
    });

    const response = await request(app)
      .post('/set-favorites')
      .send({ username: 'nonexistentuser', favorite: 'Paris' });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found.');
  });
});

describe('Error Handling in Endpoints', () => {
  jest.setTimeout(10000);

  // Test for error parsing users JSON in the login endpoint
  test('it should return a 500 error if there is an error parsing users JSON in the login endpoint', async () => {
    jest.spyOn(fs, 'readFile').mockImplementationOnce((path, encoding, callback) => {
      callback(null, 'invalid json');
    });

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal server error.');
  });

  // Test for error parsing users JSON in the set-favorites endpoint
  test('it should return a 500 error if there is an error parsing users JSON in the set-favorites endpoint', async () => {
    jest.spyOn(fs, 'readFile').mockImplementationOnce((path, encoding, callback) => {
      callback(null, 'invalid json');
    });

    const response = await request(app)
      .post('/set-favorites')
      .send({ username: 'testuser', favorite: 'testlocation' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal server error.');
  });

  // Test for error writing users file in the set-favorites endpoint
  test('it should return a 500 error if there is an error writing users file in the set-favorites endpoint', async () => {
    jest.spyOn(fs, 'readFile').mockImplementationOnce((path, encoding, callback) => {
      callback(null, JSON.stringify([{ username: 'testuser', password: 'hashedpassword', favorites: [] }]));
    });

    jest.spyOn(fs, 'writeFile').mockImplementationOnce((path, data, callback) => {
      callback(new Error('Test write error'));
    });

    const response = await request(app)
      .post('/set-favorites')
      .send({ username: 'testuser', favorite: 'testlocation' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal server error.');
  });
});

describe('Error Handling and Validation in Endpoints', () => {
  jest.setTimeout(10000);

  // Test for error parsing users JSON in the register endpoint
  test('it should return a 500 error if there is an error parsing users JSON in the register endpoint', async () => {
    jest.spyOn(fs, 'readFile').mockImplementationOnce((path, encoding, callback) => {
      callback(null, 'invalid json');
    });

    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal server error.');
  });

  // Test for missing username or password in the login endpoint
  test('it should return a 400 error if username or password is missing in the login endpoint', async () => {
    let response = await request(app)
      .post('/login')
      .send({ username: '', password: 'testpassword' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Username and password are required.');

    response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: '' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Username and password are required.');
  });

  // Test for error reading users file in the login endpoint
  test('it should return a 500 error if there is an error reading users file in the login endpoint', async () => {
    jest.spyOn(fs, 'readFile').mockImplementationOnce((path, encoding, callback) => {
      callback(new Error('Test read error'));
    });

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal server error.');
  });
});

describe('Registration Endpoint Error Handling', () => {
  // Increase the default timeout for all tests in this suite
  jest.setTimeout(20000);

  // Test for error writing users file in the register endpoint (lines 37-38)
  test('it should return a 500 error if there is an error writing users file in the register endpoint', async () => {
    jest.spyOn(fs, 'readFile').mockImplementationOnce((path, encoding, callback) => {
      const err = new Error('File not found');
      err.code = 'ENOENT';
      callback(err);
    });

    jest.spyOn(fs, 'writeFile').mockImplementationOnce((path, data, callback) => {
      callback(new Error('Test write error'));
    });

    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal server error.');
  });
});


