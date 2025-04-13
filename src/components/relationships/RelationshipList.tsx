'use client';

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { getRelationships, deleteRelationship, Relationship } from '@/utils/localStorage';
import AddRelationshipModal from '@/components/relationships/AddRelationshipModal';
import EditRelationshipModal from '@/components/relationships/EditRelationshipModal';

export default function RelationshipList() {
  // Using React namespace to avoid TypeScript errors
  const [relationships, setRelationships] = React.useState<Relationship[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingRelationship, setEditingRelationship] = React.useState<Relationship | null>(null);

  const fetchRelationships = React.useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const data = getRelationships();
      setRelationships(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load relationships. Please try again.');
      setLoading(false);
      console.error('Error fetching relationships:', err);
    }
  }, []);

  React.useEffect(() => {
    fetchRelationships();
  }, [fetchRelationships]);

  const handleRelationshipAdded = () => {
    fetchRelationships();
    setIsAddModalOpen(false);
  };

  const handleRelationshipUpdated = () => {
    fetchRelationships();
    setEditingRelationship(null);
  };

  const handleEditRelationship = (relationship: Relationship) => {
    setEditingRelationship(relationship);
  };

  const handleDeleteRelationship = (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this relationship? This will remove the relationship association from all events, but the events will still remain.');
    
    if (confirmDelete) {
      try {
        deleteRelationship(id);
        fetchRelationships();
      } catch (err) {
        setError('Failed to delete relationship. Please try again.');
        console.error('Error deleting relationship:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (relationships.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No relationships found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new relationship.</p>
        <div className="mt-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Relationship
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relationships.map((relationship) => (
          <div
            key={relationship._id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-5">
              <h3 className="font-semibold text-xl text-gray-900 mb-2">{relationship.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {relationship.description || 'No description provided'}
              </p>
              <div className="mb-4">
                {relationship.startDate && (
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Started: {format(new Date(relationship.startDate), 'MMM d, yyyy')}
                  </div>
                )}
                
                {relationship.endDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Ended: {format(new Date(relationship.endDate), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  Created {format(new Date(relationship.createdAt), 'MMM d, yyyy')}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditRelationship(relationship)}
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteRelationship(relationship._id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
              <Link
                href={`/timeline?relationshipId=${relationship._id}`}
                className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
              >
                View Timeline
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Relationship Modal */}
      <AddRelationshipModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRelationshipAdded={handleRelationshipAdded}
      />
      
      {/* Edit Relationship Modal */}
      {editingRelationship && (
        <EditRelationshipModal
          isOpen={!!editingRelationship}
          onClose={() => setEditingRelationship(null)}
          onRelationshipUpdated={handleRelationshipUpdated}
          relationship={editingRelationship}
        />
      )}
    </div>
  );
} 