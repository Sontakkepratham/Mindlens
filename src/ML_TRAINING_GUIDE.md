# MindLens ML Training Guide
## Facial Emotion Recognition Model Training

---

## 📊 **Recommended Datasets**

### **Best Choice: FER-2013**
This dataset perfectly matches your 7 emotion categories:
- ✅ Happy, Sad, Angry, Neutral, Surprised, Fearful, Disgusted
- ✅ 35,887 labeled images
- ✅ Publicly available on Kaggle
- ✅ Free to use for commercial applications
- ✅ Pre-split into train/test sets

**Download:** https://www.kaggle.com/datasets/msambare/fer2013

---

## 🏗️ **Training Architecture**

### **Option 1: Train Custom Model (Recommended)**

```
Dataset (FER-2013)
    ↓
Google Cloud Storage
    ↓
Vertex AI Training
    ↓
Deploy to Vertex AI Endpoint
    ↓
Integrate with MindLens App
```

### **Option 2: Use Pre-trained Model (Faster)**

Use existing TensorFlow.js models:
- **face-api.js** - Pre-trained emotion recognition
- **tfjs-models/face-landmarks-detection** - Face detection + emotions
- **MediaPipe Face Mesh** - Google's solution

---

## 🚀 **Step-by-Step Training Process**

### **Step 1: Prepare Dataset**

```bash
# 1. Download FER-2013 from Kaggle
wget https://www.kaggle.com/datasets/msambare/fer2013/download

# 2. Upload to Google Cloud Storage
gsutil -m cp -r fer2013/ gs://mindlens-ml-training/datasets/fer2013/

# 3. Organize structure
gs://mindlens-ml-training/
  └── datasets/
      └── fer2013/
          ├── train/
          │   ├── angry/
          │   ├── disgust/
          │   ├── fear/
          │   ├── happy/
          │   ├── sad/
          │   ├── surprise/
          │   └── neutral/
          └── test/
              └── (same structure)
```

### **Step 2: Create Training Script**

```python
# train_emotion_model.py
import tensorflow as tf
from tensorflow.keras import layers, models
from google.cloud import aiplatform

# Define model architecture
def create_emotion_model():
    model = models.Sequential([
        # Input: 48x48 grayscale images
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(48, 48, 1)),
        layers.MaxPooling2D((2, 2)),
        
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        
        layers.Flatten(),
        layers.Dropout(0.5),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.5),
        
        # Output: 7 emotion categories
        layers.Dense(7, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

# Load FER-2013 dataset
train_dataset = tf.keras.preprocessing.image_dataset_from_directory(
    'gs://mindlens-ml-training/datasets/fer2013/train',
    image_size=(48, 48),
    color_mode='grayscale',
    batch_size=32
)

test_dataset = tf.keras.preprocessing.image_dataset_from_directory(
    'gs://mindlens-ml-training/datasets/fer2013/test',
    image_size=(48, 48),
    color_mode='grayscale',
    batch_size=32
)

# Train model
model = create_emotion_model()
model.fit(
    train_dataset,
    validation_data=test_dataset,
    epochs=50
)

# Save model
model.save('gs://mindlens-ml-training/models/emotion-classifier-v1')
```

### **Step 3: Train on Vertex AI**

```bash
# Submit training job to Vertex AI
gcloud ai custom-jobs create \
  --region=us-central1 \
  --display-name=mindlens-emotion-training \
  --worker-pool-spec=machine-type=n1-standard-4,replica-count=1,container-image-uri=gcr.io/cloud-aiplatform/training/tf-gpu.2-11:latest \
  --python-package-uris=gs://mindlens-ml-training/training/emotion_trainer.tar.gz \
  --args=--epochs=50,--batch-size=32
```

### **Step 4: Deploy Model**

```python
# deploy_model.py
from google.cloud import aiplatform

# Initialize Vertex AI
aiplatform.init(project='your-project-id', location='us-central1')

# Upload model
model = aiplatform.Model.upload(
    display_name='mindlens-emotion-classifier',
    artifact_uri='gs://mindlens-ml-training/models/emotion-classifier-v1',
    serving_container_image_uri='gcr.io/cloud-aiplatform/prediction/tf2-cpu.2-11:latest'
)

# Deploy to endpoint
endpoint = model.deploy(
    machine_type='n1-standard-2',
    min_replica_count=1,
    max_replica_count=3
)

print(f"Model deployed to endpoint: {endpoint.resource_name}")
```

---

## 🔧 **Integration with MindLens Backend**

### **Update Face Scan Service**

```typescript
// /supabase/functions/server/vertex-ai-service.tsx

import { Vertex AI } from '@google-cloud/aiplatform';

const vertexAI = new VertexAI({
  project: 'your-project-id',
  location: 'us-central1'
});

export async function analyzeEmotion(imageBase64: string) {
  // Call deployed Vertex AI endpoint
  const endpoint = 'projects/YOUR_PROJECT/locations/us-central1/endpoints/YOUR_ENDPOINT_ID';
  
  const response = await vertexAI.predict({
    endpoint: endpoint,
    instances: [{ image: imageBase64 }]
  });
  
  // Parse predictions
  const emotions = response.predictions[0];
  
  return {
    dominant_emotion: emotions.dominant,
    emotions: {
      happy: emotions.scores[0],
      sad: emotions.scores[1],
      angry: emotions.scores[2],
      neutral: emotions.scores[3],
      surprised: emotions.scores[4],
      fearful: emotions.scores[5],
      disgusted: emotions.scores[6]
    },
    confidence: emotions.confidence * 100
  };
}
```

---

## 📈 **Model Performance Metrics**

### **Expected Accuracy (FER-2013)**
- **Baseline CNN:** 60-65% accuracy
- **ResNet-50:** 70-75% accuracy
- **EfficientNet:** 75-80% accuracy
- **Ensemble Models:** 80-85% accuracy

### **Training Time Estimates**
- **CPU (local):** 4-6 hours
- **GPU (Vertex AI):** 30-60 minutes
- **TPU (Vertex AI):** 15-30 minutes

### **Costs (Vertex AI)**
- **Training (n1-standard-4):** ~$0.20-0.50 per hour
- **Deployment (n1-standard-2):** ~$0.10 per hour
- **Predictions:** ~$0.000001 per prediction

---

## 🎯 **Alternative: Use Pre-trained Models**

### **Option A: face-api.js (Recommended for Quick Start)**

```typescript
// Install in frontend
npm install face-api.js

// Use in FaceScanScreen.tsx
import * as faceapi from 'face-api.js';

async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceExpressionNet.loadFromUri('/models');
}

async function detectEmotions(videoElement: HTMLVideoElement) {
  const detections = await faceapi
    .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();
    
  return detections.expressions;
}
```

### **Option B: TensorFlow.js with MobileNet**

```typescript
import * as tf from '@tensorflow/tfjs';

// Load pre-trained model
const model = await tf.loadLayersModel(
  'https://storage.googleapis.com/tfjs-models/tfjs/emotion-recognition/v1/model.json'
);

// Predict emotions
const predictions = model.predict(imageData);
```

### **Option C: MediaPipe (Google's Solution)**

```typescript
import { FaceLandmarker } from '@mediapipe/tasks-vision';

const faceLandmarker = await FaceLandmarker.createFromOptions({
  baseOptions: {
    modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
  },
  runningMode: 'VIDEO'
});

const results = faceLandmarker.detectForVideo(videoElement, timestamp);
```

---

## ⚖️ **Legal & Ethical Considerations**

### **Healthcare Compliance**
- ✅ **HIPAA Compliance:** Ensure training data is de-identified
- ✅ **FDA Regulations:** Check if your app requires FDA approval
- ✅ **Data Privacy:** Follow GDPR/CCPA for user data
- ✅ **Informed Consent:** Get explicit consent for facial analysis

### **Bias Mitigation**
- ⚠️ **Dataset Bias:** FER-2013 may have demographic imbalances
- ✅ **Test on Diverse Data:** Validate across age, gender, ethnicity
- ✅ **Fairness Metrics:** Monitor for disparate impact
- ✅ **Regular Audits:** Continuously evaluate model fairness

### **Clinical Validation**
- ⚠️ **Not a Diagnostic Tool:** Clearly state limitations
- ✅ **Professional Review:** Have mental health professionals validate
- ✅ **Accuracy Disclaimers:** Inform users of confidence levels
- ✅ **Human Oversight:** Keep counselor recommendations in the loop

---

## 📚 **Recommended Resources**

### **Research Papers**
1. "Facial Expression Recognition Using Deep Learning" - Goodfellow et al.
2. "Challenges in Representation Learning: FER-2013" - Kaggle
3. "AffectNet: A Database for Facial Expression, Valence, and Arousal" - Mollahosseini et al.

### **Code Examples**
- **GitHub:** https://github.com/topics/emotion-recognition
- **TensorFlow Hub:** https://tfhub.dev/s?q=emotion
- **Keras Examples:** https://keras.io/examples/vision/emotion_recognition/

### **Tutorials**
- Google Colab: "Train Emotion Recognition with FER-2013"
- Vertex AI Documentation: "Custom Training Jobs"
- TensorFlow.js Guide: "Face Detection & Expression Recognition"

---

## 🎓 **Training Workflow Summary**

```
1. Download FER-2013 Dataset
   ↓
2. Upload to Google Cloud Storage
   ↓
3. Create Training Script (Python/TensorFlow)
   ↓
4. Submit Training Job to Vertex AI
   ↓
5. Evaluate Model Performance
   ↓
6. Deploy to Vertex AI Endpoint
   ↓
7. Integrate with MindLens Backend
   ↓
8. Test with Real Users
   ↓
9. Monitor & Improve
```

---

## 💬 **Next Steps**

1. **Quick Start:** Use face-api.js for immediate emotion detection
2. **Medium Term:** Train custom model on FER-2013
3. **Long Term:** Collect MindLens user data (with consent) for fine-tuning
4. **Production:** Deploy to Vertex AI with auto-scaling

---

## 🔗 **Useful Links**

- **FER-2013 Dataset:** https://www.kaggle.com/datasets/msambare/fer2013
- **Vertex AI Documentation:** https://cloud.google.com/vertex-ai/docs
- **face-api.js:** https://github.com/justadudewhohacks/face-api.js
- **TensorFlow.js:** https://www.tensorflow.org/js
- **MediaPipe:** https://developers.google.com/mediapipe

---

**Last Updated:** November 2024  
**Version:** 1.0  
**Contact:** MindLens Development Team
