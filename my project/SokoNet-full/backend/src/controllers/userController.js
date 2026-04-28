/**
 * User Controller
 * Handles authentication, profile management, user operations
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const EmailService = require('../services/EmailService');

class UserController {
  /**
   * Send OTP for phone verification
   */
  async sendOTP(req, res) {
    try {
      const { phone, email } = req.body;
      const contactField = email ? { email: email.toLowerCase().trim() } : { phone };
      const contactValue = email || phone;

      if (!contactValue) {
        return res.status(400).json({ success: false, message: 'Phone or email required' });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 5 * 60000); // 5 minutes
      const hashedOtp = await bcrypt.hash(otp, 10);

      let user = await User.findOne(contactField);

      if (user) {
        user.otpCode = hashedOtp;
        user.otpExpiry = otpExpiry;
      } else {
        user = new User({
          ...contactField,
          otpCode: hashedOtp,
          otpExpiry,
          userType: 'customer'
        });
      }

      await user.save();

      if (email) {
        await EmailService.sendOTPEmail(email, otp);
      } else {
        console.log(`[OTP] ${contactValue}: ${otp}`);
      }

      res.json({
        success: true,
        message: `OTP sent to ${email ? 'email' : 'phone'}`,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Verify OTP and create session
   */
  async verifyOTP(req, res) {
    try {
      const { phone, email, otp } = req.body;
      const contactField = email ? { email: email.toLowerCase().trim() } : { phone };

      const user = await User.findOne(contactField);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (!user.otpCode || user.otpExpiry < new Date()) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }

      const otpMatches = await bcrypt.compare(otp, user.otpCode);
      if (!otpMatches) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }

      // Mark contact as verified
      if (email) {
        user.email = email.toLowerCase().trim();
        user.isEmailVerified = true;
      } else {
        user.isPhoneVerified = true;
      }
      user.otpCode = null;
      user.otpExpiry = null;
      await user.save();

      const token = jwt.sign(
        { userId: user._id, email: user.email, phone: user.phone },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          phone: user.phone,
          email: user.email,
          firstName: user.firstName,
          userType: user.userType,
          avatar: user.avatar
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Register user with email/phone and password
   */
  async register(req, res) {
    try {
      const { phone, email, password, firstName, lastName, userType = 'customer' } = req.body;
      const contact = email ? { email: email.toLowerCase().trim() } : { phone };

      if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required' });
      }

      if (!phone && !email) {
        return res.status(400).json({ success: false, message: 'Email or phone required' });
      }

      const existingUser = await User.findOne({
        $or: [
          ...(email ? [{ email: contact.email }] : []),
          ...(phone ? [{ phone }] : [])
        ]
      });

      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Account already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        ...contact,
        firstName,
        lastName,
        password: hashedPassword,
        userType,
        isPhoneVerified: !!phone,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await user.save();

      const token = jwt.sign(
        { userId: user._id, email: user.email, phone: user.phone },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          phone: user.phone,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          avatar: user.avatar
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Login using email or phone and password
   */
  async login(req, res) {
    try {
      const { identifier, password } = req.body;
      if (!identifier || !password) {
        return res.status(400).json({ success: false, message: 'Identifier and password required' });
      }

      const searchField = identifier.includes('@')
        ? { email: identifier.toLowerCase().trim() }
        : { phone: identifier };

      const user = await User.findOne(searchField);
      if (!user || !user.password) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email, phone: user.phone },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          phone: user.phone,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          avatar: user.avatar,
          biometricEnabled: user.biometricEnabled
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Set biometric preference for logged-in user
   */
  async setBiometricPreference(req, res) {
    try {
      const { enabled } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { biometricEnabled: !!enabled },
        { new: true }
      );

      res.json({ success: true, biometricEnabled: user.biometricEnabled });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get user profile
   */
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId)
        .select('-otpCode -otpExpiry -password');

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Update profile
   */
  async updateProfile(req, res) {
    try {
      const { firstName, lastName, bio, avatar, userType, skills } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user.userId,
        {
          firstName,
          lastName,
          bio,
          avatar,
          userType,
          ...(skills && { skills }),
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Update location
   */
  async updateLocation(req, res) {
    try {
      const { latitude, longitude, address, city } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user.userId,
        {
          location: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          address,
          city,
          updatedAt: new Date()
        },
        { new: true }
      );

      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get nearby workers
   */
  async getNearbyWorkers(req, res) {
    try {
      const { latitude, longitude, radius = 10 } = req.query;

      const workers = await User.find({
        userType: { $in: ['worker', 'business'] },
        isActive: true,
        isBlocked: false,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: parseFloat(radius) * 1000
          }
        }
      })
      .select('firstName lastName avatar averageRating skills location')
      .limit(30);

      res.json({ success: true, workers });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get worker stats (earnings, completion rate, etc.)
   */
  async getWorkerStats(req, res) {
    try {
      const Job = require('../models/Job');

      const completedJobs = await Job.countDocuments({
        acceptedWorkerId: req.user.userId,
        status: 'completed'
      });

      const totalJobs = await Job.countDocuments({
        acceptedWorkerId: req.user.userId
      });

      const user = await User.findById(req.user.userId);

      res.json({
        success: true,
        stats: {
          completedJobs,
          totalJobs,
          completionRate: totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0,
          averageRating: user.averageRating,
          totalEarnings: user.totalEarnings,
          escrowBalance: user.escrowBalance,
          trustScore: user.trustScore
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Withdraw earnings
   */
  async withdrawEarnings(req, res) {
    try {
      const PaymentService = require('../services/PaymentService');
      const { amount } = req.body;

      const user = await User.findById(req.user.userId);

      if (user.escrowBalance < amount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance'
        });
      }

      const result = await PaymentService.withdrawEarnings(
        req.user.userId,
        amount,
        user.bankAccount
      );

      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new UserController();
