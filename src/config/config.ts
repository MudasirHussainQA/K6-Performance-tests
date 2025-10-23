/**
 * Configuration file for K6 Contact List API Testing
 */

import { TestConfig } from '../types';
import { getEnvironment } from './environments';

const env = getEnvironment();

// Get test type from environment
const TEST_TYPE = __ENV.TEST_TYPE || 'smoke';

// Determine appropriate request rate threshold based on test type
function getRequestRateThreshold(testType: string): number {
  switch (testType) {
    case 'smoke':
      return 0.5;  // 1 VU = low rate, just validate functionality
    case 'load':
      return 10;   // 10 VUs = moderate rate
    case 'stress':
      return 20;   // 20+ VUs = high rate
    case 'spike':
      return 15;   // Variable VUs = medium-high rate
    default:
      return 1;
  }
}

export const config: TestConfig = {
  // Base API URL from environment
  baseUrl: env.baseUrl,
  
  // Test scenarios configuration
  scenarios: {
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '1m',
    },
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 10 },
        { duration: '5m', target: 10 },
        { duration: '2m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 10 },
        { duration: '5m', target: 10 },
        { duration: '2m', target: 20 },
        { duration: '5m', target: 20 },
        { duration: '2m', target: 30 },
        { duration: '5m', target: 30 },
        { duration: '10m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 5 },
        { duration: '1m', target: 5 },
        { duration: '10s', target: 50 },
        { duration: '3m', target: 50 },
        { duration: '10s', target: 5 },
        { duration: '3m', target: 5 },
        { duration: '10s', target: 0 },
      ],
    },
  },
  
  // Performance thresholds - adjusted based on test type
  thresholds: {
    http_req_duration: [
      `p(95)<${env.thresholds.responseTime95}`,
      `p(99)<${env.thresholds.responseTime99}`
    ],
    http_req_failed: [`rate<${env.thresholds.errorRate}`],
    // Realistic rate threshold per test type
    http_reqs: [`rate>${getRequestRateThreshold(TEST_TYPE)}`],
  },
  
  // HTTP settings
  http: {
    timeout: env.timeout,
    responseType: 'text',
  },
};

export default config;
