/**
 * Mock Response System
 *
 * Returns mock responses with variations for follow-up requests.
 * Ensures no consecutive duplicate responses.
 * Includes adaptive card layouts for small data returns.
 * Supports text-only responses for narrative requests.
 */

import { MockResponse } from '@/types/conversation';
import {
  getMultipleRandomLayouts,
  getRecommendedCardCount,
} from './adaptiveCardSelector';
import { getStoryOpening, getStoryContinuation } from './storyGenerator';
import { getStartingNode, getGameNode } from './gameData';
import { pickRandomAppointment, APPOINTMENT_POOL } from './appointmentData';

const responseVariations = [
  "Behold, your results have arrived.",
  "I've gathered everything neatly for you.",
  "Here is what I found, freshly assembled.",
  "Your requested items have been carefully retrieved.",
  "I've wandered the data paths and returned with answers.",
  "The search is complete. Here are your results.",
  "I've compiled your findings with great care.",
  "Your information has been elegantly arranged.",
  "All set. Here is what you asked for.",
  "I've returned with your requested insights.",
  "The results have surfaced from the depths.",
  "I've assembled everything into clarity.",
  "Your query has been resolved gracefully.",
  "Here is the information you summoned.",
  "I've fetched the details without incident.",
  "Your results are now before you.",
  "Everything has been brought together for you.",
  "I've completed the retrieval of your request.",
  "The answer has been prepared and delivered.",
  "Your requested data is now in view.",
  "I've gathered the pieces into a coherent whole.",
  "Here is the outcome of your request.",
  "I've returned with structured findings.",
  "Your results have been carefully curated.",
  "The information is now ready for your review.",
  "I've completed the search successfully.",
  "Here is the outcome, assembled just for you.",
  "Your request has been fulfilled in full.",
  "I've brought everything back in order.",
  "The data has aligned. Here are your results.",
];

let lastResponseIndex = -1;

/**
 * Get a random response intro without duplicates
 */
function getRandomResponseIntro(): string {
  let randomIndex;

  do {
    randomIndex = Math.floor(Math.random() * responseVariations.length);
  } while (randomIndex === lastResponseIndex && responseVariations.length > 1);

  lastResponseIndex = randomIndex;
  return responseVariations[randomIndex];
}

/**
 * Determine if the message is requesting to play a game
 */
function isGameRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  const gameKeywords = [
    'play a game',
    'play game',
    "let's play",
    'start a game',
    'start game',
    'game time',
  ];

  return gameKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Determine if the message is requesting a text-only response (story, explanation, etc.)
 */
function isTextOnlyRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  // Story-specific keywords (must NOT contain data-related words)
  const storyKeywords = ['story', 'tale', 'narrative'];
  const hasStoryKeyword = storyKeywords.some(keyword => lowerMessage.includes(keyword));

  if (hasStoryKeyword) return true;

  // Generic text requests (but exclude if they mention data/show/list)
  const dataExclusions = ['show', 'list', 'data', 'display', 'view', 'get', 'find'];
  const hasDataExclusion = dataExclusions.some(keyword => lowerMessage.includes(keyword));

  if (hasDataExclusion) return false;

  // Safe text-only keywords (won't conflict with data requests)
  const textOnlyKeywords = [
    'explain',
    'describe',
    'what is',
    'how does',
    'why',
  ];

  return textOnlyKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Determine if the message is a story continuation request
 */
function isStoryContinuationRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  // Story continuation phrases (explicit)
  const storyContinuationPhrases = [
    'tell me more',
    'continue the story',
    'keep going',
    'what happens next',
    'what happens',
    'and then',
    'go on',
    'what next',
    'then what',
  ];

  // Check for explicit story continuation
  if (storyContinuationPhrases.some(phrase => lowerMessage.includes(phrase))) {
    // But NOT if it mentions data/show/list
    const dataKeywords = ['data', 'show', 'list', 'display'];
    return !dataKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  // Simple "more" or "continue" only counts if NO data keywords present
  if (lowerMessage === 'more' || lowerMessage === 'continue') {
    return true;
  }

  return false;
}

/**
 * Determine if the message is a data continuation request
 */
function isDataContinuationRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  // Must contain either "more" or "another" AND data-related keywords
  const hasMore = lowerMessage.includes('more') || lowerMessage.includes('another');
  const hasDataKeyword = lowerMessage.includes('data') ||
                         lowerMessage.includes('small data') ||
                         lowerMessage.includes('show') ||
                         lowerMessage.includes('list') ||
                         lowerMessage.includes('results');

  return hasMore && hasDataKeyword;
}

/**
 * Determine if the message is a large data request
 */
function isLargeDataRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  const largeDataKeywords = [
    'large data',
    'big data',
    'full view',
    'detailed view',
    'expanded view',
  ];

  return largeDataKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Determine if the message is a large data continuation request
 */
function isLargeDataContinuationRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  const largeDataContinuationPhrases = [
    'more large data',
    'more big data',
    'show me more large',
    'another large',
    'different large data',
  ];

  return largeDataContinuationPhrases.some(phrase => lowerMessage.includes(phrase));
}

/**
 * Determine if the message is a form request
 */
function isFormRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return lowerMessage.includes('form') || lowerMessage.includes('fill out');
}

/**
 * Determine if the message requests an in-dialog form specifically
 */
function isInDialogFormRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return lowerMessage.includes('in dialog') ||
         lowerMessage.includes('in-dialog') ||
         lowerMessage.includes('inline form');
}

/**
 * Determine if the message requests a pop-out form specifically
 */
function isPopOutFormRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return lowerMessage.includes('pop out') ||
         lowerMessage.includes('pop-out') ||
         lowerMessage.includes('popout') ||
         lowerMessage.includes('floating form');
}

export function getMockResponse(userMessage: string, gameNodeId?: string): MockResponse {
  // Priority 0a: Check for blood pressure readings request
  if (userMessage.toLowerCase().includes('blood pressure') ||
      (userMessage.toLowerCase().includes('bp') && userMessage.toLowerCase().includes('reading'))) {
    return {
      content: "Here are the blood pressure readings taken in the last 6 months for Ms Margaret Ellison, presented in a line graph to show static readings and trends over time.",
      delay: 1000,
      adaptiveCards: [
        {
          id: 'bp-graph-1',
          type: 'line-graph',
          data: {},
        },
      ],
      followUpText: "Blood pressure readings over the past six months have remained consistently above the recommended range, typically around 140-150 / 88-95 mmHg.\n\nThe values show relatively stable trends with only minor variation, suggesting persistent but steady elevated blood pressure.",
    };
  }

  // Priority 0a2: Check for data table request
  if (userMessage.toLowerCase().includes('data table') ||
      userMessage.toLowerCase().includes('patient list') ||
      userMessage.toLowerCase().includes('patient table')) {
    return {
      content: "Here's a live patient data table. You can sort by any column and search across all fields.",
      delay: 1000,
      largeData: true,
      largeDataType: 'patient-data-table',
    };
  }

  // Priority 0b: Check for patient summary request
  if (userMessage.toLowerCase().includes('view patient summary') ||
      userMessage.toLowerCase().includes('patient summary')) {
    // Detect which patient is being asked about by scanning the message for known names
    const lowerMsg = userMessage.toLowerCase();
    const matched = APPOINTMENT_POOL.find(
      a => lowerMsg.includes(a.patientName.toLowerCase()) ||
           lowerMsg.includes(a.patientNameDisplay.toLowerCase())
    );
    const patientName = matched ? matched.patientName : 'Ms Margaret Ellison';
    const patientId = matched ? matched.patientId : 'PT-10002';

    return {
      content: `I have created a Patient Summary for ${patientName} as requested.`,
      delay: 1000,
      largeData: true,
      largeDataType: 'patient-summary',
      patientId,
      suggestedActions: [
        { id: 'action-encounter', text: 'Start new encounter' },
        { id: 'action-med-reviews', text: 'Action outstanding medication reviews' },
      ],
    };
  }

  // Priority 0b: Check for specific appointment request
  if (userMessage.toLowerCase().includes('show me my next appointment') ||
      userMessage.toLowerCase().includes('next appointment')) {
    const appt = pickRandomAppointment();

    const appointmentTime = new Date();
    appointmentTime.setMinutes(appointmentTime.getMinutes() + appt.minutesUntil);
    const hours = appointmentTime.getHours().toString().padStart(2, '0');
    const minutes = appointmentTime.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    return {
      content: `Your next appointment today is in ${appt.minutesUntil} minutes at ${timeString} with ${appt.patientName}.`,
      delay: 1000,
      adaptiveCards: [
        {
          id: 'patient-card-1',
          type: 'patient-card',
          data: {
            patientName: appt.patientNameDisplay,
            dateOfBirth: appt.dateOfBirth,
            patientId: appt.patientId,
            sex: appt.sex,
          },
        },
      ],
      suggestedActions: [
        { id: 'action-view-summary', text: `View patient summary for ${appt.patientName}` },
        ...appt.suggestedActions.slice(1),
      ],
      followUpText: appt.followUpText,
    };
  }

  // Priority 0c: Check for form requests
  if (isFormRequest(userMessage)) {
    const now = new Date();
    const formId = `FORM-${now.getTime()}`;
    const subtitle = now.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // If user specifically requests pop-out form
    if (isPopOutFormRequest(userMessage)) {
      return {
        content: "I've opened a pop-out form for you. You can minimize it to continue viewing the data.",
        delay: 1000,
        showPopOutForm: true,
        formData: {
          title: 'Form title',
          subtitle,
          formId,
        },
      };
    }

    // If user specifically requests in-dialog form OR just asks for "a form" (default behavior)
    if (isInDialogFormRequest(userMessage) || !isPopOutFormRequest(userMessage)) {
      return {
        content: "Here's a form for you to complete:",
        delay: 1000,
        showInDialogForm: true,
        formData: {
          title: 'Form title',
          subtitle,
          formId,
        },
      };
    }
  }

  // Priority 1: Check if this is a game request or game option selection
  if (isGameRequest(userMessage)) {
    const startNode = getStartingNode();
    return {
      content: startNode.text,
      delay: 1000,
      gameOptions: startNode.options,
      gameNodeId: startNode.id,
    };
  }

  // If we have a game node ID, user is selecting a game option
  if (gameNodeId) {
    // The userMessage should contain the option text they selected
    // We'll handle this in the main app logic
    return {
      content: '',
      delay: 0,
    };
  }

  // Priority 1: Check for large data continuation
  if (isLargeDataContinuationRequest(userMessage)) {
    return {
      content: getRandomResponseIntro(),
      delay: 1200,
      largeData: true,
    };
  }

  // Priority 2: Check for large data request
  if (isLargeDataRequest(userMessage)) {
    return {
      content: getRandomResponseIntro(),
      delay: 1500,
      largeData: true,
    };
  }

  // Priority 2: Check for story continuation ("tell me more")
  if (isStoryContinuationRequest(userMessage)) {
    return {
      content: getStoryContinuation(),
      delay: 1200,
      // No adaptive cards for story continuation
    };
  }

  // Priority 2: Check for data continuation ("show me more data")
  if (isDataContinuationRequest(userMessage)) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * responseVariations.length);
    } while (newIndex === lastResponseIndex && responseVariations.length > 1);

    lastResponseIndex = newIndex;
    const content = responseVariations[newIndex];

    // Generate more adaptive cards
    const cardCount = getRecommendedCardCount(userMessage);
    const adaptiveCards = getMultipleRandomLayouts(userMessage, cardCount);

    return {
      content,
      delay: 1000,
      adaptiveCards,
    };
  }

  // Priority 3: Check if this is a new story request
  if (isTextOnlyRequest(userMessage)) {
    return {
      content: getStoryOpening(),
      delay: 1200,
      // No adaptive cards for text-only responses
    };
  }

  // Default: Small data request - return with adaptive cards
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * responseVariations.length);
  } while (newIndex === lastResponseIndex && responseVariations.length > 1);

  lastResponseIndex = newIndex;
  const content = responseVariations[newIndex];

  // Generate adaptive cards based on the query
  const cardCount = getRecommendedCardCount(userMessage);
  const adaptiveCards = getMultipleRandomLayouts(userMessage, cardCount);

  return {
    content,
    delay: 1000,
    adaptiveCards,
  };
}
