const express = require('express');
const fs = require('fs');
const app = express();
const authController = require('./../controllers/authController');
const router = express.Router();
const tourController = require('../controllers/tourController');


router.
route('/tour-stats').
get(tourController.getTourStats);

router.
route('/monthly-plan/:year').
get(tourController.getMonthlyPlan);

router.
route('/top-5-cheap').
get(tourController.aliasTopTours, tourController.getAllTours);

router.
route('/').
get(authController.protect,tourController.getAllTours).
post(tourController.createTour);

router.
route('/:id').
get(tourController.getTour).
patch(tourController.updateTour).
delete(tourController.deleteTour);

module.exports = router