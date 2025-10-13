
#%% Importar bibliotecas necessárias
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt
from keras.models import Sequential
from keras.layers import Input, Dense
from keras.utils import to_categorical
from ucimlrepo import fetch_ucirepo

#%% Carregar a base de dados Blood Transfusion Service Center
blood_transfusion_service_center = fetch_ucirepo(id=176)

# Extrair os dados
X = blood_transfusion_service_center.data.features
y1 = blood_transfusion_service_center.data.targets

#%% Converter a variável alvo para One Hot Encoding
y = to_categorical(y1, num_classes=2)

#%% Dividir dados em treino (80%) e teste (20%)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

#%% Normalizar os dados numéricos
escala = StandardScaler()
X_train = escala.fit_transform(X_train)
X_test = escala.transform(X_test)

#%% Configurações de arquiteturas da rede
arquiteturas = {
    "1 camada (20)": [20],
    "1 camada (50)": [50],
    "1 camada (100)": [100],
    "2 camadas (20,20)": [20, 20],
    "2 camadas (50,20)": [50, 20],
    "2 camadas (100,20)": [100, 20],
    "2 camadas (100,50)": [100, 50],
}

#%% Loop de treinamento e avaliação para cada arquitetura
resultados = []

for nome, camadas in arquiteturas.items():
    print(f"\n===== Treinando arquitetura: {nome} =====")

    # Criar modelo sequencial
    mlp = Sequential()
    mlp.add(Input(shape=(4,)))  # 4 variáveis de entrada

    # Adicionar camadas ocultas conforme a configuração
    for n_neuronios in camadas:
        mlp.add(Dense(n_neuronios, activation='relu'))

    # Camada de saída (2 classes: 0 e 1)
    mlp.add(Dense(2, activation='softmax'))

    # Compilar modelo
    mlp.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

    # Treinar modelo
    historico = mlp.fit(
        X_train, y_train,
        epochs=100, batch_size=16,
        validation_data=(X_test, y_test),
        verbose=1
    )

    # Avaliar modelo
    loss, accuracy = mlp.evaluate(X_test, y_test, verbose=1)
    print(f"Acurácia: {accuracy:.3f}")

    # Prever e gerar matriz de confusão
    y_pred = mlp.predict(X_test)
    y_pred_class = np.argmax(y_pred, axis=1)
    y_test_class = np.argmax(y_test, axis=1)

    cm = confusion_matrix(y_test_class, y_pred_class, labels=[0, 1])
    print("Matriz de confusão:\n", cm)

    # Mostrar visualmente
    display = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=['Não doou', 'Doou'])
    display.plot(cmap='Blues')
    plt.title(f"Matriz de Confusão - {nome}")
    plt.show()

    # Salvar resultados
    resultados.append({
        'Arquitetura': nome,
        'Acurácia': round(accuracy, 3)
    })

#%% Exibir resumo final de resultados
df_result = pd.DataFrame(resultados)
print("\n===== Resumo das acurácias obtidas =====")
print(df_result)