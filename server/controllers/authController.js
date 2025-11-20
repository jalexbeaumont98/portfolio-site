import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import config from '../../config/config.js';
import User from '../models/User.js';

export const signin = async (req, res) => {
  try {
    console.log("🔐 SIGNIN BODY:", req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ error: "User not found" });
    }

    // 👉 This matches your schema
    const ok = await user.comparePassword(password);
    if (!ok) {
      console.log("❌ Wrong password for:", email);
      return res.status(401).json({ error: "Email and password don't match." });
    }

    // Create JWT
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      config.jwtSecret
    );

    // Optional cookie
    res.cookie("t", token, { expire: new Date() + 9999 });

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("🔥 Signin error:", err);
    return res.status(500).json({ error: "Could not sign in" });
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