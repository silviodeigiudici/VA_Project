import pandas as pd
import matplotlib.pyplot as plt
from sklearn import manifold
import numpy as np
import scipy.spatial.distance as scispa
from sklearn.impute import SimpleImputer
from sklearn import preprocessing

#path_to_data = '../dataset/filtering/data_filtered.csv'
path_to_data = '../dataset/deleting_duplicates/data_no_duplicates.csv'

data = pd.io.parsers.read_csv(  #pandas handles in a better way
     path_to_data, 
     header="infer",         #the first row contains the city names
    )

header_new = data.columns
data_numpy = data.values

dictionary = {}
index_feature_analying = 9

'''
#used in reviews
def get_key(feature):
    if int(feature) < 100000:
        return "few"
    else:
        return "more"

'''
#used for android version
def get_key(feature):
    temp = feature.strip().split(",")
    y = int(temp[1].strip())
    m = temp[0].strip().split(" ")[0].strip()
    return m 


print("Analyzing features")
for row in data_numpy:
    key_to_add_dict = get_key(row[index_feature_analying])
    #if key_to_add_dict == 400.00:
    #   print(row)
    if key_to_add_dict in dictionary:
        dictionary[key_to_add_dict] += 1  
    else:
        dictionary[key_to_add_dict] = 1

print(sorted(dictionary.items(), key=lambda e: e[0], reverse=False))
print(len(dictionary))
