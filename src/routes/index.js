import express from 'express';
import trackingRoutes from '@routes/tracking.route';
import userRoutes from '@routes/user.route';
import authRoutes from '@routes/auth.route';
import sittingRoutes from '@routes/sittingRequest.route';
import parentRoutes from '@routes/parent.route';
import babysitterRoutes from '@routes/babysitter.route';
import invitationRoutes from '@routes/invitation.route';
import circleRoutes from '@routes/circle.route';
import configurationRoutes from '@routes/configuration.route';
import feedbackRoutes from '@routes/feedback.route';
import { jwtAuthentication } from '../middlewares/jwt.middleware';

const router = express.Router();

router.get('/status', (res) => res.send('Server is up!'));

router.use('/auth', authRoutes);
router.use('/trackings', trackingRoutes);
router.use('/users', userRoutes);
router.use('/sittingRequests', sittingRoutes);
router.use('/parents', parentRoutes);
router.use('/babysitters', babysitterRoutes);
router.use('/circles', circleRoutes);
router.use('/invitations', invitationRoutes);
router.use('/configuration', configurationRoutes);
router.use('/feedback', feedbackRoutes);

export default router;
