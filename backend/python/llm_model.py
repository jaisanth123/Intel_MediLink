from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
from transformers import pipeline
import logging
from typing import List, Tuple
import os
# Set up logging
from kaggle_secrets import UserSecretsClient


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Check for GPU availability
device = "cuda" if torch.cuda.is_available() else "cpu"

# HF_TOKEN = os.environ.get('hf_token', None)
user_secrets = UserSecretsClient()
HF_TOKEN = user_secrets.get_secret("hf_token")

# Validate token
if not HF_TOKEN:
    logger.warning("No Hugging Face token found in Kaggle secrets. Some models may require authentication.")

# Load Qwen-1.5-0.5B-Chat amasfodel and tokenizer
# MODEL_NAME = "Qwen/Qwen-1.5-0.5B-Chat"
# MODEL_NAME = "ContactDoctor/Bio-Medical-MultiModal-Llama-3-8B-V1"
MODEL_NAME = "ContactDoctor/Bio-Medical-Llama-3-8B"
try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME,token=HF_TOKEN, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        torch_dtype=torch.float16 if device == "cuda" else torch.float32,
        device_map="auto" if device == "cuda" else None,
        trust_remote_code=True,
        low_cpu_mem_usage=True,
    )
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    raise

# Create the text generation pipeline
try:
    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        max_new_tokens=512,
        temperature=0.7,
        top_p=0.9,
        repetition_penalty=1.1,
        do_sample=True,
        return_full_text=False,
    )
except Exception as e:
    logger.error(f"Error creating pipeline: {str(e)}")
    raise

# Define a chat history class to manage conversation history
class ChatHistory:
    def __init__(self, window_size=5):  # Changed to 5 as requested
        self.messages: List[Tuple[str, str]] = []
        self.window_size = window_size

    def add_message(self, user_message: str, ai_response: str = ""):
        """Add a message pair to history. If ai_response is empty, it will be filled later."""
        self.messages.append((user_message, ai_response))
        # Keep only the last window_size messages
        if len(self.messages) > self.window_size:
            self.messages = self.messages[-self.window_size:]

    def update_last_response(self, ai_response: str):
        """Update the last AI response in the history."""
        if self.messages:
            user_msg, _ = self.messages[-1]
            self.messages[-1] = (user_msg, ai_response)

    def get_chat_history_text(self):
        """Format the chat history in a way that works well with Qwen models."""
        history_text = ""
        for user_msg, ai_msg in self.messages[:-1]:  # Exclude the current message
            if ai_msg:  # Only include complete exchanges
                history_text += f"<|im_start|>user\n{user_msg}<|im_end|>\n"
                history_text += f"<|im_start|>assistant\n{ai_msg}<|im_end|>\n"
        return history_text

# Function to generate response using model
def get_llm_response(message: str, chat_history: ChatHistory):
    try:
        # Add the current message to history
        chat_history.add_message(message)

        # Get conversation history (excluding the current message)
        history_text = chat_history.get_chat_history_text()

        # Create a system prompt
        system_prompt = "You are a helpful, friendly AI assistant. Provide clear, concise, and accurate responses to user questions."

        # Construct the prompt in Qwen's expected chat format
        full_prompt = f"<|im_start|>system\n{system_prompt}<|im_end|>\n{history_text}<|im_start|>user\n{message}<|im_end|>\n<|im_start|>assistant\n"

        # Log the prompt for debugging
        logger.info(f"Prompt sent to LLM: {full_prompt}")

        # Generate the response using the pipeline
        response = pipe(full_prompt)[0]['generated_text']

        # Clean up the response if needed
        response = response.strip()

        # Log the response for debugging
        logger.info(f"Generated response: {response}")

        # Update the chat history with the AI's response
        chat_history.update_last_response(response)

        return response

    except Exception as e:
        logger.error(f"Error in get_llm_response: {str(e)}")
        error_message = f"I'm sorry, I encountered an error: {str(e)}"
        chat_history.update_last_response(error_message)
        return error_message

# Example usage
if __name__ == "__main__":
    # Initialize chat history with 5-message window
    history = ChatHistory(window_size=5)

    # Example conversation loop
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit", "bye"]:
            print("Chatbot: Goodbye!")
            break

        response = get_llm_response(user_input, history)
        print(f"Chatbot: {response}")