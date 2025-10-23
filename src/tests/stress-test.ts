/**
 * Stress Testing Script for Contact List API
 * 
 * This script pushes the API to its limits to identify breaking points
 * and performance degradation thresholds.
 */

import { group, sleep } from 'k6';
import { UserAPI, ContactAPI } from '../utils/api';
import {
  generateRandomUser,
  generateRandomContact,
  checkResponse,
  parseJsonResponse,
  randomSleep,
} from '../utils/helpers';
import { config } from '../config/config';
import { AuthResponse, ContactResponse } from '../types';

interface SetupData {
  startTime: number;
}

// Stress test configuration
export const options = {
  scenarios: {
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 10 },   // Warm up
        { duration: '2m', target: 20 },   // Scale up
        { duration: '2m', target: 30 },   // Scale up more
        { duration: '2m', target: 40 },   // Push harder
        { duration: '2m', target: 50 },   // Maximum stress
        { duration: '3m', target: 50 },   // Maintain maximum
        { duration: '2m', target: 0 },    // Cool down
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_duration: ['p(99)<5000'], // 99% of requests should complete within 5s
    http_req_failed: ['rate<0.1'],      // Allow up to 10% failure rate under stress
  },
};

export default function (): void {
  let token: string | null = null;
  const contactIds: string[] = [];

  // Quick registration
  group('Registration', () => {
    const userData = generateRandomUser();
    const response = UserAPI.register(userData);
    
    if (response.status === 201) {
      const responseData = parseJsonResponse<AuthResponse>(response);
      token = responseData?.token || null;
    }
    
    sleep(0.5);
  });

  if (!token) {
    return;
  }

  // Aggressive contact creation
  group('Bulk Contact Creation', () => {
    for (let i = 0; i < 10; i++) {
      const contactData = generateRandomContact();
      const response = ContactAPI.add(token as string, contactData);
      
      if (response.status === 201) {
        const responseData = parseJsonResponse<ContactResponse>(response);
        if (responseData?._id) {
          contactIds.push(responseData._id);
        }
      }
      
      sleep(0.2); // Minimal sleep for stress
    }
  });

  // Concurrent reads
  group('Concurrent Reads', () => {
    for (let i = 0; i < 5; i++) {
      ContactAPI.getAll(token as string);
      sleep(0.1);
    }
  });

  // Rapid updates
  group('Rapid Updates', () => {
    if (contactIds.length > 0) {
      for (let i = 0; i < Math.min(5, contactIds.length); i++) {
        const contactId = contactIds[i];
        const updateData = { phone: `555${Math.floor(Math.random() * 10000000)}` };
        ContactAPI.partialUpdate(token as string, contactId, updateData);
        sleep(0.1);
      }
    }
  });

  // Bulk deletion
  group('Bulk Deletion', () => {
    for (const contactId of contactIds) {
      ContactAPI.delete(token as string, contactId);
      sleep(0.1);
    }
  });

  randomSleep(0.5, 1);
}

export function setup(): SetupData {
  console.log('🔥 Starting Stress Test...');
  console.log('⚠️  This test will push the API to its limits');
  console.log(`📍 Base URL: ${config.baseUrl}`);
  return { startTime: Date.now() };
}

export function teardown(data: SetupData): void {
  const duration = ((Date.now() - data.startTime) / 1000).toFixed(2);
  console.log(`✅ Stress Test Completed in ${duration} seconds`);
  console.log('📊 Review the metrics to identify performance bottlenecks');
}

