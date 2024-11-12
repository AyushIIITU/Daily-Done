import * as tf from '@tensorflow/tfjs';
import { KNNClassifier } from '@tensorflow-models/knn-classifier';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Dataset } from './Dataset';

// Initialize KNN classifier
const knnClassifier = new KNNClassifier();
const LABEL_MAP = {
    "productive": 1,
    "non-productive": 0
  };
// Load MobileNet model
let mobilenetModel;
async function loadModel() {
  mobilenetModel = await mobilenet.load();
  console.log("MobileNet loaded");
}

// Function to tokenize text
function tokenize(text) {
    return text.split(" ").map(word => word.toLowerCase());
}

// Build vocabulary (assuming you're doing this with text)
function buildVocabulary(tasks) {
    const uniqueWords = new Set();
    tasks.forEach(task => {
        tokenize(task).forEach(word => uniqueWords.add(word));
    });
    return Array.from(uniqueWords);  // Convert Set to Array
}

// Vectorize text using MobileNet embeddings
async function vectorizeWithMobileNet(text) {
    // Tokenize and vectorize text (You can also use BERT embeddings here for better text handling)
    const taskTensor = tf.tensor([text]);  // Wrap the input in a tensor

    // Get MobileNet embeddings for the text
    const embeddings = mobilenetModel.infer(taskTensor, 'conv_preds');  // Get embeddings
    return embeddings;  // Return the embeddings
}

// Train using the KNN Classifier
async function trainKNN(dataset) {
    const tasks = [];
    const labels = [];
  
    for (let item of dataset) {
      tasks.push(item.text);
      labels.push(LABEL_MAP[item.label]);
    }
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const embedding = await vectorizeWithMobileNet(task);  // Get embedding for each task
        knnClassifier.addExample(embedding, labels[i]);  // Add example to KNN
    }
}

// Classify using KNN
async function classifyTaskKNN(task) {
    const taskEmbedding = await vectorizeWithMobileNet(task);
    const prediction = await knnClassifier.predictClass(taskEmbedding);
    return prediction.label === 1 ? "productive" : "non-productive";
}



// Train the KNN classifier
async function trainAndClassify() {
    await loadModel();  // Load MobileNet first

    // Train the KNN with your task dataset
    await trainKNN(Dataset);

    // Classify a new task
    const result = await classifyTaskKNN("Reading a technical paper");
    console.log(`Task classification: ${result}`);  // Outputs either "productive" or "non-productive"
}

// Start training and classification
trainAndClassify();
