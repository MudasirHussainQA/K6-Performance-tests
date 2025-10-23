/**
 * Data Builder Service
 * Test data generation with builder pattern
 */

import { User, Contact } from '../types';
import { TEST_DATA, TEST_CONFIG } from '../constants';

export class DataBuilderService {
  /**
   * Generate random email
   */
  static generateEmail(prefix?: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const emailPrefix = prefix || `test_${timestamp}_${randomStr}`;
    return `${emailPrefix}${TEST_DATA.EMAIL_DOMAIN}`;
  }

  /**
   * Generate secure random password
   */
  static generatePassword(length: number = TEST_CONFIG.DEFAULT_PASSWORD_LENGTH): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Get random item from array
   */
  private static getRandomItem<T>(array: readonly T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate random date in format YYYY-MM-DD
   */
  private static generateBirthdate(): string {
    const year = 1950 + Math.floor(Math.random() * 50);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Generate random phone number
   */
  private static generatePhoneNumber(): string {
    const number = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    return `${TEST_DATA.PHONE_PREFIX}${number}`;
  }

  /**
   * Generate random street address
   */
  private static generateStreetAddress(): string {
    const number = Math.floor(Math.random() * 9999) + 1;
    return `${number} Main St`;
  }

  /**
   * Generate apartment number
   */
  private static generateApartment(): string {
    const number = Math.floor(Math.random() * 999) + 1;
    return `Apt ${number}`;
  }

  /**
   * Generate random postal code
   */
  private static generatePostalCode(): string {
    return String(Math.floor(Math.random() * 90000) + 10000);
  }

  /**
   * Build random user
   */
  static buildUser(overrides?: Partial<User>): User {
    return {
      firstName: this.getRandomItem(TEST_DATA.FIRST_NAMES),
      lastName: this.getRandomItem(TEST_DATA.LAST_NAMES),
      email: this.generateEmail(),
      password: this.generatePassword(),
      ...overrides,
    };
  }

  /**
   * Build random contact
   */
  static buildContact(overrides?: Partial<Contact>): Contact {
    const firstName = this.getRandomItem(TEST_DATA.FIRST_NAMES);
    const lastName = this.getRandomItem(TEST_DATA.LAST_NAMES);

    return {
      firstName,
      lastName,
      birthdate: this.generateBirthdate(),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${TEST_DATA.EMAIL_DOMAIN}`,
      phone: this.generatePhoneNumber(),
      street1: this.generateStreetAddress(),
      street2: this.generateApartment(),
      city: this.getRandomItem(TEST_DATA.CITIES),
      stateProvince: this.getRandomItem(TEST_DATA.STATES),
      postalCode: this.generatePostalCode(),
      country: TEST_DATA.COUNTRY,
      ...overrides,
    };
  }

  /**
   * Build multiple contacts
   */
  static buildContacts(count: number): Contact[] {
    return Array.from({ length: count }, () => this.buildContact());
  }

  /**
   * Build multiple users
   */
  static buildUsers(count: number): User[] {
    return Array.from({ length: count }, () => this.buildUser());
  }
}

