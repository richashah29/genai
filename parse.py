import pandas as pd

# Use relative path because variants.tsv is in the same folder
variants = pd.read_csv("variants.tsv", sep="\t")

# Show the first 5 rows
print(variants.head())