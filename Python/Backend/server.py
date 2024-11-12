from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import TFBertForSequenceClassification, BertTokenizer
import tensorflow as tf

# Initialize the app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this list to specify which origins can connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# from transformers import TFBertForSequenceClassification, BertTokenizer
model = TFBertForSequenceClassification.from_pretrained('Ayush01122004/Task-Classifier')
tokenizer = BertTokenizer.from_pretrained('Ayush01122004/Task-Classifier')


# Load the model and tokenizer
# model = TFBertForSequenceClassification.from_pretrained('TaskClassKar')
# tokenizer = BertTokenizer.from_pretrained('TaskClassKar')

# Request model
class TextRequest(BaseModel):
    text: str

@app.post("/predict")
async def predict(text_request: TextRequest):
    text = text_request.text
    inputs = tokenizer.batch_encode_plus(
        [text], 
        max_length=128, 
        padding=True, 
        truncation=True, 
        return_tensors='tf'
    )
    input_ids = inputs['input_ids']
    attention_mask = inputs['attention_mask']
    outputs = model(input_ids, attention_mask=attention_mask)
    predicted_class = tf.argmax(outputs.logits, axis=1).numpy()[0]
    return {"prediction": int(predicted_class)}

@app.get("/")
def read_root():
    return {"message": "Server is OK"}

# Run the app
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
