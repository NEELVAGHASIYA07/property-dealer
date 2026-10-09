// AdonisJS Backend API Client
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
export const API_ENDPOINT = `${API_BASE_URL}/api`;

/**
 * Fetch properties with filters
 */
export async function getProperties(params = {}) {
  try {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        qs.append(key, String(val));
      }
    });

    const res = await fetch(`${API_ENDPOINT}/properties?${qs.toString()}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn('Backend API unavailable or error occurred:', error);
    return null;
  }
}

/**
 * Fetch trending properties
 */
export async function getTrendingProperties() {
  try {
    const res = await fetch(`${API_ENDPOINT}/trending`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn('Backend API unavailable for trending:', error);
    return null;
  }
}

/**
 * Fetch cities list
 */
export async function getCities() {
  try {
    const res = await fetch(`${API_ENDPOINT}/cities`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn('Backend API unavailable for cities:', error);
    return null;
  }
}

/**
 * Fetch single property details by ID
 */
export async function getPropertyById(id) {
  try {
    const res = await fetch(`${API_ENDPOINT}/properties/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`Backend API unavailable for property ${id}:`, error);
    return null;
  }
}

/**
 * Create a new property
 */
export async function createProperty(data) {
  const res = await fetch(`${API_ENDPOINT}/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || `Failed to create property: ${res.status}`);
  }

  return await res.json();
}

/**
 * Update an existing property
 */
export async function updateProperty(id, data) {
  const res = await fetch(`${API_ENDPOINT}/properties/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to update property: ${res.status}`);
  }

  return await res.json();
}

/**
 * Delete a property
 */
export async function deleteProperty(id) {
  const res = await fetch(`${API_ENDPOINT}/properties/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to delete property: ${res.status}`);
  }

  return await res.json();
}

/**
 * User login
 */
export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Login failed');
  }

  return await res.json();
}

/**
 * User signup
 */
export async function signupUser({ fullName, email, password }) {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password, passwordConfirmation: password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Signup failed');
  }

  return await res.json();
}
