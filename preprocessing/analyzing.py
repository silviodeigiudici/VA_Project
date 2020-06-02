import pandas as pd
import matplotlib.pyplot as plt
from sklearn import manifold
import numpy as np
import scipy.spatial.distance as scispa
from sklearn.impute import SimpleImputer
from sklearn import preprocessing

path_to_data = '../dataset/filtering/data_filtered.csv'

data = pd.io.parsers.read_csv(  #pandas handles in a better way
     path_to_data, 
     header="infer",         #the first row contains the city names
    )

header_new = data.columns
data_numpy = data.values

dictionary = {}
index_feature_analying = 8

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
    return feature


print("Analyzing features")
for row in data_numpy:
    key_to_add_dict = get_key(row[index_feature_analying])
    if key_to_add_dict in dictionary:
        dictionary[key_to_add_dict] += 1  
    else:
        dictionary[key_to_add_dict] = 0

print(sorted(dictionary.items(), key=lambda e: e[1], reverse=True))
print(len(dictionary))
