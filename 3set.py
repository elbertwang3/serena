import csv

with open('matchstats.csv', 'rb') as csvfile:
	reader = csv.reader(csvfile)
	for row in reader:
		score = row[27]
		if score[8] != None:
			if score[8] == 'R':
				print score