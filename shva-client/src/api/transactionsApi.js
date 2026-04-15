import { fetchWithAuth } from './apiClient';

async function handleResponse(response) {
  if (response.status === 401) {
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    let message = `HTTP ${response.status}`;

    try {
      const data = await response.json();

      if (data?.message) {
        message = data.message;
      }
    } catch (e) {
      // Response is not JSON (could be empty, text, or HTML error page)
      console.warn('Non-JSON response received', e);
    }

    throw new Error(message);
  }

  return response.json();
}

export async function login(username, password) {
  const response = await fetchWithAuth('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  return handleResponse(response);
}

export async function submitTransaction(region, time) {
  const response = await fetchWithAuth('/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ region, time }),
  });

  return handleResponse(response);
}

export async function getApprovedTransactions() {
  const response = await fetchWithAuth('/transactions/approved');

  return handleResponse(response);
}
