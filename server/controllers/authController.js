import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import config from '../../config/config.js';
import User from '../models/User.js';

export const signin = async (req, res) => {
  try {
    console.log('🔐 Signin body:', req.body);  // TEMP LOG

    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(401).json({ error: 'User not found' });
    }

    // 2. Check password using your schema method
    // If you’re using the crypto-based schema from slides:
    //   UserSchema.methods.authenticate = function(plainText) { ... }
    if (!user.authenticate(password)) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ error: "Email and password don't match." });
    }

    // 3. Issue JWT
    const token = jwt.sign(
      { _id: user._id, role: user.role || 'user' },
      config.jwtSecret
    );

    // Optional cookie (useful for classic Express, not required for SPA)
    res.cookie('t', token, { expire: new Date() + 9999 });

    // 4. Respond with token + public user info
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      }
    });
  } catch (err) {
    console.error('🔥 Signin error:', err);
    return res.status(500).json({ error: 'Could not sign in' });
  }
};

export const signout = (req, res) => {
  res.clearCookie('t');
  return res.status(200).json({ message: 'signed out' });
};

export const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  userProperty: 'auth'
});

export const hasAuthorization = (req, res, next) => {
  // expects req.profile from userByID and req.auth from requireSignin
  const authorized = req.profile && req.auth && String(req.profile._id) === String(req.auth._id);
  if (!authorized) return res.status(403).json({ error: 'User is not authorized' });
  next();
};