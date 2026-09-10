"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Bell, X } from "lucide-react"

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

interface NotificationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  notifications?: NotificationItem[]
  className?: string
}

function NotificationPanel({
  open,
  onOpenChange,
  notifications = [],
  className,
}: NotificationPanelProps) {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className={cn(
          "w-96 max-w-[calc(100vw-2rem)] bg-black border-[#DDBA5E]/20 text-white p-0",
          className
        )}
      >
        <SheetHeader className="flex flex-row items-center justify-between p-4 border-b border-[#DDBA5E]/20">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-white font-[Arial] text-lg">
              Notifications
            </SheetTitle>
            {unreadCount > 0 && (
              <span className="flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-[#DDBA5E] text-black text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
            className="text-white hover:text-[#DDBA5E]"
          >
            <X />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>

        <SheetDescription className="sr-only">
          Notification panel
        </SheetDescription>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Bell className="size-10 mb-3 opacity-40" />
              <p className="font-[Arial] text-sm">No notifications yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#DDBA5E]/10">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={cn(
                    "p-4 transition-colors hover:bg-white/5 cursor-pointer",
                    !notification.read && "bg-[#DDBA5E]/5"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={cn(
                        "font-[Arial] text-sm font-medium",
                        notification.read ? "text-gray-300" : "text-white"
                      )}
                    >
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="mt-1 size-2 shrink-0 rounded-full bg-[#DDBA5E]" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-400 font-[Arial] line-clamp-2">
                    {notification.message}
                  </p>
                  <span className="mt-2 block text-[11px] text-gray-500 font-[Arial]">
                    {notification.time}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { NotificationPanel, type NotificationItem, type NotificationPanelProps }
