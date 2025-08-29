'use client'

import React, { useEffect, useState } from 'react'
import CompanionsList from '@/app/companions/CompanionsList'
import { getUserCompanions } from '@/lib/actions/companion.actions'
import { usePathname } from 'next/navigation'

interface UserCompanionsListProps {
  initialCompanions: any[]
  title: string
  userId: string
}

const UserCompanionsList = ({
  initialCompanions,
  title,
  userId
}: UserCompanionsListProps) => {
  const [companions, setCompanions] = useState(initialCompanions)
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  // Refresh companions when component mounts or when returning to the page
  useEffect(() => {
    const refreshCompanions = async () => {
      // Only refresh if we're on the my-journey page
      if (pathname === '/my-journey' && userId) {
        try {
          setIsLoading(true)
          const updatedCompanions = await getUserCompanions(userId)
          setCompanions(updatedCompanions)
        } catch (error) {
          console.error('Failed to refresh user companions:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    // Add event listener for when the page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshCompanions()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Initial fetch when component mounts
    refreshCompanions()

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [pathname, userId])

  return (
    <div className={isLoading ? 'opacity-70 transition-opacity' : ''}>
      <CompanionsList 
        title={title} 
        companions={companions} 
      />
    </div>
  )
}

export default UserCompanionsList