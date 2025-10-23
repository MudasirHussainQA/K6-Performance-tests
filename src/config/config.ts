/**
 * Configuration file for K6 Contact List API Testing
 */

import { TestConfig } from '../types';
import { getEnvironment } from './environments';

const env = getEnvironment();

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
  
  // Performance thresholds from environment
  thresholds: {
    http_req_duration: [
      `p(95)<${env.thresholds.responseTime95}`,
      `p(99)<${env.thresholds.responseTime99}`
    ],
    http_req_failed: [`rate<${env.thresholds.errorRate}`],
    http_reqs: [`rate>${env.thresholds.requestRate}`],
  },
  
  // HTTP settings
  http: {
    timeout: env.timeout,
    responseType: 'text',
  },
};

export default config;
