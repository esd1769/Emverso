'use client'

import React, { useEffect, useState } from 'react'
import CompanionsList from '@/app/companions/CompanionsList'
import { getUserSessions } from '@/lib/actions/companion.actions'
import { useRouter, usePathname } from 'next/navigation'

interface UserSessionsListProps {
  initialSessions: any[]
  title: string
  userId: string
}

const UserSessionsList = ({
  initialSessions,
  title,
  userId
}: UserSessionsListProps) => {
  const [sessions, setSessions] = useState(initialSessions)
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  // Refresh sessions when component mounts or when returning to the page
  useEffect(() => {
    const refreshSessions = async () => {
      // Only refresh if we're on the my-journey page
      if (pathname === '/my-journey' && userId) {
        try {
          setIsLoading(true)
          const updatedSessions = await getUserSessions(userId)
          setSessions(updatedSessions)
          
          // Clear the session completed flag after refreshing
          if (typeof window !== 'undefined' && sessionStorage.getItem('sessionCompleted')) {
            sessionStorage.removeItem('sessionCompleted')
          }
        } catch (error) {
          console.error('Failed to refresh user sessions:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    // Add event listener for when the page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshSessions()
      }
    }
    
    // Check if we just completed a session
    if (typeof window !== 'undefined' && sessionStorage.getItem('sessionCompleted')) {
      refreshSessions()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Initial fetch when component mounts
    refreshSessions()

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [pathname, userId])

  return (
    <div className={isLoading ? 'opacity-70 transition-opacity' : ''}>
      <CompanionsList 
        title={title} 
        companions={sessions} 
      />
    </div>
  )
}

export default UserSessionsList