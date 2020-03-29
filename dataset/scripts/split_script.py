file_name = "./googleplaystore.csv"

f = open( file_name, "r")

def check_safezone(string, substring='"', start=0):
    position_first_occurrence = string.find(substring, start)
    return position_first_occurrence, string.find(substring, position_first_occurrence + 1)

def find_first_substring(string, substring=","):
    position = string.find(substring)
    pos1, pos2 = check_safezone(string)
    if pos1 < position and position < pos2:
        position = string.find(substring, pos2)
    return position

def split_line(string, substring=","):
    list_elements = []
    position = find_first_substring(string)

    while position != -1:

        list_elements.append(string[:position].strip('"'))
        string = string[position + 1:]

        position = find_first_substring(string)

    return list_elements


file_content = f.read()

rows = file_content.strip().split("\n")

num_lines = 0
num_line_to_read = 10

for line in rows:
    print(split_line(line))

    if num_lines == num_line_to_read:
        break
    num_lines += 1
