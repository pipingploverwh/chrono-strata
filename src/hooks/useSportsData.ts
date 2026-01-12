import { useState, useEffect } from "react";

interface ESPNTeam {
  id: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  logo?: string;
  score?: string;
  winner?: boolean;
  records?: { summary: string }[];
}

interface ESPNCompetitor {
  id: string;
  homeAway: "home" | "away";
  team: ESPNTeam;
  score: string;
  winner?: boolean;
  records?: { summary: string }[];
}

interface ESPNCompetition {
  id: string;
  date: string;
  status: {
    type: {
      id: string;
      name: string;
      state: string;
      completed: boolean;
      description: string;
      detail: string;
      shortDetail: string;
    };
    clock?: number;
    displayClock?: string;
    period?: number;
  };
  competitors: ESPNCompetitor[];
  venue?: {
    fullName: string;
    city: string;
    state: string;
  };
  broadcasts?: { names: string[] }[];
}

interface ESPNEvent {
  id: string;
  name: string;
  shortName: string;
  date: string;
  competitions: ESPNCompetition[];
}

interface ESPNScoreboard {
  events: ESPNEvent[];
  leagues?: {
    name: string;
    abbreviation: string;
    season?: { year: number; type: { name: string } };
  }[];
}

export interface GameData {
  id: string;
  homeTeam: {
    name: string;
    abbreviation: string;
    score: string;
    record?: string;
    logo?: string;
    isPatriots?: boolean;
  };
  awayTeam: {
    name: string;
    abbreviation: string;
    score: string;
    record?: string;
    logo?: string;
    isPatriots?: boolean;
  };
  status: string;
  statusDetail: string;
  isLive: boolean;
  isCompleted: boolean;
  venue?: string;
  broadcast?: string;
  gameDate: Date;
}

export interface SportsDataHook {
  nflGames: GameData[];
  mlsGames: GameData[];
  patriotsGame: GameData | null;
  revolutionGame: GameData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => void;
}

const ESPN_NFL_URL = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
const ESPN_MLS_URL = "https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard";

const parseESPNGame = (event: ESPNEvent): GameData | null => {
  const competition = event.competitions[0];
  if (!competition) return null;

  const homeCompetitor = competition.competitors.find((c) => c.homeAway === "home");
  const awayCompetitor = competition.competitors.find((c) => c.homeAway === "away");

  if (!homeCompetitor || !awayCompetitor) return null;

  const isPatriots = (abbr: string) => abbr === "NE" || abbr === "NEP";
  const isRevolution = (name: string) => name.toLowerCase().includes("revolution") || name.toLowerCase().includes("new england");

  return {
    id: event.id,
    homeTeam: {
      name: homeCompetitor.team.displayName,
      abbreviation: homeCompetitor.team.abbreviation,
      score: homeCompetitor.score || "0",
      record: homeCompetitor.records?.[0]?.summary,
      logo: homeCompetitor.team.logo,
      isPatriots: isPatriots(homeCompetitor.team.abbreviation)
    },
    awayTeam: {
      name: awayCompetitor.team.displayName,
      abbreviation: awayCompetitor.team.abbreviation,
      score: awayCompetitor.score || "0",
      record: awayCompetitor.records?.[0]?.summary,
      logo: awayCompetitor.team.logo,
      isPatriots: isPatriots(awayCompetitor.team.abbreviation)
    },
    status: competition.status.type.name,
    statusDetail: competition.status.type.shortDetail,
    isLive: competition.status.type.state === "in",
    isCompleted: competition.status.type.completed,
    venue: competition.venue?.fullName,
    broadcast: competition.broadcasts?.[0]?.names?.[0],
    gameDate: new Date(event.date)
  };
};

export const useSportsData = (): SportsDataHook => {
  const [nflGames, setNflGames] = useState<GameData[]>([]);
  const [mlsGames, setMlsGames] = useState<GameData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [nflResponse, mlsResponse] = await Promise.all([
        fetch(ESPN_NFL_URL).then((r) => r.ok ? r.json() : null).catch(() => null),
        fetch(ESPN_MLS_URL).then((r) => r.ok ? r.json() : null).catch(() => null)
      ]);

      if (nflResponse?.events) {
        const parsedNfl = nflResponse.events
          .map(parseESPNGame)
          .filter((g: GameData | null): g is GameData => g !== null);
        setNflGames(parsedNfl);
      }

      if (mlsResponse?.events) {
        const parsedMls = mlsResponse.events
          .map(parseESPNGame)
          .filter((g: GameData | null): g is GameData => g !== null);
        setMlsGames(parsedMls);
      }

      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch sports data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh every 30 seconds for live games
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const patriotsGame = nflGames.find(
    (g) => g.homeTeam.isPatriots || g.awayTeam.isPatriots
  ) || null;

  const revolutionGame = mlsGames.find(
    (g) => 
      g.homeTeam.name.toLowerCase().includes("revolution") ||
      g.awayTeam.name.toLowerCase().includes("revolution") ||
      g.homeTeam.name.toLowerCase().includes("new england") ||
      g.awayTeam.name.toLowerCase().includes("new england")
  ) || null;

  return {
    nflGames,
    mlsGames,
    patriotsGame,
    revolutionGame,
    isLoading,
    error,
    lastUpdated,
    refetch: fetchData
  };
};

export default useSportsData;
