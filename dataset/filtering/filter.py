import pandas as pd
import numpy as np
import math
from sklearn.impute import SimpleImputer

def handle_size(size):
    if size != "Varies with device":
        if "k" in size:
            value = float(size.replace("k", ""))
            value = value/1000
            return value
        if "M" in size:
            return float(size.replace("M",""))
        else:
            print("WARNING: SIZE UNKNOWN")
    return size 

def handle_installs(installs):
    return int(installs.replace("+","").replace(",",""))

def handle_price(price):
    return float(price.replace("$",""))

def handle_version(version):
    if version != "Varies with device":
        if type(version) == type(0.0): #NaN value
            return "Varies with device"
        position = version.find(".")
        return float(version[:position + 2])
    return version

src_data = '../selecting/data_selected.csv'
dest_data = './data_filtered.csv'

data = pd.io.parsers.read_csv(  #pandas handles in a better way
     src_data, 
     header="infer",         #the first row contains the city names
    )

header_new = data.columns
data_numpy = data.values


print("Filtering features")
for row in data_numpy:
    row[4] = handle_size( row[4] )
    row[5] = handle_installs( row[5] )
    row[7] = handle_price( row[7] )
    row[10] = handle_version( row[10] )

print("Filling missing values")
dataframe = pd.DataFrame(data_numpy)

column_rate = dataframe.iloc[:, 2:3]
column_rate.fillna( round(column_rate.mean(), 3) , inplace=True) #inplace means side effect

column_size = dataframe.iloc[:, 4:5]
column_size.replace(to_replace="Varies with device",value=np.nan,inplace=True)
column_size = dataframe.iloc[:, 4:5] #WHY? BOOOOH
column_size.fillna( round(column_size.mean(), 3) , inplace=True)

print("Writing output")
dataframe.to_csv(dest_data, header=header_new, index=None)



