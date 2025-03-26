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
from prompt import create_nutrition_analysis_prompt,create_medical_chat_prompt
from PIL import Image

# Set up logging
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

@app.get("/health")
async def health_check():
    """Health check endpoint to verify the service is running."""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
