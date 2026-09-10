'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sidebar,
  ConversationHero,
  PromptInput,
  PromptSuggestions,
  ConversationThread,
  ChatHistoryPopover,
  NotificationsPopover
} from '@/components/chat';
import { getMockNotifications } from '@/lib/mockNotifications';
import {
  TableCard,
  DashboardCard,
  DocumentCard,
  GridCard,
  CalendarCard,
  KanbanCard,
  AnalyticsCard,
  PatientSummaryCard,
  PatientHeader
} from '@/components/ui/LargeAdaptiveCards';
import { ActionTiles, ThemeToast, Breadcrumb } from '@/components/ui';
import { CloseXIcon, SwapHorizontalIcon, NewChatIcon } from '@/components/icons';
import { PopOutForm, TextInput, TextArea, Select } from '@/components/forms';
import { Message } from '@/types/conversation';
import { getMockResponse } from '@/lib/mockResponses';
import { getGameNode } from '@/lib/gameData';
import { saveCurrentChat } from '@/lib/chatHistory';
import { getMockChatHistory } from '@/lib/mockChatHistory';
import { useAutoScroll, useTheme } from '@/hooks';

const LARGE_CARD_LAYOUTS = [
  { type: 'table', component: TableCard },
  { type: 'dashboard', component: DashboardCard },
  { type: 'document', component: DocumentCard },
  { type: 'grid', component: GridCard },
  { type: 'calendar', component: CalendarCard },
  { type: 'kanban', component: KanbanCard },
  { type: 'analytics', component: AnalyticsCard },
  { type: 'patient-summary', component: PatientSummaryCard },
];

const DEFAULT_SUGGESTIONS = [
  {
    id: '1',
    text: 'Show me a small data return'
  },
  {
    id: '2',
    text: 'Tell me a story'
  },
  {
    id: '3',
    text: "Let's play a game"
  }
];

type UIState = 'landing' | 'conversation';

export default function Home() {
  const [uiState, setUiState] = useState<UIState>('landing');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentGameNodeId, setCurrentGameNodeId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLargeData, setShowLargeData] = useState(false);
  const [largeCardLayout, setLargeCardLayout] = useState<typeof LARGE_CARD_LAYOUTS[0] | null>(null);
  const [closedLargeDataContext, setClosedLargeDataContext] = useState<{ layout: typeof LARGE_CARD_LAYOUTS[0]; messageContent: string } | null>(null);
  const [showThemeToast, setShowThemeToast] = useState(false);
  const [activePopover, setActivePopover] = useState<'chatHistory' | 'notifications' | null>(null);
  const [isLayoutSwapped, setIsLayoutSwapped] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['Patient summary']);
  const [showPatientHeader, setShowPatientHeader] = useState(false);
  const [showPopOutForm, setShowPopOutForm] = useState(false);
  const [popOutFormData, setPopOutFormData] = useState<{ title: string; subtitle?: string; formId?: string } | null>(null);
  const [activePatientId, setActivePatientId] = useState<string>('PT-10002');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [careMode, setCareMode] = useState<'primary' | 'urgent'>('primary');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) setIsFocusMode(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  // Refs
  const chatHistoryButtonRef = useRef<HTMLButtonElement>(null);
  const notificationsButtonRef = useRef<HTMLButtonElement>(null);
  const largeDataContainerRef = useRef<HTMLDivElement>(null);

  // Theme management
  const { cycleTheme, currentThemeName } = useTheme();

  const handleThemeCycle = () => {
    cycleTheme();
    setShowThemeToast(true);
  };

  const handleChatHistoryClick = () => {
    setActivePopover(prev => prev === 'chatHistory' ? null : 'chatHistory');
  };

  const handleNotificationsClick = () => {
    setActivePopover(prev => prev === 'notifications' ? null : 'notifications');
  };

  const handleSelectNotification = (notificationId: string) => {
    console.log('Selected notification:', notificationId);
    // TODO: Handle notification selection (navigate, mark as read, etc.)
  };

  const handleSelectChat = (chatId: string) => {
    // Load the chat history
    const chatHistory = getMockChatHistory();
    const selectedChat = chatHistory.find(chat => chat.id === chatId);

    if (selectedChat) {
      // Transition to conversation state
      setUiState('conversation');

      // Load the messages from the selected chat
      setMessages(selectedChat.messages);

      // Reset other states
      setCurrentGameNodeId(null);
      setShowLargeData(false);
      setLargeCardLayout(null);
      setClosedLargeDataContext(null);
      setIsLayoutSwapped(false);
    }
  };

  const handleSwapLayout = () => {
    setIsLayoutSwapped(prev => !prev);
  };

  // Auto-scroll to bottom when messages change
  const scrollRef = useAutoScroll({
    enabled: uiState === 'conversation',
    behavior: 'smooth',
    dependencies: [messages],
  });

  const handleSubmit = (msg: string) => {
    if (!msg.trim()) return;

    // Start transition animation
    setIsTransitioning(true);

    // Transition to conversation state after animation
    setTimeout(() => {
      setUiState('conversation');
      setIsTransitioning(false);
    }, 2200);

    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: msg,
      timestamp: new Date(),
      responseMode: 'inline',
    };

    setMessages((prev) => [...prev, userMessage]);

    // Create loading assistant message
    const loadingMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      responseMode: 'inline',
      isLoading: true,
    };

    setMessages((prev) => [...prev, loadingMessage]);

    // Get mock response
    const mockResponse = getMockResponse(msg, currentGameNodeId || undefined);

    // Simulate assistant response with random 5–7s thinking delay
    const thinkingDelay = 5000 + Math.random() * 2000;
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMessage.id
            ? {
                ...m,
                content: mockResponse.content,
                isLoading: false,
                adaptiveCards: mockResponse.adaptiveCards,
                gameOptions: mockResponse.gameOptions,
                gameNodeId: mockResponse.gameNodeId,
                largeData: mockResponse.largeData,
                suggestedActions: mockResponse.suggestedActions,
                followUpText: mockResponse.followUpText,
                showInDialogForm: mockResponse.showInDialogForm,
                showPopOutForm: mockResponse.showPopOutForm,
                formData: mockResponse.formData,
              }
            : m
        )
      );

      // Update game state if this is a game response
      if (mockResponse.gameNodeId) {
        setCurrentGameNodeId(mockResponse.gameNodeId);
      }

      // Update large data state if this is a large data response
      if (mockResponse.largeData) {
        // Use specific layout if provided, otherwise pick random
        let layout;
        if (mockResponse.largeDataType) {
          layout = LARGE_CARD_LAYOUTS.find(l => l.type === mockResponse.largeDataType);
          // Reset breadcrumbs and show patient header for patient summary
          if (mockResponse.largeDataType === 'patient-summary') {
            setBreadcrumbs(['Patient summary']);
            setShowPatientHeader(true);
            if (mockResponse.patientId) {
              setActivePatientId(mockResponse.patientId);
            }
          }
        }
        if (!layout) {
          layout = LARGE_CARD_LAYOUTS[Math.floor(Math.random() * LARGE_CARD_LAYOUTS.length)];
        }
        setLargeCardLayout(layout);
        setShowLargeData(true);
      }

      // Update pop-out form state if this is a pop-out form response
      if (mockResponse.showPopOutForm && mockResponse.formData) {
        setShowPopOutForm(true);
        setPopOutFormData(mockResponse.formData);
      }
    }, thinkingDelay);
  };

  const handleSelectGameOption = (option: { id: string; text: string; nextNode: string }) => {
    // Add user's choice as a message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: option.text,
      timestamp: new Date(),
      responseMode: 'inline',
    };

    setMessages((prev) => [...prev, userMessage]);

    // Create loading assistant message
    const loadingMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      responseMode: 'inline',
      isLoading: true,
    };

    setMessages((prev) => [...prev, loadingMessage]);

    // Get the next game node
    const nextNode = getGameNode(option.nextNode);

    if (nextNode) {
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingMessage.id
              ? {
                  ...m,
                  content: nextNode.text,
                  isLoading: false,
                  gameOptions: nextNode.options,
                  gameNodeId: nextNode.id,
                }
              : m
          )
        );

        setCurrentGameNodeId(nextNode.id);
      }, 1000);
    }
  };

  const handleSelectSuggestedAction = (action: { id: string; text: string }) => {
    // Submit the suggested action text as if the user typed it
    handleSubmit(action.text);
  };

  const handleSelectSuggestion = (text: string) => {
    handleSubmit(text);
  };

  const handleFormSubmit = (formData: FormData) => {
    console.log('Form submitted:', Object.fromEntries(formData));

    // Close pop-out form if open
    setShowPopOutForm(false);
    setPopOutFormData(null);

    // Create user message showing form was submitted
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: 'Form submitted successfully',
      timestamp: new Date(),
      responseMode: 'inline',
    };

    // Create assistant confirmation
    const confirmMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: 'Thank you! Your form has been submitted.',
      timestamp: new Date(),
      responseMode: 'inline',
    };

    setMessages((prev) => [...prev, userMessage, confirmMessage]);
  };

  const handleFormCancel = () => {
    console.log('Form cancelled');

    // Create user message showing form was cancelled
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: 'Form cancelled',
      timestamp: new Date(),
      responseMode: 'inline',
    };

    setMessages((prev) => [...prev, userMessage]);
  };

  const handleTileClick = (tile: { id: string; type: 'task' | 'appointment' | 'report'; count: number; label: string }) => {
    // Start transition animation
    setIsTransitioning(true);

    // Transition to conversation state after animation
    setTimeout(() => {
      setUiState('conversation');
      setIsTransitioning(false);
    }, 2200);

    // Create user message based on tile
    const tileMessages: Record<string, string> = {
      task: `Show me my ${tile.count} tasks due today`,
      appointment: `Show me my ${tile.count} appointments today`,
      report: `Show me my ${tile.count} reports scheduled for today`,
    };

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: tileMessages[tile.type],
      timestamp: new Date(),
      responseMode: 'inline',
    };

    setMessages((prev) => [...prev, userMessage]);

    // Create loading assistant message
    const loadingMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      responseMode: 'inline',
      isLoading: true,
    };

    setMessages((prev) => [...prev, loadingMessage]);

    // Generate response based on tile type
    const responseMessages: Record<string, string> = {
      task: `Here are your ${tile.count} outstanding tasks due today:`,
      appointment: `Here are your ${tile.count} appointments scheduled for today:`,
      report: `Here are your ${tile.count} reports scheduled for today:`,
    };

    const adaptiveCardTypes: Record<string, string> = {
      task: 'task-list',
      appointment: 'appointment-list',
      report: 'report-list',
    };

    // Suggested actions for each tile type
    const suggestedActionsMap: Record<string, { id: string; text: string }[]> = {
      task: [
        { id: 'reschedule-tasks', text: 'Reschedule overdue tasks' },
        { id: 'mark-complete', text: 'Mark first 3 as complete' },
        { id: 'delegate-tasks', text: 'Suggest delegation options' },
      ],
      appointment: [
        { id: 'prep-meetings', text: 'Prepare meeting briefs' },
        { id: 'send-reminders', text: 'Send reminders to attendees' },
        { id: 'review-conflicts', text: 'Check for schedule conflicts' },
      ],
      report: [
        { id: 'generate-drafts', text: 'Generate draft summaries' },
        { id: 'gather-data', text: 'Gather required data' },
        { id: 'review-templates', text: 'Review report templates' },
      ],
    };

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMessage.id
            ? {
                ...m,
                content: responseMessages[tile.type],
                isLoading: false,
                adaptiveCards: [
                  {
                    id: `card-${Date.now()}`,
                    type: adaptiveCardTypes[tile.type],
                    data: { count: tile.count },
                  },
                ],
                suggestedActions: suggestedActionsMap[tile.type],
              }
            : m
        )
      );
    }, 1500);
  };

  const handleCloseLargeData = () => {
    // Store the context for reopening
    if (largeCardLayout) {
      setClosedLargeDataContext({
        layout: largeCardLayout,
        messageContent: 'Large data view has been closed.',
      });
    }

    // Close the large data view
    setShowLargeData(false);

    // Add system message to conversation
    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      role: 'assistant',
      content: 'Large data view has been closed.',
      timestamp: new Date(),
      responseMode: 'inline',
      adaptiveCards: [
        {
          id: `reopen-${Date.now()}`,
          type: 'reopen-prompt',
          data: {},
        },
      ],
    };

    setMessages((prev) => [...prev, systemMessage]);

    // Reset breadcrumbs and patient header
    setBreadcrumbs(['Patient summary']);
    setShowPatientHeader(false);
  };

  const handleReopenLargeData = () => {
    if (closedLargeDataContext) {
      setLargeCardLayout(closedLargeDataContext.layout);
      setShowLargeData(true);
      setClosedLargeDataContext(null);
    }
  };

  const handleHomeClick = () => {
    // Save current chat if there are messages
    if (messages.length > 0) {
      saveCurrentChat(messages, currentGameNodeId);
    }

    // Reset to landing state
    setUiState('landing');
    setMessages([]);
    setCurrentGameNodeId(null);
    setShowLargeData(false);
    setLargeCardLayout(null);
    setClosedLargeDataContext(null);
    setShowPatientHeader(false);
  };

  const handleNewChat = () => {
    // Save current chat if there are messages
    if (messages.length > 0) {
      saveCurrentChat(messages, currentGameNodeId);
    }

    // Clear messages and game state but stay in conversation view
    setMessages([]);
    setCurrentGameNodeId(null);
    setShowLargeData(false);
    setLargeCardLayout(null);
    setClosedLargeDataContext(null);
    setBreadcrumbs(['Patient summary']);
    setShowPatientHeader(false);

    // Transition back to landing for a clean start
    setUiState('landing');
  };

  const handleWidgetClick = (widgetTitle: string) => {
    // Add widget title to breadcrumbs
    setBreadcrumbs(prev => [...prev, widgetTitle]);

    // Pick a random layout for the widget content
    const randomLayout = LARGE_CARD_LAYOUTS[Math.floor(Math.random() * (LARGE_CARD_LAYOUTS.length - 1))]; // Exclude patient-summary
    setLargeCardLayout(randomLayout);
  };

  const handleBreadcrumbNavigate = (index: number) => {
    // Navigate to the clicked breadcrumb level
    setBreadcrumbs(prev => prev.slice(0, index + 1));

    // If navigating back to root (Patient summary), show patient summary
    if (index === 0) {
      setLargeCardLayout(LARGE_CARD_LAYOUTS.find(l => l.type === 'patient-summary') || LARGE_CARD_LAYOUTS[0]);
    }
  };

  const unreadNotificationCount = useMemo(() => getMockNotifications().filter(n => !n.isRead).length, []);

  return (
    <main className="h-screen bg-background-soft">
      <div className="flex h-full">
        {/* Fixed Sidebar — hidden in focus mode */}
        <AnimatePresence>
          {!isFocusMode && (
            <motion.div
              key="sidebar"
              initial={{ opacity: 0, x: -64 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -64 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <Sidebar
                onHomeClick={handleHomeClick}
                onHelpClick={handleThemeCycle}
                onChatHistoryClick={handleChatHistoryClick}
                onNotificationsClick={handleNotificationsClick}
                onSearchClick={() => setIsFocusMode(true)}
                chatHistoryButtonRef={chatHistoryButtonRef}
                notificationsButtonRef={notificationsButtonRef}
                isOnHome={uiState === 'landing'}
                unreadNotificationCount={unreadNotificationCount}
                activePopover={activePopover}
                isFocusMode={isFocusMode}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat History Popover */}
        <ChatHistoryPopover
          isOpen={activePopover === 'chatHistory'}
          onClose={() => setActivePopover(null)}
          buttonRef={chatHistoryButtonRef}
          onSelectChat={handleSelectChat}
        />

        {/* Notifications Popover */}
        <NotificationsPopover
          isOpen={activePopover === 'notifications'}
          onClose={() => setActivePopover(null)}
          buttonRef={notificationsButtonRef}
          onSelectNotification={handleSelectNotification}
        />

        {/* New Chat Button is now inside dialog container for both views */}

        {/* Main Content Area */}
        <section className={`flex-1 transition-[margin] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isFocusMode ? 'ml-0' : 'ml-16'}`}>
          <div className="h-full p-6">
            <div className="h-full flex gap-6" style={{ flexDirection: isLayoutSwapped ? 'row-reverse' : 'row' }}>
              <AnimatePresence>
                {/* Large Data Panel - Appears on left (or right if swapped) when active */}
                {showLargeData && largeCardLayout && (
                  <motion.div
                    key="large-data-panel"
                    initial={{ opacity: 0, flexGrow: 0, flexBasis: 0 }}
                    animate={{ opacity: 1, flexGrow: 2, flexBasis: 0 }}
                    exit={{ opacity: 0, flexGrow: 0, flexBasis: 0 }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full"
                    style={{ minWidth: 0 }}
                  >
                    {/* Adaptive Card Container - Full height with flex layout */}
                    <div ref={largeDataContainerRef} className="h-full bg-background border border-border rounded-[12px] overflow-hidden flex flex-col">
                      {/* Sticky Header */}
                      <div className="flex-shrink-0 px-6 pt-6 pb-6 bg-background">
                        <div className="flex items-center justify-between mb-3">
                          {/* Conditional Header: Breadcrumb for patient summary, "Large data" for others */}
                          {showPatientHeader ? (
                            <Breadcrumb
                              items={breadcrumbs}
                              onNavigate={handleBreadcrumbNavigate}
                            />
                          ) : (
                            <h2 className="text-xl font-semibold text-text-primary">Large data</h2>
                          )}

                          {/* Action buttons */}
                          <div className="flex items-center gap-2">
                            {/* Care mode toggle */}
                            <button
                              onClick={() => {
                                const next = careMode === 'primary' ? 'urgent' : 'primary';
                                setCareMode(next);
                                if (next === 'urgent') setActivePatientId('PT-10003');
                                else setActivePatientId('PT-10002');
                              }}
                              className={`w-10 h-10 border rounded-lg flex items-center justify-center transition-colors shadow-sm cursor-pointer text-xs font-semibold ${careMode === 'urgent' ? 'bg-primary-main text-primary-contrast border-primary-main' : 'bg-background border-border text-text-secondary hover:bg-hover'}`}
                              aria-label="Toggle care mode"
                              title={careMode === 'primary' ? 'Switch to urgent care view' : 'Switch to primary care view'}
                            >
                              {careMode === 'urgent' ? 'UC' : 'PC'}
                            </button>
                            {showPatientHeader && (
                              <button
                                onClick={() => setActivePatientId(id => id === 'PT-10002' ? 'PT-10001' : 'PT-10002')}
                                className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center hover:bg-hover transition-colors shadow-sm cursor-pointer"
                                aria-label="Switch patient"
                              >
                                <div className="w-4 h-4 border border-border rounded" />
                              </button>
                            )}

                            {/* Close button */}
                            <button
                              onClick={handleCloseLargeData}
                              className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center hover:bg-hover transition-colors shadow-sm text-text-secondary hover:text-text-primary cursor-pointer"
                              aria-label="Close large data view"
                            >
                              <CloseXIcon size={20} />
                            </button>
                          </div>
                        </div>
                        {/* Breaker line */}
                        <div className="border-t border-border"></div>
                      </div>

                      {/* Scrollable Content */}
                      <div className={`flex-1 overflow-y-auto conversation-scroll${largeCardLayout.type === 'patient-summary' ? ' flex flex-col' : ''}`} style={{ scrollbarGutter: 'stable' }}>
                        <div className={`px-6${largeCardLayout.type === 'patient-summary' ? ' flex-1 flex flex-col' : ''}`}>
                          {/* Patient Banner — sticky inside scroll container so it shares the same width as the widgets */}
                          {showPatientHeader && (
                            <div className="sticky top-0 z-10 bg-background pb-6">
                              <PatientHeader activePatientId={activePatientId} />
                            </div>
                          )}

                          {/* Main Content Area */}
                          <div className={largeCardLayout.type === 'patient-summary' ? 'flex-1 flex flex-col pb-6' : 'pb-6'}>
                            {largeCardLayout.type === 'table' && <TableCard />}
                            {largeCardLayout.type === 'dashboard' && <DashboardCard />}
                            {largeCardLayout.type === 'document' && <DocumentCard />}
                            {largeCardLayout.type === 'grid' && <GridCard />}
                            {largeCardLayout.type === 'calendar' && <CalendarCard />}
                            {largeCardLayout.type === 'kanban' && <KanbanCard />}
                            {largeCardLayout.type === 'analytics' && <AnalyticsCard />}
                            {largeCardLayout.type === 'patient-summary' && (
                              <PatientSummaryCard onWidgetClick={handleWidgetClick} activePatientId={activePatientId} className="flex-1" careMode={careMode} />
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dialog Container — hidden in focus mode */}
              <AnimatePresence>
              {!isFocusMode && (
              <motion.div
                key="dialog-container"
                initial={{ opacity: 0, flexGrow: 0, flexBasis: 0, width: 0 }}
                animate={{ opacity: 1, flexGrow: 1, flexBasis: 0, width: 'auto' }}
                exit={{ opacity: 0, flexGrow: 0, flexBasis: 0, width: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="h-full bg-background border border-border rounded-[12px] overflow-hidden"
                style={{ minWidth: 0 }}
              >
            {/* STATE 1: LANDING STATE */}
            {uiState === 'landing' && (
              <div className="h-full flex flex-col items-center justify-center p-6 relative">
                <div className="w-full max-w-[800px]">
                  {/* Hero Section with staggered internal animation */}
                  <motion.div
                    animate={{
                      opacity: isTransitioning ? 0 : 1,
                      y: isTransitioning ? -20 : 0
                    }}
                    transition={{
                      duration: 0.5,
                      delay: isTransitioning ? 0.35 : 0,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                  >
                    <ConversationHero skipAnimation={isTransitioning} />
                  </motion.div>

                  {/* Prompt Input - Entrance animation + transition animation */}
                  <motion.div
                    className="mt-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: isTransitioning ? 'calc(50vh - 120px)' : 0
                    }}
                    transition={
                      isTransitioning
                        ? {
                            duration: 1.2,
                            delay: 1.0,
                            ease: [0.4, 0, 0.2, 1]
                          }
                        : {
                            duration: 0.4,
                            delay: 0.5,
                            ease: [0.4, 0, 0.2, 1]
                          }
                    }
                  >
                    <PromptInput onSubmit={handleSubmit} />
                  </motion.div>

                  {/* Two-column layout: Action Tiles + Suggested Prompts */}
                  <motion.div
                    className="mt-6 grid gap-6"
                    style={{ gridTemplateColumns: '1fr 2fr' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: isTransitioning ? 0 : 1,
                      y: isTransitioning ? 0 : 0
                    }}
                    transition={
                      isTransitioning
                        ? {
                            duration: 0.3,
                            delay: 0,
                            ease: [0.4, 0, 0.2, 1]
                          }
                        : {
                            duration: 0.4,
                            delay: 0.7,
                            ease: [0.4, 0, 0.2, 1]
                          }
                    }
                  >
                    {/* Left column: Action Tiles (1/3 width) */}
                    <div>
                      <h3 className="text-sm font-medium text-text-primary mb-3">Today's activities:</h3>
                      <ActionTiles onTileClick={handleTileClick} />
                    </div>

                    {/* Right column: Suggested Prompts (2/3 width) */}
                    <div>
                      <h3 className="text-sm font-medium text-text-primary mb-3">Suggested prompts:</h3>
                      <PromptSuggestions
                        suggestions={DEFAULT_SUGGESTIONS}
                        onSelectSuggestion={handleSelectSuggestion}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* STATE 2: ACTIVE CONVERSATION STATE */}
            {uiState === 'conversation' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="h-full flex flex-col"
              >
                {/* Header with New Chat button (and Swap button in large data view) */}
                <div className="flex-shrink-0 px-6 pt-6 pb-4 flex items-center justify-end gap-2">
                  {showLargeData && (
                    <button
                      onClick={handleSwapLayout}
                      className="w-10 h-10 flex items-center justify-center bg-background border border-border rounded-lg hover:bg-hover transition-colors shadow-sm cursor-pointer"
                      aria-label="Swap layout"
                    >
                      <SwapHorizontalIcon size={20} className="text-text-secondary" />
                    </button>
                  )}
                  <button
                    onClick={handleNewChat}
                    className="h-10 px-4 flex items-center gap-2 bg-background border border-border rounded-lg hover:bg-hover transition-colors shadow-sm cursor-pointer"
                  >
                    <NewChatIcon size={20} className="text-text-secondary" />
                    <span className="text-sm font-medium text-text-primary">New chat</span>
                  </button>
                </div>

                {/* Scrollable Conversation Thread */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto px-6 scroll-smooth conversation-scroll"
                  style={{ paddingTop: '0px' }}
                >
                  <div className="max-w-[800px] mx-auto">
                    <ConversationThread
                      messages={messages}
                      onSelectGameOption={handleSelectGameOption}
                      onSelectSuggestedAction={handleSelectSuggestedAction}
                      onReopenLargeData={handleReopenLargeData}
                      onFormSubmit={handleFormSubmit}
                      onFormCancel={handleFormCancel}
                      removeFirstMessageTopPadding={showLargeData}
                    />
                  </div>
                </div>

                {/* Fixed Input at Bottom */}
                <div className="pb-6 pt-6 px-6 bg-background">
                  <div className="max-w-[800px] mx-auto">
                    {/* Breaker line */}
                    <div className="border-t border-border mb-6"></div>

                    <div>
                      <PromptInput onSubmit={handleSubmit} autoFocus={true} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            </motion.div>
              )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>

      {/* Theme Toast Notification */}
      <ThemeToast
        themeName={currentThemeName}
        isVisible={showThemeToast}
        onClose={() => setShowThemeToast(false)}
      />

      {/* Pop-Out Form */}
      {showPopOutForm && popOutFormData && (
        <PopOutForm
          formId={popOutFormData.formId || `FORM-${Date.now()}`}
          title={popOutFormData.title}
          subtitle={popOutFormData.subtitle}
          isOpen={showPopOutForm}
          onClose={() => {
            setShowPopOutForm(false);
            setPopOutFormData(null);
          }}
          onSubmit={handleFormSubmit}
          containerRef={largeDataContainerRef}
        >
          <TextInput label="Patient Name" name="patient_name" required />
          <TextInput label="Date of Birth" name="dob" type="text" required />
          <Select
            label="Gender"
            name="gender"
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
            required
          />
          <TextInput label="Contact Number" name="contact" type="tel" />
          <TextInput label="Email Address" name="email" type="email" />
          <Select
            label="Preferred Contact Method"
            name="contact_method"
            options={[
              { value: 'phone', label: 'Phone' },
              { value: 'email', label: 'Email' },
              { value: 'sms', label: 'SMS' },
            ]}
          />
          <TextArea label="Medical History" name="medical_history" rows={4} />
          <TextArea label="Current Medications" name="medications" rows={3} />
          <TextArea label="Notes" name="notes" rows={3} />
        </PopOutForm>
      )}
    </main>
  );
}
