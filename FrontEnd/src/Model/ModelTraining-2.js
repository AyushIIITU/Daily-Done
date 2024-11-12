import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { Dataset } from './Dataset.js';
import fse from 'fs-extra';

// console.log(Dataset);

// Label mapping (you can also use binary encoding)
const LABEL_MAP = {
  "productive": 1,
  "non-productive": 0
};

// Load Universal Sentence Encoder (USE) model
async function loadUSEModel() {
  const model = await use.load();
  return model;
}

// Function to vectorize the text using Universal Sentence Encoder
async function vectorizeText(useModel, text) {
  const embeddings = await useModel.embed([text]);
  return embeddings.arraySync()[0];
}

// Define a new dense model on top of USE embeddings
function defineModel(inputShape) {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 64, inputShape: [inputShape], activation: 'relu' }));
  model.add(tf.layers.dense({ units: 2, activation: 'softmax' })); // 2 output classes: productive or non-productive

  model.compile({
    optimizer: 'adam',
    loss: 'sparseCategoricalCrossentropy',
    metrics: ['accuracy']
  });

  return model;
}

// Function to train the model
async function trainModel(model, useModel, dataset) {
  const tasks = [];
  const labels = [];

  for (let item of dataset) {
    const vector = await vectorizeText(useModel, item.text);
    tasks.push(vector);
    labels.push(LABEL_MAP[item.label]);
  }

  const xs = tf.tensor2d(tasks, [tasks.length, tasks[0].length], 'float32');
  const ys = tf.tensor1d(labels, 'float32');

  await model.fit(xs, ys, {
    epochs: 10,
    shuffle: true,
    validationSplit: 0.2
  });
}
async function saveModel(model, savePath) {
    await model.save(`${savePath}`);
    console.log(`Model saved to: ${savePath}`);
}
// Function to classify a new task
async function classifyTask(model, useModel, task) {
  const taskVector = await vectorizeText(useModel, task);
  const taskTensor = tf.tensor2d([taskVector], [1, taskVector.length], 'float32');
  
  const prediction = model.predict(taskTensor);
  const category = prediction.argMax(-1).dataSync()[0];
  
  return category === 1 ? "productive" : "non-productive";
}

// Example usage
const main = async () => {
  const taskDescriptions =Dataset;

  // Load Universal Sentence Encoder
  const useModel = await loadUSEModel();

  // Define the dense model
  const denseModel = defineModel(512); // Universal Sentence Encoder output size is 512

  // Train the model
  await trainModel(denseModel, useModel, taskDescriptions);
//   await saveModel(denseModel, './saved_model');
  // Classify a new task
  const result = await classifyTask(denseModel, useModel, "play game for whole day");
  console.log(`Task classification: ${result}`);
};

main();
