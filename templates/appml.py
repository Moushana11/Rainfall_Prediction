from flask import Flask, request, render_template, jsonify
from datetime import datetime
import pandas as pd
import joblib
import numpy as np

app = Flask(__name__)

# Load the pre-trained model
with open('best_model.pkl', 'rb') as f:
    model = joblib.load(f)

@app.route('/')
def index():
    return render_template('index.html')

def predict_precipitation(model,date_objstr):
    # Assuming the model expects a certain date format or transformation
    # Convert date string to datetime object
    date_obj = datetime.strptime(date_objstr,'%Y-%m-%d')
    # Prepare the data for the model
    # This might require specific transformations depending on how the model was trained
    # For example:
    # X = [[date_obj.year, date_obj.month, date_obj.day]]
   
    # Make the prediction using the model
    # The following is an example and needs to be adjusted based on actual model input requirements
    # input = np.array([[date_obj.year, date_obj.month, date_obj.day]])
    if hasattr(model, 'predict'):
        features = [21.04, 11.44, 8.48 ,56.12, 0.00, 99.79,2.77, 0.811539, 0.584298	]
        prediction = model.predict([features])
        #prediction = model.predict(input)
    # Map the prediction to a human-readable form if necessary
        if prediction < 1:
            return 'No'
        else:
            return 'Yes'
    else:
        #return prediction
        raise ValueError("Loaded object is not a valid model")

@app.route('/predict', methods=['POST'])
def predict():
    date_str = request.form.get('date')
    if not date_str:
        return jsonify({'error': 'No date provided'}), 400
    try:
        precipitation = predict_precipitation(model,date_str)
        prediction = {
            'date': date_str,
            'precipitation': precipitation
        }
        return jsonify(prediction)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
