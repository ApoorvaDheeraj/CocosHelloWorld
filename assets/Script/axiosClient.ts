import { HttpClient } from './model';

export class AxiosHttpClient implements HttpClient {

    async get<T>(url: string): Promise<T> {
        try {
            const response = await fetch(url);
            if (response.ok) {
                console.warn('Network response was  ok.');
                for(const pair in response.headers){
                    console.log(`${pair[0]}: ${pair[1]}`); 
                  }
            }
            return await response.json() as T;
        } catch (error) {
            console.error('Error fetching data:', JSON.stringify(error));
            throw error; // Rethrow the error for upstream handling
        }
    }
}
