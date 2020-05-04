file_name = "../googleplaystore.csv"
file_name_2 = "../smaller_googleplaystore.csv"

f = open( file_name, "r")
fout = open(file_name_2, "w")

def check_safezone(string, substring, start):
    position_first_occurrence = string.find(substring, start)
    return position_first_occurrence, string.find(substring, position_first_occurrence + 1)

def find_th_occurrence(string, substring, n):
    position = -1
    for i in range(0, n):
        pos1, pos2 = check_safezone(string, '"', position + 1)
        position = string.find(substring, position + 1)
        if position == -1:
            return -1
        if pos1 < position and position < pos2:
            position = pos2    
    return position

file_content = f.read()

rows = file_content.strip().split("\n")

'''
for line in rows:
    pos_occurrence = find_th_occurrence(line, ";", 1)
    if pos_occurrence != -1:
        line = line[:pos_occurrence] + "-" + line[pos_occurrence + 1:]
    fout.write(line + "\n")
'''


#fast script to select a part of the dataset
num_lines = 100
rows = rows[:num_lines]

for line in rows:
    fout.write(line + "\n")

fout.close()
f.close()
