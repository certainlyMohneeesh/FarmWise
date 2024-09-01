import sys
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image


# Load your saved model
model = tf.keras.models.load_model('/model/Resnet_cotton recognizer.h5')

# Get the image path from command line arguments
img_path = sys.argv[1]

# Load and preprocess the image
img = image.load_img(img_path, target_size=(224, 224))
img = image.img_to_array(img)
img = np.expand_dims(img, axis=0)
img = img / 255.0

# Predict
preds = model.predict(img)
preds = np.argmax(preds, axis=1)

# Output the result
if preds == 0:
    print("Diseased Cotton Leaf")
elif preds == 1:
    print("Diseased Cotton Plant")
elif preds == 2:
    print("Fresh Cotton Leaf")
else:
    print("Fresh Cotton Plant")
