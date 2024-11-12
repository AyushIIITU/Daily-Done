import * as tf from '@tensorflow/tfjs';
import { Dataset } from './Dataset.js';
// Initialize an empty vocabulary
let vocabulary = [];

// Function to tokenize text (split into lowercase words)
function tokenize(text) {
    return text.split(" ").map(word => word.toLowerCase());
}

// Function to build vocabulary dynamically from a list of tasks
function buildVocabulary(tasks) {
    const uniqueWords = new Set();
    tasks.forEach(task => {
        tokenize(task).forEach(word => uniqueWords.add(word));
    });
    vocabulary = Array.from(uniqueWords);  // Convert Set to Array
}

// Function to vectorize text using the dynamically built vocabulary
function vectorize(text) {
    let vector = Array(vocabulary.length).fill(0);
    tokenize(text).forEach(word => {
        let index = vocabulary.indexOf(word);
        if (index !== -1) vector[index] += 1;
    });
    return vector;
}

// Define the model
const model = tf.sequential();

// Function to define and compile the model
function defineModel() {
    model.add(tf.layers.dense({ units: 64, inputShape: [vocabulary.length], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 2, activation: 'softmax' })); // 2 output classes: productive or non-productive

    model.compile({
        optimizer: 'adam',
        loss: 'sparseCategoricalCrossentropy',
        metrics: ['accuracy']
    });
}

// Function to train the model
async function trainModel(tasks, labels) {
    // Ensure the input task vectors are float32
    const xs = tf.tensor2d(tasks, [tasks.length, vocabulary.length], 'float32');  // Input task vectors
    // Ensure labels are int32 for sparseCategoricalCrossentropy
    const ys = tf.tensor1d(labels, 'float32');  // Productive: 1, Non-productive: 0
  
    await model.fit(xs, ys, {
        epochs: 10,
        shuffle: true
    });
}

// Function to classify a task
function classifyTask(task) {
    const taskVector = vectorize(task);
    const taskTensor = tf.tensor2d([taskVector], [1, vocabulary.length], 'float32');  // Wrap vector in 2D tensor

    // Predict the task category
    const prediction = model.predict(taskTensor);
    const category = prediction.argMax(-1).dataSync()[0];  // Get index of the max value (0 or 1)
    
    return category === 1 ? "productive" : "non-productive";
}

// Example usage
const taskDescriptions = [
    "Working on a project report", 
    "Scrolling through social media"
];

const labels = [1, 0]; // 1 = Productive, 0 = Non-productive

// Build the vocabulary from the tasks
buildVocabulary(taskDescriptions);

// Now define the model with the updated vocabulary
defineModel();

// Vectorize the tasks based on the vocabulary
const tasks = taskDescriptions.map(task => vectorize(task));

// Train the model
trainModel(tasks, labels).then(() => {
    // After training, classify a new task
    let findCorrect=0;
    Dataset.forEach(async (data)=>{
        const result = classifyTask(data.text);
        if(result === data.label){
            findCorrect++;
        }
        else{
            console.log(`${data.text} : ${result}`);  // Should output "productive"
        }
    })
    // const result = classifyTask("Sleeping for 2 hours");
    console.log(`Task correct: ${findCorrect}`,`Task Wrong : ${Dataset.length-findCorrect}`);  // Should output "productive"
});
