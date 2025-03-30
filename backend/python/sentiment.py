# import whisper
# from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
# from transformers import pipeline
# import os

# # Step 1: Transcribe audio with Whisper
# def transcribe_audio(audio_file):
#     model = whisper.load_model("tiny")
#     if not os.path.exists(audio_file):
#         raise FileNotFoundError(f"Audio file '{audio_file}' not found.")
#     result = model.transcribe(audio_file)
#     return result["text"]

# # Step 2: Analyze sentiment with VADER
# def analyze_sentiment(text):
#     analyzer = SentimentIntensityAnalyzer()
#     sentiment_scores = analyzer.polarity_scores(text)
#     compound = sentiment_scores['compound']
#     return {
#         "sentiment": "Positive" if compound >= 0.05 else "Negative" if compound <= -0.05 else "Neutral",
#         "scores": sentiment_scores
#     }

# # Step 3: Use DistilRoBERTa to explain the sentiment and transcription
# def explain_feelings(transcription, sentiment_data):
#     model_name = "distilroberta-base"
#     generator = pipeline("text-generation", model=model_name, tokenizer=model_name)

#     sentiment = sentiment_data["sentiment"]
#     scores = sentiment_data["scores"]
#     pos_percent = scores['pos'] * 100
#     neg_percent = scores['neg'] * 100
#     neu_percent = scores['neu'] * 100

#     # Craft a prompt for explanation
#     prompt = (
#         f"Based on the statement '{transcription}' with a {sentiment} sentiment, "
#         f"explain in 5-10 lines how the user feels and possible reasons for their emotions. "
#         f"Sentiment scores: Positive {pos_percent:.1f}%, Negative {neg_percent:.1f}%, Neutral {neu_percent:.1f}%."
#     )

#     # Generate explanation
#     output = generator(
#         prompt,
#         max_length=250,  # Enough for 5-10 lines
#         num_return_sequences=1,
#         temperature=0.8,
#         top_p=0.9,
#         do_sample=True,
#         truncation=True
#     )
#     full_text = output[0]["generated_text"]

#     # Strip the prompt and ensure a clean explanation
#     explanation = full_text.replace(prompt, "").strip()
#     if not explanation:  # Fallback if generation fails
#         explanation = (
#             f"The user feels {sentiment.lower()} based on their statement. "
#             f"With {pos_percent:.1f}% positive, {neg_percent:.1f}% negative, and {neu_percent:.1f}% neutral sentiment, "
#             f"they might be reacting to recent events. Their emotions could stem from personal experiences or external factors."
#         )
#     return explanation

# # Main function
# def main():
#     audio_file = "/home/brooklin/Downloads/input.m4a"  # Replace with your audio file

#     try:
#         # Transcribe
#         print("Transcribing audio...")
#         transcription = transcribe_audio(audio_file)
#         print(f"Transcription: {transcription}")

#         # Sentiment
#         print("Analyzing sentiment...")
#         sentiment_data = analyze_sentiment(transcription)
#         print(f"Sentiment: {sentiment_data['sentiment']}")

#         # Explain feelings
#         print("Generating explanation...")
#         explanation = explain_feelings(transcription, sentiment_data)
#         print(f"Bot response:\n{explanation}")

#     except Exception as e:
#         print(f"An error occurred: {str(e)}")

# if __name__ == "__main__":
#     main()



from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import whisper
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from transformers import pipeline
import os
import tempfile
import shutil
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Audio Sentiment Analysis API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from this origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)