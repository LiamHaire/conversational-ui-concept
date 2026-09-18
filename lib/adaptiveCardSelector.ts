// Card layout types
export type CardLayoutType =
  | 'list-item'
  | 'three-column'
  | 'two-column'
  | 'media'
  | 'stats'
  | 'timeline'
  | 'calendar'
  | 'profile'
  | 'table'
  | 'form';

// Query type categories
type QueryCategory =
  | 'list'
  | 'schedule'
  | 'stats'
  | 'people'
  | 'data'
  | 'form'
  | 'general';

// Map query categories to appropriate card layouts
const categoryLayouts: Record<QueryCategory, CardLayoutType[]> = {
  list: ['list-item', 'timeline', 'table'],
  schedule: ['calendar', 'timeline', 'list-item'],
  stats: ['stats', 'three-column', 'two-column'],
  people: ['profile', 'timeline', 'media'],
  data: ['table', 'two-column', 'stats'],
  form: ['form', 'two-column'],
  general: ['list-item', 'two-column', 'media'],
};

// Keywords for categorizing queries
const categoryKeywords: Record<QueryCategory, string[]> = {
  list: [
    'list',
    'show',
    'display',
    'view',
    'find',
    'search',
    'all',
    'medication',
    'patient',
  ],
  schedule: [
    'calendar',
    'schedule',
    'appointment',
    'meeting',
    'today',
    'tomorrow',
    'week',
    'upcoming',
    'next',
  ],
  stats: [
    'stats',
    'statistics',
    'summary',
    'report',
    'overview',
    'dashboard',
    'metrics',
    'count',
    'total',
  ],
  people: [
    'patient',
    'doctor',
    'nurse',
    'staff',
    'team',
    'profile',
    'contact',
    'who',
  ],
  data: [
    'data',
    'records',
    'history',
    'results',
    'test',
    'lab',
    'vitals',
    'chart',
  ],
  form: ['form', 'create', 'new', 'add', 'register', 'submit', 'update'],
  general: [],
};

/**
 * Categorize a query based on keywords
 */
function categorizeQuery(query: string): QueryCategory {
  const lowerQuery = query.toLowerCase();

  // Check each category's keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => lowerQuery.includes(keyword))) {
      return category as QueryCategory;
    }
  }

  return 'general';
}

/**
 * Get a random card layout for a given query
 * Returns a layout type that's appropriate for the query context
 */
export function getRandomCardLayout(query: string): CardLayoutType {
  const category = categorizeQuery(query);
  const possibleLayouts = categoryLayouts[category];

  // Randomly select from appropriate layouts
  const randomIndex = Math.floor(Math.random() * possibleLayouts.length);
  return possibleLayouts[randomIndex];
}

/**
 * Get a specific number of random layouts (for multiple card display)
 */
export function getMultipleRandomLayouts(
  query: string,
  count: number
): CardLayoutType[] {
  const category = categorizeQuery(query);
  const possibleLayouts = categoryLayouts[category];
  const layouts: CardLayoutType[] = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * possibleLayouts.length);
    layouts.push(possibleLayouts[randomIndex]);
  }

  return layouts;
}

/**
 * Determine if query should get multiple cards or single card
 */
export function shouldShowMultipleCards(query: string): boolean {
  const multipleCardKeywords = [
    'all',
    'list',
    'show',
    'multiple',
    'several',
    'appointments',
    'patients',
    'medications',
  ];

  const lowerQuery = query.toLowerCase();
  return multipleCardKeywords.some((keyword) => lowerQuery.includes(keyword));
}

/**
 * Get the recommended number of cards to show
 */
export function getRecommendedCardCount(query: string): number {
  if (shouldShowMultipleCards(query)) {
    // Random between 2-4 cards for list-type queries
    return Math.floor(Math.random() * 3) + 2;
  }
  return 1;
}
