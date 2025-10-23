/**
 * Contact Helper
 * Provides reusable contact management flows
 */

import { ContactAPI } from '../api';
import { DataBuilderService } from '../services/data-builder.service';
import { ValidatorService } from '../services/validator.service';
import { LoggerService } from '../services/logger.service';
import { HttpService } from '../services/http.service';
import { SleepUtil } from '../utils/sleep.util';
import { HTTP_STATUS, LOG_MESSAGES, TEST_CONFIG } from '../constants';
import { Contact, PartialContact, ContactResponse } from '../types';

export interface ContactCreationResult {
  success: boolean;
  contactIds: string[];
  count: number;
}

export class ContactHelper {
  /**
   * Create a single contact
   */
  static createOne(token: string, contactData?: Contact): string | null {
    const contact = contactData || DataBuilderService.buildContact();
    const response = ContactAPI.create(token, contact);
    
    if (!ValidatorService.validateResponse(response, 'Create Contact', HTTP_STATUS.CREATED)) {
      return null;
    }
    
    const responseData = HttpService.parseJsonResponse<ContactResponse>(response);
    if (!responseData || !responseData._id) {
      return null;
    }
    
    return responseData._id;
  }

  /**
   * Create multiple contacts
   */
  static createMultiple(token: string, count: number = TEST_CONFIG.DEFAULT_CONTACTS_COUNT): ContactCreationResult {
    LoggerService.test('Creating multiple contacts', `- Count: ${count}`);
    
    const contactIds: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const contactId = this.createOne(token);
      
      if (contactId) {
        contactIds.push(contactId);
      }
      
      SleepUtil.short();
    }
    
    const success = contactIds.length === count;
    if (success) {
      LoggerService.success(`${LOG_MESSAGES.CONTACT_CREATED} - Created ${contactIds.length} contacts`);
    } else {
      LoggerService.warn(`Created ${contactIds.length}/${count} contacts`);
    }
    
    return {
      success,
      contactIds,
      count: contactIds.length,
    };
  }

  /**
   * Get all contacts
   */
  static getAll(token: string): ContactResponse[] | null {
    LoggerService.test('Get All Contacts');
    const response = ContactAPI.getAll(token);
    
    if (!ValidatorService.validateResponse(response, 'Get All Contacts', HTTP_STATUS.OK)) {
      return null;
    }
    
    const contacts = HttpService.parseJsonResponse<ContactResponse[]>(response);
    
    if (!contacts || !Array.isArray(contacts)) {
      LoggerService.error('Invalid contacts response');
      return null;
    }
    
    LoggerService.success(`${LOG_MESSAGES.CONTACTS_RETRIEVED} - Count: ${contacts.length}`);
    return contacts;
  }

  /**
   * Get contact by ID
   */
  static getById(token: string, contactId: string): ContactResponse | null {
    const response = ContactAPI.getById(token, contactId);
    
    if (!ValidatorService.validateResponse(response, 'Get Contact by ID', HTTP_STATUS.OK)) {
      return null;
    }
    
    const contact = HttpService.parseJsonResponse<ContactResponse>(response);
    
    if (!contact) {
      LoggerService.error('Invalid contact response');
      return null;
    }
    
    return contact;
  }

  /**
   * Update contact (full update)
   */
  static update(token: string, contactId: string, contactData?: Contact): boolean {
    const contact = contactData || DataBuilderService.buildContact();
    const response = ContactAPI.update(token, contactId, contact);
    
    if (!ValidatorService.validateResponse(response, 'Update Contact (PUT)', HTTP_STATUS.OK)) {
      return false;
    }
    
    LoggerService.success(LOG_MESSAGES.CONTACT_UPDATED);
    return true;
  }

  /**
   * Partially update contact
   */
  static partialUpdate(token: string, contactId: string, updates: PartialContact): boolean {
    const response = ContactAPI.partialUpdate(token, contactId, updates);
    
    if (!ValidatorService.validateResponse(response, 'Update Contact (PATCH)', HTTP_STATUS.OK)) {
      return false;
    }
    
    LoggerService.success(LOG_MESSAGES.CONTACT_UPDATED);
    return true;
  }

  /**
   * Delete single contact
   */
  static deleteOne(token: string, contactId: string): boolean {
    const response = ContactAPI.delete(token, contactId);
    
    if (!ValidatorService.validateResponse(response, 'Delete Contact', HTTP_STATUS.OK)) {
      return false;
    }
    
    return true;
  }

  /**
   * Delete multiple contacts
   */
  static deleteMultiple(token: string, contactIds: string[]): number {
    LoggerService.test('Deleting contacts', `- Count: ${contactIds.length}`);
    
    let deletedCount = 0;
    
    for (const contactId of contactIds) {
      if (this.deleteOne(token, contactId)) {
        deletedCount++;
      }
      SleepUtil.short();
    }
    
    LoggerService.success(`${LOG_MESSAGES.CONTACT_DELETED} - Deleted ${deletedCount} contact(s)`);
    return deletedCount;
  }

  /**
   * Delete all contacts for user
   */
  static deleteAll(token: string): number {
    const contacts = this.getAll(token);
    
    if (!contacts || contacts.length === 0) {
      LoggerService.info('No contacts to delete');
      return 0;
    }
    
    const contactIds = contacts.map(c => c._id);
    return this.deleteMultiple(token, contactIds);
  }
}

