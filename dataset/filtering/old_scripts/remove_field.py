file_name = "./trains_big.csv"
file_name_2 = "./trains_big_pca.csv"

f = open( file_name, "r")
fout = open(file_name_2, "w")


def check_safezone(string, substring='"', start=0):
    position_first_occurrence = string.find(substring, start)
    return position_first_occurrence, string.find(substring, position_first_occurrence + 1)

def find_first_substring(string, substring=","):
    position = string.find(substring)
    pos1, pos2 = check_safezone(string)
    if pos1 < position and position < pos2:
        position = string.find(substring, pos2)
    return position

#if you put a number in list_positions that is higher it will delete the last field
def remove_field(string, list_positions, substring=","):
    final_string = ""
    i_element = 0
    num_element = list_positions[0] if list_positions != [] else ""
    list_positions = list_positions[1:]
    list_length = len(list_positions)

    position = find_first_substring(string)

    while position != -1:

        if i_element == num_element:
            num_element = list_positions[0] if list_positions != [] else ""
            list_positions = list_positions[1:]
        else:
            final_string += string[:position + 1]
 
        string = string[position + 1:]

        position = find_first_substring(string)

        i_element += 1

    if num_element == "":
        final_string += string
    else:
        final_string = final_string[:-1]

    return final_string

def split_line(string, substring=","):
    list_elements = []
    position = find_first_substring(string, substring)

    while position != -1:

        list_elements.append(string[:position].strip('"'))
        string = string[position + 1:]

        position = find_first_substring(string, substring)

    return list_elements


file_content = f.read()

#rows = file_content.strip().split("\n")

rows = split_line(file_content, "\n")
rows = rows[1:]

num_lines = 1
num_line_to_read = 100

for line in rows:
    #print(line)
    line = remove_field(line, [0, 1, 2, 3, 4, 8, 12, 16])
    #print(line)
    fout.write(line + "\n")
"""    
    if num_lines == num_line_to_read:
        break
    num_lines += 1
"""
