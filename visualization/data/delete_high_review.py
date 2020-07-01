import pandas as pd
import numpy as np


src_data = './data_save.csv'
dest_data = './data.csv'


data = pd.io.parsers.read_csv(  #pandas handles in a better way
     src_data, 
     header="infer",         #the first row contains the city names
    )

data_numpy = data.values
header_new = data.columns

booleans_list_low_review = []
for row in data_numpy:
    if(int(row[3]) <= 100000):
        booleans_list_low_review.append(True)
    else:
        booleans_list_low_review.append(False)


rows_without_high_review = data_numpy[booleans_list_low_review]


pd.DataFrame(rows_without_high_review).to_csv(dest_data, header=header_new, index=None)



