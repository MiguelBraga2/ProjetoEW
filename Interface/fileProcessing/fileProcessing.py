import sys
import json

def processFile(file_name):
    # Reading the JSON file
    with open('./raw_files/' + file_name, 'r') as file:
        data = json.load(file)

    
    
    
    
    
    
    # Writing the modified data back to the JSON file
    with open('./processed_files/' + file_name, 'w') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)


if __name__ == '__main__':
    file_name = sys.argv[1]
    processFile(file_name)