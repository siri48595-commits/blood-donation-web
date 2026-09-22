import crypto from 'crypto';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendPasswordResetEmail } from '../services/emailService.js';
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidBloodGroup,
  isValidRole,
} from '../utils/validators.js';

/**
 * Register user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      role,
      bloodGroup,
      dateOfBirth,
      gender,
      city,
      state,
      area,
      pincode,
    } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number',
      });
    }

    if (!isValidRole(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role selected',
      });
    }

    if (!isValidBloodGroup(bloodGroup)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid blood group',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      role,
      bloodGroup,
      dateOfBirth,
      gender,
      city,
      state,
      area,
      pincode,
      isAvailable: role === 'DONOR' ? false : undefined,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        bloodGroup: user.bloodGroup,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error registering user',
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone number or email and password are required.',
      });
    }

    const normalizedIdentifier = identifier.trim();
    const isEmail = normalizedIdentifier.includes('@');
    const lookup = isEmail
      ? { email: normalizedIdentifier.toLowerCase() }
      : {
          phone: {
            $in: [normalizedIdentifier, normalizedIdentifier.replace(/[\s-]/g, '')],
          },
        };

    // Find user and select password field
    const user = await User.findOne(lookup).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number/email or password.',
      });
    }

    // Check password
    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number/email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact support.',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        bloodGroup: user.bloodGroup,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error logging in',
    });
  }
};

/**
 * Logout user (frontend-side primarily)
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error logging out',
    });
  }
};

/**
 * Request a password reset email
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  const genericResponse = {
    success: true,
    message: 'If this email is registered, a password reset link has been sent to your email.',
  };

  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return res.status(200).json(genericResponse);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${rawToken}`;

    try {
      await sendPasswordResetEmail(user.email, resetUrl);
    } catch (emailError) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.error('Password reset email delivery failed:', emailError);
    }

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(200).json(genericResponse);
  }
};

/**
 * Reset a password with a single-use token
 * POST /api/auth/reset-password
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token, new password, and confirmation are required.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'This password reset link is invalid or expired.',
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to reset password. Please try again.',
    });
  }
};

export default {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
