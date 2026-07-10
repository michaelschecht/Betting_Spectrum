import { Game, SportType, Strategy, BacktestResponse, SimulatedBetGame, ProfitHistoryPoint, BacktestSummary } from './types';

// Deterministic seedable random number generator (LCG or Jenkins-style)
// This guarantees that backtests are identical and stable across runs
export function seedRandom(seedStr: string): () => number {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// Teams list by sport
export const TEAMS: Record<SportType, string[]> = {
  NFL: [
    'Patriots', 'Bills', 'Dolphins', 'Jets',
    'Ravens', 'Steelers', 'Bengals', 'Browns',
    'Texans', 'Colts', 'Jaguars', 'Titans',
    'Chiefs', 'Chargers', 'Raiders', 'Broncos',
    'Eagles', 'Cowboys', 'Giants', 'Commanders',
    'Lions', 'Packers', 'Vikings', 'Bears',
    'Buccaneers', 'Saints', 'Falcons', 'Panthers',
    '49ers', 'Rams', 'Seahawks', 'Cardinals'
  ],
  NBA: [
    'Celtics', 'Nets', 'Knicks', '76ers', 'Raptors',
    'Bulls', 'Cavaliers', 'Pistons', 'Pacers', 'Bucks',
    'Hawks', 'Hornets', 'Heat', 'Magic', 'Wizards',
    'Nuggets', 'Timberwolves', 'Thunder', 'Trail Blazers', 'Jazz',
    'Warriors', 'Clippers', 'Lakers', 'Suns', 'Kings',
    'Mavericks', 'Rockets', 'Grizzlies', 'Pelicans', 'Spurs'
  ],
  MLB: [
    'Yankees', 'Red Sox', 'Blue Jays', 'Orioles', 'Rays',
    'White Sox', 'Guardians', 'Tigers', 'Royals', 'Twins',
    'Astros', 'Angels', 'Athletics', 'Mariners', 'Rangers',
    'Braves', 'Marlins', 'Mets', 'Phillies', 'Nationals',
    'Cubs', 'Reds', 'Brewers', 'Pirates', 'Cardinals',
    'Diamondbacks', 'Rockies', 'Dodgers', 'Padres', 'Giants'
  ],
  NHL: [
    'Bruins', 'Sabres', 'Red Wings', 'Panthers', 'Canadiens', 'Senators', 'Lightning', 'Maple Leafs',       
    'Hurricanes', 'Blue Jackets', 'Devils', 'Islanders', 'Rangers', 'Flyers', 'Penguins', 'Capitals',       
    'Blackhawks', 'Avalanche', 'Stars', 'Wild', 'Predators', 'Blues', 'Jets', 'Ducks',
    'Flames', 'Oilers', 'Kings', 'Sharks', 'Kraken', 'Golden Knights', 'Canucks', 'Coyotes'
  ]
};

// Historical dynasty eras strength modifiers (2000-2025)
// Base rating is 75 (average). Peaks can reach 98. Slumps can go down to 55.
export function getTeamHistoricalRating(sport: SportType, team: string, year: number): { offense: number; defense: number } {
  let baseOff = 75;
  let baseDef = 75;

  if (sport === 'NFL') {
    // Patriots Dynasty: 2001-2019
    if (team === 'Patriots' && year >= 2001 && year <= 2019) {
      baseOff = year === 2007 ? 98 : 90;
      baseDef = 88;
    } else if (team === 'Patriots' && year > 2019) {
      baseOff = 62;
      baseDef = 72;
    }
    // Chiefs Mahomes Era: 2018-2025
    if (team === 'Chiefs' && year >= 2018) {
      baseOff = year <= 2020 ? 96 : 91;
      baseDef = year >= 2023 ? 88 : 78;
    } else if (team === 'Chiefs' && year < 2010) {
      baseOff = 68;
      baseDef = 66;
    }
    // Rams Greatest Show on Turf: 1999-2001
    if (team === 'Rams' && year >= 2000 && year <= 2001) {
      baseOff = 97;
      baseDef = 72;
    }
    // Colts Peyton Manning Era: 2003-2010
    if (team === 'Colts' && year >= 2003 && year <= 2010) {
      baseOff = 92;
      baseDef = 80;
    }
    // Seahawks Legion of Boom: 2012-2015
    if (team === 'Seahawks' && year >= 2012 && year <= 2015) {
      baseOff = 82;
      baseDef = 96;
    }
    // Browns Slump Era: 2000-2017 (incl. 0_16 season in 2017)
    if (team === 'Browns') {
      if (year === 2017) {
        baseOff = 50; baseDef = 55;
      } else if (year < 2018) {
        baseOff = 60; baseDef = 62;
      } else {
        baseOff = 78; baseDef = 80;
      }
    }
  } else if (sport === 'NBA') {
    // Warriors Splash Bros: 2014-2022
    if (team === 'Warriors') {
      if (year === 2016) {
        baseOff = 98; baseDef = 86; // 73 Wins
      } else if (year >= 2015 && year <= 2019) {
        baseOff = 95; baseDef = 88;
      } else if (year >= 2020 && year <= 2022) {
        baseOff = 86; baseDef = 88;
      }
    }
    // Lakers Kobe/Shaq: 2000-2002
    if (team === 'Lakers' && year >= 2000 && year <= 2002) {
      baseOff = 93;
      baseDef = 88;
    } else if (team === 'Lakers' && year >= 2014 && year <= 2018) {
      baseOff = 60; // Hard slumps
      baseDef = 58;
    } else if (team === 'Lakers' && year >= 2019 && year <= 2021) {
      baseOff = 86;
      baseDef = 92; // LeBron + AD peak
    }
    // Spurs Consistency: 2000-2016
    if (team === 'Spurs' && year >= 2000 && year <= 2016) {
      baseOff = 86;
      baseDef = 94;
    } else if (team === 'Spurs' && year >= 2019) {
      baseOff = 63;
      baseDef = 65;
    }
    // Heat Big Three: 2010-2014
    if (team === 'Heat' && year >= 2010 && year <= 2014) {
      baseOff = 93;
      baseDef = 89;
    }
  } else if (sport === 'MLB') {
    // Dodgers Giant Payroll: 2013-2025
    if (team === 'Dodgers' && year >= 2013) {
      baseOff = 90;
      baseDef = 89;
    }
    // Astros Dynasty / Trashcan Era: 2017-2024
    if (team === 'Astros') {
      if (year >= 2017 && year <= 2024) {
        baseOff = 92; baseDef = 87;
      } else if (year >= 2011 && year <= 2013) {
        baseOff = 50; baseDef = 52; // Massive rebuilding
      }
    }
    // Giants Odd Year/Even Year Peaks: 2010-2014
    if (team === 'Giants' && year >= 2010 && year <= 2014 && year % 2 === 0) {
      baseOff = 80;
      baseDef = 93; // Incredible pitching
    }
  } else if (sport === 'NHL') {
    // Blackhawks Dynasty: 2010-2015
    if (team === 'Blackhawks' && year >= 2010 && year <= 2015) {
      baseOff = 91;
      baseDef = 88;
    } else if (team === 'Blackhawks' && year >= 2020) {
      baseOff = 60;
      baseDef = 62;
    }
    // Penguins Crosby Era: 2008-2018
    if (team === 'Penguins' && year >= 2008 && year <= 2018) {
      baseOff = 92;
      baseDef = 82;
    }
    // Lightning Dynasty: 2018-2023
    if (team === 'Lightning' && year >= 2018 && year <= 2023) {
      baseOff = 93;
      baseDef = 89;
    }
  }

  return { offense: baseOff, defense: baseDef };
}

// Generate complete schedule of games for a sport and season
export function generateGamesDatabase(sport: SportType, year: number): Game[] {
  const teams = TEAMS[sport];
  const rng = seedRandom(`${sport}-${year}`);

  let gameCount = 0;
  let homeAdvantage = 0;
  let scoreMultiplier = 0;
  let baseTotal = 0;

  if (sport === 'NFL') {
    gameCount = 272;
    homeAdvantage = 1.5;
    scoreMultiplier = 13;
    baseTotal = 44;
  } else if (sport === 'NBA') {
    gameCount = 600;
    homeAdvantage = 2.5;
    scoreMultiplier = 11;
    baseTotal = 192 + Math.min(25, year - 2000) * 1.5;
  } else if (sport === 'MLB') {
    gameCount = 800;
    homeAdvantage = 0.12;
    scoreMultiplier = 3.5;
    baseTotal = 8.8;
  } else if (sport === 'NHL') {
    gameCount = 600;
    homeAdvantage = 0.2;
    scoreMultiplier = 2.1;
    baseTotal = 5.6 + Math.min(3, Math.max(0, year - 2015)) * 0.15;
  }

  const games: Game[] = [];
  const teamWinStreaks: Record<string, number> = {};
  const teamLastGameDate: Record<string, string> = {};
  teams.forEach(t => {
    teamWinStreaks[t] = 0;
    teamLastGameDate[t] = "";
  });

  for (let i = 0; i < gameCount; i++) {
    const homeIdx = Math.floor(rng() * teams.length);
    let awayIdx = Math.floor(rng() * teams.length);
    while (awayIdx === homeIdx) {
      awayIdx = Math.floor(rng() * teams.length);
    }

    const homeTeam = teams[homeIdx];
    const awayTeam = teams[awayIdx];

    let dateStr = "";
    if (sport === 'NFL') {
      const week = Math.floor(i / 16) + 1;
      const monthIndex = week < 5 ? 10 : week < 9 ? 11 : week < 14 ? 12 : 1;
      const yearOffset = monthIndex === 1 ? year + 1 : year;
      const day = ((i * 3) % 28) + 1;
      dateStr = `${yearOffset}-${String(monthIndex).padStart(2, '0')}-${String(day).padStart(2, '0')}`;     
    } else {
      let actualMonth = 1;
      let actualYear = year;
      if (sport === 'NBA' || sport === 'NHL') {
        const months = [10, 11, 12, 1, 2, 3, 4, 5];
        const m = months[Math.floor((i / gameCount) * months.length)] || 11;
        actualMonth = m;
        if (m < 9) actualYear = year + 1;
      } else {
        const months = [4, 5, 6, 7, 8, 9, 10];
        actualMonth = months[Math.floor((i / gameCount) * months.length)] || 5;
      }
      const day = ((i * 13) % 28) + 1;
      dateStr = `${actualYear}-${String(actualMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    const homeLastDate = teamLastGameDate[homeTeam];
    const awayLastDate = teamLastGameDate[awayTeam];
    const defaultRest = sport === 'NFL' ? 7 : sport === 'MLB' ? 1 : 2;

    const homeRestDays = homeLastDate ? Math.floor((new Date(dateStr).getTime() - new Date(homeLastDate).getTime()) / (1000 * 60 * 60 * 24)) : defaultRest + 7;
    const awayRestDays = awayLastDate ? Math.floor((new Date(dateStr).getTime() - new Date(awayLastDate).getTime()) / (1000 * 60 * 60 * 24)) : defaultRest + 7;

    const homeRating = getTeamHistoricalRating(sport, homeTeam, year);
    const awayRating = getTeamHistoricalRating(sport, awayTeam, year);
    const homeStreak = teamWinStreaks[homeTeam] || 0;
    const awayStreak = teamWinStreaks[awayTeam] || 0;
    const starHomeInjured = rng() < 0.08;
    const starAwayInjured = rng() < 0.08;

    const activeHomeOffense = homeRating.offense - (starHomeInjured ? 6 : 0);
    const activeAwayOffense = awayRating.offense - (starAwayInjured ? 6 : 0);
    const homeStreakBonus = Math.max(-2, Math.min(3, homeStreak * 0.5));
    const awayStreakBonus = Math.max(-2, Math.min(3, awayStreak * 0.5));
    const homeAdvPower = activeHomeOffense + (homeAdvantage * 2) + homeStreakBonus;
    const awayAdvPower = activeAwayOffense + awayStreakBonus;

    let powerDiff = homeAdvPower - awayAdvPower;
    let expectedSpread = 0;
    let expectedTotal = baseTotal;

    if (sport === 'NFL') {
      expectedSpread = powerDiff * 0.35;
      expectedSpread = Math.max(-17, Math.min(17, expectedSpread));
      expectedTotal = baseTotal + (activeHomeOffense + activeAwayOffense - 150) * 0.15;
    } else if (sport === 'NBA') {
      expectedSpread = powerDiff * 0.45;
      expectedSpread = Math.max(-16, Math.min(16, expectedSpread));
      expectedTotal = baseTotal + (activeHomeOffense + activeAwayOffense - 150) * 0.5;
    } else if (sport === 'MLB') {
      expectedSpread = powerDiff * 0.04;
      expectedSpread = Math.max(-2.5, Math.min(2.5, expectedSpread));
      expectedTotal = baseTotal + (activeHomeOffense + activeAwayOffense - 150) * 0.03;
    } else if (sport === 'NHL') {
      expectedSpread = powerDiff * 0.05;
      expectedSpread = Math.max(-2, Math.min(2, expectedSpread));
      expectedTotal = baseTotal + (activeHomeOffense + activeAwayOffense - 150) * 0.015;
    }

    expectedTotal = Math.round(expectedTotal * 2) / 2;
    let homeSpread = -Math.round(expectedSpread * 2) / 2;
    if (homeSpread === 0) homeSpread = -0.5;

    const winProbHome = 1 / (1 + Math.exp(homeSpread * (sport === 'NFL' ? 0.15 : sport === 'NBA' ? 0.08 : sport === 'MLB' ? 0.70 : 0.60)));
    let homeMoneyline = 100;
    let awayMoneyline = 100;

    if (winProbHome >= 0.5) {
      homeMoneyline = -Math.round((winProbHome / (1 - winProbHome)) * 100);
      awayMoneyline = Math.round(((1 - winProbHome) / winProbHome) * 100);
      homeMoneyline = Math.min(-105, homeMoneyline - 5);
      awayMoneyline = Math.max(100, awayMoneyline - 5);
    } else {
      const winProbAway = 1 - winProbHome;
      awayMoneyline = -Math.round((winProbAway / (1 - winProbAway)) * 100);
      homeMoneyline = Math.round(((1 - winProbAway) / winProbAway) * 100);
      awayMoneyline = Math.min(-105, awayMoneyline - 5);
      homeMoneyline = Math.max(100, homeMoneyline - 5);
    }

    homeMoneyline = homeMoneyline > 0 ? Math.round(homeMoneyline / 5) * 5 : Math.round(homeMoneyline / 10) * 10;
    awayMoneyline = awayMoneyline > 0 ? Math.round(awayMoneyline / 5) * 5 : Math.round(awayMoneyline / 10) * 10;

    const baseHomeScore = sport === 'NFL' ? 22 : sport === 'NBA' ? 102 : sport === 'MLB' ? 4.3 : 2.8;       
    const baseAwayScore = sport === 'NFL' ? 20 : sport === 'NBA' ? 99 : sport === 'MLB' ? 4.1 : 2.6;        

    const homeG = rng();
    const awayG = rng();
    const z0 = Math.sqrt(-2.0 * Math.log(homeG || 0.0001)) * Math.cos(2.0 * Math.PI * (awayG || 0.0001));   
    const z1 = Math.sqrt(-2.0 * Math.log(homeG || 0.0001)) * Math.sin(2.0 * Math.PI * (awayG || 0.0001));   

    let scoreHomeReal = baseHomeScore + (powerDiff * (sport === 'NFL' ? 0.2 : sport === 'NBA' ? 0.3 : 0.02)) + (z0 * (scoreMultiplier * 0.45));
    let scoreAwayReal = baseAwayScore - (powerDiff * (sport === 'NFL' ? 0.2 : sport === 'NBA' ? 0.3 : 0.02)) + (z1 * (scoreMultiplier * 0.45));

    let homeScore = Math.max(0, Math.round(scoreHomeReal));
    let awayScore = Math.max(0, Math.round(scoreAwayReal));

    if (sport === 'NBA' && homeScore < 60) homeScore = 60 + Math.floor(rng() * 20);
    if (sport === 'NBA' && awayScore < 60) awayScore = 60 + Math.floor(rng() * 20);

    if (homeScore === awayScore) {
      if (sport === 'NFL') rng() < 0.5 ? homeScore += 6 : awayScore += 6;
      else if (sport === 'NBA') rng() < 0.5 ? homeScore += 8 : awayScore += 8;
      else rng() < 0.5 ? homeScore += 1 : awayScore += 1;
    }

    games.push({
      id: `${sport}-${year}-${i}`,
      sport,
      season: year,
      date: dateStr,
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      homeSpread,
      overUnder: expectedTotal,
      homeMoneyline,
      awayMoneyline,
      isPlayoff: i > (gameCount * 0.9),
      starHomeInjured,
      starAwayInjured,
      homeWinStreak: homeStreak,
      awayWinStreak: awayStreak,
      homeRestDays,
      awayRestDays
    });

    if (homeScore > awayScore) {
      teamWinStreaks[homeTeam] = (teamWinStreaks[homeTeam] || 0) + 1;
      teamWinStreaks[awayTeam] = Math.min(0, (teamWinStreaks[awayTeam] || 0) - 1);
    } else {
      teamWinStreaks[awayTeam] = (teamWinStreaks[awayTeam] || 0) + 1;
      teamWinStreaks[homeTeam] = Math.min(0, (teamWinStreaks[homeTeam] || 0) - 1);
    }
    teamLastGameDate[homeTeam] = dateStr;
    teamLastGameDate[awayTeam] = dateStr;
  }

  return games.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Convert American Odds to Decimal Multiplier
export function americanToDecimalOdds(odds: number): number {
  if (odds > 0) {
    return 1 + (odds / 100);
  } else {
    return 1 + (100 / Math.abs(odds));
  }
}

// Main backtester processor
export function runBacktest(strategy: Strategy): BacktestResponse {
  const allGames: Game[] = [];
  for (let yr = strategy.startYear; yr <= strategy.endYear; yr++) {
    allGames.push(...generateGamesDatabase(strategy.sport, yr));
  }
  allGames.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let totalBets = 0;
  let wonBets = 0;
  let lostBets = 0;
  let pushedBets = 0;
  let totalWagered = 0;
  let totalReturn = 0;
  let currentBankroll = strategy.startingBankroll;
  let peakBankroll = strategy.startingBankroll;
  let maxDrawdown = 0;

  const simulatedGames: SimulatedBetGame[] = [];
  const profitHistory: ProfitHistoryPoint[] = [];

  allGames.forEach((game) => {
    let shouldBet = false;
    let betPlacedText = '';
    let odds = 100;
    let isWinOutcome: 'win' | 'loss' | 'push' = 'loss';

    const homeIsFav = game.homeMoneyline < game.awayMoneyline;
    const favoriteTeam = homeIsFav ? game.homeTeam : game.awayTeam;
    const underdogTeam = homeIsFav ? game.awayTeam : game.homeTeam;
    const favoriteOdds = homeIsFav ? game.homeMoneyline : game.awayMoneyline;
    const underdogOdds = homeIsFav ? game.awayMoneyline : game.homeMoneyline;

    if (strategy.betType === 'moneyline') {
      if (strategy.sideSelection === 'favorites') {
        shouldBet = true; odds = favoriteOdds; betPlacedText = `${favoriteTeam} ML (${odds})`; isWinOutcome = (homeIsFav && game.homeScore > game.awayScore) || (!homeIsFav && game.awayScore > game.homeScore) ? 'win' : 'loss';
      } else if (strategy.sideSelection === 'underdogs') {
        shouldBet = true; odds = underdogOdds; betPlacedText = `${underdogTeam} ML (${odds})`; isWinOutcome = (!homeIsFav && game.homeScore > game.awayScore) || (homeIsFav && game.awayScore > game.homeScore) ? 'win' : 'loss';
      } else if (strategy.sideSelection === 'home') {
        shouldBet = true; odds = game.homeMoneyline; betPlacedText = `${game.homeTeam} ML`; isWinOutcome = game.homeScore > game.awayScore ? 'win' : 'loss';
      } else if (strategy.sideSelection === 'away') {
        shouldBet = true; odds = game.awayMoneyline; betPlacedText = `${game.awayTeam} ML`; isWinOutcome = game.awayScore > game.homeScore ? 'win' : 'loss';
      } else if (strategy.sideSelection === 'home_favorites') {
        if (homeIsFav) { shouldBet = true; odds = game.homeMoneyline; betPlacedText = `${game.homeTeam} ML (Home Fav)`; isWinOutcome = game.homeScore > game.awayScore ? 'win' : 'loss'; }
      } else if (strategy.sideSelection === 'away_favorites') {
        if (!homeIsFav) { shouldBet = true; odds = game.awayMoneyline; betPlacedText = `${game.awayTeam} ML (Away Fav)`; isWinOutcome = game.awayScore > game.homeScore ? 'win' : 'loss'; }
      } else if (strategy.sideSelection === 'home_underdogs') {
        if (!homeIsFav) { shouldBet = true; odds = game.homeMoneyline; betPlacedText = `${game.homeTeam} ML (Home Dog)`; isWinOutcome = game.homeScore > game.awayScore ? 'win' : 'loss'; }
      } else if (strategy.sideSelection === 'away_underdogs') {
        if (homeIsFav) { shouldBet = true; odds = game.awayMoneyline; betPlacedText = `${game.awayTeam} ML (Away Dog)`; isWinOutcome = game.awayScore > game.homeScore ? 'win' : 'loss'; }
      } else if (strategy.sideSelection === 'after_win') {
        const hQual = game.homeWinStreak > 0;
        const aQual = game.awayWinStreak > 0;
        if (hQual && (!aQual || game.homeWinStreak >= game.awayWinStreak)) {
          shouldBet = true; odds = game.homeMoneyline; betPlacedText = `${game.homeTeam} ML (Off Win)`; isWinOutcome = game.homeScore > game.awayScore ? 'win' : 'loss';
        } else if (aQual) {
          shouldBet = true; odds = game.awayMoneyline; betPlacedText = `${game.awayTeam} ML (Off Win)`; isWinOutcome = game.awayScore > game.homeScore ? 'win' : 'loss';
        }
      } else if (strategy.sideSelection === 'after_loss') {
        const hQual = game.homeWinStreak < 0;
        const aQual = game.awayWinStreak < 0;
        if (hQual && (!aQual || game.homeWinStreak <= game.awayWinStreak)) {
          shouldBet = true; odds = game.homeMoneyline; betPlacedText = `${game.homeTeam} ML (Off Loss)`; isWinOutcome = game.homeScore > game.awayScore ? 'win' : 'loss';
        } else if (aQual) {
          shouldBet = true; odds = game.awayMoneyline; betPlacedText = `${game.awayTeam} ML (Off Loss)`; isWinOutcome = game.awayScore > game.homeScore ? 'win' : 'loss';
        }
      } else if (strategy.sideSelection === 'hot_streak') {
        const hQual = game.homeWinStreak >= 3;
        const aQual = game.awayWinStreak >= 3;
        if (hQual && (!aQual || game.homeWinStreak >= game.awayWinStreak)) {
          shouldBet = true; odds = game.homeMoneyline; betPlacedText = `${game.homeTeam} ML (Hot)`; isWinOutcome = game.homeScore > game.awayScore ? 'win' : 'loss';
        } else if (aQual) {
          shouldBet = true; odds = game.awayMoneyline; betPlacedText = `${game.awayTeam} ML (Hot)`; isWinOutcome = game.awayScore > game.homeScore ? 'win' : 'loss';
        }
      } else if (strategy.sideSelection === 'cold_streak') {
        const hQual = game.homeWinStreak <= -3;
        const aQual = game.awayWinStreak <= -3;
        if (hQual && (!aQual || game.homeWinStreak <= game.awayWinStreak)) {
          shouldBet = true; odds = game.homeMoneyline; betPlacedText = `${game.homeTeam} ML (Cold)`; isWinOutcome = game.homeScore > game.awayScore ? 'win' : 'loss';
        } else if (aQual) {
          shouldBet = true; odds = game.awayMoneyline; betPlacedText = `${game.awayTeam} ML (Cold)`; isWinOutcome = game.awayScore > game.homeScore ? 'win' : 'loss';
        }
      } else if (strategy.sideSelection === 'rest_advantage') {
        if (game.homeRestDays > game.awayRestDays) {
          shouldBet = true; odds = game.homeMoneyline; betPlacedText = `${game.homeTeam} ML (Rest Adv)`; isWinOutcome = game.homeScore > game.awayScore ? 'win' : 'loss';
        } else if (game.awayRestDays > game.homeRestDays) {
          shouldBet = true; odds = game.awayMoneyline; betPlacedText = `${game.awayTeam} ML (Rest Adv)`; isWinOutcome = game.awayScore > game.homeScore ? 'win' : 'loss';
        } else {
          shouldBet = true; odds = game.homeMoneyline; betPlacedText = `${game.homeTeam} ML (Equal Rest)`; isWinOutcome = game.homeScore > game.awayScore ? 'win' : 'loss';
        }
      } else if (strategy.sideSelection === 'rest_disadvantage') {
        if (game.homeRestDays < game.awayRestDays) {
          shouldBet = true; odds = game.homeMoneyline; betPlacedText = `${game.homeTeam} ML (Rest Disadv)`; isWinOutcome = game.homeScore > game.awayScore ? 'win' : 'loss';
        } else if (game.awayRestDays < game.homeRestDays) {
          shouldBet = true; odds = game.awayMoneyline; betPlacedText = `${game.awayTeam} ML (Rest Disadv)`; isWinOutcome = game.awayScore > game.homeScore ? 'win' : 'loss';
        } else {
          shouldBet = true; odds = game.awayMoneyline; betPlacedText = `${game.awayTeam} ML (Equal Rest)`; isWinOutcome = game.awayScore > game.homeScore ? 'win' : 'loss';
        }
      }
    } else if (strategy.betType === 'spread') {
      odds = -110;
      const hSpread = game.homeSpread;
      const aSpread = -hSpread;
      if (strategy.sideSelection === 'home') {
        shouldBet = true; betPlacedText = `${game.homeTeam} ${hSpread}`; const coverDiff = game.homeScore + hSpread - game.awayScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
      } else if (strategy.sideSelection === 'away') {
        shouldBet = true; betPlacedText = `${game.awayTeam} ${aSpread}`; const coverDiff = game.awayScore + aSpread - game.homeScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
      } else if (strategy.sideSelection === 'favorites') {
        const betHome = homeIsFav; const activeSpread = betHome ? hSpread : aSpread; const activeTeam = betHome ? game.homeTeam : game.awayTeam;
        shouldBet = true; betPlacedText = `${activeTeam} ${activeSpread}`; const coverDiff = betHome ? game.homeScore + hSpread - game.awayScore : game.awayScore + aSpread - game.homeScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
      } else if (strategy.sideSelection === 'underdogs') {
        const betHome = !homeIsFav; const activeSpread = betHome ? hSpread : aSpread; const activeTeam = betHome ? game.homeTeam : game.awayTeam;
        shouldBet = true; betPlacedText = `${activeTeam} ${activeSpread}`; const coverDiff = betHome ? game.homeScore + hSpread - game.awayScore : game.awayScore + aSpread - game.homeScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
      } else if (strategy.sideSelection === 'home_favorites') {
        if (homeIsFav) { shouldBet = true; betPlacedText = `${game.homeTeam} ${hSpread} (Home Fav)`; const coverDiff = game.homeScore + hSpread - game.awayScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push'; }
      } else if (strategy.sideSelection === 'away_favorites') {
        if (!homeIsFav) { shouldBet = true; betPlacedText = `${game.awayTeam} ${aSpread} (Away Fav)`; const coverDiff = game.awayScore + aSpread - game.homeScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push'; }
      } else if (strategy.sideSelection === 'home_underdogs') {
        if (!homeIsFav) { shouldBet = true; betPlacedText = `${game.homeTeam} ${hSpread} (Home Dog)`; const coverDiff = game.homeScore + hSpread - game.awayScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push'; }
      } else if (strategy.sideSelection === 'away_underdogs') {
        if (homeIsFav) { shouldBet = true; betPlacedText = `${game.awayTeam} ${aSpread} (Away Dog)`; const coverDiff = game.awayScore + aSpread - game.homeScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push'; }
      } else if (strategy.sideSelection === 'after_win') {
        const hQual = game.homeWinStreak > 0; const aQual = game.awayWinStreak > 0;
        if (hQual && (!aQual || game.homeWinStreak >= game.awayWinStreak)) {
          shouldBet = true; betPlacedText = `${game.homeTeam} ${hSpread} (Off Win)`; const coverDiff = game.homeScore + hSpread - game.awayScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
        } else if (aQual) {
          shouldBet = true; betPlacedText = `${game.awayTeam} ${aSpread} (Off Win)`; const coverDiff = game.awayScore + aSpread - game.homeScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
        }
      } else if (strategy.sideSelection === 'after_loss') {
        const hQual = game.homeWinStreak < 0; const aQual = game.awayWinStreak < 0;
        if (hQual && (!aQual || game.homeWinStreak <= game.awayWinStreak)) {
          shouldBet = true; betPlacedText = `${game.homeTeam} ${hSpread} (Off Loss)`; const coverDiff = game.homeScore + hSpread - game.awayScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
        } else if (aQual) {
          shouldBet = true; betPlacedText = `${game.awayTeam} ${aSpread} (Off Loss)`; const coverDiff = game.awayScore + aSpread - game.homeScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
        }
      } else if (strategy.sideSelection === 'hot_streak') {
        const hQual = game.homeWinStreak >= 3; const aQual = game.awayWinStreak >= 3;
        if (hQual && (!aQual || game.homeWinStreak >= game.awayWinStreak)) {
          shouldBet = true; betPlacedText = `${game.homeTeam} ${hSpread} (Hot)`; const coverDiff = game.homeScore + hSpread - game.awayScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
        } else if (aQual) {
          shouldBet = true; betPlacedText = `${game.awayTeam} ${aSpread} (Hot)`; const coverDiff = game.awayScore + aSpread - game.homeScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
        }
      } else if (strategy.sideSelection === 'cold_streak') {
        const hQual = game.homeWinStreak <= -3; const aQual = game.awayWinStreak <= -3;
        if (hQual && (!aQual || game.homeWinStreak <= game.awayWinStreak)) {
          shouldBet = true; betPlacedText = `${game.homeTeam} ${hSpread} (Cold)`; const coverDiff = game.homeScore + hSpread - game.awayScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
        } else if (aQual) {
          shouldBet = true; betPlacedText = `${game.awayTeam} ${aSpread} (Cold)`; const coverDiff = game.awayScore + aSpread - game.homeScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
        }
      } else if (strategy.sideSelection === 'rest_advantage') {
        if (game.homeRestDays > game.awayRestDays) {
          shouldBet = true; betPlacedText = `${game.homeTeam} ${hSpread} (Rest Adv)`; const coverDiff = game.homeScore + hSpread - game.awayScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
        } else if (game.awayRestDays > game.homeRestDays) {
          shouldBet = true; betPlacedText = `${game.awayTeam} ${aSpread} (Rest Adv)`; const coverDiff = game.awayScore + aSpread - game.homeScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
        } else {
          shouldBet = true; betPlacedText = `${game.homeTeam} ${hSpread} (Equal Rest)`; const coverDiff = game.homeScore + hSpread - game.awayScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
        }
      } else if (strategy.sideSelection === 'rest_disadvantage') {
        if (game.homeRestDays < game.awayRestDays) {
          shouldBet = true; betPlacedText = `${game.homeTeam} ${hSpread} (Rest Disadv)`; const coverDiff = game.homeScore + hSpread - game.awayScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
        } else if (game.awayRestDays < game.homeRestDays) {
          shouldBet = true; betPlacedText = `${game.awayTeam} ${aSpread} (Rest Disadv)`; const coverDiff = game.awayScore + aSpread - game.homeScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
        } else {
          shouldBet = true; betPlacedText = `${game.awayTeam} ${aSpread} (Equal Rest)`; const coverDiff = game.awayScore + aSpread - game.homeScore; isWinOutcome = coverDiff > 0 ? 'win' : coverDiff < 0 ? 'loss' : 'push';
        }
      }
    } else if (strategy.betType === 'totals') {
      odds = -110;
      const totalPoints = game.homeScore + game.awayScore;
      if (strategy.sideSelection === 'over') {
        shouldBet = true; betPlacedText = `Over ${game.overUnder}`; isWinOutcome = totalPoints > game.overUnder ? 'win' : totalPoints < game.overUnder ? 'loss' : 'push';
      } else if (strategy.sideSelection === 'under') {
        shouldBet = true; betPlacedText = `Under ${game.overUnder}`; isWinOutcome = totalPoints < game.overUnder ? 'win' : totalPoints > game.overUnder ? 'loss' : 'push';
      }
    }

    if (shouldBet) {
      if (strategy.oddsMin !== undefined && odds < strategy.oddsMin) shouldBet = false;
      if (strategy.oddsMax !== undefined && odds > strategy.oddsMax) shouldBet = false;
      if (strategy.betType === 'spread') {
        const absSpread = Math.abs(game.homeSpread);
        if (strategy.spreadMin !== undefined && absSpread < strategy.spreadMin) shouldBet = false;
        if (strategy.spreadMax !== undefined && absSpread > strategy.spreadMax) shouldBet = false;
      }
      if (strategy.betType === 'totals') {
        if (strategy.totalMin !== undefined && game.overUnder < strategy.totalMin) shouldBet = false;       
        if (strategy.totalMax !== undefined && game.overUnder > strategy.totalMax) shouldBet = false;       
      }
      
      if (strategy.streakFilter !== 'any') {
        let betTargetTeam = '';
        if (betPlacedText.includes(game.homeTeam)) betTargetTeam = game.homeTeam;
        else if (betPlacedText.includes(game.awayTeam)) betTargetTeam = game.awayTeam;

        if (betTargetTeam) {
          const streakVal = betTargetTeam === game.homeTeam ? game.homeWinStreak : game.awayWinStreak;
          if (strategy.streakFilter === 'after_win' && streakVal <= 0) shouldBet = false;
          if (strategy.streakFilter === 'after_loss' && streakVal >= 0) shouldBet = false;
          if (strategy.streakFilter === 'hot_streak_3plus' && streakVal < 3) shouldBet = false;
          if (strategy.streakFilter === 'cold_streak_3plus' && streakVal > -3) shouldBet = false;
        }
      }
    }

    if (shouldBet) {
      totalBets++;
      const decimalOdds = americanToDecimalOdds(odds);
      const stake = strategy.unitSize;
      let returnVal = 0;
      let netResult = 0;
      if (isWinOutcome === 'win') {
        wonBets++; returnVal = stake * decimalOdds; netResult = returnVal - stake;
      } else if (isWinOutcome === 'loss') {
        lostBets++; returnVal = 0; netResult = -stake;
      } else {
        pushedBets++; returnVal = stake; netResult = 0;
      }
      totalWagered += stake; totalReturn += returnVal; currentBankroll += netResult;
      if (currentBankroll > peakBankroll) peakBankroll = currentBankroll;
      const dd = peakBankroll - currentBankroll;
      if (dd > maxDrawdown) maxDrawdown = dd;
      simulatedGames.push({
        id: game.id, date: game.date, matchup: `${game.awayTeam} @ ${game.homeTeam}`, sport: game.sport, season: game.season, homeTeam: game.homeTeam, awayTeam: game.awayTeam, homeScore: game.homeScore, awayScore: game.awayScore, homeSpread: game.homeSpread, overUnder: game.overUnder, homeMoneyline: game.homeMoneyline, awayMoneyline: game.awayMoneyline, betPlaced: betPlacedText, oddsDecimal: parseFloat(decimalOdds.toFixed(3)), stake, returnVal: parseFloat(returnVal.toFixed(2)), netResult: parseFloat(netResult.toFixed(2)), status: isWinOutcome
      });
      profitHistory.push({
        index: totalBets, date: game.date, matchup: `${game.awayTeam} @ ${game.homeTeam}`, netProfit: parseFloat(netResult.toFixed(2)), cumulativeProfit: parseFloat((currentBankroll - strategy.startingBankroll).toFixed(2)), currentBankroll: parseFloat(currentBankroll.toFixed(2))
      });
    }
  });

  const netProfit = totalReturn - totalWagered;
  const winRate = totalBets > 0 ? (wonBets / (totalBets - pushedBets || 1)) * 100 : 0;
  const roi = totalWagered > 0 ? (netProfit / totalWagered) * 100 : 0;
  const avgOdds = simulatedGames.length > 0 ? simulatedGames.reduce((acc, g) => acc + g.oddsDecimal, 0) / simulatedGames.length : 0;
  const p = winRate / 100; const q = 1 - p; const b = avgOdds - 1;
  let kellyPercentage = 0;
  if (b > 0 && totalBets > 5) {
    kellyPercentage = ((p * b) - q) / b * 100;
    kellyPercentage = Math.max(0, parseFloat((kellyPercentage * 0.25).toFixed(2)));
  }

  const summary: BacktestSummary = {
    sport: strategy.sport, startYear: strategy.startYear, endYear: strategy.endYear, totalBets, wonBets, lostBets, pushedBets, winRate: parseFloat(winRate.toFixed(2)), totalWagered: parseFloat(totalWagered.toFixed(2)), totalReturn: parseFloat(totalReturn.toFixed(2)), netProfit: parseFloat(netProfit.toFixed(2)), roi: parseFloat(roi.toFixed(2)), avgOdds: parseFloat(avgOdds.toFixed(3)), maxDrawdown: parseFloat(maxDrawdown.toFixed(2)), maxDrawdownPercent: (peakBankroll > 0 ? (maxDrawdown / peakBankroll) * 100 : 0), kellyPercentage, finalBankroll: parseFloat(currentBankroll.toFixed(2))
  };

  return { summary, profitHistory, games: simulatedGames.slice(-250) };
}