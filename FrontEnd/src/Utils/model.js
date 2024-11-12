// src/utils/model.js
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

let useModel;
const LABEL_MAP = {
  "productive": 1,
  "non-productive": 0
};

export async function loadModel() {
  useModel = await use.load();
  console.log("USE Model loaded");
}

export async function vectorizeText(text) {
  const embeddings = await useModel.embed([text.toLowerCase()]);
  return embeddings;
}

export function createModel() {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 128, inputShape: [512], activation: 'relu' }));
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

export async function trainModel(model, dataset) {
  const tasks = [];
  const labels = [];

  for (let item of dataset) {
    const embedding = await vectorizeText(item.text);
    tasks.push(embedding);
    labels.push(LABEL_MAP[item.label]);
  }

  const xs = tf.concat(tasks);
  const ys = tf.tensor(labels);

  await model.fit(xs, ys, {
    epochs: 10,
    batchSize: 8,
    shuffle: true,
    validationSplit: 0.2,
  });
}

export async function classifyTask(model, task) {
  const embedding = await vectorizeText(task);
  const prediction = model.predict(embedding);
  const result = (await prediction.data())[0];
  return result > 0.5 ? "productive" : "non-productive";
}
