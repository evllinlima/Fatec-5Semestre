#%% [markdown]
# ## Com train-test split:
# ✅ Funciona com CSV genéricos (features nominais e numéricas, target multiclasse).   
# ✅ Permite ignorar colunas irrelevantes.   
# ✅ Aplica ID3 (Entropia) e CART (Gini).
# ✅ Exibe e salva árvores gráficas e regras IF-THEN com valores originais.
# ✅ Detecta automaticamente se a coluna alvo é nominal ou numérica e ajusta a lógica.
# ✅ Imprime métricas de acurácia para ID3 e CART (usando hold-out).
# ✅ Mantém tudo configurável no início do script.
# ✅ Funciona com CSV genéricos, colunas ignoradas, valores originais nas regras, e salva árvores e regras.

import pandas as pd
from sklearn.tree import DecisionTreeClassifier, export_text, plot_tree
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt

#%%
#  === CONFIGURAÇÃO ===
'''
file_path = "seu_arquivo.csv"        # Caminho do CSV
target_column = "nome_da_coluna_y"   # Coluna alvo
ignore_columns = ["coluna_id_1", "coluna_id_2", ...]       # Colunas para desprezar
'''
file_path = "jogarTenis.csv"        # Caminho do CSV
target_column = "Joga"   # Coluna alvo
ignore_columns = ["Dia"]       # Colunas para desprezar


test_size = 0.3     # Proporção para teste

# === LEITURA DO CSV ===
df = pd.read_csv(file_path)
print("Colunas disponíveis:", df.columns.tolist())

# Remove colunas irrelevantes
df = df.drop(columns=[c for c in ignore_columns if c in df.columns])

# === SEPARAÇÃO DE FEATURES E TARGET ===
X = df.drop(columns=[target_column])
y = df[target_column]
print(X.head(),'\n')
print(y.head(),'\n')

#%%
#  Detecta tipo da coluna alvo
target_is_nominal = y.dtype == 'object'

# Se alvo for nominal, aplica LabelEncoder
if target_is_nominal:
    enc_target = LabelEncoder()    # ok se classe binária S/N, V/F
    y_encoded = enc_target.fit_transform(y)
else:
    y_encoded = y.values

#%%
#  Split train/test
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=test_size, random_state=42)

#%%
#  === ID3 (Entropia) ===
X_train_id3 = X_train.copy()
X_test_id3 = X_test.copy()
encoders = {}
for col in X_train_id3.columns:
    if X_train_id3[col].dtype == 'object':
        le = LabelEncoder()
        X_train_id3[col] = le.fit_transform(X_train_id3[col])
        X_test_id3[col] = le.transform(X_test_id3[col])
        encoders[col] = le

id3_model = DecisionTreeClassifier(criterion="entropy")
id3_model.fit(X_train_id3, y_train)

# Avaliação ID3
id3_preds = id3_model.predict(X_test_id3)
print("\n=== ID3 Métricas ===")
print("Acurácia:", accuracy_score(y_test, id3_preds))
print(classification_report(y_test, id3_preds, target_names=(le_target.classes_ if target_is_nominal else None)))

#%%
#  Plot ID3 tree
plt.figure(figsize=(12, 6))
plot_tree(id3_model, feature_names=X_train_id3.columns, class_names=(le_target.classes_ if target_is_nominal else None), filled=True)
plt.title("ID3 Decision Tree (Entropy)")
plt.savefig("id3_tree.png")
plt.show()

#%%
#  Export ID3 rules com valores originais
id3_rules_raw = export_text(id3_model, feature_names=list(X_train_id3.columns))
id3_rules_lines = id3_rules_raw.split('\n')
id3_rules_nominal = []
for line in id3_rules_lines:
    for col, le in label_encoders.items():
        for i, cls in enumerate(le.classes_):
            line = line.replace(f"{col} <= {i}", f"{col} == {cls} or earlier")
            line = line.replace(f"{col} > {i}", f"{col} == later than {cls}")
    if target_is_nominal:
        for i, cls in enumerate(le_target.classes_):
            line = line.replace(f"class: {i}", f"class: {cls}")
    id3_rules_nominal.append(line)

id3_rules_text = "\n".join(id3_rules_nominal)
print("\nRegras ID3:\n", id3_rules_text)
with open("id3_rules.txt", "w", encoding="utf-8") as f:
    f.write("ID3 Rules (IF-THEN format):\n")
    f.write(id3_rules_text)

#%%
#  === CART (Gini) ===
categorical_features = X.select_dtypes(include=['object']).columns.tolist()
numerical_features = X.select_dtypes(exclude=['object']).columns.tolist()

preprocessor = ColumnTransformer([
    ("cat", OneHotEncoder(), categorical_features),
    ("num", "passthrough", numerical_features)
], remainder="drop")

cart_pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", DecisionTreeClassifier(criterion="gini"))
])
cart_pipeline.fit(X_train, y_train)

# Avaliação CART
cart_preds = cart_pipeline.predict(X_test)
print("\n=== CART Métricas ===")
print("Acurácia:", accuracy_score(y_test, cart_preds))
print(classification_report(y_test, cart_preds, target_names=(le_target.classes_ if target_is_nominal else None)))

# Feature names após OneHotEncoding
encoded_feature_names = []
if categorical_features:
    encoded_feature_names.extend(
        cart_pipeline.named_steps["preprocessor"].named_transformers_["cat"].get_feature_names_out(categorical_features)
    )
encoded_feature_names.extend(numerical_features)

#%%
#  Plot CART tree
plt.figure(figsize=(12, 6))
plot_tree(cart_pipeline.named_steps["classifier"], feature_names=encoded_feature_names, class_names=(le_target.classes_ if target_is_nominal else None), filled=True)
plt.title("CART Decision Tree (Gini)")
plt.savefig("cart_tree.png")
plt.show()

#%%
#  Export CART rules
cart_rules = export_text(cart_pipeline.named_steps["classifier"], feature_names=list(encoded_feature_names))
cart_rules_named = cart_rules
if target_is_nominal:
    for i, cls in enumerate(le_target.classes_):
        cart_rules_named = cart_rules_named.replace(f"class: {i}", f"class: {cls}")

print("\nRegras CART:\n", cart_rules_named)
with open("cart_rules.txt", "w", encoding="utf-8") as f:
    f.write("CART Rules (IF-THEN format):\n")
    f.write(cart_rules_named)

print("\n✅ Árvores e regras salvas: id3_tree.png, cart_tree.png, id3_rules.txt, cart_rules.txt")

# %%
