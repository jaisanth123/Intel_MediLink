def create_nutrition_analysis_prompt(age, gender, description, text):
    """Nutrition analysis prompt"""
    return f"""
    Patient Profile:
    - Age: {age}
    - Gender: {gender}
    - Condition: {description}
    - Ingredients: {text}

    Response Guidelines:
    1. Be concise.
    2. Use professional language.
    3. Structure in points.

    Provide:
    - Health impact of ingredients
    - Risks and benefits
    - Dietary recommendations
    """

def create_medical_chat_prompt(user_message):
    """Medical chat prompt"""
    return f"""
    Medical Assistance Request:
    User Query: {user_message}

    Response Guidelines:
    1. Be concise.
    2. Use professional language.
    3. Structure in points.

    Guidelines:
    - Provide factual information
    - Avoid diagnosis
    - Recommend consultation if serious
    # """

def create_health_chat_prompt(user_message):
    """Health chat prompt"""
    return f"""
    Health Assistance Request:
    User Query: {user_message}

    Response Guidelines:
    1. Be concise.
    2. Use professional language.
    3. Structure in points.

    Guidelines:
    - Provide factual information
    - Avoid diagnosis
    - Recommend consultation if serious
    """

def create_health_report_analysis_prompt(age, gender, description, ocr_text, user_query):
    """Health report analysis prompt based on OCR results"""
    return f"""
    Patient Profile:
    - Age: {age}
    - Gender: {gender}
    - Condition: {description}
    - OCR Text: {ocr_text}
    - User Query: {user_query}

    Response Guidelines:
    - Be concise and direct.
    - Use professional medical language.
    - Structure your response in clear points.

    Required Information:
    1. Key findings from the health report.
    2. Risks and benefits for the patient.
    3. Recommendations based on findings.

    Additional Guidelines:
    - If the OCR data is irrelevant to the user query (e.g., the OCR data is about a urine test and the user asks about an eye check), acknowledge the discrepancy.
    - Politely inform the user that the provided data does not pertain to their question and suggest they provide relevant information or ask a different question.
    - Always prioritize the user's query and ensure the response is tailored to their needs.
    """