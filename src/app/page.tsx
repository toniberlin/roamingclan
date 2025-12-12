'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Button } from '@/components/ui';

export default function Home() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleCreateTrip = () => {
    setIsCreating(true);
    router.push('/create-trip');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-16">
        <div className="text-center animate-fade-in">
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-gradient mb-6">
              Ready to Lead Your Next Adventure?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Create amazing trips and connect with fellow travelers who share your passion for exploration.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleCreateTrip}
                disabled={isCreating}
                loading={isCreating}
                size="lg"
                className="shadow-gradient"
              >
                CREATE A TRIP
              </Button>
              
              <Button
                onClick={() => router.push('/trips')}
                size="lg"
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                BROWSE TRIPS
              </Button>
            </div>
            
            <p className="text-sm text-gray-500">
              Start your journey as a trip leader or discover amazing adventures
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}