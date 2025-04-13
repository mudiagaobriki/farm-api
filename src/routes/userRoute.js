import { Router } from 'express';
import UserControllerFactory from '../controller/UserController.js';
import User from '../models/User.js';

const userRouter = Router();
const UserController = UserControllerFactory();

// Registration and Authentication
userRouter.post('/register', UserController.register);
userRouter.post('/login', UserController.login);
userRouter.post('/validate-username', UserController.isUsernameExists);

// Email Verification
userRouter.get('/email/verify/:verifyToken', UserController.verifyUser);
userRouter.post('/email/verify/resend', UserController.resendVerificationLink);

// Password Reset
userRouter.post('/email/forgot-password', UserController.forgotPassword);
userRouter.post('/email/reset/:resetToken', UserController.resetPassword);
userRouter.post('/email/password-reset', UserController.resetPassword2);

// Logout
userRouter.get('/logout', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ status: 'error', msg: 'Email is required' });
        }

        const user = await User.findOneAndUpdate(
            { email },
            { loginToken: null },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ status: 'error', msg: 'User not found' });
        }

        res.status(200).json({ status: 'success', msg: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ status: 'error', msg: 'Internal server error' });
    }
});

export default userRouter;
