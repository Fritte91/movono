import json

# Read the JSON file
with open('movies.json', 'r', encoding='utf-8') as file:
    movies = json.load(file)

# Count the number of movies
count = len(movies)

print(f"Number of movies in movies.json: {count}")