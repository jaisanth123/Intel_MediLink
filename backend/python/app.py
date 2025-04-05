from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import logging
from pydantic import BaseModel
from llm_model import get_llm_response, ChatHistory  # Import the LLM response function and ChatHistory class
from ocr import extract_text_from_enhanced_image  # Import the OCR function
import ngrok
from prompt import create_nutrition_analysis_prompt,create_medical_chat_prompt,create_health_chat_prompt,create_health_report_analysis_prompt
from PIL import Image
import whisper
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from transformers import pipeline
import tempfile
import wave


# Set up loggingt
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ngrok.set_auth_token("2niCah6WtVIDTrt4rndLw83ak5y_7YrR4DjQk3p1hqSqmyCKp")
listener = ngrok.forward("127.0.0.1:8000", domain="cricket-romantic-slightly.ngrok-free.app")

# Define request model for chat
class ChatRequest(BaseModel):
    message: str

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)

# Initialize chat history - make this global so it persists between requests
chat_history = ChatHistory()

@app.post("/llm-chat")
async def llm_chat(request: ChatRequest):
    try:
        # Add the user message to chat history
        chat_history.add_message(request.message)

        # Create the professional medical prompt
        medical_prompt = create_medical_chat_prompt(request.message)

        # Get the LLM response using the medical prompt
        llm_response = get_llm_response(medical_prompt, chat_history)

        # Return the LLM response directly as text (not in JSON format)
        return llm_response
    except Exception as e:
        logger.error(f"Error in llm-chat: {str(e)}")
        error_message = f"Sorry, I encountered an error: {str(e)}"
        return JSONResponse(
            status_code=500,
            content={"message": error_message}
        )

@app.post("/health-llm-chat")
async def llm_chat(request: ChatRequest):
    try:
        # Add the user message to chat history
        chat_history.add_message(request.message)

        # Create the professional medical prompt
        medical_prompt = create_health_chat_prompt(request.message)

        # Get the LLM response using the medical prompt
        llm_response = get_llm_response(medical_prompt, chat_history)

        # Return the LLM response directly as text (not in JSON format)
        return llm_response
    except Exception as e:
        logger.error(f"Error in llm-chat: {str(e)}")
        error_message = f"Sorry, I encountered an error: {str(e)}"
        return JSONResponse(
            status_code=500,
            content={"message": error_message}
        )

@app.post("/ocr")
async def ocr(
    file: UploadFile = File(...),
    age: str = Form(None),
    gender: str = Form(None),
    description: str = Form("")
):
    try:
        # Check and handle undefined or missing values
        age_value = "Not provided" if age is None or age == "undefined" else age
        gender_value = "Not provided" if gender is None or gender == "undefined" else gender

        # Create a separate chat history for OCR analysis to keep it isolated from regular chat
        ocr_chat_history = ChatHistory()

        # Save the uploaded file temporarily
        file_location = f"uploads/{file.filename}"
        try:
            with open(file_location, "wb+") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as save_error:
            logger.error(f"Error saving file: {str(save_error)}")
            raise HTTPException(status_code=500, detail=f"Error saving file: {str(save_error)}")

        # Call the OCR function from ocr.py
        text = extract_text_from_enhanced_image(file_location)

        # If OCR text is empty, provide a fallback message
        if not text.strip():
            text = "No text could be detected in the provided image."

        # Clean up - remove the file after processing
        try:
            os.remove(file_location)
        except Exception as rm_error:
            logger.warning(f"Error removing file: {str(rm_error)}")

        # Prepare the prompt for the LLM with better handling of missing values
        prompt = create_nutrition_analysis_prompt(age_value, gender_value, description, text)

        # Add the prompt to OCR chat history
        ocr_chat_history.add_message(prompt)

        # Get the LLM response
        llm_response = get_llm_response(prompt, ocr_chat_history)

        return llm_response

    except Exception as e:
        logger.error(f"General Error in OCR endpoint: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error processing request: {str(e)}"}
        )


#===============================SENTIMENT ANALYSIS =============================
# Step 1: Transcribe audio with Whisper
def transcribe_audio(audio_file_path):
    model = whisper.load_model("tiny")
    if not os.path.exists(audio_file_path):
        raise FileNotFoundError(f"Audio file '{audio_file_path}' not found.")
    result = model.transcribe(audio_file_path)
    return result["text"]

# Step 2: Analyze sentiment with VADER
def analyze_sentiment(text):
    analyzer = SentimentIntensityAnalyzer()
    sentiment_scores = analyzer.polarity_scores(text)
    compound = sentiment_scores['compound']
    return {
        "sentiment": "Positive" if compound >= 0.05 else "Negative" if compound <= -0.05 else "Neutral",
        "scores": sentiment_scores
    }

# Step 3: Use DistilRoBERTa to explain the sentiment and transcription
def explain_feelings(transcription, sentiment_data):
    model_name = "distilroberta-base"
    generator = pipeline("text-generation", model=model_name, tokenizer=model_name)

    sentiment = sentiment_data["sentiment"]
    scores = sentiment_data["scores"]
    pos_percent = scores['pos'] * 100
    neg_percent = scores['neg'] * 100
    neu_percent = scores['neu'] * 100

    # Craft a prompt for explanation
    prompt = (
        f"Based on the statement '{transcription}' with a {sentiment} sentiment, "
        f"explain in 5-10 lines how the user feels and possible reasons for their emotions. "
        f"Sentiment scores: Positive {pos_percent:.1f}%, Negative {neg_percent:.1f}%, Neutral {neu_percent:.1f}%."
    )

    # Generate explanation
    output = generator(
        prompt,
        max_new_tokens=100,
        num_return_sequences=1,
        temperature=0.8,
        top_p=0.9,
        do_sample=True,
        truncation=True
    )
    full_text = output[0]["generated_text"]

    # Strip the prompt and ensure a clean explanation
    explanation = full_text.replace(prompt, "").strip()
    if not explanation:  # Fallback if generation fails
        explanation = (
            f"The user feels {sentiment.lower()} based on their statement. "
            f"With {pos_percent:.1f}% positive, {neg_percent:.1f}% negative, and {neu_percent:.1f}% neutral sentiment, "
            f"they might be reacting to recent events. Their emotions could stem from personal experiences or external factors."
        )
    return explanation

@app.post("/process-audio", response_class=JSONResponse)
async def process_audio(file: UploadFile = File(...)):
    """
    Process an uploaded audio file (supports WAV, MP3, MP4, M4A, etc.):
    1. Transcribe the audio
    2. Analyze sentiment
    3. Generate an explanation

    Returns a JSON with transcription, sentiment, and explanation.
    """
    # List of supported audio formats
    supported_formats = ['.wav', '.mp3', '.mp4', '.m4a', '.m4p', '.aac', '.ogg', '.flac']

    # Check file extension
    file_ext = os.path.splitext(file.filename.lower())[1]
    if file_ext not in supported_formats:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Supported formats: {', '.join(supported_formats)}"
        )

    # Save the uploaded file temporarily with its original extension
    with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_file_path = temp_file.name

    try:
        # Process the audio
        transcription = transcribe_audio(temp_file_path)
        sentiment_data = analyze_sentiment(transcription)
        explanation = explain_feelings(transcription, sentiment_data)

        # Return results
        return {
            "transcription": transcription,
            "sentiment": sentiment_data["sentiment"],
            "sentiment_scores": {
                "positive": sentiment_data["scores"]["pos"],
                "negative": sentiment_data["scores"]["neg"],
                "neutral": sentiment_data["scores"]["neu"],
                "compound": sentiment_data["scores"]["compound"]
            },
            "explanation": explanation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.unlink(temp_file_path)


@app.post("/text-sentiment", response_class=JSONResponse)
async def analyze_text_sentiment(request: ChatRequest):
    """
    Process text input for sentiment analysis:
    1. Analyze sentiment
    2. Generate an explanation

    Returns a JSON with sentiment and explanation.
    """
    try:
        text = request.message

        # Analyze sentiment
        sentiment_data = analyze_sentiment(text)

        # Generate explanation
        explanation = explain_feelings(text, sentiment_data)

        # Return results
        return {
            "text": text,
            "sentiment": sentiment_data["sentiment"],
            "sentiment_scores": {
                "positive": sentiment_data["scores"]["pos"],
                "negative": sentiment_data["scores"]["neg"],
                "neutral": sentiment_data["scores"]["neu"],
                "compound": sentiment_data["scores"]["compound"]
            },
            "explanation": explanation
        }
    except Exception as e:
        logger.error(f"Error in text-sentiment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


#======================================SENTIMENT ANALYSIS END =================================


@app.post("/health-ocr")
async def ocr(
    file: UploadFile = File(...),
    age: str = Form(None),
    gender: str = Form(None),
    description: str = Form("")
):
    try:
        # Check and handle undefined or missing values
        age_value = "Not provided" if age is None or age == "undefined" else age
        gender_value = "Not provided" if gender is None or gender == "undefined" else gender

        # Create a separate chat history for OCR analysis to keep it isolated from regular chat
        ocr_chat_history = ChatHistory()

        # Save the uploaded file temporarily
        file_location = f"uploads/{file.filename}"
        try:
            with open(file_location, "wb+") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as save_error:
            logger.error(f"Error saving file: {str(save_error)}")
            raise HTTPException(status_code=500, detail=f"Error saving file: {str(save_error)}")

        # Call the OCR function from ocr.py
        text = extract_text_from_enhanced_image(file_location)

        # If OCR text is empty, provide a fallback message
        if not text.strip():
            text = "No text could be detected in the provided image."

        # Clean up - remove the file after processing
        try:
            os.remove(file_location)
        except Exception as rm_error:
            logger.warning(f"Error removing file: {str(rm_error)}")

        # Use description as user_query if needed
        user_query = description  # Use description as the user query

        # Prepare the prompt for the LLM with better handling of missing values
        prompt = create_health_report_analysis_prompt(age_value, gender_value, description, text, user_query)

        # Add the prompt to OCR chat history
        ocr_chat_history.add_message(prompt)

        # Get the LLM response
        llm_response = get_llm_response(prompt, ocr_chat_history)

        return llm_response

    except Exception as e:
        logger.error(f"General Error in OCR endpoint: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": f"Error processing request: {str(e)}"}
        )
@app.get("/health")
async def health_check():
    """Health check endpoint to verify the service is running."""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
