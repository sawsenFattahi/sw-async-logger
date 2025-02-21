export declare function logAsync(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor;
  
  export declare class Logger {
    static log(level: LogLevel, message: string): void;
  }
  
  export enum LogLevel {
    INFO = "info",
    ERROR = "error",
    DEBUG = "debug",
    WARN = "warn",
    FATAL = "fatal"
  }
  