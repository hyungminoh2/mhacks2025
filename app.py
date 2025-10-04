from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)  # This allows cross-origin requests from your React app

# Try loading both common patterns
load_dotenv(dotenv_path=".env.local")
load_dotenv(dotenv_path=".env")  # fallback just in case

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY_DOOHEE"))

@app.route('/generate', methods=['POST'])
def fetch_question():
    try:
        data = request.get_json()
        user_question = data.get('question', None)
        
        if not user_question:
            return jsonify({"error": "Question parameter missing."}), 400
        with open("crypto_update.html", "r") as e:
            # Add context to make the AI more crypto-focused
            email_raw = e.read()
            crypto_context = f"""You are a chatbot extension of the daily emails provided by Solvend. Here is the email sent to the user for context. Email {email_raw}
            
            User question: {user_question}"""
        
            response = client.models.generate_content(
                model="gemini-2.5-pro",
                contents=crypto_context
            )
        
        print(f"User question: {user_question}")
        print(f"AI response: {response.text}")
        
        return jsonify({"message": response.text}), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": "Internal server error. Please try again later."}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Server is running"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=4000)