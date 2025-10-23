import { group, sleep } from 'k6';
import { UserAPI, ContactAPI } from '../../utils/api';
import {
  generateRandomUser,
  generateRandomContact,
  checkResponse,
  parseJsonResponse,
  logTest,
  logSuccess,
  logError,
  randomSleep,
} from '../../utils/helpers';
import { config } from '../../config/config';
import { AuthResponse, ContactResponse } from '../../types';

// Test configuration
export const options = {
  scenarios: {
    contact_test: config.scenarios.smoke,
  },
  thresholds: config.thresholds,
};

/**
 * Main test execution
 */
export default function (): void {
  let token: string | null = null;
  let contactId: string | null = null;
  const contacts: string[] = [];

  // Setup: Create user and login
  group('Setup - User Registration and Login', () => {
    const userData = generateRandomUser();
    
    logTest('User Registration for Contact Tests');
    const registerResponse = UserAPI.register(userData);
    
    if (checkResponse(registerResponse, 'Register User', 201)) {
      const responseData = parseJsonResponse<AuthResponse>(registerResponse);
      if (responseData && responseData.token) {
        token = responseData.token;
        logSuccess('User registered and authenticated');
      }
    }
    
    sleep(1);
  });

  if (!token) {
    logError('Failed to authenticate user. Skipping contact tests.');
    return;
  }

  // Test: Add New Contact
  group('Add New Contact', () => {
    logTest('Adding new contact');
    
    const contactData = generateRandomContact();
    const response = ContactAPI.add(token as string, contactData);
    
    if (checkResponse(response, 'Add Contact', 201)) {
      const responseData = parseJsonResponse<ContactResponse>(response);
      if (responseData && responseData._id) {
        contactId = responseData._id;
        contacts.push(contactId);
        logSuccess(`Contact added successfully with ID: ${contactId}`);
      }
    }
    
    sleep(1);
  });

  // Test: Get All Contacts
  group('Get All Contacts', () => {
    logTest('Retrieving all contacts');
    
    const response = ContactAPI.getAll(token as string);
    
    if (checkResponse(response, 'Get All Contacts', 200)) {
      const responseData = parseJsonResponse<ContactResponse[]>(response);
      if (responseData && Array.isArray(responseData)) {
        logSuccess(`Retrieved ${responseData.length} contact(s)`);
      }
    }
    
    sleep(1);
  });

  // Test: Get Contact by ID
  if (contactId) {
    group('Get Contact by ID', () => {
      logTest('Retrieving contact by ID', `- ID: ${contactId}`);
      
      const response = ContactAPI.getById(token as string, contactId as string);
      
      if (checkResponse(response, 'Get Contact by ID', 200)) {
        const responseData = parseJsonResponse<ContactResponse>(response);
        if (responseData) {
          logSuccess(`Retrieved contact: ${responseData.firstName} ${responseData.lastName}`);
        }
      }
      
      sleep(1);
    });

    // Test: Update Contact (PUT)
    group('Update Contact (Full Update)', () => {
      logTest('Updating contact with PUT', `- ID: ${contactId}`);
      
      const updatedContact = generateRandomContact();
      const response = ContactAPI.update(token as string, contactId as string, updatedContact);
      
      if (checkResponse(response, 'Update Contact (PUT)', 200)) {
        logSuccess('Contact updated successfully');
      }
      
      sleep(1);
    });

    // Test: Partial Update Contact (PATCH)
    group('Update Contact (Partial Update)', () => {
      logTest('Updating contact with PATCH', `- ID: ${contactId}`);
      
      const partialUpdate = {
        firstName: 'UpdatedFirstName',
        phone: '555-999-8888',
      };
      
      const response = ContactAPI.partialUpdate(token as string, contactId as string, partialUpdate);
      
      if (checkResponse(response, 'Update Contact (PATCH)', 200)) {
        logSuccess('Contact partially updated successfully');
      }
      
      sleep(1);
    });
  }

  // Test: Add Multiple Contacts
  group('Add Multiple Contacts', () => {
    logTest('Adding multiple contacts');
    
    const numberOfContacts = 3;
    
    for (let i = 0; i < numberOfContacts; i++) {
      const contactData = generateRandomContact();
      const response = ContactAPI.add(token as string, contactData);
      
      if (checkResponse(response, `Add Contact ${i + 1}`, 201)) {
        const responseData = parseJsonResponse<ContactResponse>(response);
        if (responseData && responseData._id) {
          contacts.push(responseData._id);
        }
      }
      
      sleep(0.5);
    }
    
    logSuccess(`Added ${numberOfContacts} additional contacts`);
    sleep(1);
  });

  // Test: Verify All Contacts
  group('Verify All Contacts', () => {
    logTest('Verifying all contacts are retrievable');
    
    const response = ContactAPI.getAll(token as string);
    
    if (checkResponse(response, 'Get All Contacts', 200)) {
      const responseData = parseJsonResponse<ContactResponse[]>(response);
      if (responseData && Array.isArray(responseData)) {
        logSuccess(`Total contacts in system: ${responseData.length}`);
      }
    }
    
    sleep(1);
  });

  // Test: Delete Contacts
  group('Delete Contacts', () => {
    logTest('Deleting contacts');
    
    let deletedCount = 0;
    
    for (const id of contacts) {
      const response = ContactAPI.delete(token as string, id);
      
      if (checkResponse(response, `Delete Contact ${id}`, 200)) {
        deletedCount++;
      }
      
      sleep(0.5);
    }
    
    logSuccess(`Deleted ${deletedCount} contact(s)`);
    sleep(1);
  });

  // Test: Verify Contacts Deleted
  group('Verify Contacts Deleted', () => {
    logTest('Verifying contacts were deleted');
    
    const response = ContactAPI.getAll(token as string);
    
    if (checkResponse(response, 'Get All Contacts After Deletion', 200)) {
      const responseData = parseJsonResponse<ContactResponse[]>(response);
      if (responseData && Array.isArray(responseData)) {
        logSuccess(`Remaining contacts: ${responseData.length}`);
      }
    }
    
    sleep(1);
  });

  randomSleep(1, 3);
}

/**
 * Setup function
 */
export function setup(): Record<string, never> {
  console.log('🚀 Starting Contact Management Tests...');
  console.log(`📍 Base URL: ${config.baseUrl}`);
  return {};
}

/**
 * Teardown function
 */
export function teardown(_data: Record<string, never>): void {
  console.log('✅ Contact Management Tests Completed!');
}

