import pandas as pd

def main():
    csv = pd.read_csv("./utils/library.csv")
    json_data = csv.to_json(orient="records", indent=4)
    with open("./utils/library.json", "w") as json_file:
        json_file.write(json_data)

if __name__ == "__main__":
    main()