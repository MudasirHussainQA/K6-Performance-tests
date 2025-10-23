import http from 'k6/http';
import { config } from '../config/config';
import { getHeaders, getAuthHeaders } from './helpers';
import { User, UpdateUserData, Contact, PartialContact, K6Response } from '../types';

const BASE_URL = config.baseUrl;

/**
 * User API endpoints
 */
export class UserAPI {
  /**
   * Register a new user
   */
  static register(userData: User): K6Response {
    const url = `${BASE_URL}/users`;
    const payload = JSON.stringify(userData);
    return http.post(url, payload, { headers: getHeaders() });
  }

  /**
   * Login user
   */
  static login(email: string, password: string): K6Response {
    const url = `${BASE_URL}/users/login`;
    const payload = JSON.stringify({ email, password });
    return http.post(url, payload, { headers: getHeaders() });
  }

  /**
   * Get user profile
   */
  static getProfile(token: string): K6Response {
    const url = `${BASE_URL}/users/me`;
    return http.get(url, { headers: getAuthHeaders(token) });
  }

  /**
   * Update user profile
   */
  static updateProfile(token: string, userData: UpdateUserData): K6Response {
    const url = `${BASE_URL}/users/me`;
    const payload = JSON.stringify(userData);
    return http.patch(url, payload, { headers: getAuthHeaders(token) });
  }

  /**
   * Logout user
   */
  static logout(token: string): K6Response {
    const url = `${BASE_URL}/users/logout`;
    return http.post(url, null, { headers: getAuthHeaders(token) });
  }

  /**
   * Delete user
   */
  static delete(token: string): K6Response {
    const url = `${BASE_URL}/users/me`;
    return http.del(url, null, { headers: getAuthHeaders(token) });
  }
}

/**
 * Contact API endpoints
 */
export class ContactAPI {
  /**
   * Get all contacts
   */
  static getAll(token: string): K6Response {
    const url = `${BASE_URL}/contacts`;
    return http.get(url, { headers: getAuthHeaders(token) });
  }

  /**
   * Get contact by ID
   */
  static getById(token: string, contactId: string): K6Response {
    const url = `${BASE_URL}/contacts/${contactId}`;
    return http.get(url, { headers: getAuthHeaders(token) });
  }

  /**
   * Add a new contact
   */
  static add(token: string, contactData: Contact | Partial<Contact>): K6Response {
    const url = `${BASE_URL}/contacts`;
    const payload = JSON.stringify(contactData);
    return http.post(url, payload, { headers: getAuthHeaders(token) });
  }

  /**
   * Update a contact
   */
  static update(token: string, contactId: string, contactData: Contact): K6Response {
    const url = `${BASE_URL}/contacts/${contactId}`;
    const payload = JSON.stringify(contactData);
    return http.put(url, payload, { headers: getAuthHeaders(token) });
  }

  /**
   * Partially update a contact
   */
  static partialUpdate(token: string, contactId: string, contactData: PartialContact): K6Response {
    const url = `${BASE_URL}/contacts/${contactId}`;
    const payload = JSON.stringify(contactData);
    return http.patch(url, payload, { headers: getAuthHeaders(token) });
  }

  /**
   * Delete a contact
   */
  static delete(token: string, contactId: string): K6Response {
    const url = `${BASE_URL}/contacts/${contactId}`;
    return http.del(url, null, { headers: getAuthHeaders(token) });
  }
}

