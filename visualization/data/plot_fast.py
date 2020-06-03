import pandas as pd
import matplotlib.pyplot as plt

path_to_data = './data.csv'

data = pd.io.parsers.read_csv(  #pandas handles in a better way
     path_to_data, 
     header="infer",         #the first row contains the city names
    )


#list_values_to_check = ["Free", "Paid"]
list_values_to_check = [1000000,10000000,100000,5000000,100000000] # 10000, 100000, 1000000, 10000000]
#list_values_to_check = ["Everyone", "Teen", "Everyone 10+", "Mature 17+", "Adults only 18+"]
#list_values_to_check = ["4.0","4.1","Varies with device","4.4","2.3"]
#list_values_to_check = ["GAME","FAMILY","MEDICAL","TOOLS","COMMUNICATION"]

#colors = ['black', 'red', 'blue', 'green', 'yellow']

#index_field = 6
index_field = 5
#index_field = 8
#index_field = 10
#index_field = 1

#Interesting features:
#varies with devices, paid, everyone, TOOLS, 100000000

array_to_check = data.values[:,index_field]


'''
list_values_to_check = [3.5,4,4.2,4.4,4.6,4.8]
index_field = 2



booleans_list = []
for i in range(1,len(list_values_to_check)):
    new_booleans = (array_to_check > list_values_to_check[i-1]) & (array_to_check <= list_values_to_check[i])
    booleans_list.append(new_booleans)

'''

booleans_list = []
for value in list_values_to_check:
    new_booleans = array_to_check == value
    booleans_list.append(new_booleans)



pos = data.values[:,11:]



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




