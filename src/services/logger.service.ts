/**
 * Logger Service
 * Centralized logging with consistent formatting
 */

export class LoggerService {
  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  static info(message: string, context?: string): void {
    const timestamp = this.getTimestamp();
    const contextStr = context ? ` [${context}]` : '';
    console.log(`[${timestamp}]${contextStr} ℹ️  ${message}`);
  }

  static success(message: string, context?: string): void {
    const contextStr = context ? ` [${context}]` : '';
    console.log(`${contextStr} ✅ ${message}`);
  }

  static error(message: string, context?: string): void {
    const contextStr = context ? ` [${context}]` : '';
    console.error(`${contextStr} ❌ ${message}`);
  }

  static warn(message: string, context?: string): void {
    const contextStr = context ? ` [${context}]` : '';
    console.warn(`${contextStr} ⚠️  ${message}`);
  }

  static test(testName: string, details?: string): void {
    const timestamp = this.getTimestamp();
    const detailsStr = details ? ` ${details}` : '';
    console.log(`[${timestamp}] 🧪 ${testName}${detailsStr}`);
  }

  static debug(message: string, data?: any): void {
    if (__ENV.DEBUG === 'true') {
      const timestamp = this.getTimestamp();
      console.log(`[${timestamp}] 🔍 ${message}`);
      if (data) {
        console.log(JSON.stringify(data, null, 2));
      }
    }
  }

  static metric(metricName: string, value: number | string, unit?: string): void {
    const unitStr = unit ? ` ${unit}` : '';
    console.log(`📊 ${metricName}: ${value}${unitStr}`);
  }

  static separator(char: string = '═', length: number = 60): void {
    console.log(char.repeat(length));
  }

  static header(title: string): void {
    this.separator('═');
    console.log(`║  ${title.padEnd(56)}  ║`);
    this.separator('═');
  }

  static section(title: string): void {
    console.log('');
    console.log(`▶️  ${title}`);
    console.log('─'.repeat(60));
  }
}

