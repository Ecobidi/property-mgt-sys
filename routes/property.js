const cloudinary = require('cloudinary')
const multer = require('multer')
const streamifier = require('streamifier')

const router = require('express').Router()

const PropertyController = require('../controllers/property')
const PropertyService = require('../services/property')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const upload = multer({})

const streamUpload = (file) => {
  return new Promise((resolve, reject) => {
      let stream = cloudinary.v2.uploader.upload_stream({folder: 'estate-mgt'},
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
     streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

let fields = [{name: 'featured', maxCount: 1}, {name: 'image1', maxCount: 1}, {name: 'image2', maxCount: 1}, {name: 'image3', maxCount: 1}]

router.get('/', PropertyController.getAllProperties)

router.get('/new', PropertyController.getCreatePropertyPage)

// router.post('/new', upload.single('image'), PropertyController.createProperty)

router.post('/new', upload.fields(fields), async function (req, res, next) {
  try {
    let imagesArray = []
    if (req.files.featured) imagesArray.push(await streamUpload(req.files.featured[0]))
    if (req.files.image1) imagesArray.push(await streamUpload(req.files.image1[0]))
    if (req.files.image2) imagesArray.push(await streamUpload(req.files.image2[0]))
    if (req.files.image3) imagesArray.push(await streamUpload(req.files.image3[0]))

    imagesArray = imagesArray.map(i => i.url)
    let dao = req.body
    dao.images = imagesArray
    await PropertyService.save(req.body)
    req.flash('success_msg', 'Property Created')
    res.redirect('/properties')
  } catch (error) {
    console.log(error)
    console.log('An Error Creating Property')
    res.redirect('/properties/new')
  }
});

router.get('/remove/:property_id', PropertyController.removeProperty)

module.exports = router