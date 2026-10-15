import User from '../models/User.js';

/**
 * @desc    Register a new customer account
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // New registrations default strictly to 'customer'
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: 'customer',
    });

    // Save user info in session
    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    req.session.save((err) => {
      if (err) return next(err);
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user & create session
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Save user info in session
    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    req.session.save((err) => {
      if (err) return next(err);
      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user & destroy session
 * @route   POST /api/auth/logout
 * @access  Public / Authenticated
 */
export const logout = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Could not log out, please try again',
        });
      }
      res.clearCookie('restaurant.sid');
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    });
  } else {
    res.status(200).json({
      success: true,
      message: 'Already logged out',
    });
  }
};

/**
 * @desc    Get current logged in user session
 * @route   GET /api/auth/me
 * @access  Authenticated
 */
export const getMe = async (req, res, next) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(200).json({
        success: true,
        user: null,
      });
    }

    const user = await User.findById(req.session.user.id);
    if (!user) {
      req.session.destroy();
      return res.status(200).json({
        success: true,
        user: null,
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};
