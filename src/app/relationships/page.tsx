import React from 'react';
import RelationshipList from '@/components/relationships/RelationshipList';

export default function RelationshipsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Relationships</h1>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Manage your relationships and view their timelines.
        </p>
      </div>
      <RelationshipList />
    </div>
  );
} 