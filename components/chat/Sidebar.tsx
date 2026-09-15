'use client';

import {
  BrandMark,
  IQIcon,
  HomeIcon,
  ChatHistoryIcon,
  SearchIcon,
  NotificationIcon,
  HelpIcon,
  SettingsIcon
} from '@/components/icons';
import { SidebarItem } from './SidebarItem';
import { Avatar } from '@/components/ui';

interface SidebarProps {
  onHomeClick?: () => void;
  onHelpClick?: () => void;
  onChatHistoryClick?: () => void;
  onNotificationsClick?: () => void;
  onSearchClick?: () => void;
  chatHistoryButtonRef?: React.RefObject<HTMLButtonElement>;
  notificationsButtonRef?: React.RefObject<HTMLButtonElement>;
  isOnHome?: boolean;
  unreadNotificationCount?: number;
  activePopover?: 'chatHistory' | 'notifications' | null;
  isFocusMode?: boolean;
}

export function Sidebar({ onHomeClick, onHelpClick, onChatHistoryClick, onNotificationsClick, onSearchClick, chatHistoryButtonRef, notificationsButtonRef, isOnHome = true, unreadNotificationCount = 0, activePopover, isFocusMode = false }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-background border-r border-border flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="mb-8">
        <BrandMark size={32} />
      </div>

      {/* Main Navigation - Top */}
      <nav className="flex flex-col gap-2 flex-1">
        <SidebarItem icon={HomeIcon} label="Home" active={isOnHome} onClick={onHomeClick} />
        <SidebarItem
          ref={chatHistoryButtonRef}
          icon={ChatHistoryIcon}
          label="Chat History"
          onClick={onChatHistoryClick}
          disableTooltip={activePopover === 'chatHistory'}
        />
      </nav>

      {/* Bottom Utility Icons */}
      <div className="flex flex-col gap-2 mt-auto">
        <SidebarItem icon={SearchIcon} label="Search" onClick={onSearchClick} active={isFocusMode} />
        <SidebarItem
          ref={notificationsButtonRef}
          icon={NotificationIcon}
          label="Notifications"
          onClick={onNotificationsClick}
          badge={unreadNotificationCount}
          disableTooltip={activePopover === 'notifications'}
        />
        <SidebarItem icon={HelpIcon} label="Help" onClick={onHelpClick} />
        <SidebarItem icon={SettingsIcon} label="Settings" />
      </div>

      {/* User Avatar */}
      <div className="mt-4">
        <Avatar initials="LH" variant="accent1" size={36} />
      </div>
    </aside>
  );
}
