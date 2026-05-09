from flask import Flask, request, jsonify
import numpy as np
import joblib
from flasgger import Swagger

app = Flask(__name__)
swagger = Swagger(app)
model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

LABELS = {
    0: "poor",
    1: "ok",
    2: "good"
}

def give_advice(features, quality):
    advices = []
    totalTime = features["totalTime"]
    coverage = features["coverage"]
    circular = features["circularRatio"]
    avgSpeed = features["avgSpeed"]
    speedVar = features["speedVariance"]
    recommendedTime = features["recommendedTime"]
    if totalTime < recommendedTime:
        advices.append("Periază mai mult timp")
    if coverage < 0.3:
        advices.append("Acoperă mai bine suprafața dintelui")
    if quality == "good":
        advices.append("Periaj corect pentru acest dinte.")
    if abs(avgSpeed - 0.5) > 0.2:
        advices.append("Menține o viteză moderată și constantă.")
    if circular < 0.5:
        advices.append("Fă mișcări mai circulare.")
    if speedVar > 0.2:
        advices.append("Mișcări prea haotice, încearcă să menții un ritm uniform.")

    return advices
@app.route("/api/evaluations", methods=["POST"])
def evaluate():
    """
   Evaluează calitatea periajului și oferă recomandări.
   ---
   tags:
     - Rezultate periaj
   parameters:
     - name: body
       in: body
       required: true
       schema:
         type: object
         properties:
           totalTime:
             type: number
           avgSpeed:
             type: number
           speedVariance:
             type: number
           circularRatio:
             type: number
           coverage:
             type: number
           recommendedTime:
             type: number
   responses:
     200:
       description: Rezultat evaluare periaj
       schema:
         type: object
         properties:
           result:
             type: string
           advice:
             type: array
             items:
               type: string
   """
    data = request.json

    features = np.array([[
        data["totalTime"],
        data["avgSpeed"],
        data["speedVariance"],
        data["circularRatio"],
        data["coverage"],
    ]])

    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)[0]
    quality = LABELS[prediction]
    advices = give_advice(data, quality)
    return jsonify({
        "result": quality,
        "advice": advices
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5001)
