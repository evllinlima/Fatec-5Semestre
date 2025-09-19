"""
Base: Blood Transfusion Service Center (UCI)
https://archive.ics.uci.edu/dataset/176/blood+transfusion+service+center

Este código segue as instruções do PI:
- Importa os dados da UCI
- Separa em treino e teste
- Treina rede neural MLP com diferentes configurações
- Calcula acurácia e matriz de confusão
"""

#%% BIBLIOTECAS
from ucimlrepo import fetch_ucirepo
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, ConfusionMatrixDisplay
import pandas as pd
import matplotlib.pyplot as plt

#%% CARGA DOS DADOS
blood = fetch_ucirepo(id=176)
X = blood.data.features
y = blood.data.targets

print('\nMeta dados:', blood.metadata)
print('\nVariáveis:', blood.variables)
print('\nMatriz de entrada (X):\n', X)
input('Aperte uma tecla para continuar:')
print('\nVetor de classes (y):\n', y)
input('Aperte uma tecla para continuar:')

#%% SEPARAÇÃO TREINO/TESTE
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
#%% 0.2 é igual a 20% dos dados para teste e 80% para treino
print('\nFormato treino:', X_train.shape, y_train.shape)
print('Formato teste:', X_test.shape, y_test.shape)
input('Aperte uma tecla para continuar:')

#%% TREINAMENTO E TESTE COM VARIAÇÃO DE CAMADAS OCULTAS
configs = [(20,), (50,), (100,), (20,20), (50,20), (100,20), (100,50)]
resultados = []
for config in configs:
    mlp = MLPClassifier(hidden_layer_sizes=config, max_iter=1000, tol=1e-6, activation='logistic')
    mlp.fit(X_train, y_train)
    y_pred = mlp.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    matriz = confusion_matrix(y_test, y_pred)
    resultados.append({
        'config': config,
        'acuracia': acc,
        'matriz_confusao': matriz
    })
    print(f'\nConfiguração: {config} | Acurácia: {acc}')
    print('Matriz de Confusão:\n', matriz)
    # Exibe matriz de confusão gráfica para cada configuração
    disp = ConfusionMatrixDisplay(confusion_matrix=matriz)
    disp.plot()
    plt.title(f'Configuração: {config}')
    plt.show()
    input('Aperte uma tecla para continuar:')

#%% TABELA DE RESULTADOS
print('\nTabela de configurações e acurácias:')
for r in resultados:
    print(f'Configuração: {r["config"]} | Acurácia: {r["acuracia"]}')
    print('Matriz de Confusão:\n', r['matriz_confusao'])

#%% INFORMAÇÕES DA REDE (última configuração)
print('\nInformações da última rede:')
print('Classes:', mlp.classes_)
print('Erro (loss):', mlp.loss_)
print('Amostras visitadas:', mlp.t_)
print('Atributos de entrada:', mlp.n_features_in_)
print('N ciclos:', mlp.n_iter_)
print('N de camadas:', mlp.n_layers_)
print('Tamanhos das camadas ocultas:', mlp.hidden_layer_sizes)
print('N de neurônios saída:', mlp.n_outputs_)
print('Função de ativação saída:', mlp.out_activation_)
