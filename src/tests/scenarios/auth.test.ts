import { group, sleep } from 'k6';
import { UserAPI } from '../../utils/api';
import {
  generateRandomUser,
  checkResponse,
  parseJsonResponse,
  logTest,
  logSuccess,
  logError,
  randomSleep,
} from '../../utils/helpers';
import { config } from '../../config/config';
import { AuthResponse, UserResponse } from '../../types';

// Test configuration
export const options = {
  scenarios: {
    auth_test: config.scenarios.smoke,
  },
  thresholds: config.thresholds,
};

/**
 * Main test execution
 */
export default function (): void {
  const userData = generateRandomUser();
  let token: string | null = null;
  let userId: string | null = null;

  // Test User Registration
  group('User Registration', () => {
    logTest('User Registration', `- Email: ${userData.email}`);
    
    const response = UserAPI.register(userData);
    
    if (checkResponse(response, 'User Registration', 201)) {
      const responseData = parseJsonResponse<AuthResponse>(response);
      if (responseData && responseData.user) {
        userId = responseData.user._id;
        token = responseData.token;
        logSuccess(`User registered successfully with ID: ${userId}`);
      }
    }
    
    sleep(1);
  });

  // Test User Login
  group('User Login', () => {
    logTest('User Login', `- Email: ${userData.email}`);
    
    const response = UserAPI.login(userData.email, userData.password);
    
    if (checkResponse(response, 'User Login', 200)) {
      const responseData = parseJsonResponse<AuthResponse>(response);
      if (responseData && responseData.token) {
        token = responseData.token;
        logSuccess('User logged in successfully');
      }
    }
    
    sleep(1);
  });

  // Test Get User Profile
  if (token) {
    group('Get User Profile', () => {
      logTest('Get User Profile');
      
      const response = UserAPI.getProfile(token as string);
      
      if (checkResponse(response, 'Get User Profile', 200)) {
        const responseData = parseJsonResponse<UserResponse>(response);
        if (responseData) {
          logSuccess(`Retrieved profile for: ${responseData.firstName} ${responseData.lastName}`);
        }
      }
      
      sleep(1);
    });

    // Test Update User Profile
    group('Update User Profile', () => {
      logTest('Update User Profile');
      
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };
      
      const response = UserAPI.updateProfile(token as string, updateData);
      
      if (checkResponse(response, 'Update User Profile', 200)) {
        logSuccess('User profile updated successfully');
      }
      
      sleep(1);
    });

    // Test User Logout
    group('User Logout', () => {
      logTest('User Logout');
      
      const response = UserAPI.logout(token as string);
      
      if (checkResponse(response, 'User Logout', 200)) {
        logSuccess('User logged out successfully');
      }
      
      sleep(1);
    });
  }

  randomSleep(1, 3);
}

/**
 * Setup function - runs once before all tests
 */
export function setup(): Record<string, never> {
  console.log('🚀 Starting Authentication Tests...');
  console.log(`📍 Base URL: ${config.baseUrl}`);
  return {};
}

/**
 * Teardown function - runs once after all tests
 */
export function teardown(_data: Record<string, never>): void {
  console.log('✅ Authentication Tests Completed!');
}

