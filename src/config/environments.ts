/**
 * Environment-specific configurations
 */

export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  timeout: string;
  thresholds: {
    responseTime95: number;
    responseTime99: number;
    errorRate: number;
    requestRate: number;
  };
}

export const environments: Record<string, EnvironmentConfig> = {
  production: {
    name: 'Production',
    baseUrl: __ENV.BASE_URL || 'https://thinking-tester-contact-list.herokuapp.com',
    timeout: '30s',
    thresholds: {
      responseTime95: 500,
      responseTime99: 1000,
      errorRate: 0.01, // 1% error rate in production
      requestRate: 20,
    },
  },
  
  staging: {
    name: 'Staging',
    baseUrl: __ENV.BASE_URL || 'https://staging-contact-list.herokuapp.com',
    timeout: '45s',
    thresholds: {
      responseTime95: 800,
      responseTime99: 1500,
      errorRate: 0.05, // 5% error rate acceptable in staging
      requestRate: 10,
    },
  },
  
  qa: {
    name: 'QA',
    baseUrl: __ENV.BASE_URL || 'https://qa-contact-list.herokuapp.com',
    timeout: '60s',
    thresholds: {
      responseTime95: 1000,
      responseTime99: 2000,
      errorRate: 0.1, // 10% error rate acceptable in QA
      requestRate: 5,
    },
  },
  
  development: {
    name: 'Development',
    baseUrl: __ENV.BASE_URL || 'http://localhost:3000',
    timeout: '60s',
    thresholds: {
      responseTime95: 2000,
      responseTime99: 5000,
      errorRate: 0.2, // 20% error rate acceptable in dev
      requestRate: 1,
    },
  },
};

/**
 * Get environment configuration
 */
export function getEnvironment(): EnvironmentConfig {
  const envName = __ENV.ENVIRONMENT || 'production';
  const env = environments[envName.toLowerCase()];
  
  if (!env) {
    console.warn(`⚠️  Unknown environment: ${envName}. Using production config.`);
    return environments.production;
  }
  
  console.log(`🌍 Environment: ${env.name}`);
  console.log(`📍 Base URL: ${env.baseUrl}`);
  
  return env;
}

export default getEnvironment;

