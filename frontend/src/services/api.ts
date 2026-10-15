import {
  Category,
  MenuItem,
  Order,
  OrderStatus,
  User,
  FulfillmentType,
  PaymentMethod,
  DeliveryAddress,
  PickupDetails,
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const config: RequestInit = {
    ...options,
    credentials: 'include', // Ensure cookies are sent and received
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message || 'Something went wrong', response.status);
  }

  return data as T;
}

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------
export const api = {
  auth: {
    register: (userData: { name: string; email: string; password: string; phone?: string }) =>
      request<{ success: boolean; message: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    login: (credentials: { email: string; password: string }) =>
      request<{ success: boolean; message: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    logout: () =>
      request<{ success: boolean; message: string }>('/auth/logout', {
        method: 'POST',
      }),

    getMe: () =>
      request<{ success: boolean; user: User | null }>('/auth/me', {
        method: 'GET',
      }),
  },

  // -------------------------------------------------------------
  // Categories Endpoints
  // -------------------------------------------------------------
  categories: {
    getAll: (includeInactive = false) =>
      request<{ success: boolean; count: number; data: Category[] }>(
        `/categories${includeInactive ? '?includeInactive=true' : ''}`
      ),

    getById: (id: string) =>
      request<{ success: boolean; data: Category }>(`/categories/${id}`),

    create: (data: Partial<Category>) =>
      request<{ success: boolean; message: string; data: Category }>('/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<Category>) =>
      request<{ success: boolean; message: string; data: Category }>(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/categories/${id}`, {
        method: 'DELETE',
      }),
  },

  // -------------------------------------------------------------
  // Menu Items Endpoints
  // -------------------------------------------------------------
  menuItems: {
    getAll: (params?: { category?: string; search?: string; isAvailable?: boolean; featured?: boolean }) => {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.search) query.append('search', params.search);
      if (params?.isAvailable !== undefined) query.append('isAvailable', String(params.isAvailable));
      if (params?.featured !== undefined) query.append('featured', String(params.featured));

      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<{ success: boolean; count: number; data: MenuItem[] }>(`/menu-items${qs}`);
    },

    getById: (id: string) =>
      request<{ success: boolean; data: MenuItem }>(`/menu-items/${id}`),

    create: (data: Partial<MenuItem>) =>
      request<{ success: boolean; message: string; data: MenuItem }>('/menu-items', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<MenuItem>) =>
      request<{ success: boolean; message: string; data: MenuItem }>(`/menu-items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/menu-items/${id}`, {
        method: 'DELETE',
      }),

    toggleAvailability: (id: string) =>
      request<{ success: boolean; message: string; isAvailable: boolean }>(
        `/menu-items/${id}/availability`,
        { method: 'PATCH' }
      ),
  },

  // -------------------------------------------------------------
  // Orders Endpoints
  // -------------------------------------------------------------
  orders: {
    create: (orderData: {
      items: { menuItemId: string; quantity: number }[];
      fulfillmentType: FulfillmentType;
      deliveryAddress?: DeliveryAddress;
      pickupDetails?: PickupDetails;
      paymentMethod: PaymentMethod;
      customerNotes?: string;
    }) =>
      request<{ success: boolean; message: string; data: Order }>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),

    getMyOrders: () =>
      request<{ success: boolean; count: number; data: Order[] }>('/orders/my-orders'),

    getById: (id: string) =>
      request<{ success: boolean; data: Order }>(`/orders/${id}`),

    getAll: (params?: { status?: string; fulfillmentType?: string; search?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.fulfillmentType) query.append('fulfillmentType', params.fulfillmentType);
      if (params?.search) query.append('search', params.search);

      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<{ success: boolean; count: number; data: Order[] }>(`/orders${qs}`);
    },

    updateStatus: (id: string, status: OrderStatus, note?: string) =>
      request<{ success: boolean; message: string; data: Order }>(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      }),
  },
};
