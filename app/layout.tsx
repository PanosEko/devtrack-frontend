import './globals.css'
import type { Metadata } from 'next'
import AddTaskModal from "@/components/AddTaskModal";
import React from "react";

export const metadata: Metadata = {
  title: 'DevTrack',
  description: 'Created by PanosEko',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      {children}
      <AddTaskModal />
      </body>
    </html>
  )
}
