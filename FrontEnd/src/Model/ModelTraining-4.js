import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { Dataset } from './Dataset.js';
// import * as fse from 'fs-extra';
let useModel;

// Label mapping for binary classification
const LABEL_MAP = {
  "Productive": 1,
  "Non-Productive": 0
};

// Preprocess the text (e.g., lowercasing)
function preprocess(text) {
  return text.toLowerCase();
}
// Save model to local storage or file system
async function saveModel(model) {
    await model.save('localstorage://task-classifier'); // For browser environments
    // Or use a different path for server-side, e.g., 'file://model/my-model' for Node.js
  }
  

// Load Universal Sentence Encoder
export async function loadModel() {
  useModel = await use.load();
  console.log("USE Model loaded");
}

// Function to vectorize text using USE
export async function vectorizeText(text) {
    // Ensure that the USE model is loaded before using it
    if (!useModel) {
      await loadModel();  // If not loaded yet, load it
    }
  
    try {
      const embeddings = await useModel.embed([preprocess(text)]);  // Embed the input text
      return embeddings;
    } catch (err) {
      console.error('Error embedding text:', err);
      return null;
    }
  }

// Build and compile a neural network model
export function createModel() {
  const model = tf.sequential();

  // Add layers to the model
  model.add(tf.layers.dense({ units: 128, inputShape: [512], activation: 'relu' }));  // Input shape matches USE embedding size (512)
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));  // Binary classification (Productive or Non-Productive)

  model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

// Function to train the neural network model
export async function trainModel(model, dataset) {
  const tasks = [];
  const labels = [];

  for (let item of dataset) {
    const embedding = await vectorizeText(item.text);  // Get USE embeddings
    tasks.push(embedding);
    labels.push(LABEL_MAP[item.label]);  // Convert label to binary (1 or 0)
  }

  // Convert tasks and labels into tensors
  const xs = tf.concat(tasks);  // Concatenate embeddings into a single tensor
  const ys = tf.tensor(labels);

  // Train the model
  await model.fit(xs, ys, {
    epochs: 10,
    batchSize: 8,
    shuffle: true,
    validationSplit: 0.2,  // Split the dataset for validation
  });
}

// Function to classify a task
// Function to classify a task
export async function classifyTask(model, task) {
    if (!model) {
      console.error("Model is not loaded or initialized.");
      return null;  // Return early if the model is null
    }
  
    const embedding = await vectorizeText(task);
    
    try {
      const prediction = model.predict(embedding);
      const result = (await prediction.data())[0];  // Get the prediction result
      return result > 0.5 ? "Productive" : "Non-Productive";  // Use 0.5 as a threshold for binary classification
    } catch (error) {
      console.error('Error during prediction:', error);
      return null;
    }
  }
  

// Main function to load the model, train, and classify tasks
export async function run() {
  await loadModel();  // Load USE model

  const model = createModel();  // Create neural network model

  // Train the model
  await trainModel(model, Dataset);
  // Save the model
    await saveModel(model);
// await saveModel(model);
  // Classify a task after training
  const result = await classifyTask(model, "Do Study Course for 2 hours");
  console.log(`Task classification: ${result}`);  // Output either "Productive" or "Non-Productive"
}

run();
