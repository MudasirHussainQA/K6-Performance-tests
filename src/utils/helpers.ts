import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { User, Contact, Headers, K6Response } from '../types';

// Custom metrics
export const errorRate = new Rate('errors');
export const successRate = new Rate('success');
export const apiDuration = new Trend('api_duration');
export const failedRequests = new Counter('failed_requests');

/**
 * Generate random email address
 */
export function generateRandomEmail(): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  return `test_${timestamp}_${randomStr}@example.com`;
}

/**
 * Generate random password
 */
export function generateRandomPassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Generate random contact data
 */
export function generateRandomContact(): Contact {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Mary'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return {
    firstName: firstName,
    lastName: lastName,
    birthdate: `19${Math.floor(Math.random() * 50) + 50}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    phone: `555${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`,
    street1: `${Math.floor(Math.random() * 9999) + 1} Main St`,
    street2: `Apt ${Math.floor(Math.random() * 999) + 1}`,
    city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
    stateProvince: ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
    postalCode: String(Math.floor(Math.random() * 90000) + 10000),
    country: 'USA'
  };
}

/**
 * Generate random user data
 */
export function generateRandomUser(): User {
  return {
    firstName: ['John', 'Jane', 'Michael', 'Sarah', 'David'][Math.floor(Math.random() * 5)],
    lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)],
    email: generateRandomEmail(),
    password: generateRandomPassword()
  };
}

/**
 * Check HTTP response with detailed logging
 */
export function checkResponse(response: K6Response, testName: string, expectedStatus: number = 200): boolean {
  const success = check(response, {
    [`${testName}: status is ${expectedStatus}`]: (r) => r.status === expectedStatus,
    [`${testName}: response time < 500ms`]: (r) => r.timings.duration < 500,
    [`${testName}: response has body`]: (r) => r.body !== null && String(r.body).length > 0,
  });
  
  // Record metrics
  errorRate.add(!success);
  successRate.add(success);
  apiDuration.add(response.timings.duration);
  
  if (!success) {
    failedRequests.add(1);
    const bodyPreview = response.body ? String(response.body).substring(0, 200) : 'No body';
    console.error(`❌ ${testName} failed: Status ${response.status}, Body: ${bodyPreview}`);
  }
  
  return success;
}

/**
 * Check HTTP response for error status
 */
export function checkErrorResponse(response: K6Response, testName: string, expectedStatus: number = 400): boolean {
  const success = check(response, {
    [`${testName}: status is ${expectedStatus}`]: (r) => r.status === expectedStatus,
    [`${testName}: has error message`]: (r) => {
      try {
        const body = JSON.parse(String(r.body));
        return body.error || body.message;
      } catch (e) {
        return false;
      }
    },
  });
  
  return success;
}

/**
 * Parse JSON response safely
 */
export function parseJsonResponse<T = any>(response: K6Response): T | null {
  try {
    return JSON.parse(String(response.body)) as T;
  } catch (e) {
    console.error(`Failed to parse JSON: ${response.body}`);
    return null;
  }
}

/**
 * Log test execution
 */
export function logTest(testName: string, details: string = ''): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🧪 ${testName} ${details}`);
}

/**
 * Log success
 */
export function logSuccess(message: string): void {
  console.log(`✅ ${message}`);
}

/**
 * Log error
 */
export function logError(message: string): void {
  console.error(`❌ ${message}`);
}

/**
 * Generate authorization header
 */
export function getAuthHeaders(token: string): Headers {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

/**
 * Get standard headers
 */
export function getHeaders(): Headers {
  return {
    'Content-Type': 'application/json',
  };
}

/**
 * Random sleep between min and max seconds
 */
export function randomSleep(min: number = 1, max: number = 3): void {
  const sleepTime = Math.random() * (max - min) + min;
  sleep(sleepTime);
}

