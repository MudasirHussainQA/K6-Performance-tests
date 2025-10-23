/**
 * User API Client
 * Handles all user-related API operations
 */

import { K6Response, User, UpdateUserData } from '../types';
import { HttpService } from '../services/http.service';
import { API_ENDPOINTS } from '../constants';
import { config } from '../config/config';

export class UserAPI {
  private static readonly BASE_URL = config.baseUrl;

  /**
   * Register a new user
   */
  static register(userData: User): K6Response {
    const url = `${this.BASE_URL}${API_ENDPOINTS.USERS}`;
    return HttpService.post(url, userData);
  }

  /**
   * Login user and obtain authentication token
   */
  static login(email: string, password: string): K6Response {
    const url = `${this.BASE_URL}${API_ENDPOINTS.USERS_LOGIN}`;
    const credentials = { email, password };
    return HttpService.post(url, credentials);
  }

  /**
   * Get authenticated user's profile
   */
  static getProfile(token: string): K6Response {
    const url = `${this.BASE_URL}${API_ENDPOINTS.USERS_ME}`;
    return HttpService.get(url, token);
  }

  /**
   * Update authenticated user's profile
   */
  static updateProfile(token: string, userData: UpdateUserData): K6Response {
    const url = `${this.BASE_URL}${API_ENDPOINTS.USERS_ME}`;
    return HttpService.patch(url, userData, token);
  }

  /**
   * Logout user (invalidate token)
   */
  static logout(token: string): K6Response {
    const url = `${this.BASE_URL}${API_ENDPOINTS.USERS_LOGOUT}`;
    return HttpService.post(url, null, token);
  }

  /**
   * Delete authenticated user's account
   */
  static deleteAccount(token: string): K6Response {
    const url = `${this.BASE_URL}${API_ENDPOINTS.USERS_ME}`;
    return HttpService.delete(url, token);
  }
}

