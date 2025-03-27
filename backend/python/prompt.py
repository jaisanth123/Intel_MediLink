def create_nutrition_analysis_prompt(age, gender, description, text):
    """Simple nutrition analysis prompt"""
    return f"""
    Patient Profile:
    - Age: {age}
    - Gender: {gender}
    - Condition: {description}
    - Ingredients: {text}

    Must Follow
    1. Your response must be concise; only answer the questions and provide additional information only if needed.
    2. You should write like a professional doctor.
    3. Be responsible in your research.
    4. Importantly, your response needs to be structured in a pointwise format, not in a single paragraph, which is not suitable for customers.

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

    Must Follow
    1. Your response must be concise; only answer the questions and provide additional information only if needed.
    2. You should write like a professional doctor.
    3. Be responsible in your research.
    4. Importantly, your response needs to be structured in a pointwise format, not in a single paragraph, which is not suitable for customers.

    Guidelines:
    - Provide clear, factual medical information
    - Avoid diagnosis or specific treatments
    - Recommend professional consultation if serious
    - Use clear, professional language
    """