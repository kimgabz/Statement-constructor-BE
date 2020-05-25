import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  OK,
  NOT_FOUND,
  UNAUTHORIZED,
} from 'http-status-codes';
import User from './user.model';
import userService from './user.service';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  getJWTToken,
  getEncryptedPassword,
} from '../../module/utilities/utils';
import { devConfig } from '../../../config/env/development';
import { sendEmail } from '../../module/utilities/mails';

export default {
  async signup(req, res) {
    try {
      // Validate the request
      const { error, value } = userService.validateUserSingupSchema(req.body);
      if (error && error.details) {
        return res.status(BAD_REQUEST).json(error);
      }

      // create user
      // const user = await User.create(value);
      // return res
      //   .status(OK)
      //   .json({ success: true, message: 'User is created', user: user });

      const existingUser = await User.findOne({ 'local.email': value.email });
      if (existingUser) {
        return res
          .status(BAD_REQUEST)
          .json({ error: 'You have already created account' });
      }
      const user = await new User();
      user.local.email = value.email;
      user.local.name = value.name;

      const salt = await bcryptjs.genSalt();
      const hash = await bcryptjs.hash(value.password, salt);
      user.local.password = hash;

      await user.save();
      return res.json({ success: true, message: 'User created successfully' });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json(error);
    }
  },
  async login(req, res) {
    try {
      // Validate the request
      const { error, value } = userService.validateLoginSchema(req.body);
      if (error && error.details) {
        return res.status(BAD_REQUEST).json(error);
      }

      // create user
      const user = await User.findOne({ 'local.email': value.email });
      if (!user) {
        return res
          .status(BAD_REQUEST)
          .json({ error: 'invalid email or password' });
      }
      const matched = bcryptjs.compare(value.password, user.password);
      if (!matched) {
        return res
          .status(UNAUTHORIZED)
          .json({ error: 'invalid email or password' });
      }
      const token = jwt.sign({ id: user._id }, devConfig.secret, {
        expiresIn: '1d',
      });
      return res.status(OK).json({ success: true, token: token });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json(error);
    }
  },
  async test(req, res) {
    return res.json(req.user);
  },
  async forgotPassword(req, res) {
    try {
      const { value, error } = userService.validateForgotSchema(req.body);
      if (error && error.details) {
        return res.status(BAD_REQUEST).json(error);
      }
      const criteria = {
        $or: [
          { 'google.email': value.email },
          { 'github.email': value.email },
          { 'twitter.email': value.email },
          { 'local.email': value.email },
        ],
      };
      const user = await User.findOne(criteria);
      if (!user) {
        return res.status(NOT_FOUND).json({ err: 'could not find user' });
      }
      const token = getJWTToken({ id: user._id });

      const resetLink = `
       <h4> Please click on the link to reset the password </h4>
       <a href ='${devConfig.frontendURL}/reset-password/${token}'>Reset Password</a>
      `;

      const sanitizedUser = userService.getUser(user);
      const results = await sendEmail({
        html: resetLink,
        subject: 'Forgot Password',
        email: sanitizedUser.email,
      });
      return res.json(results);
    } catch (err) {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).json(err);
    }
  },
  async resetPassword(req, res) {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(BAD_REQUEST).json({ err: 'password is required' });
      }
      const user = await User.findById(req.user._id);
      const sanitizedUser = userService.getUser(user);
      if (!user.local.email) {
        user.local.email = sanitizedUser.email;
        user.local.name = sanitizedUser.name;
      }
      const hash = await getEncryptedPassword(password);
      user.local.password = hash;
      await user.save();
      return res.json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).json(err);
    }
  },
};
