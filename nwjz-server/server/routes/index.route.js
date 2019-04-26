/*
 * @Author: Roy Chen
 * @Date: 2017-12-13 00:45:05
 * @Last Modified by: Roy Chen
 * @Last Modified time: 2019-04-25 18:05:21
 */
import express from 'express';
import userRoutes from './user.route';
import workerRoutes from './worker.route';
import authRoutes from './auth.route';
import uploadRoutes from './upload.route';
import serviceRoutes from './service.route';
import serviceCategoryRoutes from './service.category.route';
import addressRoutes from './address.route';
import feedbackRouters from './feedback.router';
import couponRoutes from './coupon.route';
import employerRoutes from './employer.route';
import contractRoutes from './contract.route';
import orderRoutes from './order.route';
import appointmentsRoute from './appointments.route';
import preappointmentsRoute from './preappointment.route';
import dashboardRoute from './dashboard.route';
import smsRoute from './sms.route';
import wechatRoute from './wechat.route';
import settingRoute from './setting.route';
import messageRoute from './message.route';
import statsRoute from './stats.route';
import commentRoute from './comment.route';
import eventRoute from './event.route';
import cardRoute from './card.route';
import insuranceRoute from './insurance/insurance.route';
import roleRoute from './permission/role.route';
import menuRoute from './permission/menu.route';
import commRoute from './communication/communication.route';
import companyRoute from './company/company.route';
import financeRoute from './finance/finance.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

router.use('/setting', settingRoute);

// mount user routes at /users
router.use('/users', userRoutes);

router.use('/workers', workerRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount service routes at /service
router.use('/services', serviceRoutes);

router.use('/servcates', serviceCategoryRoutes);

// mount upload routes at /upload
router.use('/upload', uploadRoutes);

// mount address routes at /addresses
router.use('/addresses', addressRoutes);

router.use('/feedback', feedbackRouters);

// mount coupon routes at /coupons
router.use('/coupons', couponRoutes);

// mount employers routes at /employers
router.use('/employers', employerRoutes);

// mount employers routes at /employers
router.use('/contracts', contractRoutes);

router.use('/orders', orderRoutes);

router.use('/appointments', appointmentsRoute);

router.use('/preappointments', preappointmentsRoute);

router.use('/sms', smsRoute);

router.use('/dashboard', dashboardRoute);

router.use('/wechat', wechatRoute);

router.use('/msgs', messageRoute);

router.use('/stats', statsRoute);

router.use('/comments', commentRoute);

router.use('/events', eventRoute);

router.use('/cards', cardRoute);

router.use('/ins', insuranceRoute);

router.use('/roles', roleRoute);

router.use('/menus', menuRoute);

router.use('/comms', commRoute);

router.use('/companys', companyRoute);

router.use('/fin', financeRoute);

export default router;
