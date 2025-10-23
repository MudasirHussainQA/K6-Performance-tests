/**
 * Main K6 Test Suite - Refactored with Clean Code Principles
 * 
 * This test suite demonstrates best practices including:
 * - Service layer architecture
 * - Helper methods for reusable flows
 * - Constants for magic numbers/strings
 * - Centralized logging and validation
 * - Clear separation of concerns
 */

import { group } from 'k6';
import { AuthHelper } from '../helpers/auth.helper';
import { ContactHelper } from '../helpers/contact.helper';
import { UserAPI } from '../api';
import { ValidatorService } from '../services/validator.service';
import { LoggerService } from '../services/logger.service';
import { HttpService } from '../services/http.service';
import { SleepUtil } from '../utils/sleep.util';
import { config } from '../config/config';
import { HTTP_STATUS, TEST_GROUPS, LOG_MESSAGES } from '../constants';
import { UserResponse } from '../types';

// Get test type from environment
const TEST_TYPE = __ENV.TEST_TYPE || 'smoke';

// Export K6 options
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
 * Main test execution - Clean and focused
 */
export default function (): void {
  // State management
  let token: string | null = null;
  const contactIds: string[] = [];

  // === AUTHENTICATION FLOW ===
  group(`01. ${TEST_GROUPS.AUTH}`, () => {
    const authResult = AuthHelper.registerAndLogin();
    
    if (!authResult.success || !authResult.token) {
      LoggerService.error('Authentication failed. Aborting test.');
      return;
    }
    
    token = authResult.token;
    SleepUtil.medium();
    
    // Verify login by re-authenticating
    if (authResult.user) {
      const loginResult = AuthHelper.login(authResult.user.email, authResult.user.password);
      if (loginResult.success && loginResult.token) {
        token = loginResult.token; // Update with fresh token
      }
    }
    
    SleepUtil.medium();
  });

  // Guard clause - exit if authentication failed
  if (!token) {
    LoggerService.error('No authentication token. Skipping remaining tests.');
    return;
  }

  // TypeScript: token is confirmed not null from here onwards
  const authToken: string = token;

  // === USER PROFILE MANAGEMENT ===
  group(`02. ${TEST_GROUPS.USER_PROFILE}`, () => {
    // Get user profile
    LoggerService.test('Get User Profile');
    const profileResponse = UserAPI.getProfile(authToken);
    
    if (ValidatorService.validateResponse(profileResponse, 'Get User Profile', HTTP_STATUS.OK)) {
      const profileData = HttpService.parseJsonResponse<UserResponse>(profileResponse);
      if (profileData) {
        LoggerService.success(`${LOG_MESSAGES.PROFILE_RETRIEVED}: ${profileData.firstName} ${profileData.lastName}`);
      }
    }
    
    SleepUtil.medium();
    
    // Update user profile
    LoggerService.test('Update User Profile');
    const updateData = { firstName: 'Updated', lastName: 'User' };
    const updateResponse = UserAPI.updateProfile(authToken, updateData);
    
    if (ValidatorService.validateResponse(updateResponse, 'Update User Profile', HTTP_STATUS.OK)) {
      LoggerService.success(LOG_MESSAGES.PROFILE_UPDATED);
    }
    
    SleepUtil.medium();
  });

  // === CONTACT CREATION ===
  group(`03. ${TEST_GROUPS.CONTACT_CREATION}`, () => {
    const result = ContactHelper.createMultiple(authToken);
    contactIds.push(...result.contactIds);
    SleepUtil.medium();
  });

  // === CONTACT RETRIEVAL ===
  group(`04. ${TEST_GROUPS.CONTACT_RETRIEVAL}`, () => {
    // Get all contacts
    const contacts = ContactHelper.getAll(authToken);
    SleepUtil.medium();
    
    // Get individual contacts (sample first 3)
    if (contactIds.length > 0) {
      LoggerService.test('Get Individual Contacts');
      
      const sampleSize = Math.min(3, contactIds.length);
      for (let i = 0; i < sampleSize; i++) {
        const contact = ContactHelper.getById(authToken, contactIds[i]);
        
        if (contact) {
          LoggerService.success(`${LOG_MESSAGES.CONTACT_RETRIEVED}: ${contact.firstName} ${contact.lastName}`);
        }
        
        SleepUtil.short();
      }
    }
    
    SleepUtil.medium();
  });

  // === CONTACT UPDATES ===
  group(`05. ${TEST_GROUPS.CONTACT_UPDATE}`, () => {
    if (contactIds.length > 0) {
      const contactId = contactIds[0];
      
      // Full update (PUT)
      LoggerService.test('Full Contact Update (PUT)');
      ContactHelper.update(authToken, contactId);
      SleepUtil.medium();
      
      // Partial update (PATCH)
      LoggerService.test('Partial Contact Update (PATCH)');
      const partialUpdates = { phone: '555-999-8888', city: 'Updated City' };
      ContactHelper.partialUpdate(authToken, contactId, partialUpdates);
      SleepUtil.medium();
    }
  });

  // === CONTACT DELETION ===
  group(`06. ${TEST_GROUPS.CONTACT_DELETION}`, () => {
    if (contactIds.length > 0) {
      ContactHelper.deleteMultiple(authToken, contactIds);
      SleepUtil.medium();
    }
  });

  // === VERIFICATION ===
  group(`07. ${TEST_GROUPS.VERIFICATION}`, () => {
    LoggerService.test('Verify contacts were deleted');
    const remainingContacts = ContactHelper.getAll(authToken);
    
    if (remainingContacts) {
      LoggerService.success(`Remaining contacts: ${remainingContacts.length}`);
    }
    
    SleepUtil.medium();
  });

  // === CLEANUP ===
  group(`08. ${TEST_GROUPS.CLEANUP}`, () => {
    AuthHelper.logout(authToken);
    SleepUtil.medium();
  });

  // Random sleep between iterations
  SleepUtil.random();
}

/**
 * Setup function - Runs once before all tests
 */
export function setup(): SetupData {
  LoggerService.header('K6 Contact List API - Performance Test Suite');
  console.log('');
  LoggerService.info(`Test Type: ${TEST_TYPE.toUpperCase()}`);
  LoggerService.info(`Base URL: ${config.baseUrl}`);
  LoggerService.info(`Starting tests at: ${new Date().toISOString()}`);
  console.log('');
  LoggerService.section('Test Scenarios');
  console.log('  1. User Registration and Authentication');
  console.log('  2. User Profile Management');
  console.log('  3. Contact Creation');
  console.log('  4. Contact Retrieval');
  console.log('  5. Contact Updates');
  console.log('  6. Contact Deletion');
  console.log('  7. Verification After Deletion');
  console.log('  8. Cleanup and Logout');
  console.log('');
  LoggerService.separator();
  console.log('');
  
  return {
    startTime: Date.now(),
    testType: TEST_TYPE,
  };
}

/**
 * Teardown function - Runs once after all tests
 */
export function teardown(data: SetupData): void {
  const durationSeconds = ((Date.now() - data.startTime) / 1000).toFixed(2);
  
  console.log('');
  LoggerService.separator();
  console.log('');
  LoggerService.success('All Tests Completed!');
  LoggerService.metric('Total Duration', durationSeconds, 'seconds');
  LoggerService.info(`Finished at: ${new Date().toISOString()}`);
  console.log('');
  console.log('Check the summary above for detailed metrics and results.');
  console.log('');
  LoggerService.separator();
}

