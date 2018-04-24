import csv
from collections import defaultdict
with open('public/data/allmatches.csv', 'rb') as csvfile:
	reader = csv.reader(csvfile)
	num3setmatches = defaultdict(int)
	num3setwon = defaultdict(int)
	numdownaset = defaultdict(int)
	for row in reader:
		score = row[27]
		winner_name = row[10]
		loser_name = row[20]
		match_year = row[0].split("-")[0]

		print score
		print winner_name
		print loser_name
		print match_year

		splitScore = score.split(" ")
		
	