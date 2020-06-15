import pandas as pd
import numpy as np


src_data = '../filtering/data_filtered.csv'
dest_data = './data_no_duplicates.csv'


data = pd.io.parsers.read_csv(  #pandas handles in a better way
     src_data, 
     header="infer",         #the first row contains the city names
    )

dictionary = {}

data_numpy = data.values
header_new = data.columns

num_duplicates = 0
duplicates = []
booleans_list_no_duplicates = []
for row in data_numpy:
    if(row[0] not in dictionary):
        dictionary[row[0]] = row
        booleans_list_no_duplicates.append(True)
    else:
        num_duplicates += 1
        duplicates.append(row[0])
        booleans_list_no_duplicates.append(False)

print(num_duplicates)
#print(duplicates)

rows_without_duplicates = data_numpy[booleans_list_no_duplicates]


pd.DataFrame(rows_without_duplicates).to_csv(dest_data, header=header_new, index=None)



