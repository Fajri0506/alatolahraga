const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const AuthController = {
  register: async (req, res, next) => {
    try {
      const { nama, email, password, no_hp, alamat } = req.body;

      if (!nama || !email || !password) {
        return res.status(400).json({ message: 'Nama, email, dan password wajib diisi' });
      }

      // Check if email already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const id_user = await UserModel.create({
        nama,
        email,
        password: hashedPassword,
        no_hp,
        alamat,
        role: 'penyewa' // Default role for registration
      });

      // Generate JWT Token
      const token = jwt.sign(
        { id_user, role: 'penyewa' },
        process.env.JWT_SECRET || 'supersecretkeyforrentalapp12345',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        message: 'Registrasi berhasil',
        token,
        user: {
          id_user,
          nama,
          email,
          no_hp,
          alamat,
          role: 'penyewa'
        }
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email dan password wajib diisi' });
      }

      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Email atau password salah' });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Email atau password salah' });
      }

      // Generate JWT Token
      const token = jwt.sign(
        { id_user: user.id_user, role: user.role },
        process.env.JWT_SECRET || 'supersecretkeyforrentalapp12345',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(200).json({
        message: 'Login berhasil',
        token,
        user: {
          id_user: user.id_user,
          nama: user.nama,
          email: user.email,
          no_hp: user.no_hp,
          alamat: user.alamat,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  },

  getProfile: async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.user.id_user);
      if (!user) {
        return res.status(404).json({ message: 'User tidak ditemukan' });
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = AuthController;
