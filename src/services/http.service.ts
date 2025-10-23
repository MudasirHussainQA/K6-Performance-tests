/**
 * HTTP Service
 * Low-level HTTP operations with consistent headers and error handling
 */

import http from 'k6/http';
import { K6Response, Headers } from '../types';
import { HTTP_HEADERS, CONTENT_TYPE } from '../constants';
import { LoggerService } from './logger.service';

export class HttpService {
  /**
   * Get standard JSON headers
   */
  static getStandardHeaders(): Headers {
    return {
      [HTTP_HEADERS.CONTENT_TYPE]: CONTENT_TYPE.JSON,
    };
  }

  /**
   * Get authenticated headers
   */
  static getAuthHeaders(token: string): Headers {
    return {
      ...this.getStandardHeaders(),
      [HTTP_HEADERS.AUTHORIZATION]: `Bearer ${token}`,
    };
  }

  /**
   * Perform GET request
   */
  static get(url: string, token?: string): K6Response {
    const headers = token ? this.getAuthHeaders(token) : this.getStandardHeaders();
    LoggerService.debug(`GET ${url}`, { headers });
    return http.get(url, { headers });
  }

  /**
   * Perform POST request
   */
  static post(url: string, payload: any, token?: string): K6Response {
    const headers = token ? this.getAuthHeaders(token) : this.getStandardHeaders();
    const body = payload ? JSON.stringify(payload) : null;
    LoggerService.debug(`POST ${url}`, { headers, body });
    return http.post(url, body, { headers });
  }

  /**
   * Perform PUT request
   */
  static put(url: string, payload: any, token?: string): K6Response {
    const headers = token ? this.getAuthHeaders(token) : this.getStandardHeaders();
    const body = JSON.stringify(payload);
    LoggerService.debug(`PUT ${url}`, { headers, body });
    return http.put(url, body, { headers });
  }

  /**
   * Perform PATCH request
   */
  static patch(url: string, payload: any, token?: string): K6Response {
    const headers = token ? this.getAuthHeaders(token) : this.getStandardHeaders();
    const body = JSON.stringify(payload);
    LoggerService.debug(`PATCH ${url}`, { headers, body });
    return http.patch(url, body, { headers });
  }

  /**
   * Perform DELETE request
   */
  static delete(url: string, token?: string): K6Response {
    const headers = token ? this.getAuthHeaders(token) : this.getStandardHeaders();
    LoggerService.debug(`DELETE ${url}`, { headers });
    return http.del(url, null, { headers });
  }

  /**
   * Parse JSON response safely
   */
  static parseJsonResponse<T = any>(response: K6Response): T | null {
    try {
      return JSON.parse(String(response.body)) as T;
    } catch (error) {
      LoggerService.error(`Failed to parse JSON response: ${response.body}`);
      return null;
    }
  }
}

