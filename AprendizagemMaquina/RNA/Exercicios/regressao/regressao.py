import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.preprocessing import StandardScaler
import seaborn as sns
import matplotlib.pyplot as plt
from ucimlrepo import fetch_ucirepo

# ========================================
# 1. ESCOLHER E CARREGAR O DATASET
# ========================================
# Buscar o dataset Daily Demand Forecasting Orders da UCI
daily_demand = fetch_ucirepo(id=409)

# Dados como pandas dataframes
X = daily_demand.data.features
y = daily_demand.data.targets

# ========================================
# 1a. DESCRIÇÃO DO DATASET
# ========================================
print("\n" + "="*60)
print("DESCRIÇÃO DO DATASET: Daily Demand Forecasting Orders")
print("="*60)
print(f"- Número de registros: {len(X)}")
print(f"- Número de variáveis de entrada: {len(X.columns)}")
print(f"- Variáveis de entrada: {X.columns.tolist()}")
print(f"- Variável de saída: {y.columns[0]} (Total de pedidos)")
print(f"- Tipos de dados das variáveis de entrada:")
print(X.dtypes)
print(f"\n- Tipo de dado da variável de saída: {y.dtypes[0]}")

print("\n" + "-"*60)
print("INFORMAÇÕES ESTATÍSTICAS DAS VARIÁVEIS DE ENTRADA:")
print("-"*60)
print(X.describe())

print("\n" + "-"*60)
print("INFORMAÇÕES ESTATÍSTICAS DAS VARIÁVEIS DE ENTRADA:")
print("-"*60)
print(X.describe())

# ========================================
# 2. VERIFICAR SE Y É NUMÉRICA
# ========================================
print("\n" + "="*60)
print("VERIFICAÇÃO DA VARIÁVEL DE SAÍDA")
print("="*60)
if np.issubdtype(y.dtypes[0], np.number):
    print(f"✓ A variável de saída '{y.columns[0]}' é NUMÉRICA ({y.dtypes[0]})")
    print(f"  Isso permite realizar regressão linear: y = f(x1, x2, x3, ...)")
    print(f"\n  Estatísticas de '{y.columns[0]}':")
    print(f"  - Valor mínimo: {y.min()[0]:.2f}")
    print(f"  - Valor máximo: {y.max()[0]:.2f}")
    print(f"  - Média: {y.mean()[0]:.2f}")
    print(f"  - Desvio padrão: {y.std()[0]:.2f}")
else:
    print(f"✗ AVISO: A variável '{y.columns[0]}' NÃO é numérica!")
    print("  Regressão linear requer variável de saída numérica.")

# ========================================
# 3. VISUALIZAÇÃO DA DISTRIBUIÇÃO (PAIRPLOT)
# ========================================
print("\n" + "="*60)
print("VISUALIZAÇÃO: Gráfico de Distribuição das Variáveis")
print("="*60)
print("Gerando gráfico pairplot (par-a-par)...")
# Como temos muitas variáveis, vamos selecionar as principais para o pairplot
principais_vars = ['Week of the month', 'Day of the week', 'Order type A', 'Order type B', 'Order type C']
df_plot = pd.concat([X[principais_vars], y], axis=1)
sns.pairplot(df_plot, diag_kind='kde', plot_kws={'alpha': 0.6})
plt.suptitle('Distribuição das Principais Variáveis', y=1.02)
plt.show()

# ========================================
# 4. NORMALIZAÇÃO DOS DADOS
# ========================================
print("\n" + "="*60)
print("NORMALIZAÇÃO DOS DADOS")
print("="*60)
print("Aplicando StandardScaler para melhor performance do modelo...")
scaler_X = StandardScaler()
scaler_y = StandardScaler()

# Transformar os dados
X_scaled = scaler_X.fit_transform(X)
y_scaled = scaler_y.fit_transform(y)

print("✓ Dados normalizados (média=0, desvio padrão=1)")

# ========================================
# 5. SEPARAÇÃO EM TREINO E TESTE
# ========================================
print("\n" + "="*60)
print("SEPARAÇÃO DOS DADOS: Treino (80%) e Teste (20%)")
print("="*60)
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y_scaled, test_size=0.2, random_state=42
)
print(f"- Registros de treino: {len(X_train)}")
print(f"- Registros de teste: {len(X_test)}")

# ========================================
# 3a. REGRESSÃO LINEAR (LinearRegression)
# ========================================
print("\n" + "="*60)
print("PROGRAMA A: REGRESSÃO LINEAR (LinearRegression)")
print("="*60)
modelo_lr = LinearRegression()
modelo_lr.fit(X_train, y_train)

# Fazer previsões
y_pred_lr = modelo_lr.predict(X_test)

# Converter para escala original
y_test_original = scaler_y.inverse_transform(y_test).ravel()
y_pred_lr_original = scaler_y.inverse_transform(y_pred_lr).ravel()

# Calcular métricas
mae_lr = mean_absolute_error(y_test_original, y_pred_lr_original)
mse_lr = mean_squared_error(y_test_original, y_pred_lr_original)
correlacao_lr = np.corrcoef(y_test_original, y_pred_lr_original)[0, 1]

print("\nResultados da Regressão Linear:")
print(f"  - Erro Médio Absoluto (MAE): {mae_lr:.2f}")
print(f"  - Erro Quadrático Médio (MSE): {mse_lr:.2f}")
print(f"  - Coeficiente de Correlação: {correlacao_lr:.4f}")

print("\n  Coeficientes do modelo (model.coef_):")
for feature, coef in zip(X.columns, modelo_lr.coef_.ravel()):
    print(f"    {feature}: {coef:.4f}")
print(f"  Intercepto: {modelo_lr.intercept_[0]:.4f}")

# ========================================
# 3b. REGRESSÃO COM REDE NEURAL (MLPRegressor)
# ========================================
print("\n" + "="*60)
print("PROGRAMA B: REGRESSÃO COM REDE NEURAL (MLPRegressor)")
print("="*60)
print("Treinando rede neural com 1 camada oculta (64 neurônios)...")

modelo_mlp = MLPRegressor(
    hidden_layer_sizes=(64,),  # 1 camada oculta com 64 neurônios
    activation='relu',
    solver='adam',
    max_iter=100,
    batch_size=32,
    verbose=False,
    random_state=42,
    early_stopping=True,
    validation_fraction=0.1
)

modelo_mlp.fit(X_train, y_train.ravel())

# Fazer previsões
y_pred_mlp = modelo_mlp.predict(X_test)

# Converter para escala original
y_pred_mlp_original = scaler_y.inverse_transform(y_pred_mlp.reshape(-1, 1)).ravel()

# Calcular métricas
mae_mlp = mean_absolute_error(y_test_original, y_pred_mlp_original)
mse_mlp = mean_squared_error(y_test_original, y_pred_mlp_original)
correlacao_mlp = np.corrcoef(y_test_original, y_pred_mlp_original)[0, 1]

print("\nResultados da Rede Neural:")
print(f"  - Erro Médio Absoluto (MAE): {mae_mlp:.2f}")
print(f"  - Erro Quadrático Médio (MSE): {mse_mlp:.2f}")
print(f"  - Coeficiente de Correlação: {correlacao_mlp:.4f}")
print(f"  - Número de iterações: {modelo_mlp.n_iter_}")
print(f"  - Número de camadas: {modelo_mlp.n_layers_}")
print(f"  - Erro final (loss): {modelo_mlp.loss_:.4f}")

# ========================================
# 6. CÁLCULO DO COEFICIENTE DE CORRELAÇÃO
# ========================================
print("\n" + "="*60)
print("COEFICIENTE DE CORRELAÇÃO ENTRE REAL E PREVISTO")
print("="*60)
print(f"Linear Regression: {correlacao_lr:.4f}")
print(f"MLP Regressor:     {correlacao_mlp:.4f}")
print("\nInterpretação:")
print("  - Valores próximos de 1.0 indicam excelente correlação")
print("  - Valores acima de 0.7 indicam boa correlação")

# ========================================
# 7. VISUALIZAÇÃO: REAL vs PREVISTO (10 valores)
# ========================================
print("\n" + "="*60)
print("GRÁFICO: 10 Valores de Teste - Real vs Previsto")
print("="*60)

# Selecionar 10 valores aleatórios
np.random.seed(42)
indices = np.random.choice(len(y_test_original), 10, replace=False)
indices = np.sort(indices)

y_test_10 = y_test_original[indices]
y_pred_lr_10 = y_pred_lr_original[indices]
y_pred_mlp_10 = y_pred_mlp_original[indices]

# Criar DataFrame para visualização
df_comparacao = pd.DataFrame({
    'Índice': range(1, 11),
    'Real': y_test_10,
    'Previsto (LR)': y_pred_lr_10,
    'Previsto (MLP)': y_pred_mlp_10
})

print("\nComparação de 10 valores do conjunto de teste:")
print(df_comparacao.to_string(index=False))

# Plotar gráfico de barras
x_pos = np.arange(10)
width = 0.25

fig, ax = plt.subplots(figsize=(12, 6))
ax.bar(x_pos - width, y_test_10, width, label='Real', alpha=0.8, color='blue')
ax.bar(x_pos, y_pred_lr_10, width, label='Previsto (Linear Regression)', alpha=0.8, color='green')
ax.bar(x_pos + width, y_pred_mlp_10, width, label='Previsto (MLP)', alpha=0.8, color='orange')

ax.set_xlabel('Amostra')
ax.set_ylabel('Total de Pedidos')
ax.set_title('Comparação: Valores Reais vs Previstos (10 amostras)')
ax.set_xticks(x_pos)
ax.set_xticklabels([f'{i+1}' for i in range(10)])
ax.legend()
ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

# ========================================
# GRÁFICO SCATTER: REAL vs PREVISTO
# ========================================
print("\n" + "="*60)
print("GRÁFICO SCATTER: Valores Reais vs Previstos (todos os dados de teste)")
print("="*60)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))

# Linear Regression
ax1.scatter(y_test_original, y_pred_lr_original, alpha=0.6, color='green')
ax1.plot([y_test_original.min(), y_test_original.max()], 
         [y_test_original.min(), y_test_original.max()], 'r--', lw=2)
ax1.set_xlabel('Valores Reais')
ax1.set_ylabel('Valores Previstos')
ax1.set_title(f'Linear Regression\n(Correlação: {correlacao_lr:.4f}, MAE: {mae_lr:.2f})')
ax1.grid(True, alpha=0.3)

# MLP Regressor
ax2.scatter(y_test_original, y_pred_mlp_original, alpha=0.6, color='orange')
ax2.plot([y_test_original.min(), y_test_original.max()], 
         [y_test_original.min(), y_test_original.max()], 'r--', lw=2)
ax2.set_xlabel('Valores Reais')
ax2.set_ylabel('Valores Previstos')
ax2.set_title(f'MLP Regressor\n(Correlação: {correlacao_mlp:.4f}, MAE: {mae_mlp:.2f})')
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

# ========================================
# RESUMO FINAL
# ========================================
print("\n" + "="*60)
print("RESUMO FINAL DA ANÁLISE")
print("="*60)
print(f"Dataset: Daily Demand Forecasting Orders (UCI)")
print(f"Registros: {len(X)} | Treino: {len(X_train)} | Teste: {len(X_test)}")
print(f"\nModelo 1 - Linear Regression:")
print(f"  MAE: {mae_lr:.2f} | MSE: {mse_lr:.2f} | Correlação: {correlacao_lr:.4f}")
print(f"\nModelo 2 - MLP Regressor (Rede Neural):")
print(f"  MAE: {mae_mlp:.2f} | MSE: {mse_mlp:.2f} | Correlação: {correlacao_mlp:.4f}")
print(f"\nMelhor modelo: {'Linear Regression' if mae_lr < mae_mlp else 'MLP Regressor'} (menor MAE)")
print("="*60)