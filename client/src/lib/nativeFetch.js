import { CapacitorHttp } from '@capacitor/core';

// Custom fetch implementation using CapacitorHttp
export const capacitorFetch = async (url, options = {}) => {
    const { method = 'GET', headers = {}, body } = options;

    // Convert headers to simple object if it's a Headers object
    const requestHeaders = {};
    if (headers instanceof Headers) {
        headers.forEach((value, key) => {
            requestHeaders[key] = value;
        });
    } else {
        Object.assign(requestHeaders, headers);
    }

    // Prepare options for CapacitorHttp
    const httpOptions = {
        url,
        method,
        headers: requestHeaders,
        data: body,
    };

    try {
        const response = await CapacitorHttp.request(httpOptions);

        // Convert response headers to Headers object
        const responseHeaders = new Headers();
        Object.keys(response.headers).forEach(key => {
            responseHeaders.append(key, response.headers[key]);
        });

        // Create a Response-like object that Supabase expects
        return new Response(JSON.stringify(response.data), {
            status: response.status,
            statusText: response.status === 200 ? 'OK' : 'Error',
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('CapacitorHttp Error:', error);
        throw new TypeError('Network request failed');
    }
};
