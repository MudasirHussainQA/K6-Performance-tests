/**
 * Main K6 Test Orchestrator for Contact List API
 * 
 * This script orchestrates complete end-to-end testing including:
 * - User authentication flow
 * - Contact CRUD operations
 * - Performance testing with configurable scenarios
 */

import { group, sleep } from 'k6';
import { UserAPI, ContactAPI } from '../utils/api';
import {
  generateRandomUser,
  generateRandomContact,
  checkResponse,
  parseJsonResponse,
  logTest,
  logSuccess,
  logError,
  randomSleep,
} from '../utils/helpers';
import { config } from '../config/config';
import { AuthResponse, ContactResponse, UserResponse } from '../types';

// Get test type from environment or default to smoke
const TEST_TYPE = __ENV.TEST_TYPE || 'smoke';

// Test configuration based on test type
export const options = {
  scenarios: {
    default: (config.scenarios as any)[TEST_TYPE] || config.scenarios.smoke,
  },
  thresholds: config.thresholds,
};

interface SetupData {
  startTime: number;
  testType: string;
}

/**
 * Main test execution
 */
export default function (): void {
  let token: string | null = null;
  let userId: string | null = null;
  const contactIds: string[] = [];

  // ===== AUTHENTICATION FLOW =====
  group('01. User Registration and Authentication', () => {
    const userData = generateRandomUser();
    
    // Register new user
    logTest('User Registration', `- Email: ${userData.email}`);
    const registerResponse = UserAPI.register(userData);
    
    if (checkResponse(registerResponse, 'User Registration', 201)) {
      const responseData = parseJsonResponse<AuthResponse>(registerResponse);
      if (responseData && responseData.token) {
        token = responseData.token;
        userId = responseData.user?._id;
        logSuccess(`User registered - ID: ${userId}`);
      }
    } else {
      logError('Failed to register user. Skipping remaining tests.');
      return;
    }
    
    sleep(1);
    
    // Login with the same credentials
    logTest('User Login', `- Email: ${userData.email}`);
    const loginResponse = UserAPI.login(userData.email, userData.password);
    
    if (checkResponse(loginResponse, 'User Login', 200)) {
      const responseData = parseJsonResponse<AuthResponse>(loginResponse);
      if (responseData && responseData.token) {
        token = responseData.token; // Update token from login
        logSuccess('User logged in successfully');
      }
    }
    
    sleep(1);
  });

  if (!token) {
    logError('No authentication token available. Aborting tests.');
    return;
  }

  // ===== USER PROFILE MANAGEMENT =====
  group('02. User Profile Management', () => {
    // Get user profile
    logTest('Get User Profile');
    const profileResponse = UserAPI.getProfile(token as string);
    
    if (checkResponse(profileResponse, 'Get User Profile', 200)) {
      const profileData = parseJsonResponse<UserResponse>(profileResponse);
      if (profileData) {
        logSuccess(`Profile: ${profileData.firstName} ${profileData.lastName}`);
      }
    }
    
    sleep(1);
    
    // Update user profile
    logTest('Update User Profile');
    const updateData = {
      firstName: 'Updated',
      lastName: 'User',
    };
    
    const updateResponse = UserAPI.updateProfile(token as string, updateData);
    checkResponse(updateResponse, 'Update User Profile', 200);
    
    sleep(1);
  });

  // ===== CONTACT MANAGEMENT =====
  group('03. Contact Creation', () => {
    logTest('Creating multiple contacts');
    
    // Create 5 contacts
    const numberOfContacts = 5;
    
    for (let i = 0; i < numberOfContacts; i++) {
      const contactData = generateRandomContact();
      const response = ContactAPI.add(token as string, contactData);
      
      if (checkResponse(response, `Create Contact ${i + 1}`, 201)) {
        const responseData = parseJsonResponse<ContactResponse>(response);
        if (responseData && responseData._id) {
          contactIds.push(responseData._id);
        }
      }
      
      sleep(0.5);
    }
    
    logSuccess(`Created ${contactIds.length} contacts`);
    sleep(1);
  });

  group('04. Contact Retrieval', () => {
    // Get all contacts
    logTest('Get All Contacts');
    const allContactsResponse = ContactAPI.getAll(token as string);
    
    if (checkResponse(allContactsResponse, 'Get All Contacts', 200)) {
      const contacts = parseJsonResponse<ContactResponse[]>(allContactsResponse);
      if (contacts && Array.isArray(contacts)) {
        logSuccess(`Retrieved ${contacts.length} contacts`);
      }
    }
    
    sleep(1);
    
    // Get individual contacts
    if (contactIds.length > 0) {
      logTest('Get Individual Contacts');
      
      for (let i = 0; i < Math.min(3, contactIds.length); i++) {
        const contactId = contactIds[i];
        const response = ContactAPI.getById(token as string, contactId);
        
        if (checkResponse(response, `Get Contact ${i + 1}`, 200)) {
          const contact = parseJsonResponse<ContactResponse>(response);
          if (contact) {
            logSuccess(`Retrieved: ${contact.firstName} ${contact.lastName}`);
          }
        }
        
        sleep(0.5);
      }
    }
    
    sleep(1);
  });

  group('05. Contact Updates', () => {
    if (contactIds.length > 0) {
      const contactId = contactIds[0];
      
      // Full update (PUT)
      logTest('Full Contact Update (PUT)');
      const updatedContact = generateRandomContact();
      const putResponse = ContactAPI.update(token as string, contactId, updatedContact);
      checkResponse(putResponse, 'Update Contact (PUT)', 200);
      
      sleep(1);
      
      // Partial update (PATCH)
      logTest('Partial Contact Update (PATCH)');
      const partialUpdate = {
        phone: '555-999-8888',
        city: 'Updated City',
      };
      const patchResponse = ContactAPI.partialUpdate(token as string, contactId, partialUpdate);
      checkResponse(patchResponse, 'Update Contact (PATCH)', 200);
      
      sleep(1);
    }
  });

  group('06. Contact Deletion', () => {
    if (contactIds.length > 0) {
      logTest('Deleting contacts');
      
      let deletedCount = 0;
      
      // Delete all created contacts
      for (const contactId of contactIds) {
        const response = ContactAPI.delete(token as string, contactId);
        
        if (checkResponse(response, 'Delete Contact', 200)) {
          deletedCount++;
        }
        
        sleep(0.5);
      }
      
      logSuccess(`Deleted ${deletedCount} contact(s)`);
      sleep(1);
    }
  });

  group('07. Verification After Deletion', () => {
    logTest('Verify contacts were deleted');
    
    const allContactsResponse = ContactAPI.getAll(token as string);
    
    if (checkResponse(allContactsResponse, 'Get All Contacts', 200)) {
      const contacts = parseJsonResponse<ContactResponse[]>(allContactsResponse);
      if (contacts && Array.isArray(contacts)) {
        logSuccess(`Remaining contacts: ${contacts.length}`);
      }
    }
    
    sleep(1);
  });

  // ===== CLEANUP =====
  group('08. Cleanup and Logout', () => {
    logTest('User Logout');
    const logoutResponse = UserAPI.logout(token as string);
    checkResponse(logoutResponse, 'User Logout', 200);
    
    sleep(1);
  });

  // Random sleep between iterations
  randomSleep(1, 3);
}

/**
 * Setup function - runs once before all tests
 */
export function setup(): SetupData {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       K6 Contact List API - Performance Test Suite         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Test Type: ${TEST_TYPE.toUpperCase()}`);
  console.log(`📍 Base URL: ${config.baseUrl}`);
  console.log(`⏱️  Starting tests at: ${new Date().toISOString()}`);
  console.log('');
  console.log('Test Scenarios:');
  console.log('  1. User Registration and Authentication');
  console.log('  2. User Profile Management');
  console.log('  3. Contact Creation');
  console.log('  4. Contact Retrieval');
  console.log('  5. Contact Updates');
  console.log('  6. Contact Deletion');
  console.log('  7. Verification After Deletion');
  console.log('  8. Cleanup and Logout');
  console.log('');
  console.log('════════════════════════════════════════════════════════════');
  console.log('');
  
  return {
    startTime: Date.now(),
    testType: TEST_TYPE,
  };
}

/**
 * Teardown function - runs once after all tests
 */
export function teardown(data: SetupData): void {
  const duration = ((Date.now() - data.startTime) / 1000).toFixed(2);
  
  console.log('');
  console.log('════════════════════════════════════════════════════════════');
  console.log('');
  console.log('✅ All Tests Completed!');
  console.log(`⏱️  Total Duration: ${duration} seconds`);
  console.log(`🏁 Finished at: ${new Date().toISOString()}`);
  console.log('');
  console.log('Check the summary above for detailed metrics and results.');
  console.log('');
  console.log('╚════════════════════════════════════════════════════════════╝');
}

