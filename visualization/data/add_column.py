dest_path = './data.csv'
#dest_path = '../filtering/to_filter.csv'
src_path = "./data_raw.csv"
#coords is a numpy array/matrix
print("Start creating database")

src_file = open(src_path, 'r')
file_content = src_file.read()
rows = file_content.strip().split('\n')

dest_file = open(dest_path, 'w')

dest_file.write(rows[0] + ",highlight\n")

num_lines = len(rows)

for i in range(1, num_lines):
    new_row = rows[i] + "," + "0" #0 means no highlight, 1 from brushing, 2 from namelist, 3 from both
    dest_file.write(new_row + "\n")

dest_file.close()
