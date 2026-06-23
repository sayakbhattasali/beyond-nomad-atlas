import { destinations, Destination } from "@/data/destinations";

/**
 * Semantic synonym mappings for emotionally intelligent retrieval.
 * Maps user intent words to destination-relevant keywords.
 */
const SEMANTIC_MAP: Record<string, string[]> = {
  // Nature & landscape
  mountain: ["hill", "mist", "elevated", "cold", "pine", "trek", "hills"],
  peaceful: ["quiet", "calm", "reset", "solitude", "silence", "serene", "still"],
  beach: ["sea", "shore", "waves", "coastal", "ocean", "sand", "tide"],
  nature: ["forest", "green", "trees", "wildlife", "jungle", "lake", "river", "waterfall", "dam"],
  heritage: ["temple", "ancient", "history", "old", "ruins", "monument", "spiritual", "sacred"],

  // Emotional states
  exhausted: ["tired", "burnout", "drained", "overwhelmed", "stressed", "reset", "recharge"],
  lonely: ["alone", "solitude", "solo", "introspection", "quiet", "self"],
  romantic: ["date", "couple", "intimate", "love", "girlfriend", "boyfriend", "partner", "evening"],
  friends: ["group", "social", "party", "hangout", "crew", "squad", "outing"],
  adventure: ["thrill", "explore", "discover", "exciting", "trek", "new", "unknown"],

  // Practical / proximity
  evening: ["night", "late", "sunset", "after dark", "tonight", "dusk"],
  quick: ["short", "nearby", "close", "fast", "casual", "walk", "drive"],
  weekend: ["overnight", "stay", "trip", "getaway", "escape", "2 days"],
  food: ["eat", "restaurant", "café", "dinner", "lunch", "snack", "street food"],
};

/**
 * Proximity classification based on distance from KIIT/Bhubaneswar.
 */
function getProximity(distanceKm: number): "local" | "day-trip" | "weekend" {
  if (distanceKm <= 25) return "local";
  if (distanceKm <= 100) return "day-trip";
  return "weekend";
}

/**
 * Expand query using semantic synonyms so retrieval catches
 * emotionally adjacent concepts, not just exact keywords.
 */
function expandQuery(query: string): string[] {
  const lower = query.toLowerCase();
  const expanded: Set<string> = new Set(lower.split(/\s+/));

  for (const [concept, synonyms] of Object.entries(SEMANTIC_MAP)) {
    // If the query contains the concept OR any synonym, add all related terms
    if (lower.includes(concept) || synonyms.some((s) => lower.includes(s))) {
      expanded.add(concept);
      synonyms.forEach((s) => expanded.add(s));
    }
  }

  return Array.from(expanded);
}

/**
 * Heuristic retriever with semantic expansion and proximity awareness.
 * Always returns at least 4 destinations — never an empty array.
 */
export function retrieveDestinations(query: string): Destination[] {
  const expandedTerms = expandQuery(query);
  const normalizedQuery = query.toLowerCase();

  // Detect proximity intent from query
  let proximityPreference: "local" | "day-trip" | "weekend" | null = null;
  const localWords = ["evening", "tonight", "walk", "nearby", "close", "casual", "quick", "short drive", "late night"];
  const weekendWords = ["weekend", "overnight", "getaway", "retreat", "stay"];

  if (localWords.some((w) => normalizedQuery.includes(w))) proximityPreference = "local";
  if (weekendWords.some((w) => normalizedQuery.includes(w))) proximityPreference = "weekend";

  const scored = destinations.map((dest) => {
    let score = 0;
    const destText = `${dest.summary} ${dest.overview} ${dest.idealFor.join(" ")} ${dest.vibes.join(" ")} ${dest.category}`.toLowerCase();

    // 1. Vibe matching against expanded terms
    dest.vibes.forEach((vibe) => {
      if (expandedTerms.some((term) => vibe.toLowerCase().includes(term))) score += 10;
    });

    // 2. Semantic keyword matching against dest content
    expandedTerms.forEach((term) => {
      if (destText.includes(term)) score += 4;
    });

    // 3. Category matching
    if (expandedTerms.some((term) => dest.category.toLowerCase().includes(term))) score += 5;

    // 4. IdealFor matching
    dest.idealFor.forEach((ideal) => {
      if (expandedTerms.some((term) => ideal.toLowerCase().includes(term))) score += 4;
    });

    // 5. Direct name mention (strongest signal)
    if (normalizedQuery.includes(dest.name.toLowerCase())) score += 25;

    // 6. Proximity bonus — reward destinations that match the user's effort level
    const proximity = getProximity(dest.distanceKm);
    if (proximityPreference === proximity) score += 8;
    // Penalize weekend destinations for casual evening queries
    if (proximityPreference === "local" && proximity === "weekend") score -= 5;

    return { ...dest, score };
  });

  const topMatches = scored
    .filter((dest) => dest.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  // Guaranteed fallback — diversified selection if no strong matches
  if (topMatches.length < 2) {
    const fallback = destinations
      .filter((d) => !topMatches.some((m) => m.slug === d.slug))
      .slice(0, 4 - topMatches.length);
    return [...topMatches, ...fallback];
  }

  return topMatches;
}

/**
 * Returns all atlas destination names for validation purposes.
 */
export function getAllAtlasNames(): string[] {
  return destinations.map((d) => d.name.toLowerCase());
}
