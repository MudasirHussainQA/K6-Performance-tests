/**
 * Contact API Client
 * Handles all contact-related API operations
 */

import { K6Response, Contact, PartialContact } from '../types';
import { HttpService } from '../services/http.service';
import { API_ENDPOINTS } from '../constants';
import { config } from '../config/config';

export class ContactAPI {
  private static readonly BASE_URL = config.baseUrl;

  /**
   * Get all contacts for authenticated user
   */
  static getAll(token: string): K6Response {
    const url = `${this.BASE_URL}${API_ENDPOINTS.CONTACTS}`;
    return HttpService.get(url, token);
  }

  /**
   * Get specific contact by ID
   */
  static getById(token: string, contactId: string): K6Response {
    const url = `${this.BASE_URL}${API_ENDPOINTS.CONTACT_BY_ID(contactId)}`;
    return HttpService.get(url, token);
  }

  /**
   * Create a new contact
   */
  static create(token: string, contactData: Contact | Partial<Contact>): K6Response {
    const url = `${this.BASE_URL}${API_ENDPOINTS.CONTACTS}`;
    return HttpService.post(url, contactData, token);
  }

  /**
   * Fully update a contact (PUT - replaces entire resource)
   */
  static update(token: string, contactId: string, contactData: Contact): K6Response {
    const url = `${this.BASE_URL}${API_ENDPOINTS.CONTACT_BY_ID(contactId)}`;
    return HttpService.put(url, contactData, token);
  }

  /**
   * Partially update a contact (PATCH - updates specific fields)
   */
  static partialUpdate(token: string, contactId: string, contactData: PartialContact): K6Response {
    const url = `${this.BASE_URL}${API_ENDPOINTS.CONTACT_BY_ID(contactId)}`;
    return HttpService.patch(url, contactData, token);
  }

  /**
   * Delete a contact
   */
  static delete(token: string, contactId: string): K6Response {
    const url = `${this.BASE_URL}${API_ENDPOINTS.CONTACT_BY_ID(contactId)}`;
    return HttpService.delete(url, token);
  }

  /**
   * Bulk delete contacts
   */
  static deleteMultiple(token: string, contactIds: string[]): K6Response[] {
    return contactIds.map(id => this.delete(token, id));
  }
}

