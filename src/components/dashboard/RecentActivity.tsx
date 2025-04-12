'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Activity {
  _id: string;
  title: string;
  date: string;
  type: 'event_created' | 'event_updated' | 'event_deleted';
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchActivities() {
      try {
        // In a real app, this would fetch actual recent activities
        // Simulating recent activities for demo purposes
        const mockActivities = [
          {
            _id: '1',
            title: 'First Meeting',
            date: new Date().toISOString(),
            type: 'event_created' as const
          },
          {
            _id: '2',
            title: 'Important Discussion',
            date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            type: 'event_updated' as const
          }
        ];
        
        // Simulate API call delay
        setTimeout(() => {
          setActivities(mockActivities);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching activities', error);
        setIsLoading(false);
      }
    }
    
    fetchActivities();
  }, []);
  
  function getActivityIcon(type: Activity['type']) {
    switch (type) {
      case 'event_created':
        return <span className="text-green-500">+</span>;
      case 'event_updated':
        return <span className="text-blue-500">↻</span>;
      case 'event_deleted':
        return <span className="text-red-500">×</span>;
      default:
        return null;
    }
  }
  
  function getActivityText(type: Activity['type']) {
    switch (type) {
      case 'event_created':
        return 'added to timeline';
      case 'event_updated':
        return 'updated';
      case 'event_deleted':
        return 'removed from timeline';
      default:
        return '';
    }
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      
      {isLoading ? (
        <div className="space-y-3">
          <div className="animate-pulse h-12 bg-gray-100 rounded"></div>
          <div className="animate-pulse h-12 bg-gray-100 rounded"></div>
        </div>
      ) : activities.length > 0 ? (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li key={activity._id} className="border-b pb-2">
              <div className="flex items-center">
                <div className="mr-2 text-xl">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-500">
                    {getActivityText(activity.type)} • {format(new Date(activity.date), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-4">No recent activity</p>
      )}
      
      <Link 
        href="/timeline" 
        className="text-primary-600 hover:text-primary-700 text-sm mt-4 block text-right"
      >
        View All →
      </Link>
    </div>
  );
} 