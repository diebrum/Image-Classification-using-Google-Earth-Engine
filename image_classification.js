var agua = /* color: #d63000 */ee.Geometry.MultiPoint(),
    campo = /* color: #98ff00 */ee.Geometry.MultiPolygon(
        [[[[-50.75198504766408, -29.372205305140096],
           [-50.755074952449235, -29.371083339273],
           [-50.75527383700468, -29.369561828077448],
           [-50.75827791110136, -29.367841430688163],
           [-50.761110323821086, -29.36544778596243],
           [-50.762140292082805, -29.36716822379653],
           [-50.76008035555937, -29.37255375429369],
           [-50.75802041903593, -29.373675703954884]]],
         [[[-50.76623294195119, -29.365996938926358],
           [-50.767520402278336, -29.365174114993597],
           [-50.76700541814748, -29.367492965405734],
           [-50.765546296443375, -29.368390570742598]]],
         [[[-50.752843354548844, -29.364725299136932],
           [-50.752843354548844, -29.36375285799467],
           [-50.75713488897267, -29.363229231994783],
           [-50.757564042415055, -29.364201678137324]]],
         [[[-50.75490329107228, -29.36709019121771],
           [-50.75601909002248, -29.366071740772348],
           [-50.75842234929982, -29.366370947606857],
           [-50.75670573553029, -29.36809136984289]]],
         [[[-50.76297137578908, -29.36475708770317],
           [-50.75816485723439, -29.363050853301605],
           [-50.7588515027422, -29.362003591390252],
           [-50.7614264233965, -29.36162956666912],
           [-50.7628855451006, -29.362602028086883],
           [-50.76588961919728, -29.361779176722415],
           [-50.76674792608205, -29.364172907684214],
           [-50.7643446668047, -29.367239793248498]]],
         [[[-50.76039645513478, -29.371601312429664],
           [-50.7608685239214, -29.371900503014313],
           [-50.759581063594254, -29.37392001646079],
           [-50.75142714818898, -29.37268587411538],
           [-50.750826333369645, -29.371638711300843],
           [-50.75085060290077, -29.370890731267025],
           [-50.752953454768445, -29.37175090783191],
           [-50.75183765581825, -29.372199692719654],
           [-50.75801746538856, -29.373583433668653],
           [-50.75999157122352, -29.372611077128703]]],
         [[[-50.75454132250526, -29.36991834900715],
           [-50.75329677752235, -29.369656552196496],
           [-50.753468438899304, -29.3687215580916],
           [-50.754455491816785, -29.368945957459875]]],
         [[[-50.7670296876786, -29.367636954172763],
           [-50.767415925776746, -29.365205903419714],
           [-50.766943856990125, -29.36475708770317],
           [-50.76775924853065, -29.36509369967603],
           [-50.767458841120984, -29.368123157358262],
           [-50.76638595751503, -29.367861355931495]]]]),
    urb_solo = /* color: #0b4a8b */ee.Geometry.MultiPoint(),
    veg = /* color: #ffc82d */ee.Geometry.MultiPolygon(
        [[[[-50.749434396540906, -29.36808575719566],
           [-50.74904815844276, -29.36475708770317],
           [-50.75127975634315, -29.364009057112995],
           [-50.75179474047401, -29.36920775609777]]],
         [[[-50.76157943896034, -29.36988094950399],
           [-50.763467714106824, -29.368310157965226],
           [-50.764411851680066, -29.36999314797226],
           [-50.762437745845105, -29.372611077128703]]],
         [[[-50.74987537737076, -29.363207376405622],
           [-50.750304530813146, -29.361786091957615],
           [-50.754392602733745, -29.358634548102433],
           [-50.75434968738951, -29.361626795402806]]]]);
		   
		   
		   
		   
var stations = [
  ee.Feature(
      ee.Geometry.Point(-50.7578138,  -29.365533), {'name': 'Canela'}),
  
];
var bartStations = ee.FeatureCollection(stations);

// Map a function over the collection to buffer each feature.
var buffered = bartStations.map(function(f) {
  return f.buffer(1000, 100); // Note that the errorMargin is set to 100.
});

Map.addLayer(buffered, {color: '800080'});

Map.setCenter(-50.7578138,  -29.365533, 11);

var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
  .filterDate('2020-01-01', '2022-07-01');

// Reduce the collection by taking the median.
var median = collection.median();



// Clip to the output image to the Nevada and Arizona state boundaries.
var clipped = median.clipToCollection(buffered);

// Display the result.
Map.setCenter(-50.7578138,  -29.365533, 11);
var visParams = {bands: ['B3', 'B3', 'B1'], max:0.3 /*gain: [1.4, 1.4, 1.1]*/};
//Map.addLayer(clipped, visParams, 'clipped composite');
Map.centerObject(clipped, 9);
Map.addLayer(clipped,visParams, 'true-color composite');

// Load a pre-computed Landsat composite for input.
var input = clipped;
var image=clipped;


// Define a region in which to generate a sample of the input.
var region = buffered;

// Display the sample region.
Map.setCenter(-50.7578138,  -29.365533, 11);
Map.addLayer(ee.Image().paint(region, 0, 2), {}, 'region');

var bands=['B1','B2','B3','B4','B5'];





// Make a FeatureCollection from the hand-made geometries.
var polygons = ee.FeatureCollection([
  //ee.Feature(agua1, {'class': 0}),
  ee.Feature(urb_solo, {'class': 1}),
  ee.Feature(veg, {'class': 2}),
  //ee.Feature(soil1, {'class': 3}),
  ee.Feature(campo, {'class': 4}),
]);

// Get the values for all pixels in each polygon in the training.
var training = image.sampleRegions({
  // Get the sample from the polygons FeatureCollection.
  collection: polygons,
  // Keep this list of properties from the polygons.
  properties: ['class'],
  // Set the scale to get Landsat pixels in the polygons.
  scale: 30
});

// Create an SVM classifier with custom parameters.
var classifier = ee.Classifier.libsvm({
  kernelType: 'RBF',
  gamma: 0.5,
  cost: 10
});

// Train the classifier.
var trained = classifier.train(training, 'class', bands);

// Classify the image.
var classified = image.classify(trained);



// Display the classification result and the input image.
Map.setCenter(-50.7578138,  -29.365533, 9);
Map.addLayer(image,
             {bands: ['B4', 'B3', 'B2'], min: 0, max: 3},
             'image');
Map.addLayer(polygons, {color: 'yellow'}, 'training polygons');
Map.addLayer(classified,
             {min: 0, max: 4, palette: ['orange', 'green','red','blue','black']},
             'classes');
			 
Export.image.toDrive({
   image: classified,
    description: 'Classified_visualize_visparams',
   region: buffered, 
    scale: 30,
    maxPixels: 1e13,
    }); 