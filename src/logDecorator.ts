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

function safeStringify(obj: any) {
    try {
        return JSON.stringify(obj);
    } catch (error) {
        return '[Unserializable Object]';
    }
}

function truncate(str: string, length = 500) {
    return str.length > length ? str.substring(0, length) + '...' : str;
}

export function logAsync(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        const startTime = performance.now();
        try {
            Logger.log(LogLevel.INFO, `Start ${propertyKey} with args: ${safeStringify(args)}`);

            const result = originalMethod.apply(this, args);

            if (result instanceof Promise) {
                return result
                    .then((res) => {
                        const endTime = performance.now();
                        Logger.log(LogLevel.INFO, `End ${propertyKey} with result: ${truncate(safeStringify(res))}`);
                        Logger.log(LogLevel.INFO, `${propertyKey} executed in ${endTime - startTime}ms`);
                        return res;
                    })
                    .catch((error) => {
                        const endTime = performance.now();
                        Logger.log(LogLevel.ERROR, `${propertyKey} executed in ${endTime - startTime}ms with error: ${error.message}`);
                        throw error;
                    });
            } else {
                const endTime = performance.now();
                Logger.log(LogLevel.INFO, `End ${propertyKey} with result: ${truncate(safeStringify(result))}`);
                Logger.log(LogLevel.INFO, `${propertyKey} executed in ${endTime - startTime}ms`);
                return result;
            }
        } catch (error: any) {
            const endTime = performance.now();
            Logger.log(LogLevel.ERROR, `${propertyKey} executed in ${endTime - startTime}ms with error: ${error.message}`);
            throw error;
        }
    };

    return descriptor;
}
