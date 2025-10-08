from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)

# Allow requests from your frontend dev servers
FRONTEND_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]
CORS(app, resources={r"/*": {"origins": FRONTEND_ORIGINS}})



# Load model safely
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
model = joblib.load(MODEL_PATH)


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json() or {}
    print("Incoming data:", data)

    try:
        df = pd.DataFrame([{
            'Attendance_Rate': float(data.get('Attendance_Rate', 0)),
            'Study_Hours_Per_Week': float(data.get('Study_Hours_Per_Week', 0)),
            'Sleep_Hours': float(data.get('Sleep_Hours', 0)),
            'Part_Time_Job': data.get('Part_Time_Job', ''),
            'Internet_Usage_Hrs': float(data.get('Internet_Usage_Hrs', 0)),
            'Assignments_Completed': float(data.get('Assignments_Completed', 0)),
            'Club_Involvement': data.get('Club_Involvement', ''),
            'Parent_Education_Level': data.get('Parent_Education_Level', '')
        }])

        pred = model.predict(df)[0]
        print("Prediction result:", pred)

        return jsonify({
            'success': True,
            'prediction': str(pred),
            'message': f"Predicted Performance Category: {pred}"
        })
    except Exception as e:
        print("Prediction error:", e)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/', methods=['GET'])
def index():
    return jsonify({'status': 'ok', 'message': 'Flask backend is running.'})


if __name__ == '__main__':
    app.run(port=5000, debug=True)

