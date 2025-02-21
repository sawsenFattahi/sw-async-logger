import * as fs from 'fs';
import { performance } from 'perf_hooks';

export enum LogLevel {
    INFO = 'info',
    ERROR = 'error',
    DEBUG = 'debug',
    WARN = 'warn',
    FATAL = 'fatal'
}

export class Logger {
    static log(level: LogLevel, message: string) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${level}] ${timestamp} - ${message}\n`;
        console.log(logMessage);
        const logFilePath = process.env.NODE_ENV === "test" ? "log-test.txt" : process.env.LOG_FILE_PATH || "log.txt";
        fs.appendFileSync(logFilePath, logMessage);
    }
}

export function logAsync(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        const startTime = performance.now();
        try {
            Logger.log(LogLevel.INFO, `Start ${propertyKey} with args: ${JSON.stringify(args)}`);
            const result = await originalMethod.apply(this, args);
            const endTime = performance.now();
            Logger.log(LogLevel.INFO, `End ${propertyKey} with result: ${JSON.stringify(result)}`);
            const executionTime = endTime - startTime;
            Logger.log(LogLevel.INFO, `${propertyKey} executed in ${executionTime}ms`);
            return result;
        } catch (error: any) {
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            Logger.log(LogLevel.ERROR, `${propertyKey} executed in ${executionTime}ms with error: ${error.message}`);
            throw error;
        }
    };
    return descriptor;
}