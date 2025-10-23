/**
 * TypeScript type definitions for Contact List API
 */

import { RefinedResponse, ResponseType } from 'k6/http';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
}

export interface Contact {
  firstName: string;
  lastName: string;
  birthdate: string;
  email: string;
  phone: string;
  street1: string;
  street2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
}

export interface ContactResponse extends Contact {
  _id: string;
  owner: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export interface PartialContact {
  firstName?: string;
  lastName?: string;
  birthdate?: string;
  email?: string;
  phone?: string;
  street1?: string;
  street2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
}

export interface TestConfig {
  baseUrl: string;
  scenarios: {
    smoke: ScenarioConfig;
    load: ScenarioConfig;
    stress: ScenarioConfig;
    spike: ScenarioConfig;
  };
  thresholds: Record<string, string[]>;
  http: {
    timeout: string;
    responseType: string;
  };
}

export interface ScenarioConfig {
  executor: string;
  vus?: number;
  duration?: string;
  startVUs?: number;
  stages?: Stage[];
  gracefulRampDown?: string;
}

export interface Stage {
  duration: string;
  target: number;
}

export interface Headers {
  [name: string]: string;
}

export type K6Response = RefinedResponse<ResponseType | undefined>;

