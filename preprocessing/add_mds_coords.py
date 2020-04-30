dest_path = '../visualization/data/data.csv'

#coords is a numpy array/matrix
def add_coords(coords, src_path):
    print("Start creating database")
    
    src_file = open(src_path, 'r')
    file_content = src_file.read()
    rows = file_content.strip().split('\n')

    dest_file = open(dest_path, 'w')
    
    dest_file.write(rows[0] + ",comp0,comp1\n")

    num_lines = len(rows)
    #num_lines = len(coords)
    for i in range(1, num_lines):
        new_row = rows[i] + "," + str(coords[i - 1, 0]) + "," + str(coords[i - 1, 1])
        dest_file.write(new_row + "\n")
    
    dest_file.close()



