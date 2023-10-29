import './globals.css'
import type { Metadata } from 'next'
import Modal from "@/components/Modal";
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
      <Modal />
      </body>
    </html>
  )
}
