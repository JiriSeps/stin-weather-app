// Import necessary libraries
import React from 'react';
import { render, fireEvent, waitFor, act} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import App from './App.js'; // Assuming App component is in the same directory

const { JSDOM } = require('jsdom');
const { window } = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
  <input id="username" value="">
  <input id="password" value="">
</body>
</html>
`);

const { document } = window;
global.document = document;
global.alert = jest.fn();

jest.mock('axios');
// Mock functions and variables
let usersData = [];
const setHead = jest.fn();
const handlePayment = jest.fn();
const payment = 'payment';
const setState = jest.fn();
const useStateSpy = jest.spyOn(React, 'useState');
useStateSpy.mockImplementation((init) => [init, setState]);

// Integration tests for App component
describe('App component', () => {
  afterEach(() => {
    jest.restoreAllMocks(); // Restore original implementations of mocked functions
  });

  test('handles login correctly', async () => {
    // Mock setUser function
    const setUserMock = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValue(['', setUserMock]);

    // Mock axios post method to return a successful login response
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    const { getByText, getByPlaceholderText } = render(<App />);

    // Mock user input
    const usernameInput = getByPlaceholderText('Uživatelské jméno');
    const passwordInput = getByPlaceholderText('Heslo');
    fireEvent.change(usernameInput, { target: { value: 'username' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    // Trigger login button click
    fireEvent.click(getByText('Přihlásit se'));

    // Wait for login request to complete
    await waitFor(async () => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8081/login', {
        username: 'username',
        password: 'password',
      });
    });

    // Assert that the setUser function was called with the expected value
   //expect(setUserMock).toHaveBeenCalledWith(''); // Změněno na 'testUser'
  });
});

describe('handlePayment', () => {
  test('it should handle payment with valid inputs', () => {
    // Mocking window.alert
    window.alert = jest.fn();

    // Call the function
    handlePayment('username', 'password');

    // Assert the axios.post call
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8081/register', {
      username: 'username',
      password: 'password',
    });

    // Resolve the axios promise
    return Promise.resolve().then(() => {
      // Assert the alert
      expect(window.alert).toHaveBeenCalledWith('Registration successful!');
    });
  });

  // Write more test cases for other scenarios
});

describe('handleRegistration', () => {
  test('it should handle registration with unique username', () => {
    // Mocking window.alert
    window.alert = jest.fn();

    // Mocking document.getElementById
    document.getElementById = jest.fn(() => ({
      value: 'newUser',
    }));

    // Call the function
    handleRegistration();

    // Assert the setHead function call
    expect(setHead).toHaveBeenCalledWith(payment);
  });

  // Write more test cases for other scenarios
});

describe('fetch historical weather data', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        daily: {
          temperature_2m_max: 20,
          temperature_2m_min: 10,
          precipitation_sum: 5,
          rain_sum: 2,
          showers_sum: 1,
          snowfall_sum: 2
        }
      })
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches and updates weather history correctly', async () => {
    const { waitFor } = render(<App />);
    
    // Wait for the component to fetch and update weather history
    await waitFor(() => {
      // Check if weather history is updated correctly
      // Add your assertions here based on the expected state after fetching weather history
    });
  });

  it('handles error when fetching weather history', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error output
    
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false
    });
    
    const { findByText } = render(<App />);
    
    // Check if error message is displayed to the user
    const errorMessage = await findByText('An error occurred while fetching weather history.');
    expect(errorMessage).toBeInTheDocument();
  });
});

describe('handleKeyDown function', () => {
  it('should update searchedCity state when Enter key is pressed', () => {
    const { getByPlaceholderText } = render(<App />);
    const inputElement = getByPlaceholderText('Zadejte město');

    // Simulate typing into the input element
    fireEvent.change(inputElement, { target: { value: 'Prague' } });

    // Simulate pressing Enter key
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Assert that searchedCity state is updated correctly
    expect(inputElement.value).toBe('');
    // You may want to assert other things depending on your implementation
  });
});

describe('handlePayment function', () => {
  it('should handle payment successfully', async () => {
    // Render the App component
    const { getByText, getByPlaceholderText, getByLabelText } = render(<App />);

    // Mock user input for username and password
    const usernameInput = getByPlaceholderText('Uživatelské jméno');
    const passwordInput = getByPlaceholderText('Heslo');
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger registration button click
    const registrationButton = getByText('Registrovat');
    fireEvent.click(registrationButton);

    // Mock user input for card number, validity, and cvc
    const cardInput = getByPlaceholderText('Číslo karty');
    const validInput = getByPlaceholderText('Platnost karty');
    const cvcInput = getByPlaceholderText('CVC');
    fireEvent.change(cardInput, { target: { value: '1234 5678 9012 3456' } });
    fireEvent.change(validInput, { target: { value: '12/23' } });
    fireEvent.change(cvcInput, { target: { value: '123' } });

    // Trigger payment button click
    const paymentButton = getByText('Zaplatit');
    fireEvent.click(paymentButton);

    // Wait for payment request to complete
    await waitFor(() => {
      // Assert that axios.post is called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8081/register', {
        username: 'testUser',
        password: 'testPassword',
      });

      // Mock the response from the server
      axios.post.mockResolvedValueOnce({ status: 201 });

      // Assert that the successful registration alert is shown
      expect(window.alert).toHaveBeenCalledWith('Registration successful!');
    });
  });
});

describe('selectFavs function', () => {
  it('should set favorites successfully and update searchedCity on select change', async () => {
    // Mock usersData
    const usersData = [
      { username: 'testUser', favorites: ['New York', 'London', 'Paris'] }
    ];

    // Render the App component
    const { getByText, getByDisplayValue } = render(<App />);

    // Mock axios post method to return a successful response
    axios.post.mockResolvedValueOnce({ data: { message: 'Favorites set successfully' } });

    // Trigger selectFavs function
    fireEvent.click(getByText('Set Favorites'));

    // Simulate user selecting an option from the dropdown
    const selectElement = getByDisplayValue('');
    fireEvent.change(selectElement, { target: { value: 'London' } });

    // Assert that the searchedCity state is updated correctly
    expect(selectElement.value).toBe('London');

    // Wait for axios request to complete
    await waitFor(() => {
      // Assert that axios.post is called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8081/set-favorites', {
        username: '',
        favorite: 'London'
      });

      // Assert that the UI or success message is updated accordingly (optional)
      // For example:
      // expect(getByText('Favorites set successfully')).toBeInTheDocument();
    });
  });
});

describe('handleLogin function', () => {
  it('should handle login failure and display error message', async () => {
    // Render the App component
    const { getByPlaceholderText, getByText } = render(<App />);

    // Mock axios post method to return a rejected promise (simulate login failure)
    axios.post.mockRejectedValue(new Error('Network error'));

    // Trigger login function
    const usernameInput = getByPlaceholderText('Uživatelské jméno');
    const passwordInput = getByPlaceholderText('Heslo');
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.click(getByText('Přihlásit se'));

    // Wait for the error message to be displayed
    await waitFor(() => {
      // Assert that the error message is displayed
      expect(getByText('An error occurred during registration.')).toBeInTheDocument();
    });
  });
});

describe('handleRegistration function', () => {
  it('should display an alert when the username already exists', () => {
    // Spy on the window.alert function
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();

    // Render the App component
    const { getByText } = render(<App />);

    // Mock the usersData within the component
    jest.spyOn(React, 'useState').mockReturnValueOnce(['existingUser', jest.fn()]);

    // Trigger registration with an existing username
    fireEvent.click(getByText('Registrovat'));

    // Assert that the alert message is displayed
    expect(alertSpy).toHaveBeenCalledWith("An account with the same username already exists. Please choose a different username.");

    // Restore the original implementation of window.alert
    alertSpy.mockRestore();
  });

  it('should proceed to registration when the username does not exist', () => {
    // Render the App component
    const { getByText } = render(<App />);

    // Mock the usersData within the component
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', jest.fn()]);

    // Trigger registration with a new username
    fireEvent.click(getByText('Registrovat'));

    // Assert that the registration proceeds (e.g., by checking the next screen or behavior)
    // Add assertions here as per your specific application logic
  });
});

describe('handleMenuToggle function', () => {
  it('should toggle the menuOpen state when the menu icon is clicked', () => {
    // Render the App component
    const { getByAltText } = render(<App />);

    // Find the menu icon by alt text
    const menuIcon = getByAltText('Hamburger Menu');

    // Initially, the menu should be closed
    // Assert that the menuOpen state is false
    // You can adjust the assertion based on your actual implementation
    // For example, you might check for a CSS class that indicates the menu state
    // const blockElement = getByClassName('block'); // Assuming some element contains the menu
    // expect(blockElement).not.toHaveClass('menu-open'); // Example assertion

    // Trigger click on the menu icon
    fireEvent.click(menuIcon);

    // After the click, the menu should be open
    // Assert that the menuOpen state is true
    // Adjust the assertion according to your actual implementation
    // expect(blockElement).toHaveClass('menu-open'); // Example assertion
  });
});

describe('useWeatherData hook', () => {
  it('should throw an error if network response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({ error: 'Failed to fetch data' }),
    });

    const { result } = renderHook(() => useWeatherData());
    await act(async () => {
      await result.current.fetchData();
    });

    // Assert that the hook throws the expected error
    expect(result.error).toEqual(new Error('Network response was not ok'));
  });
});

// describe('App functions', () => {
//   describe('setFavs', () => {
//     it('should call axios.post with correct parameters', async () => {
//       const mockedResponse = { data: { message: 'Favorites set successfully' } };
//       axios.post.mockResolvedValue(mockedResponse);

//       await setFavs();

//       expect(axios.post).toHaveBeenCalledWith('http://localhost:8081/set-favorites', {
//         username: expect.any(String),
//         favorite: expect.any(String)
//       });
//     });
//   });

//   describe('selectFavs', () => {
//     it('should set favorites correctly', () => {
//       // Mock user data
//       const mockedUserData = [{ username: 'testUser', favorites: ['London', 'Paris'] }];
//       jest.mock('./users.json', () => mockedUserData);

//       // Render selectFavs function output
//       const { getByTestId } = render(selectFavs());

//       // Simulate change event
//       fireEvent.change(getByTestId('favorites-select'), { target: { value: 'London' } });

//       // Check if setSearchedCity has been called with the correct value
//       expect(setSearchedCity).toHaveBeenCalledWith('London');
//     });
//   });

//   // Add more tests for other functions if needed
// });
