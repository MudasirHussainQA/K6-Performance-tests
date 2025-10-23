import { group, sleep } from 'k6';
import { UserAPI, ContactAPI } from '../../utils/api';
import {
  generateRandomUser,
  generateRandomContact,
  checkResponse,
  checkErrorResponse,
  parseJsonResponse,
  logTest,
  logSuccess,
  randomSleep,
} from '../../utils/helpers';
import { config } from '../../config/config';
import { AuthResponse, ContactResponse } from '../../types';

// Test configuration
export const options = {
  scenarios: {
    negative_contact_test: config.scenarios.smoke,
  },
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<1'],
  },
};

/**
 * Main test execution for negative contact scenarios
 */
export default function (): void {
  let token: string | null = null;
  let validContactId: string | null = null;

  // Setup: Create user and login
  group('Setup - User Registration', () => {
    const userData = generateRandomUser();
    const registerResponse = UserAPI.register(userData);
    
    if (checkResponse(registerResponse, 'Register User', 201)) {
      const responseData = parseJsonResponse<AuthResponse>(registerResponse);
      if (responseData && responseData.token) {
        token = responseData.token;
      }
    }
    
    sleep(1);
  });

  if (!token) {
    return;
  }

  // Create a valid contact for later tests
  group('Setup - Create Valid Contact', () => {
    const contactData = generateRandomContact();
    const response = ContactAPI.add(token as string, contactData);
    
    if (checkResponse(response, 'Create Setup Contact', 201)) {
      const responseData = parseJsonResponse<ContactResponse>(response);
      if (responseData && responseData._id) {
        validContactId = responseData._id;
      }
    }
    
    sleep(1);
  });

  // Test: Add Contact Without Authentication
  group('Unauthorized Contact Operations', () => {
    group('Add Contact Without Token', () => {
      logTest('Adding contact without authentication');
      
      const contactData = generateRandomContact();
      const response = ContactAPI.add('', contactData);
      
      checkErrorResponse(response, 'Add Contact Without Auth', 401);
      sleep(1);
    });

    group('Get Contacts Without Token', () => {
      logTest('Getting contacts without authentication');
      
      const response = ContactAPI.getAll('');
      checkErrorResponse(response, 'Get Contacts Without Auth', 401);
      sleep(1);
    });
  });

  // Test: Add Contact with Invalid Data
  group('Add Contact - Invalid Data', () => {
    group('Missing Required Fields', () => {
      logTest('Adding contact without required fields');
      
      const invalidContact = {
        email: 'test@example.com',
        phone: '5551234567',
      };
      
      const response = ContactAPI.add(token as string, invalidContact);
      checkErrorResponse(response, 'Add Contact Missing FirstName', 400);
      sleep(1);
    });

    group('Invalid Email Format', () => {
      logTest('Adding contact with invalid email');
      
      const contactData = generateRandomContact();
      contactData.email = 'invalid-email';
      
      const response = ContactAPI.add(token as string, contactData);
      checkErrorResponse(response, 'Add Contact Invalid Email', 400);
      sleep(1);
    });

    group('Invalid Birthdate Format', () => {
      logTest('Adding contact with invalid birthdate');
      
      const contactData = generateRandomContact();
      contactData.birthdate = 'invalid-date';
      
      const response = ContactAPI.add(token as string, contactData);
      checkErrorResponse(response, 'Add Contact Invalid Birthdate', 400);
      sleep(1);
    });
  });

  // Test: Get Non-existent Contact
  group('Get Non-existent Contact', () => {
    logTest('Getting contact with invalid ID');
    
    const fakeContactId = '507f1f77bcf86cd799439011'; // Valid MongoDB ObjectId format but doesn't exist
    const response = ContactAPI.getById(token as string, fakeContactId);
    
    checkErrorResponse(response, 'Get Non-existent Contact', 404);
    sleep(1);
  });

  // Test: Update Non-existent Contact
  group('Update Non-existent Contact', () => {
    logTest('Updating contact with invalid ID');
    
    const fakeContactId = '507f1f77bcf86cd799439011';
    const contactData = generateRandomContact();
    const response = ContactAPI.update(token as string, fakeContactId, contactData);
    
    checkErrorResponse(response, 'Update Non-existent Contact', 404);
    sleep(1);
  });

  // Test: Update with Invalid Data
  if (validContactId) {
    group('Update Contact - Invalid Data', () => {
      logTest('Updating contact with invalid email');
      
      const invalidUpdate = {
        firstName: 'Valid',
        lastName: 'Name',
        email: 'invalid-email-format',
        birthdate: '1990-01-01',
        phone: '5551234567',
        street1: '123 Main St',
        street2: '',
        city: 'City',
        stateProvince: 'ST',
        postalCode: '12345',
        country: 'USA',
      };
      
      const response = ContactAPI.update(token as string, validContactId as string, invalidUpdate);
      checkErrorResponse(response, 'Update Contact Invalid Data', 400);
      sleep(1);
    });
  }

  // Test: Delete Non-existent Contact
  group('Delete Non-existent Contact', () => {
    logTest('Deleting contact with invalid ID');
    
    const fakeContactId = '507f1f77bcf86cd799439011';
    const response = ContactAPI.delete(token as string, fakeContactId);
    
    checkErrorResponse(response, 'Delete Non-existent Contact', 404);
    sleep(1);
  });

  // Test: Delete Contact Without Authentication
  group('Delete Contact Without Token', () => {
    logTest('Deleting contact without authentication');
    
    if (validContactId) {
      const response = ContactAPI.delete('', validContactId as string);
      checkErrorResponse(response, 'Delete Contact Without Auth', 401);
      sleep(1);
    }
  });

  // Test: Access Another User's Contact
  group('Cross-User Access Test', () => {
    logTest('Attempting to access another user\'s contact');
    
    // Create a second user
    const user2Data = generateRandomUser();
    const user2Response = UserAPI.register(user2Data);
    
    if (checkResponse(user2Response, 'Register Second User', 201)) {
      const user2ResponseData = parseJsonResponse<AuthResponse>(user2Response);
      const user2Token = user2ResponseData?.token;
      
      sleep(1);
      
      if (user2Token && validContactId) {
        // Try to access first user's contact with second user's token
        const response = ContactAPI.getById(user2Token, validContactId as string);
        checkErrorResponse(response, 'Access Another User Contact', 404);
      }
    }
    
    sleep(1);
  });

  randomSleep(1, 2);
}

/**
 * Setup function
 */
export function setup(): Record<string, never> {
  console.log('🚀 Starting Negative Contact Tests...');
  console.log(`📍 Base URL: ${config.baseUrl}`);
  return {};
}

/**
 * Teardown function
 */
export function teardown(_data: Record<string, never>): void {
  console.log('✅ Negative Contact Tests Completed!');
}

