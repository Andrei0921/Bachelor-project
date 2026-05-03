import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, confusion_matrix
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier


# -------------------------------
# 1. Date sintetice
# -------------------------------
# [totalTime, avgSpeed, speedVar, pauses,
#  circularRatio, coverage, revisitDelay, pressureVar]
df = pd.read_csv("../Backend/src/main/resources/training_data.csv")
cols = ["totalTime", "avgSpeed", "speedVariance", "circularRatio", "coverage", "label"]
df = df[cols].copy()
df[cols] = df[cols].apply(pd.to_numeric, errors="coerce")
df = df.dropna()

feature_cols = ["totalTime", "avgSpeed", "speedVariance", "circularRatio", "coverage"]
X = df[feature_cols].values
y = df["label"].astype(int).values

# -------------------------------
# 2. Split date
# -------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y if len(np.unique(y)) > 1 else None
)

# 5) Normalizare
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 6) Modele
log_reg = LogisticRegression(max_iter=2000)
rf = RandomForestClassifier(n_estimators=200, random_state=42)

log_reg.fit(X_train_scaled, y_train)
rf.fit(X_train_scaled, y_train)

# 7) Evaluare
pred_lr = log_reg.predict(X_test_scaled)
pred_rf = rf.predict(X_test_scaled)

def evaluate_model(name, y_true, y_pred):
    return {
        "name": name,
        "accuracy": accuracy_score(y_true, y_pred),
        "precision": precision_score(y_true, y_pred, average="weighted", zero_division=0),
        "recall": recall_score(y_true, y_pred, average="weighted", zero_division=0),
        "f1": f1_score(y_true, y_pred, average="weighted", zero_division=0),
        "confusion_matrix": confusion_matrix(y_true, y_pred)
    }

metrics_lr = evaluate_model("Logistic Regression", y_test, pred_lr)
metrics_rf = evaluate_model("Random Forest", y_test, pred_rf)

print("Logistic Regression metrics:")
print("Accuracy:", metrics_lr["accuracy"])
print("Precision:", metrics_lr["precision"])
print("Recall:", metrics_lr["recall"])
print("F1-score:", metrics_lr["f1"])
print("Confusion matrix:")
print(metrics_lr["confusion_matrix"])

print("\nRandom Forest metrics:")
print("Accuracy:", metrics_rf["accuracy"])
print("Precision:", metrics_rf["precision"])
print("Recall:", metrics_rf["recall"])
print("F1-score:", metrics_rf["f1"])
print("Confusion matrix:")
print(metrics_rf["confusion_matrix"])

if (
        metrics_rf["f1"] > metrics_lr["f1"]
        or (
        metrics_rf["f1"] == metrics_lr["f1"]
        and metrics_rf["accuracy"] >= metrics_lr["accuracy"]
)
):
    best_model = rf
    best_metrics = metrics_rf
else:
    best_model = log_reg
    best_metrics = metrics_lr

print("\nBest model:", best_metrics["name"])
print("Best model accuracy:", best_metrics["accuracy"])
print("Best model precision:", best_metrics["precision"])
print("Best model recall:", best_metrics["recall"])
print("Best model F1-score:", best_metrics["f1"])
print("Best model confusion matrix:")
print(best_metrics["confusion_matrix"])

joblib.dump(best_model, "model.pkl")
joblib.dump(scaler, "scaler.pkl")