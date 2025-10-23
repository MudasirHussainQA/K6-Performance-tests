import { group, sleep } from 'k6';
import { UserAPI } from '../../utils/api';
import {
  generateRandomUser,
  generateRandomEmail,
  checkErrorResponse,
  parseJsonResponse,
  logTest,
  logSuccess,
  randomSleep,
} from '../../utils/helpers';
import { config } from '../../config/config';

// Test configuration
export const options = {
  scenarios: {
    negative_auth_test: config.scenarios.smoke,
  },
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<1'], // Allow more failures for negative tests
  },
};

/**
 * Main test execution for negative scenarios
 */
export default function (): void {
  // Test Registration with Invalid Data
  group('Registration - Negative Tests', () => {
    // Test: Missing required fields
    group('Missing Required Fields', () => {
      logTest('Registration with missing email');
      
      const invalidUser = {
        firstName: 'Test',
        lastName: 'User',
        password: 'Password123!',
      };
      
      const response = UserAPI.register(invalidUser as any);
      checkErrorResponse(response, 'Registration without email', 400);
      
      sleep(1);
    });

    // Test: Invalid email format
    group('Invalid Email Format', () => {
      logTest('Registration with invalid email format');
      
      const userData = generateRandomUser();
      userData.email = 'invalid-email-format';
      
      const response = UserAPI.register(userData);
      checkErrorResponse(response, 'Registration with invalid email', 400);
      
      sleep(1);
    });

    // Test: Weak password
    group('Weak Password', () => {
      logTest('Registration with weak password');
      
      const userData = generateRandomUser();
      userData.password = '123'; // Too short
      
      const response = UserAPI.register(userData);
      checkErrorResponse(response, 'Registration with weak password', 400);
      
      sleep(1);
    });

    // Test: Duplicate registration
    group('Duplicate Registration', () => {
      logTest('Duplicate user registration');
      
      const userData = generateRandomUser();
      
      // First registration
      let response = UserAPI.register(userData);
      
      // Try to register again with same email
      sleep(1);
      response = UserAPI.register(userData);
      checkErrorResponse(response, 'Duplicate registration', 400);
      
      sleep(1);
    });
  });

  // Test Login with Invalid Credentials
  group('Login - Negative Tests', () => {
    // Test: Invalid email
    group('Invalid Email', () => {
      logTest('Login with non-existent email');
      
      const response = UserAPI.login(generateRandomEmail(), 'Password123!');
      checkErrorResponse(response, 'Login with invalid email', 401);
      
      sleep(1);
    });

    // Test: Wrong password
    group('Wrong Password', () => {
      logTest('Login with wrong password');
      
      // First create a user
      const userData = generateRandomUser();
      const registerResponse = UserAPI.register(userData);
      
      sleep(1);
      
      // Try to login with wrong password
      const response = UserAPI.login(userData.email, 'WrongPassword123!');
      checkErrorResponse(response, 'Login with wrong password', 401);
      
      sleep(1);
    });

    // Test: Missing credentials
    group('Missing Credentials', () => {
      logTest('Login without password');
      
      const response = UserAPI.login('test@example.com', '');
      checkErrorResponse(response, 'Login without password', 400);
      
      sleep(1);
    });
  });

  // Test Profile Access without Token
  group('Unauthorized Access Tests', () => {
    group('Access Profile Without Token', () => {
      logTest('Get profile without authentication token');
      
      const response = UserAPI.getProfile('');
      checkErrorResponse(response, 'Access without token', 401);
      
      sleep(1);
    });

    group('Access Profile With Invalid Token', () => {
      logTest('Get profile with invalid token');
      
      const response = UserAPI.getProfile('invalid-token-12345');
      checkErrorResponse(response, 'Access with invalid token', 401);
      
      sleep(1);
    });
  });

  randomSleep(1, 2);
}

/**
 * Setup function
 */
export function setup(): Record<string, never> {
  console.log('🚀 Starting Negative Authentication Tests...');
  console.log(`📍 Base URL: ${config.baseUrl}`);
  return {};
}

/**
 * Teardown function
 */
export function teardown(_data: Record<string, never>): void {
  console.log('✅ Negative Authentication Tests Completed!');
}

