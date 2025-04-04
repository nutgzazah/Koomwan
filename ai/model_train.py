import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.ensemble import RandomForestClassifier
from imblearn.over_sampling import SMOTE
import warnings
warnings.filterwarnings('ignore')

# Load dataset
df = pd.read_csv('cleaned_diabetes_prediction_dataset.csv')

# Feature Engineering
df['hypertension'] = np.where((df['systolic_bp'] > 140) | (df['diastolic_bp'] > 90), 1, 0)
df['heart_disease'] = np.where((df['systolic_bp'] > 140) | (df['blood_glucose_level'] > 180) | (df['bmi'] > 30), 1, 0)

# Handle missing values with median
imputer = SimpleImputer(strategy='median')
df_imputed = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)

# Features and Labels
X = df_imputed.drop(columns=['diabetes'])
y = df_imputed['diabetes']

# Feature Selection (optional - k=10 best features)
selector = SelectKBest(f_classif, k=10)
X_selected = selector.fit_transform(X, y)

# Solve class imbalance
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_selected, y)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X_resampled, y_resampled, test_size=0.2, stratify=y_resampled, random_state=42
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)

# Train model
model = RandomForestClassifier(n_estimators=300, class_weight='balanced', random_state=42)
model.fit(X_train_scaled, y_train)

# Save model and scaler
model_path = os.path.join(os.path.dirname(__file__), "rf_model.pkl")
scaler_path = os.path.join(os.path.dirname(__file__), "scaler.pkl")

joblib.dump(model, model_path)
joblib.dump(scaler, scaler_path)

print("✅ โมเดลและ Scaler ถูกบันทึกเรียบร้อยแล้ว!")
