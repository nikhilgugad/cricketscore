let team1, team2;
let currentInnings = 1;
let totalRuns = 0;
let totalWickets = 0;
let totalBalls = 0;
let totalExtras = 0;
let scorecard = [];
let striker, nonStriker, bowler;
let tossWinner, tossDecision;
let batsmenStats = {};
let bowlerStats = {};
let bowlersList = [];

document.getElementById('startMatch').addEventListener('click', () => {
    team1 = document.getElementById('team1').value;
    team2 = document.getElementById('team2').value;

    if (team1 && team2) {
        document.querySelector('.team-names').style.display = 'none';
        document.querySelector('.toss-result').style.display = 'block';
    } else {
        alert('Please enter both team names.');
    }
});

document.getElementById('submitToss').addEventListener('click', () => {
    tossWinner = document.getElementById('tossWinner').value;
    tossDecision = document.getElementById('tossDecision').value;

    document.querySelector('.toss-result').style.display = 'none';
    document.querySelector('.player-input').style.display = 'block';
    document.getElementById('currentTeam').innerText = `${tossWinner === 'team1' ? team1 : team2} ${tossDecision === 'bat' ? 'Batting' : 'Bowling'}`;
});

document.getElementById('startInnings').addEventListener('click', () => {
    striker = document.getElementById('striker').value;
    nonStriker = document.getElementById('nonStriker').value;
    bowler = document.getElementById('bowler').value;

    if (striker && nonStriker && bowler) {
        batsmenStats[striker] = { runs: 0, balls: 0, fours: 0, sixes: 0, out: null, bowler: null };
        batsmenStats[nonStriker] = { runs: 0, balls: 0, fours: 0, sixes: 0, out: null, bowler: null };
        bowlerStats[bowler] = { runs: 0, balls: 0, wickets: 0, extras: 0 };
        bowlersList.push(bowler);

        document.querySelector('.player-input').style.display = 'none';
        document.querySelector('.score-input').style.display = 'block';
        document.querySelector('.live-score-bar').style.display = 'block';
        document.getElementById('currentTeamDisplay').innerText = `${tossWinner === 'team1' ? team1 : team2} Batting`;
        document.getElementById('currentStriker').innerText = striker;
        document.getElementById('currentNonStriker').innerText = nonStriker;
        document.getElementById('currentBowler').innerText = bowler;
        updateLiveScore();
    } else {
        alert('Please enter all player names.');
    }
});

const updateScore = (runs, isWicket = false, isExtra = false, isNoBall = false, isWide = false) => {
    if (!isExtra) {
        totalBalls++;
        batsmenStats[striker].runs += runs;
        batsmenStats[striker].balls++;
        if (runs === 4) batsmenStats[striker].fours++;
        if (runs === 6) batsmenStats[striker].sixes++;
    } else {
        totalExtras += runs;
    }

    bowlerStats[bowler].runs += runs;
    bowlerStats[bowler].balls += (isNoBall || isWide) ? 0 : 1;

    if (isWicket) {
        totalWickets++;
        bowlerStats[bowler].wickets++;
        batsmenStats[striker].out = document.getElementById('dismissalType').value;
        batsmenStats[striker].bowler = bowler;
        document.querySelector('.score-input').style.display = 'none';
        document.querySelector('.new-batsman').style.display = 'block';
    }

    // Swap striker and non-striker if odd runs are scored
    if (runs % 2 !== 0 && !isExtra) {
        [striker, nonStriker] = [nonStriker, striker];
    }

    // Swap striker and non-striker after every over (6 balls)
    if (totalBalls % 6 === 0 && !isExtra) {
        [striker, nonStriker] = [nonStriker, striker];
        changeBowler();
    }

    scorecard.push({ runs, isWicket, striker, nonStriker, bowler, isExtra, isNoBall, isWide });
    updateLiveScore();
};

const changeBowler = () => {
    const newBowler = prompt("Enter new bowler's name:");
    if (newBowler) {
        bowler = newBowler;
        if (!bowlersList.includes(bowler)) bowlersList.push(bowler);
        bowlerStats[bowler] = bowlerStats[bowler] || { runs: 0, balls: 0, wickets: 0, extras: 0 };
        document.getElementById('currentBowler').innerText = bowler;
    }
};

document.getElementById('submitNewBatsman').addEventListener('click', () => {
    const newBatsman = document.getElementById('newBatsman').value;
    if (newBatsman) {
        striker = newBatsman;
        batsmenStats[striker] = { runs: 0, balls: 0, fours: 0, sixes: 0, out: null, bowler: null };
        document.querySelector('.new-batsman').style.display = 'none';
        document.querySelector('.score-input').style.display = 'block';
        document.getElementById('currentStriker').innerText = striker;
        document.getElementById('newBatsman').value = '';
        updateLiveScore();
    } else {
        alert('Please enter the new batsman\'s name.');
    }
});

document.getElementById('dotBall').addEventListener('click', () => updateScore(0));
document.getElementById('singleRun').addEventListener('click', () => updateScore(1));
document.getElementById('twoRuns').addEventListener('click', () => updateScore(2));
document.getElementById('threeRuns').addEventListener('click', () => updateScore(3));
document.getElementById('fourRuns').addEventListener('click', () => updateScore(4));
document.getElementById('sixRuns').addEventListener('click', () => updateScore(6));
document.getElementById('wicket').addEventListener('click', () => updateScore(0, true));
document.getElementById('extraRun').addEventListener('click', () => updateScore(1, false, true));
document.getElementById('noBall').addEventListener('click', () => updateScore(1, false, true, true));
document.getElementById('wideBall').addEventListener('click', () => updateScore(1, false, true, false, true));

document.getElementById('endInnings').addEventListener('click', () => {
    if (currentInnings === 1) {
        currentInnings = 2;
        totalRuns = 0;
        totalWickets = 0;
        totalBalls = 0;
        totalExtras = 0;
        scorecard = [];
        batsmenStats = {};
        bowlerStats = {};
        bowlersList = [];
        document.querySelector('.score-input').style.display = 'none';
        document.querySelector('.player-input').style.display = 'block';
        document.getElementById('currentTeam').innerText = `${tossWinner === 'team1' ? team2 : team1} Batting`;
    } else {
        document.querySelector('.score-input').style.display = 'none';
        document.querySelector('.scorecard').style.display = 'block';
    }
});

document.getElementById('showScorecard').addEventListener('click', () => {
    updateScorecard();
    document.querySelector('.scorecard').style.display = 'block';
});

const ballsToOvers = (balls) => {
    const overs = Math.floor(balls / 6);
    const remainingBalls = balls % 6;
    return `${overs}.${remainingBalls}`;
};

const updateLiveScore = () => {
    const overs = ballsToOvers(totalBalls);
    document.getElementById('liveScore').innerText = `${totalRuns}/${totalWickets} (${overs} overs) | Extras: ${totalExtras}`;
    document.getElementById('batsmenScores').innerText = `Striker: ${striker} - ${batsmenStats[striker].runs} (${batsmenStats[striker].balls}), Non-Striker: ${nonStriker} - ${batsmenStats[nonStriker].runs} (${batsmenStats[nonStriker].balls})`;
    document.getElementById('bowlerStats').innerText = `Bowler: ${bowler} - ${bowlerStats[bowler].runs}/${bowlerStats[bowler].wickets} (${ballsToOvers(bowlerStats[bowler].balls)})`;
};

const updateScorecard = () => {
    let output = `<h3>${tossWinner === 'team1' ? team1 : team2} Batting</h3>`;
    output += `<table border="1"><tr><th>Batsman</th><th>Runs</th><th>Balls</th><th>4s</th><th>6s</th><th>SR</th><th>Out</th><th>Bowler</th></tr>`;
    for (const batsman in batsmenStats) {
        const stats = batsmenStats[batsman];
        const strikeRate = ((stats.runs / stats.balls) * 100).toFixed(2);
        output += `<tr><td>${batsman}</td><td>${stats.runs}</td><td>${stats.balls}</td><td>${stats.fours}</td><td>${stats.sixes}</td><td>${strikeRate}</td><td>${stats.out || 'Not Out'}</td><td>${stats.bowler || '-'}</td></tr>`;
    }
    output += `</table>`;

    output += `<h3>Bowling</h3>`;
    output += `<table border="1"><tr><th>Bowler</th><th>Runs</th><th>Wickets</th><th>Overs</th><th>Extras</th></tr>`;
    for (const bowlerName in bowlerStats) {
        const stats = bowlerStats[bowlerName];
        output += `<tr><td>${bowlerName}</td><td>${stats.runs}</td><td>${stats.wickets}</td><td>${ballsToOvers(stats.balls)}</td><td>${stats.extras}</td></tr>`;
    }
    output += `</table>`;

    document.getElementById('scorecardOutput').innerHTML = output;
};