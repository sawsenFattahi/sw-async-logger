import { logAsync } from "../src";

class ExampleService {
    @logAsync
    async fetchData(url: string): Promise<any> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }
}

(async () => {
    const exampleService = new ExampleService();
    try {
        const data = await exampleService.fetchData('https://jsonplaceholder.typicode.com/posts/1');
        console.log('Fetched data:', data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
})();
