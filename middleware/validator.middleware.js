import { body, validationResult } from 'express-validator';
import apiResponse from '../utils/apiresponse.js';

const validateRegistration = (req, res, next) => {
    body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long');
    body('email').isEmail().withMessage('Invalid email address');
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long');
    body('faculty').isIn(["Science", "Management", "Humanities", "Arts"]).withMessage('Invalid faculty');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(new apiResponse(400,errors,"Error in validation"));
    }
    next();
  };
  

  export {validateRegistration}
  