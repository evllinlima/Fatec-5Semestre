# REAL ESTATE VALUATION - RANDOM FOREST REGRESSOR

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from ucimlrepo import fetch_ucirepo
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

# === Carregar dados ===
real_estate_valuation = fetch_ucirepo(id=477)

# Data (as pandas dataframes)
X = real_estate_valuation.data.features
y = real_estate_valuation.data.targets

# Pré-processamento: remover valores nulos
indices_validos = X.notna().all(axis=1) & y.notna().all(axis=1)
X = X[indices_validos].reset_index(drop=True)
y = y[indices_validos].reset_index(drop=True)

# Separar features e target
# X já contém as features
# y já contém o target

# Dividir em treino e teste
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Treinar modelo
rf_regressor = RandomForestRegressor(n_estimators=100, random_state=42)
rf_regressor.fit(X_train, y_train.values.ravel())

# Previsões no conjunto de teste
y_pred = rf_regressor.predict(X_test)

# Avaliação
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"Mean Squared Error (MSE): {mse:.2f}")
print(f"R-squared (R²): {r2:.2f}")

# Ranking textual das features por importância
importances = rf_regressor.feature_importances_
feature_names = X.columns
sorted_indices = importances.argsort()[::-1]
print("\nRanking das features por importância:")
for i in sorted_indices:
    print(f"{feature_names[i]}: {importances[i]:.4f}")

# === Gráfico combinado: correlação + importância ===
fig, axes = plt.subplots(1, 2, figsize=(16, 6))

# Heatmap de correlação
sns.heatmap(X.corr(), annot=True, cmap='coolwarm', fmt=".2f", linewidths=0.5, ax=axes[0])
axes[0].set_title("Correlação entre Features")

# Gráfico horizontal de importância
sorted_features = [feature_names[i] for i in sorted_indices]
sorted_importances = importances[sorted_indices]
bars = axes[1].barh(sorted_features, sorted_importances, color='skyblue')
axes[1].set_xlabel("Importância")
axes[1].set_title("Importância das Features - Random Forest")
axes[1].invert_yaxis()

# Adicionar valores numéricos nas barras
for bar in bars:
    width = bar.get_width()
    axes[1].text(width + 0.001, bar.get_y() + bar.get_height()/2,
                 f"{width:.3f}", va='center')

plt.tight_layout()
plt.savefig("real_estate_feature_analysis.png")
plt.show()

# === Scatter plot: valores reais vs previstos ===
plt.figure(figsize=(8, 6))
plt.scatter(y_test, y_pred, alpha=0.5, color='teal')
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', label='Linha de referência')
plt.xlabel("Valor Real")
plt.ylabel("Valor Previsto")
plt.title("Valores Reais vs Previstos - Random Forest Regressor")
plt.legend()
plt.tight_layout()
plt.savefig("real_estate_prediction_scatter.png")
plt.show()