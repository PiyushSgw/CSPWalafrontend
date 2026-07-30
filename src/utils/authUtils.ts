// Utility functions to handle authentication for both CSP and Admin users

export const getAuthToken = (): { token: string; isAdmin: boolean } | null => {
  if (typeof window === 'undefined') return null;
  
  const adminToken = localStorage.getItem('admin_token');
  const cspToken = localStorage.getItem('csp_access_token');
  
  if (adminToken) {
    return { token: adminToken, isAdmin: true };
  }
  
  if (cspToken) {
    return { token: cspToken, isAdmin: false };
  }
  
  return null;
};

export const getAuthHeaders = (): Record<string, string> => {
  const auth = getAuthToken();
  if (!auth) return {};
  
  return {
    'Authorization': `Bearer ${auth.token}`,
    'Content-Type': 'application/json'
  };
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const isAdminUser = (): boolean => {
  const auth = getAuthToken();
  return auth?.isAdmin || false;
};

export const getCspToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('csp_access_token');
};

export const getAdminToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
};

// API URL builder based on user type
export const getApiUrl = (endpoint: string): string => {
  const auth = getAuthToken();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  
  if (auth?.isAdmin) {
    // Admin endpoints
    const adminEndpoint = endpoint.startsWith('/admin/') ? endpoint : `/admin${endpoint}`;
    return baseUrl.includes('/api') 
      ? `${baseUrl}${adminEndpoint}`
      : `${baseUrl}/api${adminEndpoint}`;
  } else {
    // CSP endpoints
    const cspEndpoint = endpoint.startsWith('/csp/') ? endpoint : `/csp${endpoint}`;
    return baseUrl.includes('/api') 
      ? `${baseUrl}${cspEndpoint}`
      : `${baseUrl}/api${cspEndpoint}`;
  }
};
