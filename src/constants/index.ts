/**
 * Application Constants
 * Centralized location for all magic numbers, strings, and configuration values
 */

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const HTTP_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
} as const;

export const CONTENT_TYPE = {
  JSON: 'application/json',
  TEXT: 'text/plain',
} as const;

export const API_ENDPOINTS = {
  USERS: '/users',
  USERS_LOGIN: '/users/login',
  USERS_LOGOUT: '/users/logout',
  USERS_ME: '/users/me',
  CONTACTS: '/contacts',
  CONTACT_BY_ID: (id: string) => `/contacts/${id}`,
} as const;

export const TEST_CONFIG = {
  DEFAULT_PASSWORD_LENGTH: 12,
  DEFAULT_CONTACTS_COUNT: 5,
  DEFAULT_SLEEP_MIN: 1,
  DEFAULT_SLEEP_MAX: 3,
  DEFAULT_SHORT_SLEEP: 0.5,
  DEFAULT_MEDIUM_SLEEP: 1,
  MAX_RESPONSE_TIME_MS: 500,
  LOG_BODY_PREVIEW_LENGTH: 200,
} as const;

export const TEST_DATA = {
  FIRST_NAMES: ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Mary'],
  LAST_NAMES: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'],
  CITIES: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
  STATES: ['NY', 'CA', 'IL', 'TX', 'AZ'],
  PHONE_PREFIX: '555',
  EMAIL_DOMAIN: '@example.com',
  COUNTRY: 'USA',
} as const;

export const VALIDATION_MESSAGES = {
  MISSING_TOKEN: 'Authentication token is required',
  MISSING_CONTACT_ID: 'Contact ID is required',
  INVALID_RESPONSE_BODY: 'Response body is invalid or empty',
  FAILED_TO_PARSE_JSON: 'Failed to parse JSON response',
} as const;

export const LOG_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  USER_LOGGED_IN: 'User logged in successfully',
  USER_LOGGED_OUT: 'User logged out successfully',
  PROFILE_UPDATED: 'User profile updated successfully',
  PROFILE_RETRIEVED: 'User profile retrieved successfully',
  CONTACT_CREATED: 'Contact created successfully',
  CONTACT_UPDATED: 'Contact updated successfully',
  CONTACT_DELETED: 'Contact deleted successfully',
  CONTACT_RETRIEVED: 'Contact retrieved successfully',
  CONTACTS_RETRIEVED: 'Contacts retrieved successfully',
  TEST_SKIPPED: 'Test skipped due to prerequisite failure',
} as const;

export const TEST_GROUPS = {
  AUTH: 'Authentication',
  USER_PROFILE: 'User Profile Management',
  CONTACT_CREATION: 'Contact Creation',
  CONTACT_RETRIEVAL: 'Contact Retrieval',
  CONTACT_UPDATE: 'Contact Updates',
  CONTACT_DELETION: 'Contact Deletion',
  VERIFICATION: 'Verification',
  CLEANUP: 'Cleanup',
} as const;

