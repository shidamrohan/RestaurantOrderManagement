import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';

/**
 * Generate human-readable unique order number: ORD-YYYYMMDD-XXXX
 */
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${dateStr}-${randomSuffix}`;
};

/**
 * @desc    Place a new order
 * @route   POST /api/orders
 * @access  Private (Authenticated Customer)
 */
export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      fulfillmentType,
      deliveryAddress,
      pickupDetails,
      paymentMethod,
      customerNotes,
    } = req.body;

    const customerId = req.session.user.id;

    // 1. Validation of fulfillment and payment method
    if (!fulfillmentType || !['delivery', 'pickup'].includes(fulfillmentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid fulfillment type. Choose either "delivery" or "pickup".',
      });
    }

    if (!paymentMethod || !['COD', 'Pay at Restaurant'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method. Choose "COD" or "Pay at Restaurant".',
      });
    }

    if (fulfillmentType === 'delivery' && paymentMethod !== 'COD') {
      return res.status(400).json({
        success: false,
        message: 'For delivery orders, payment method must be Cash on Delivery (COD).',
      });
    }

    if (fulfillmentType === 'pickup' && paymentMethod !== 'Pay at Restaurant') {
      return res.status(400).json({
        success: false,
        message: 'For pickup orders, payment method must be "Pay at Restaurant".',
      });
    }

    if (fulfillmentType === 'delivery') {
      if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.phone) {
        return res.status(400).json({
          success: false,
          message: 'Delivery street address and contact phone are required.',
        });
      }
    }

    // 2. Validate Items & Fetch fresh prices from Database
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Please select food items to place an order.',
      });
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const { menuItemId, quantity } = item;

      if (!menuItemId || !quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Invalid item data or quantity provided in cart.',
        });
      }

      const dbItem = await MenuItem.findById(menuItemId);
      if (!dbItem) {
        return res.status(400).json({
          success: false,
          message: `Food item with ID ${menuItemId} no longer exists.`,
        });
      }

      if (!dbItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `"${dbItem.name}" is currently sold out and unavailable.`,
        });
      }

      const itemTotal = Number((dbItem.price * quantity).toFixed(2));
      subtotal += itemTotal;

      orderItems.push({
        menuItem: dbItem._id,
        name: dbItem.name,
        price: dbItem.price,
        quantity,
        itemTotal,
      });
    }

    // 3. Calculate Fees and Taxes
    subtotal = Number(subtotal.toFixed(2));
    const deliveryFee = fulfillmentType === 'delivery' ? 5.0 : 0.0;
    const tax = Number((subtotal * 0.05).toFixed(2)); // 5% tax
    const totalAmount = Number((subtotal + deliveryFee + tax).toFixed(2));

    // 4. Create and Save Order
    let orderNumber = generateOrderNumber();
    // Guarantee uniqueness
    while (await Order.findOne({ orderNumber })) {
      orderNumber = generateOrderNumber();
    }

    const order = await Order.create({
      orderNumber,
      customer: customerId,
      items: orderItems,
      fulfillmentType,
      deliveryAddress: fulfillmentType === 'delivery' ? deliveryAddress : {},
      pickupDetails: fulfillmentType === 'pickup' ? pickupDetails : {},
      paymentMethod,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
      customerNotes: customerNotes || '',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date(),
          note: 'Order placed by customer',
          updatedBy: customerId,
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order history for current customer
 * @route   GET /api/orders/my-orders
 * @access  Private (Authenticated Customer)
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const customerId = req.session.user.id;
    const orders = await Order.find({ customer: customerId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single order details by ID
 * @route   GET /api/orders/:id
 * @access  Private (Customer owner, Staff, or Admin)
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.menuItem', 'image name');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const user = req.session.user;
    const isOwner = order.customer && order.customer._id.toString() === user.id;
    const isStaffOrAdmin = ['staff', 'admin'].includes(user.role);

    if (!isOwner && !isStaffOrAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this order',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders for Staff / Admin Dashboard
 * @route   GET /api/orders
 * @access  Private (Staff & Admin)
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, fulfillmentType, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (fulfillmentType && fulfillmentType !== 'all') {
      query.fulfillmentType = fulfillmentType;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'deliveryAddress.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status along allowed transition path
 * @route   PATCH /api/orders/:id/status
 * @access  Private (Staff & Admin)
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the next status to transition to',
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check transition validity
    if (!order.canTransitionTo(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from "${order.orderStatus}" to "${status}" for ${order.fulfillmentType} order.`,
      });
    }

    // Apply new status
    order.orderStatus = status;

    // If order reached 'Delivered', payment is collected on offline fulfillment
    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order marked as ${status} by staff`,
      updatedBy: req.session.user.id,
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status successfully updated to "${status}"`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
