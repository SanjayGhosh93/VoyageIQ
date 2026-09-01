import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier

class FreightRateForecaster:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self._fit_baseline()

    def _fit_baseline(self):
        np.random.seed(42)
        X = np.random.uniform(low=[2000, 20000, 1000], high=[10000, 150000, 3000], size=(500, 3))
        y = (X[:, 0] * 0.0035) + (X[:, 2] * 0.007) - (X[:, 1] * 0.00004) + np.random.normal(0, 1.5, 500)
        self.model.fit(X, y)

    def predict(self, distance_nm, cargo_volume, bdi_index=1800):
        rate = self.model.predict([[distance_nm, cargo_volume, bdi_index]])[0]
        return round(float(max(rate, 9.0)), 2)

class DemurrageRiskClassifier:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=50, random_state=42)
        self._fit_baseline()

    def _fit_baseline(self):
        np.random.seed(42)
        X = np.random.uniform(low=[0, 1, 0.5], high=[1, 15, 1.2], size=(400, 3))
        y = ((X[:, 0] == 1) | (X[:, 1] > 7) | (X[:, 2] < 0.85)).astype(int)
        self.model.fit(X, y)

    def predict_risk_score(self, month, queue_count, draft_ratio):
        is_monsoon = 1 if month in [6, 7, 8, 9] else 0
        prob = self.model.predict_proba([[is_monsoon, queue_count, draft_ratio]])[0][1]
        return round(float(prob * 100), 1)