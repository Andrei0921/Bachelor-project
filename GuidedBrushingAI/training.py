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

acc_lr = accuracy_score(y_test, pred_lr)
acc_rf = accuracy_score(y_test, pred_rf)

precision = precision_score(y_test, pred_rf, average="weighted")
recall = recall_score(y_test, pred_rf, average="weighted")
f1 = f1_score(y_test, pred_rf, average="weighted")

print("Logistic Regression accuracy:", acc_lr)
print("Random Forest accuracy:", acc_rf)
print("Precision:", precision)
print("Recall:", recall)
print("F1-score:", f1)
print("Confusion matrix (RF):")
print(confusion_matrix(y_test, pred_rf))

# 8) Alegere + salvare
best_model = rf if acc_rf >= acc_lr else log_reg
joblib.dump(best_model, "model.pkl")
joblib.dump(scaler, "scaler.pkl")