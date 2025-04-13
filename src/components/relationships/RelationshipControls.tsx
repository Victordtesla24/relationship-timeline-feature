'use client';

import React from 'react';
import AddRelationshipModal from '@/components/relationships/AddRelationshipModal';

export default function RelationshipControls() {
  const [isAddRelationshipModalOpen, setIsAddRelationshipModalOpen] = React.useState(false);

  const handleAddRelationship = () => {
    setIsAddRelationshipModalOpen(true);
  };

  const handleRelationshipAdded = () => {
    setIsAddRelationshipModalOpen(false);
    // Refresh the relationships list
    window.location.reload();
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 animate-slide-in-right">
      <button
        onClick={handleAddRelationship}
        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Relationship
      </button>
      
      <AddRelationshipModal
        isOpen={isAddRelationshipModalOpen}
        onClose={() => setIsAddRelationshipModalOpen(false)}
        onRelationshipAdded={handleRelationshipAdded}
      />
    </div>
  );
} 