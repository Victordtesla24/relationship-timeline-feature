import ExportContent from '@/components/export/ExportContent';

export const metadata = {
  title: 'Export Timeline | Relationship Timeline App',
  description: 'Export your relationship timeline as PDF or Word document',
};

export default function ExportPage() {
  return (
    <div>
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-3xl font-bold">Export Timeline</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-6 text-gray-600">
            Export your relationship timeline as a PDF or Word document for offline reference.
          </p>
          
          <ExportContent />
        </div>
      </main>
    </div>
  );
}