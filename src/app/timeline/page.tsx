import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Timeline from '@/components/timeline/Timeline';
import TimelineControls from '@/components/timeline/TimelineControls';

export const metadata = {
  title: 'Timeline | Relationship Timeline App',
  description: 'View and manage your relationship timeline',
};

export default async function TimelinePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-3xl font-bold">Relationship Timeline</h1>
          <TimelineControls />
        </div>
        
        <Timeline />
      </main>
    </div>
  );
} 