def create_nutrition_analysis_prompt(age, gender, description, text):
    """Simple nutrition analysis prompt"""
    return f"""
    Patient Profile:
    - Age: {age}
    - Gender: {gender}
    - Condition: {description}
    - Ingredients: {text}

    Provide:
    1. Ingredient health impact
    2. Risks/benefits for patient
    3. Dietary recommendation

    Be concise, direct, medical-focused.
    """

def create_medical_chat_prompt(user_message):
    """Simple medical chat prompt"""
    return f"""
    Medical Assistance Request:
    User Query: {user_message}

    Guidelines:
    - Provide clear, factual medical information
    - Avoid diagnosis or specific treatments
    - Recommend professional consultation if serious
    - Maximum 200 words
    - Use clear, professional language
    """