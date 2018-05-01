import csv
from collections import defaultdict
with open('public/data/allmatches.csv', 'rb') as csvfile:
	reader = csv.reader(csvfile)
	next(reader)
	winloss = defaultdict(lambda: [0, 0])
	threeset = defaultdict(lambda: [0, 0])
	tiebreak = defaultdict(lambda: [0, 0])
	downaset = defaultdict(lambda: [0, 0])
	for row in reader:
		score = row[27]
		winner_name = row[10]
		loser_name = row[20]
		#print loser_name
		match_year = row[0].split("-")[0]
		#print winloss[winner_name][0]
		winloss[winner_name][0] += 1
		winloss[loser_name][1] += 1




		splitScore = score.split(" ")
		#print splitScore
		#print all(x not in splitScore for x in ['W/O', 'DEF', '&nbsp;', 'RET'])
		if len(splitScore) == 3 and all(x not in splitScore for x in ['W/O', 'DEF', '&nbsp;', 'RET', ""]):
			#print "inside threeset"
			#print splitScore
			threeset[winner_name][0] += 1
			threeset[loser_name][1] += 1

		for i in range(len(splitScore)):
			score =  splitScore[i][0:3]
			if score == '7-6':
				tiebreak[winner_name][0] += 1
				tiebreak[loser_name][1] += 1
			elif score == '6-7':
				tiebreak[loser_name][0] += 1
				tiebreak[winner_name][1] += 1
		firstset = splitScore[0].split("-")
		if all(x not in splitScore for x in ['W/O', 'DEF', '&nbsp;', 'RET', ""]):


			if int(firstset[0][0]) < int(firstset[1][0]) and len(splitScore) == 3:
				downaset[winner_name][0] += 1
			elif int(firstset[0][0]) > int(firstset[1][0]):

				downaset[loser_name][1] += 1




	'''print "winloss: " + str(winloss)
	print "threeset: " + str(threeset)
	print "tiebreak: " + str(tiebreak)
	print "downaset: " + str(downaset)'''

	with open('public/data/topplayers.csv', 'rb') as csvfile2:
		reader2 = csv.reader(csvfile2)
		next(reader2)
		players = [row[0] for row in reader2]

		newwinloss = {player: winloss[player] for player in players}
		newthreeset = {player: threeset[player] for player in players}
		newtiebreak = {player: tiebreak[player] for player in players}
		newdownaset = {player: downaset[player] for player in players}

		print "winloss: " + str(newwinloss)
		print '\n'
		print "threeset: " + str(newthreeset)
		print '\n'
		print "tiebreak: " + str(newtiebreak)
		print '\n'
		print "downaset: " + str(newdownaset)

		with open('public/data/underpressure.csv', 'wb') as csvfile3:
			writer = csv.writer(csvfile3)
			writer.writerow(['player', 'totalwin', 'totalloss', 'total', 'threesetwin', 'threesetloss', 'totalthreeset', 'tiebreakwin', 'tiebreakloss', 'totaltiebreak', 'downasetwin', 'downasetloss', 'totaldownaset'])
			for player in players:
				#print str(int(newwinloss[player][0]) + int(newwinloss[player][1]))
				writer.writerow([player,
				newwinloss[player][0], newwinloss[player][1], int(newwinloss[player][0]) + int(newwinloss[player][1]),
				newthreeset[player][0], newthreeset[player][1], int(newthreeset[player][0]) + int(newthreeset[player][1]),
				newtiebreak[player][0], newtiebreak[player][1], int(newtiebreak[player][0]) + int(newtiebreak[player][1]),
				newdownaset[player][0], newdownaset[player][1], int(newdownaset[player][0]) + int(newdownaset[player][1])])
