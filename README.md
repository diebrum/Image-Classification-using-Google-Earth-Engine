# Image-Classification-using-Google-Earth-Engine

This file contains a script to perform Remote Sensing image classification through Support Vector Machines (SVM) algorithm.

Open the script in the Google Earth Engine (GEE) code editor: https://code.earthengine.google.com/ or https://signup.earthengine.google.com/#!/

Clicking on RUN button the script will be executed by GEE. 

What this script makes in some basic steps:

1- Defines the samples for each class. These classes are defined by the user, so modify the code in order to achieve realistic results.

2- Creates a point in a defined geographic place and so creates a buffer. The radius of the buffer must be defined by the user.

3- Selects Landsat 8 dataset of images and apply a median-based reduction. The user must select the start and end date for the images.

4- The selected images are clipped based on the buffered area created earlier.

5- A composite of bands is displayed on the screen.

6- The samples selected are transformed to a Feature Collection in order to feed SVM model.

7- The pixels values are collected, for each pixel/point, the information of each band used in the composition are retrieved.

8- Defines SVM parameters.

9- Trains the algorithm and classify all the buffered area. The result is displayed on the screen.

10- Exports the classified image to Google Drive.


In the repository i put the exported result. The file name is classification.tiff.
