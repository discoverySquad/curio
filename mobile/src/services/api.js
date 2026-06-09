export const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
    const url = `${API_URL}${endpoint}`;

    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...(body && { body: JSON.stringify(body) }),
    });

    const text = await response.text();

    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        throw new Error(`Backend returned non-JSON response. Status: ${response.status}`);
    }

    if (!response.ok) {
        throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
    }

    return data;
};
