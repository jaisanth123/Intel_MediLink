from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
from PIL import Image
import os
import shutil
import logging
from pydantic import BaseModel

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request model for chat
class ChatRequest(BaseModel):
    message: str

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)

@app.post("/llm-chat")
async def llm_chat(request: ChatRequest):
    try:
        logger.info(f"Received message: {request.message}")
        # For now, just return a simple acknowledgment
        return JSONResponse(content={"message": "I received the message"})
    except Exception as e:
        logger.error(f"Error in llm-chat: {str(e)}")
        return JSONResponse(
            status_code=500, 
            content={"message": f"Error processing message: {str(e)}"}
        )

@app.post("/ocr")
async def ocr(
    file: UploadFile = File(...),
    age: str = Form(...),
    gender: str = Form(...),
    description: str = Form("")
):
    try:
        logger.info(f"Received file: {file.filename}, content_type: {file.content_type}")
        logger.info(f"User info - Age: {age}, Gender: {gender}")
        logger.info(f"Description: {description}")
        
        # Save the uploaded file temporarily
        file_location = f"uploads/{file.filename}"
        try:
            with open(file_location, "wb+") as buffer:
                shutil.copyfileobj(file.file, buffer)
            logger.info(f"File saved to {file_location}")
        except Exception as save_error:
            logger.error(f"Error saving file: {str(save_error)}")
            raise HTTPException(status_code=500, detail=f"Error saving file: {str(save_error)}")
        
        # Check if file exists and is readable
        if not os.path.exists(file_location):
            logger.error(f"File does not exist at {file_location}")
            raise HTTPException(status_code=500, detail="File was not saved correctly")
        
        # Verify tesseract is installed
        try:
            tesseract_version = pytesseract.get_tesseract_version()
            logger.info(f"Tesseract version: {tesseract_version}")
        except Exception as tess_error:
            logger.error(f"Tesseract error: {str(tess_error)}")
            # You might need to set the tesseract path if it's not in PATH
            # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # Windows
            # or
            # pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'  # Linux
            raise HTTPException(status_code=500, detail=f"Tesseract error: {str(tess_error)}")
        
        # Perform OCR on the image
        try:
            img = Image.open(file_location)
            logger.info(f"Image opened: {img.format}, size: {img.size}, mode: {img.mode}")
            text = pytesseract.image_to_string(img)
            logger.info(f"OCR Result: {text[:100]}...")  # Log first 100 chars
        except Exception as ocr_error:
            logger.error(f"OCR Error: {str(ocr_error)}")
            return JSONResponse(content={
                "success": False, 
                "message": f"OCR Error: {str(ocr_error)}"
            })
        
        # Remove the file after processing
        try:
            os.remove(file_location)
            logger.info(f"File removed: {file_location}")
        except Exception as rm_error:
            logger.warning(f"Error removing file: {str(rm_error)}")
        
        # Return structured response with user info and OCR result
        return JSONResponse(content={
            "success": True,
            "gender": gender,
            "age": age,
            "description": description,
            "text": text
        })
    except Exception as e:
        logger.error(f"General Error: {str(e)}")
        return JSONResponse(content={"success": False, "message": str(e)})
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)