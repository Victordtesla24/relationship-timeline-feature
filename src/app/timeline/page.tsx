import Timeline from '@/components/timeline/Timeline';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TimelineControls from '@/components/timeline/TimelineControls';

export const metadata = {
  title: 'Timeline | Relationship Timeline App',
  description: 'View and manage your relationship timeline',
};

// Define the page props according to Next.js App Router specification
type Props = {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function TimelinePage({ searchParams }: Props) {
  // Extract relationshipId from query parameters - properly type cast it for TypeScript
  const relationshipId = typeof searchParams.relationshipId === 'string' 
    ? searchParams.relationshipId 
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-primary-50">
      <DashboardHeader title="Relationship Timeline" />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent mb-6 sm:mb-0 animate-slide-in-left">
            Relationship Timeline
          </h1>
          <div className="animate-slide-in-right">
            <TimelineControls relationshipId={relationshipId} />
          </div>
        </div>
        
        <Timeline relationshipId={relationshipId} />
      </main>
    </div>
  );
} 