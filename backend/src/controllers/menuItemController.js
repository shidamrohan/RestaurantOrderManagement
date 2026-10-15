import MenuItem from '../models/MenuItem.js';
import Category from '../models/Category.js';

/**
 * @desc    Get all menu items with category filter, availability, and search
 * @route   GET /api/menu-items
 * @access  Public
 */
export const getMenuItems = async (req, res, next) => {
  try {
    const { category, search, isAvailable, featured, sort } = req.query;
    const query = {};

    // Filter by availability
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }

    // Filter by featured
    if (featured !== undefined) {
      query.isFeatured = featured === 'true';
    }

    // Filter by category (by ID or by slug)
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCat = await Category.findOne({ slug: category });
        if (foundCat) {
          query.category = foundCat._id;
        }
      }
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Sorting
    let sortQuery = { isFeatured: -1, createdAt: -1 };
    if (sort === 'price_asc') sortQuery = { price: 1 };
    if (sort === 'price_desc') sortQuery = { price: -1 };
    if (sort === 'name_asc') sortQuery = { name: 1 };

    const items = await MenuItem.find(query)
      .populate('category', 'name slug')
      .sort(sortQuery);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single menu item by ID
 * @route   GET /api/menu-items/:id
 * @access  Public
 */
export const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate(
      'category',
      'name slug'
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new menu item
 * @route   POST /api/menu-items
 * @access  Private (Admin only)
 */
export const createMenuItem = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      isAvailable,
      preparationTime,
      tags,
      isFeatured,
    } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, price, and category',
      });
    }

    // Check category existence
    const catExists = await Category.findById(category);
    if (!catExists) {
      return res.status(400).json({
        success: false,
        message: 'Selected category does not exist',
      });
    }

    const item = await MenuItem.create({
      name,
      description,
      price: Number(price),
      category,
      image: image || '',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      preparationTime: preparationTime ? Number(preparationTime) : 20,
      tags: Array.isArray(tags) ? tags : [],
      isFeatured: Boolean(isFeatured),
    });

    const populatedItem = await item.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: populatedItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a menu item
 * @route   PUT /api/menu-items/:id
 * @access  Private (Admin only)
 */
export const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    const {
      name,
      description,
      price,
      category,
      image,
      isAvailable,
      preparationTime,
      tags,
      isFeatured,
    } = req.body;

    if (category) {
      const catExists = await Category.findById(category);
      if (!catExists) {
        return res.status(400).json({
          success: false,
          message: 'Selected category does not exist',
        });
      }
      item.category = category;
    }

    if (name) item.name = name;
    if (description !== undefined) item.description = description;
    if (price !== undefined) item.price = Number(price);
    if (image !== undefined) item.image = image;
    if (isAvailable !== undefined) item.isAvailable = isAvailable;
    if (preparationTime !== undefined) item.preparationTime = Number(preparationTime);
    if (tags !== undefined) item.tags = Array.isArray(tags) ? tags : [];
    if (isFeatured !== undefined) item.isFeatured = Boolean(isFeatured);

    await item.save();
    const updatedItem = await item.populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a menu item
 * @route   DELETE /api/menu-items/:id
 * @access  Private (Admin only)
 */
export const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Quick toggle availability for restaurant staff/admin
 * @route   PATCH /api/menu-items/:id/availability
 * @access  Private (Staff & Admin)
 */
export const toggleAvailability = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.status(200).json({
      success: true,
      message: `Item marked as ${item.isAvailable ? 'available' : 'unavailable'}`,
      isAvailable: item.isAvailable,
    });
  } catch (error) {
    next(error);
  }
};
