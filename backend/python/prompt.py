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
    """

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

def create_health_report_analysis_prompt(age, gender, description, ocr_text):
    """Health report analysis prompt based on OCR results"""
    return f"""
    Patient Profile:
    - Age: {age}
    - Gender: {gender}
    - Condition: {description}
    - OCR Text: {ocr_text}

    Response Guidelines:
    - Be concise and direct.
    - Use professional medical language.
    - Structure your response in clear points.

    Required Information:
    1. Key findings from the health report.
    2. Risks and benefits for the patient.
    3. Recommendations based on findings.
    """