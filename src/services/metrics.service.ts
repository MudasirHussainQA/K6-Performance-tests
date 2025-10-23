/**
 * Metrics Service
 * Centralized metrics recording
 */

import { Rate, Trend, Counter } from 'k6/metrics';

export class MetricsService {
  private static errorRate = new Rate('errors');
  private static successRate = new Rate('success');
  private static apiDuration = new Trend('api_duration');
  private static failedRequests = new Counter('failed_requests');

  static recordError(isError: boolean): void {
    this.errorRate.add(isError);
  }

  static recordSuccess(isSuccess: boolean): void {
    this.successRate.add(isSuccess);
  }

  static recordApiDuration(duration: number): void {
    this.apiDuration.add(duration);
  }

  static incrementFailedRequests(): void {
    this.failedRequests.add(1);
  }
}

