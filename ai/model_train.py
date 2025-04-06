import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import classification_report, confusion_matrix
from imblearn.over_sampling import SMOTENC
import warnings


warnings.filterwarnings('ignore')


#Create Pipeline For (imputer → scaler → selector → model) # Only One File (rf_model.pkl)
#Use SMOTENC For categorical (gender) Fix
#Use confusion_matrix, classification_report, cross_val_score (Show)
# === Load Dataset ===

# === Load Dataset ===
df = pd.read_csv('cleaned_diabetes_prediction_dataset.csv')

# === Encode Gender (0 = male, 1 = female) ===
df['gender'] = df['gender'].astype(str).str.lower().map({'male': 0, 'female': 1}).fillna(0)

# === Reverse-calculate weight/height from BMI (assume height = 165 cm) ===
df['height'] = 165
df['weight'] = round(df['bmi'] * ((df['height'] / 100) ** 2), 1)

# === Add engineered features ===
df['hypertension'] = ((df['systolic_bp'] > 140) | (df['diastolic_bp'] > 90)).astype(int)
df['heart_disease'] = ((df['systolic_bp'] > 140) | (df['blood_glucose_level'] > 180) |
                       ((df['weight'] / ((df['height'] / 100) ** 2)) > 30)).astype(int)

# === Define features and target ===
X = df.drop(columns=['diabetes', 'bmi'])
y = df['diabetes']

# === Handle missing values ===
categorical_cols = ['gender']
numerical_cols = X.columns.difference(categorical_cols)

X[numerical_cols] = SimpleImputer(strategy='median').fit_transform(X[numerical_cols])
X[categorical_cols] = X[categorical_cols].fillna(0)

# === Handle class imbalance using SMOTENC ===
cat_features = [X.columns.get_loc(col) for col in categorical_cols]
X_resampled, y_resampled = SMOTENC(categorical_features=cat_features, random_state=42).fit_resample(X, y)

# === Train/Test Split ===
X_train, X_test, y_train, y_test = train_test_split(
    X_resampled, y_resampled, test_size=0.2, stratify=y_resampled, random_state=42
)

# === Build classifier and wrap with calibration ===
rf = RandomForestClassifier(n_estimators=300, class_weight='balanced', random_state=42)
calibrated_rf = CalibratedClassifierCV(estimator=rf, cv=5, method='sigmoid')

# === Build pipeline ===
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("selector", SelectKBest(score_func=f_classif, k=10)),
    ("classifier", calibrated_rf)
])

# === Train model ===
pipeline.fit(X_train, y_train)

# === Evaluate model ===
y_pred = pipeline.predict(X_test)
print("\n📊 Classification Report:\n", classification_report(y_test, y_pred, digits=4))

matrix = confusion_matrix(y_test, y_pred)
print("\n📊 Confusion Matrix:")
print(matrix)

cv_scores = cross_val_score(pipeline, X_resampled, y_resampled, cv=5, scoring='roc_auc')
print("\n✅ ROC AUC (5-Fold CV):", round(cv_scores.mean(), 4))

# === Save trained model ===
model_path = os.path.join(os.path.dirname(__file__), "rf_model.pkl")
joblib.dump(pipeline, model_path)

print("\n✅ Model trained & saved as rf_model.pkl")
