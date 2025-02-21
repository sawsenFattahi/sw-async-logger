import * as fs from 'fs';
import { logAsync } from "../src";

class TestService {
    @logAsync
    async fetchData(value: string): Promise<string> {
        return `Received: ${value}`;
    }

    @logAsync
    async fetchWithError(): Promise<void> {
        throw new Error("Intentional error");
    }
}

describe("logAsync Decorator", () => {
    let consoleLogSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;
    let service: TestService;
    const logFilePath = 'log-test.txt';

    beforeEach(() => {
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
        service = new TestService();
    });

    afterEach(() => {
        if (fs.existsSync(logFilePath)) {
            fs.unlinkSync(logFilePath);
        }
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    test("should log input arguments and result", async () => {
        const result = await service.fetchData("test");
    
        expect(result).toBe("Received: test");
    
        expect(consoleLogSpy.mock.calls[0][0]).toMatch(/Start fetchData with args:/);
        expect(consoleLogSpy.mock.calls[1][0]).toMatch(/End fetchData with result:/);
        expect(consoleLogSpy.mock.calls[2][0]).toMatch(/fetchData executed in/);
    
        // Check if the log file contains expected logs
        const logContent = fs.readFileSync(logFilePath, 'utf-8');
        expect(logContent).toContain("Start fetchData with args:");
    });
    
    test("should log errors when an exception is thrown", async () => {
        await expect(service.fetchWithError()).rejects.toThrow("Intentional error");

        expect(consoleLogSpy.mock.calls.some(call => call[0].includes("fetchWithError"))).toBe(true);
        
        // Check if the error is written in the log file
        const logContent = fs.readFileSync(logFilePath, 'utf-8');
        expect(logContent).toContain("fetchWithError executed in");
        expect(logContent).toContain("Intentional error");
    });
});
