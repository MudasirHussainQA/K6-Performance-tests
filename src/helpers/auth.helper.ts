/**
 * Authentication Helper
 * Provides reusable authentication flows
 */

import { UserAPI } from '../api';
import { DataBuilderService } from '../services/data-builder.service';
import { ValidatorService } from '../services/validator.service';
import { LoggerService } from '../services/logger.service';
import { HttpService } from '../services/http.service';
import { HTTP_STATUS, LOG_MESSAGES } from '../constants';
import { User, AuthResponse } from '../types';

export interface AuthResult {
  success: boolean;
  token: string | null;
  userId: string | null;
  user?: User;
}

export class AuthHelper {
  /**
   * Register and authenticate a new user
   */
  static registerAndLogin(userData?: User): AuthResult {
    const user = userData || DataBuilderService.buildUser();
    
    LoggerService.test('User Registration', `- Email: ${user.email}`);
    const registerResponse = UserAPI.register(user);
    
    if (!ValidatorService.validateResponse(registerResponse, 'User Registration', HTTP_STATUS.CREATED)) {
      LoggerService.error('Failed to register user');
      return { success: false, token: null, userId: null };
    }
    
    const responseData = HttpService.parseJsonResponse<AuthResponse>(registerResponse);
    
    if (!responseData || !responseData.token) {
      LoggerService.error('Registration response missing token');
      return { success: false, token: null, userId: null };
    }
    
    LoggerService.success(`${LOG_MESSAGES.USER_REGISTERED} - ID: ${responseData.user._id}`);
    
    return {
      success: true,
      token: responseData.token,
      userId: responseData.user._id,
      user,
    };
  }

  /**
   * Login existing user
   */
  static login(email: string, password: string): AuthResult {
    LoggerService.test('User Login', `- Email: ${email}`);
    const loginResponse = UserAPI.login(email, password);
    
    if (!ValidatorService.validateResponse(loginResponse, 'User Login', HTTP_STATUS.OK)) {
      LoggerService.error('Failed to login user');
      return { success: false, token: null, userId: null };
    }
    
    const responseData = HttpService.parseJsonResponse<AuthResponse>(loginResponse);
    
    if (!responseData || !responseData.token) {
      LoggerService.error('Login response missing token');
      return { success: false, token: null, userId: null };
    }
    
    LoggerService.success(LOG_MESSAGES.USER_LOGGED_IN);
    
    return {
      success: true,
      token: responseData.token,
      userId: responseData.user._id,
    };
  }

  /**
   * Logout user
   */
  static logout(token: string): boolean {
    LoggerService.test('User Logout');
    const logoutResponse = UserAPI.logout(token);
    
    if (!ValidatorService.validateResponse(logoutResponse, 'User Logout', HTTP_STATUS.OK)) {
      LoggerService.warn('Logout failed but continuing');
      return false;
    }
    
    LoggerService.success(LOG_MESSAGES.USER_LOGGED_OUT);
    return true;
  }
}

