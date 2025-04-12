import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      <main className="flex-grow">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col items-center text-center mb-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Relationship Timeline
              </h1>
              <div className="w-24 h-1 bg-primary-600 mb-8"></div>
              <p className="text-xl text-gray-600 max-w-2xl">
                Document, organize, and share your relationship timeline with professional support from your legal counsel.
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary-100 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Chronological Events</h3>
                  </div>
                  <p className="text-gray-600">
                    Create a precise timeline of your relationship history with important dates and events.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary-100 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Media Documentation</h3>
                  </div>
                  <p className="text-gray-600">
                    Upload photos and documents to support each event with concrete evidence and context.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary-100 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Legal Collaboration</h3>
                  </div>
                  <p className="text-gray-600">
                    Share your timeline with your legal counsel for professional advice and documentation.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary-100 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Professional Export</h3>
                  </div>
                  <p className="text-gray-600">
                    Export your timeline as a PDF or Word document for official records and legal proceedings.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 flex justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-6 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">Relationship Timeline</h2>
            </div>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-800 pt-4 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Relationship Timeline App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 