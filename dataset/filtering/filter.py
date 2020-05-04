import pandas as pd
import numpy as np
import math

def handle_size(size):
    if size != "Varies with device":
        if "k" in size:
            value = float(size.replace("k", ""))
            value = value/1000
            return str(value)
        if "M" in size:
            return size.replace("M","")
    return size 

def handle_installs(installs):
    return installs.replace("+","").replace(",","")

def handle_price(price):
    return price.replace("$","")

def handle_version(version):
    if version != "Varies with device" and version != "Nan": 
        position = version.find(".")
        return version[:position + 2]
    return version

src_data = '../selecting/data_selected.csv'
dest_data = './data_filtered.csv'

data = pd.io.parsers.read_csv(  #pandas handles in a better way
     src_data, 
     header="infer",         #the first row contains the city names
     keep_default_na=False
    )

header_new = data.columns
data_numpy = data.values


print("Filtering features")
for row in data_numpy:
    row[4] = handle_size( row[4] )
    row[5] = handle_installs( row[5] )
    row[6] = handle_price( row[7] )
    row[9] = handle_version( row[10] )


print("Filling missing values")



#print("Shuffling")
#np.random.shuffle(out_data)

print("Writing output")
pd.DataFrame(data_numpy).to_csv(dest_data, header=header_new, index=None)
