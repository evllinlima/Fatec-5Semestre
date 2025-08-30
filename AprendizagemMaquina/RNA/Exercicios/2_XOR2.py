#%%     BIBLIOTECAS

from sklearn.neural_network import MLPClassifier

#%% CARGA DE DADOS

#%%o X maiusculo representa uma matriz
X = [[0, 0], [0, 1], [1, 0], [1, 1]]
y = [0, 1, 1, 0]

#%% CONFIG REDE NEURAL
# e-3 é elevado
mlp = MLPClassifier(verbose=True, hidden_layer_sizes=4, max_iter=10000, tol=1e-6, activation='relu')

#%% TREINAMENTO DA REDE
mlp.fit(X, y) #executa o treinamento no console

#%% TESTE
for caso in X :
    print('Caso: ', caso , 'previsto: ', mlp.predict([caso]))

#%% ALGUNS PARAMETROS DA REDE

print("Classes = ", mlp.classes_) #lista de classes
print("Erro = ", mlp.loss_) #fator de perda
print("Amostras visitadas = ", mlp.t_) #numero de amostras de treinamento visitadas
print("Atributos de entrada = ", mlp.n_features_in_) #numero de atributos de entrada
print("Número de ciclos = ", mlp.n_iter_) #numero de iterações de treinamento
print("Número de camadas = ", mlp.n_layers_) #numero de camadas
print("Tamanho das camadas = ", mlp.hidden_layer_sizes) #tamanho das camadas
print("Número de neurons de saída = ", mlp.n_outputs_) #numero de neurons de saída
print("F de ativação = ", mlp.out_activation_) #função de ativação utilizada
