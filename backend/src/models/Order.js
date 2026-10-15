import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    itemTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Order must contain at least one item'],
      validate: [
        (items) => Array.isArray(items) && items.length > 0,
        'Order must have at least one food item',
      ],
    },
    fulfillmentType: {
      type: String,
      enum: {
        values: ['delivery', 'pickup'],
        message: '{VALUE} is not a valid fulfillment type',
      },
      required: [true, 'Please select delivery or pickup'],
    },
    deliveryAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
      phone: { type: String, default: '' },
      instructions: { type: String, default: '' },
    },
    pickupDetails: {
      contactPhone: { type: String, default: '' },
      estimatedTime: { type: String, default: '' },
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['COD', 'Pay at Restaurant'],
        message: '{VALUE} is not supported. Use COD or Pay at Restaurant',
      },
      required: [true, 'Please select payment method'],
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: {
        values: [
          'Pending',
          'Confirmed',
          'Preparing',
          'Ready',
          'Out for Delivery',
          'Delivered',
          'Cancelled',
        ],
        message: '{VALUE} is not a valid order status',
      },
      default: 'Pending',
      index: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    customerNotes: {
      type: String,
      default: '',
      maxlength: 300,
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Helper function to validate status transition
orderSchema.methods.canTransitionTo = function (nextStatus) {
  const current = this.orderStatus;
  const isDelivery = this.fulfillmentType === 'delivery';

  // Any state can be cancelled except if already Delivered or Cancelled
  if (nextStatus === 'Cancelled') {
    return current !== 'Delivered' && current !== 'Cancelled';
  }

  const allowedTransitions = {
    Pending: ['Confirmed', 'Cancelled'],
    Confirmed: ['Preparing', 'Cancelled'],
    Preparing: ['Ready', 'Cancelled'],
    Ready: isDelivery
      ? ['Out for Delivery', 'Cancelled']
      : ['Delivered', 'Cancelled'],
    'Out for Delivery': ['Delivered', 'Cancelled'],
    Delivered: [],
    Cancelled: [],
  };

  return allowedTransitions[current]?.includes(nextStatus) || false;
};

const Order = mongoose.model('Order', orderSchema);
export default Order;
