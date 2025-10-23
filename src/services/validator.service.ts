/**
 * Validator Service
 * Handles all validation logic for API responses and data
 */

import { check } from 'k6';
import { K6Response } from '../types';
import { HTTP_STATUS, TEST_CONFIG, VALIDATION_MESSAGES } from '../constants';
import { LoggerService } from './logger.service';
import { MetricsService } from './metrics.service';

export interface ValidationResult {
  success: boolean;
  message?: string;
}

export class ValidatorService {
  /**
   * Validate HTTP response status, timing, and body
   */
  static validateResponse(
    response: K6Response,
    testName: string,
    expectedStatus: number = HTTP_STATUS.OK
  ): boolean {
    const checks = {
      [`${testName}: status is ${expectedStatus}`]: (r: K6Response) => r.status === expectedStatus,
      [`${testName}: response time < ${TEST_CONFIG.MAX_RESPONSE_TIME_MS}ms`]: 
        (r: K6Response) => r.timings.duration < TEST_CONFIG.MAX_RESPONSE_TIME_MS,
      [`${testName}: response has body`]: 
        (r: K6Response) => r.body !== null && String(r.body).length > 0,
    };

    const success = check(response, checks);

    // Record metrics
    MetricsService.recordError(!success);
    MetricsService.recordSuccess(success);
    MetricsService.recordApiDuration(response.timings.duration);

    if (!success) {
      MetricsService.incrementFailedRequests();
      this.logFailure(testName, response);
    }

    return success;
  }

  /**
   * Validate error response
   */
  static validateErrorResponse(
    response: K6Response,
    testName: string,
    expectedStatus: number = HTTP_STATUS.BAD_REQUEST
  ): boolean {
    const checks = {
      [`${testName}: status is ${expectedStatus}`]: (r: K6Response) => r.status === expectedStatus,
      [`${testName}: has error message`]: (r: K6Response) => {
        try {
          const body = JSON.parse(String(r.body));
          return Boolean(body.error || body.message);
        } catch {
          return false;
        }
      },
    };

    return check(response, checks);
  }

  /**
   * Validate required fields in data
   */
  static validateRequired(data: Record<string, any>, requiredFields: string[]): ValidationResult {
    for (const field of requiredFields) {
      if (!data[field]) {
        return {
          success: false,
          message: `Required field '${field}' is missing`,
        };
      }
    }
    return { success: true };
  }

  /**
   * Validate token exists
   */
  static validateToken(token: string | null): ValidationResult {
    if (!token) {
      return {
        success: false,
        message: VALIDATION_MESSAGES.MISSING_TOKEN,
      };
    }
    return { success: true };
  }

  /**
   * Validate response body is not empty
   */
  static validateResponseBody(response: K6Response): ValidationResult {
    if (!response.body || String(response.body).length === 0) {
      return {
        success: false,
        message: VALIDATION_MESSAGES.INVALID_RESPONSE_BODY,
      };
    }
    return { success: true };
  }

  /**
   * Log validation failure with detailed information
   */
  private static logFailure(testName: string, response: K6Response): void {
    const bodyPreview = response.body 
      ? String(response.body).substring(0, TEST_CONFIG.LOG_BODY_PREVIEW_LENGTH) 
      : 'No body';
    
    LoggerService.error(
      `${testName} failed: Status ${response.status}, Body: ${bodyPreview}`,
      'Validation'
    );
  }
}

