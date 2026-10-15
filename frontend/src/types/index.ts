export type UserRole = 'customer' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category | { _id: string; name: string; slug: string };
  image?: string;
  isAvailable: boolean;
  preparationTime: number;
  tags: string[];
  isFeatured?: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export type FulfillmentType = 'delivery' | 'pickup';
export type PaymentMethod = 'COD' | 'Pay at Restaurant';
export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  menuItem: string | MenuItem;
  name: string;
  price: number;
  quantity: number;
  itemTotal: number;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  instructions?: string;
}

export interface PickupDetails {
  contactPhone: string;
  estimatedTime?: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: User | { _id: string; name: string; email: string; phone?: string };
  items: OrderItem[];
  fulfillmentType: FulfillmentType;
  deliveryAddress?: DeliveryAddress;
  pickupDetails?: PickupDetails;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid';
  orderStatus: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  totalAmount: number;
  customerNotes?: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}
