# Async Logger 📜

A simple **Node.js** library to log **async functions** with error handling and performance tracking.

## 🚀 Features
- ✅ **Automatic logging** for async function calls
- ✅ **Error handling** with logs
- ✅ **Execution time tracking**
- ✅ **Easy to use decorator-based approach**

---

## 📦 Installation
```sh
npm install perf-async-logger
```
## 🔧 How to Use
1️⃣ Import the Logger

import { logAsync, Logger, LogLevel } from "perf-async-logger";

2️⃣ Use the @logAsync Decorator

Apply @logAsync to your async functions:

import { logAsync } from "perf-async-logger";

class MyService {
    @logAsync
    async fetchData(value: string): Promise<string> {
        return `Received: ${value}`;
    }

    @logAsync
    async fetchWithError(): Promise<void> {
        throw new Error("Intentional error");
    }
}

const service = new MyService();
service.fetchData("test");  // Logs execution time and success
service.fetchWithError();   // Logs error message

📜 Logger Output

The library logs start time, execution time, and errors:

✅ Successful function call

[INFO] 2025-02-21T15:28:37.986Z - Start fetchData with args: ["test"]
[INFO] 2025-02-21T15:28:37.991Z - End fetchData with result: "Received: test"
[INFO] 2025-02-21T15:28:37.996Z - fetchData executed in 5.679ms

❌ Error in function

[INFO] 2025-02-21T15:26:49.260Z - Start fetchWithError with args: []
[ERROR] 2025-02-21T15:26:49.265Z - fetchWithError executed in 5.052ms with error: Intentional error

⚙️ Custom Logging

You can manually log messages using the Logger class:

import { Logger, LogLevel } from "perf-async-logger";

Logger.log(LogLevel.INFO, "This is an info message");
Logger.log(LogLevel.ERROR, "Something went wrong!");

🛠 Configuration (Optional)

By default, logs are written to log.txt.
To change this, set the LOG_FILE environment variable:

export LOG_FILE=custom-log.txt

---

### 📄 License

This project is licensed under the MIT License.
🤝 Contributing

Feel free to fork and submit PRs! 🚀

---

### 📬 Contact

Created by sawssen Fattahi https://github.com/sawsenFattahi


---

### **🆕 Updates:**
✅ **Added a "How to Use" section** with clear steps  
✅ **Explained configuration (changing log file name)**  
✅ **More clarity on error logging and outputs**  

Let me know if you need any other changes! 🚀🔥