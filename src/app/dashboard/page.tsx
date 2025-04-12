import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TimelineSummary from '@/components/dashboard/TimelineSummary';
import RecentActivity from '@/components/dashboard/RecentActivity';

export const metadata = {
  title: 'Dashboard | Relationship Timeline App',
  description: 'View and manage your relationship timeline',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <TimelineSummary />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
} 