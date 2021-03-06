import pandas as pd
import matplotlib.pyplot as plt
from sklearn import manifold
import numpy as np
import scipy.spatial.distance as scispa
from sklearn.impute import SimpleImputer
from sklearn import preprocessing

#path_to_data = '../dataset/googleplaystore.csv'
path_to_data = '../dataset/deleting_duplicates/data_no_duplicates.csv'
#path_to_data = '../visualization/data/data.csv'

data = pd.io.parsers.read_csv(  #pandas handles in a better way
     path_to_data, 
     header="infer",         #the first row contains the city names
     #usecols=[1,2,3,5,6,8]
     usecols=[1,2,3,4,5,6,7,8,10]
    )

iterations = 100
num_rows = 1000
#data_numpy = data.values[:num_rows]
data_numpy = data.values[:]

#list_values_to_check = ["Free", "Paid"]
#list_values_to_check = [10000, 100000, 1000000, 10000000]
list_values_to_check = ["Everyone", "Teen", "Everyone 10+", "Mature 17+", "Adults only 18+"]
#list_values_to_check = ["4.0","4.1","Varies with device","4.4","2.3"]
#list_values_to_check = ["GAME","FAMILY","MEDICAL","TOOLS","COMMUNICATION"]

#colors = ['black', 'red', 'blue', 'green', 'yellow']

#index_field = 0
#index_field = 8
index_field = 7
#index_field = 4
#index_field = 5


list_values_to_check = [3.5,4,4.2,4.4,4.6,4.8]
index_field = 1

#array_to_check = data.values[:num_rows,index_field]
array_to_check = data.values[:,index_field]


booleans_list = []
for i in range(1,len(list_values_to_check)):
    new_booleans = (array_to_check > list_values_to_check[i-1]) & (array_to_check <= list_values_to_check[i])
    booleans_list.append(new_booleans)

'''
booleans_list = []
for value in list_values_to_check:
    new_booleans = array_to_check == value
    booleans_list.append(new_booleans)
'''

#TO ELIMINATE:
#data_numpy = data.values[:num_rows,[0, 1, 3]] #extract specific columns

#data_numpy_euclidian = data_numpy[:,[2]]
data_numpy_euclidian = data_numpy[:,[1,2,3,6]]
data_numpy_jaccard = data_numpy[:,[0,4,5,7,8]]
#data_numpy_jaccard = data_numpy[:,[7]]

#imp_mean = SimpleImputer(missing_values=np.nan, strategy='mean')
#imp_mean.fit(data_numpy_euclidian)
#data_numpy_euclidian = imp_mean.transform(data_numpy_euclidian)


data_numpy_euclidian = preprocessing.StandardScaler().fit_transform(data_numpy_euclidian)


print("Start computing matrix...")

#distance_function = lambda u,v: 1 - (len(set(u).intersection( set(v) )) / len(v) )
distance_function = lambda u,v: 1 - (len(set(u).intersection( set(v) )) / len(set(u).union( set(v) )))

dissM4_condensed = scispa.pdist(data_numpy_jaccard, distance_function)
dissM4 = scispa.squareform(dissM4_condensed, checks=False)

print("Start computing matrix euclidian...")

dissM4_condensed = scispa.pdist(data_numpy_euclidian, 'euclidean')
dissM4 = np.add(dissM4, scispa.squareform(dissM4_condensed, checks=False) )

print("Start MDS...")
mds = manifold.MDS(n_components=2, max_iter=iterations, eps=1e-9,dissimilarity="precomputed",random_state=2, n_jobs=8)
#mds = manifold.MDS(n_components=2, max_iter=iterations, eps=1e-9,dissimilarity="precomputed",n_jobs=4)
fitting = mds.fit(dissM4)
pos = fitting.embedding_
stress = fitting.stress_


print("Start plotting...")
clusters = []
for booleans in booleans_list:
    new_cluster = pos[booleans]
    clusters.append(new_cluster)

colors = ['black', 'red', 'blue', 'green', 'yellow']
colors_remained = colors[:]

for cluster in clusters:
    plt.plot(cluster[:,0],cluster[:,1], 'o', markersize=3, color=colors_remained[0], alpha=0.5,label='First cluster')
    colors_remained = colors_remained[1:]

plt.xlabel('Y1')
plt.ylabel('Y2')
plt.xlim([-10,10])
plt.ylim([-10,10])
plt.legend()
plt.title('Transformed data projected on first component')


plt.show()

path = "./images_run/" + str(iterations) + "_" + str(num_rows) + "_" + str(index_field) + ".png"

#plt.savefig(path)

print(stress)


import add_mds_coords
add_mds_coords.add_coords(pos, path_to_data)

