const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const config = require('./config');
const fs = require('fs');

const visualRecognition = new VisualRecognitionV3({
  iam_apikey: config.apiKey,
  url: config.url,
  version: config.version
});

const params = {
  images_file: fs.createReadStream('./resources/animals.zip')
};

visualRecognition.classify(params, (err, result) => {
  
  if (err) return console.log('error', err);

  console.info(`Total of ${result.images_processed} images processed`);
  console.info('='.repeat(50));

  let countErrors = 0;
  let errorDescription = [];
  let countClassifiers = 0;
  let classifiersDescription = [];

  for (imageAnalyze of result.images) {

    if ('error' in imageAnalyze) {
      countErrors++;
      errorDescription.push({
        image: imageAnalyze.image,
        description: imageAnalyze.error.description
      });
    }

    if ('classifiers' in imageAnalyze) {
      countClassifiers++;
      classifiersDescription.push({
        image: imageAnalyze.image,
        class: imageAnalyze.classifiers[0].classes[0].class,
        score: (imageAnalyze.classifiers[0].classes[0].score * 100).toFixed(1) + '%'
      });
    }
  }

  console.info(`Total of ${countClassifiers} images classifier`);
  console.info(`Total of ${countErrors} error`);
  console.info('='.repeat(50));
  console.info('Errors ->', errorDescription);
  console.info('='.repeat(50));
  console.info('Classifiers ->', classifiersDescription);
});