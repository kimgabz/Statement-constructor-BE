import jwt from 'jsonwebtoken';
import { devConfig } from '../../../config/env/development';

export default {
  sendJWTToken(req, res) {
    // console.log(req.currentUser);
    const token = jwt.sign({ id: req.user.id }, devConfig.secret, {
      expiresIn: '1d',
    });
    // return res.json({ token });
    res.redirect(
      `${devConfig.frontendURL}/dashboard/statements/?token=${token}`
    );
  },
  authenticate(req, res) {
    return res.send(true);
  },
  logout(req, res) {
    req.logout(); // remove the session and remove req.currentUser;
    return res.json({ success: true });
  },
};
