const Tour = require('../models/tourModel'); 
const APIfeatures = require('../utils/APIfeatures');
const appError = require('../utils/appError');
const aliasTopTours = (req, res, next) => {
   
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

const catchAsync = fn => {
    return(req, res, next) => {
        fn(req, res, next).catch(next);
    }
    
}
const getAllTours =catchAsync(async (req, res,next) => {
    const features = new APIfeatures(Tour.find(), req.query)
        .filtering()
        .sort()
        .limitFields()
        .paginate();
      const tours = await features.query;
      res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
      });
  });

const getTour = catchAsync(async (req, res,next) => {
    const tour = await Tour.findById(req.params.id)
    if(!tour){  
        return next(new appError('No tour found with that ID',404));
    }
    res.status(200).json({
        status: 'success',  
        data: {
            tour
            }
       
        }) 
});

const updateTour =catchAsync( async (req, res,next) => {
    const tour = await Tour.
    findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    })
   
});

const createTour = catchAsync(async (req, res,next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
   status: 'success',
   data: {
       tour: newTour
   }
})
});


const deleteTour = catchAsync(async(req, res,next) => {

    const tour = await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
        status: 'success',
        data: null
})
    
});

const getTourStats = catchAsync(async (req, res,next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingAverage: { $gte: 4.5 } } 
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ]);

    console.log('Aggregated Stats:', stats);
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});

const getMonthlyPlan = catchAsync(async (req, res,next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {   
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: { _id: 0 }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        {
            $limit: 12
        }

    ])
    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    })
});


module.exports = {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan
   
};