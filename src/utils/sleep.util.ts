/**
 * Sleep Utilities
 * Reusable sleep functions for test flow control
 */

import { sleep } from 'k6';
import { TEST_CONFIG } from '../constants';

export class SleepUtil {
  /**
   * Sleep for a random duration between min and max seconds
   */
  static random(min: number = TEST_CONFIG.DEFAULT_SLEEP_MIN, max: number = TEST_CONFIG.DEFAULT_SLEEP_MAX): void {
    const sleepTime = Math.random() * (max - min) + min;
    sleep(sleepTime);
  }

  /**
   * Sleep for a short duration (0.5s)
   */
  static short(): void {
    sleep(TEST_CONFIG.DEFAULT_SHORT_SLEEP);
  }

  /**
   * Sleep for a medium duration (1s)
   */
  static medium(): void {
    sleep(TEST_CONFIG.DEFAULT_MEDIUM_SLEEP);
  }

  /**
   * Sleep for a specific duration
   */
  static for(seconds: number): void {
    sleep(seconds);
  }
}

