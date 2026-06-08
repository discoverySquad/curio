export const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...(body && { body: JSON.stringify(body) }),
    });

    return response.json();
};
