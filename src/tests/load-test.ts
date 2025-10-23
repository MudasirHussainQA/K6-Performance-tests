import { group, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { UserAPI, ContactAPI } from '../utils/api';
import {
  generateRandomUser,
  generateRandomContact,
  parseJsonResponse,
  randomSleep,
} from '../utils/helpers';
import { config } from '../config/config';
import { User, AuthResponse, ContactResponse } from '../types';

const users = new SharedArray('users', function () {
  const userArray = [];
  for (let i = 0; i < 10; i++) {
    userArray.push(generateRandomUser());
  }
  return userArray;
});

interface SetupData {
  startTime: number;
}

export const options = {
  scenarios: {
    ramping_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 5 },
        { duration: '2m', target: 5 },
        { duration: '30s', target: 10 },
        { duration: '2m', target: 10 },
        { duration: '30s', target: 20 },
        { duration: '2m', target: 20 },
        { duration: '1m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    http_req_failed: ['rate<0.05'],
    http_reqs: ['rate>5'],
  },
};

export default function (): void {
  const userData = users[__VU % users.length];
  let token: string | null = null;

  group('Authentication', () => {
    let response = UserAPI.login(userData.email, userData.password);
    
    if (response.status === 200) {
      const responseData = parseJsonResponse<AuthResponse>(response);
      token = responseData?.token || null;
    } else {
      response = UserAPI.register(userData);
      if (response.status === 201) {
        const responseData = parseJsonResponse<AuthResponse>(response);
        token = responseData?.token || null;
      }
    }
    
    sleep(1);
  });

  if (!token) {
    return;
  }

  const scenario = Math.random();

  if (scenario < 0.3) {
    group('Read Contacts', () => {
      ContactAPI.getAll(token as string);
      sleep(1);
      ContactAPI.getAll(token as string);
    });
  } else if (scenario < 0.6) {
    group('Create Contacts', () => {
      for (let i = 0; i < 3; i++) {
        const contactData = generateRandomContact();
        ContactAPI.add(token as string, contactData);
        sleep(0.5);
      }
    });
  } else if (scenario < 0.85) {
    group('Mixed Operations', () => {
      const contactData = generateRandomContact();
      const addResponse = ContactAPI.add(token as string, contactData);
      
      if (addResponse.status === 201) {
        const responseData = parseJsonResponse<ContactResponse>(addResponse);
        const contactId = responseData?._id;
        
        sleep(1);
        
        if (contactId) {
          ContactAPI.getById(token as string, contactId);
          sleep(1);
          
          const updatedData = generateRandomContact();
          ContactAPI.update(token as string, contactId, updatedData);
          sleep(1);
          
          ContactAPI.delete(token as string, contactId);
        }
      }
    });
  } else {
    group('Profile Operations', () => {
      UserAPI.getProfile(token as string);
      sleep(1);
      
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };
      UserAPI.updateProfile(token as string, updateData);
    });
  }

  randomSleep(1, 5);
}

export function setup(): SetupData {
  console.log('🚀 Starting Load Test...');
  console.log(`📊 Simulating realistic user load patterns`);
  console.log(`📍 Base URL: ${config.baseUrl}`);
  return { startTime: Date.now() };
}

export function teardown(data: SetupData): void {
  const duration = ((Date.now() - data.startTime) / 1000).toFixed(2);
  console.log(`✅ Load Test Completed in ${duration} seconds`);
}
