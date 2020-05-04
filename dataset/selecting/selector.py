import pandas as pd
import numpy as np


src_data = '../googleplaystore.csv'
dest_data = './data_selected.csv'


data = pd.io.parsers.read_csv(  #pandas handles in a better way
     src_data, 
     header="infer",         #the first row contains the city names
     usecols=[0,1,2,3,4,5,6,7,8,10,12]
    )

header_new = data.columns
data_numpy = data.values


print("Selecting Paid and few Free")
booleans_list_paid = []
booleans_list_free = []
for row in data_numpy:
    new_bool = row[6] == "Paid"
    booleans_list_paid.append(new_bool)
    booleans_list_free.append(not new_bool)


paid_rows = data_numpy[booleans_list_paid]
free_rows = data_numpy[booleans_list_free]

print("Merging the two sets")
num_paid_rows = len(paid_rows)
num_free_rows = int( len(data_numpy)/2 ) - num_paid_rows

selected_free_rows = free_rows[:num_free_rows]
out_data = np.vstack( (paid_rows,selected_free_rows) )

print("Shuffling")
np.random.shuffle(out_data)

print("Writing output")
pd.DataFrame(out_data).to_csv(dest_data, header=header_new, index=None)
