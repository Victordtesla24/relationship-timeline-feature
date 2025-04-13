import ExportContent from '@/components/export/ExportContent';
import Link from 'next/link';

export const metadata = {
  title: 'Export Timeline | Relationship Timeline App',
  description: 'Export your relationship timeline as PDF or Word document',
};

export default function ExportPage() {
  return (
    <div>
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero header with gradient background */}
        <div className="relative mb-10 px-6 py-8 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 shadow-lg overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 20 L40 20 M20 0 L20 40" stroke="white" strokeWidth="1" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pattern)" />
            </svg>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Export Timeline</h1>
              <p className="text-primary-100 text-lg">Create documents of your special moments</p>
            </div>
            
            <Link 
              href="/timeline" 
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-white text-primary-600 font-medium rounded-lg shadow-md hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Timeline
            </Link>
          </div>
        </div>
        
        <p className="text-lg text-gray-600 mb-8 max-w-3xl">
          Create a beautifully formatted document of your relationship timeline to save, print, or share with others. Choose your preferred format and customize the content to include.
        </p>
        
        <ExportContent />
      </main>
    </div>
  );
}