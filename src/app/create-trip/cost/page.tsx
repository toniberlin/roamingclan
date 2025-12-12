'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CostItem {
  id: string;
  name: string;
  amount: number;
}

export default function CostCalculator() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    minTripMates: 2,
    maxTripMates: 4,
    currency: 'EUR',
    buffer: 0,
    yourFee: 0,
    calculatorEnabled: true
  });

  const [accommodation, setAccommodation] = useState<CostItem[]>([]);
  const [transportation, setTransportation] = useState<CostItem[]>([]);
  const [activities, setActivities] = useState<CostItem[]>([]);

  const addCostItem = (category: 'accommodation' | 'transportation' | 'activities', name: string, amount: number) => {
    const newItem: CostItem = {
      id: Date.now().toString(),
      name,
      amount
    };

    switch (category) {
      case 'accommodation':
        setAccommodation([...accommodation, newItem]);
        break;
      case 'transportation':
        setTransportation([...transportation, newItem]);
        break;
      case 'activities':
        setActivities([...activities, newItem]);
        break;
    }
  };

  const removeCostItem = (category: 'accommodation' | 'transportation' | 'activities', id: string) => {
    switch (category) {
      case 'accommodation':
        setAccommodation(accommodation.filter(item => item.id !== id));
        break;
      case 'transportation':
        setTransportation(transportation.filter(item => item.id !== id));
        break;
      case 'activities':
        setActivities(activities.filter(item => item.id !== id));
        break;
    }
  };

  const calculateTotal = () => {
    const accommodationTotal = accommodation.reduce((sum, item) => sum + item.amount, 0);
    const transportationTotal = transportation.reduce((sum, item) => sum + item.amount, 0);
    const activitiesTotal = activities.reduce((sum, item) => sum + item.amount, 0);
    
    const subtotal = accommodationTotal + transportationTotal + activitiesTotal;
    const bufferAmount = (subtotal * formData.buffer) / 100;
    const total = subtotal + bufferAmount + formData.yourFee;
    
    return total;
  };

  const handleNext = () => {
    console.log('Cost Calculator Data:', {
      formData,
      accommodation,
      transportation,
      activities,
      total: calculateTotal()
    });
    router.push('/create-trip/submit');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
            <h1 className="text-2xl font-bold">
              <span className="text-blue-600">ROAMING</span>{' '}
              <span className="text-teal-600">CLAN</span>
            </h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
                JOIN A TRIP
              </Link>
              <a href="/create-trip" className="text-gray-700 hover:text-gray-900 font-medium">
                LEAD A TRIP
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
                HOW IT WORKS
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">EN</span>
                <span className="text-sm text-gray-600">€ EUR</span>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Number of TripMates */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Number of TripMates</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, minTripMates: Math.max(1, prev.minTripMates - 1) }))}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{formData.minTripMates}</span>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, minTripMates: prev.minTripMates + 1 }))}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, maxTripMates: Math.max(prev.minTripMates, prev.maxTripMates - 1) }))}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{formData.maxTripMates}</span>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, maxTripMates: prev.maxTripMates + 1 }))}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cost per TripMate */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost per TripMate</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency (EUR)</label>
              <div className="flex items-center">
                <span className="text-lg font-semibold mr-2">€</span>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Keep in mind cost of accommodation + local transport + any other activities if applicable. Exclude flight costs to/from the destination.
            </p>
          </div>

          {/* Cost Calculator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Cost calculator</h3>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">RESET</a>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.calculatorEnabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, calculatorEnabled: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.calculatorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.calculatorEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </div>
                </label>
              </div>
            </div>

            {/* Accommodation */}
            <CostSection
              title="Accommodation (per TripMate)"
              items={accommodation}
              onAdd={(name, amount) => addCostItem('accommodation', name, amount)}
              onRemove={(id) => removeCostItem('accommodation', id)}
              color="green"
            />

            {/* Transportation */}
            <CostSection
              title="Transportation (per TripMate)"
              items={transportation}
              onAdd={(name, amount) => addCostItem('transportation', name, amount)}
              onRemove={(id) => removeCostItem('transportation', id)}
              color="blue"
            />

            {/* Activities */}
            <CostSection
              title="Other Activities (per TripMate)"
              items={activities}
              onAdd={(name, amount) => addCostItem('activities', name, amount)}
              onRemove={(id) => removeCostItem('activities', id)}
              color="purple"
            />

            {/* Buffer */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-2">Buffer(%)</h4>
              <p className="text-sm text-gray-600 mb-4">Cover unexpected costs (10% recommended)</p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, buffer: Math.max(0, prev.buffer - 1) }))}
                  className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-lg font-semibold w-8 text-center">{formData.buffer}</span>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, buffer: prev.buffer + 1 }))}
                  className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Your Fee */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-2">Your Fee</h4>
              <p className="text-sm text-gray-600 mb-4">You can add an extra fee</p>
              <div className="flex items-center">
                <span className="text-lg font-semibold mr-2">€</span>
                <input
                  type="number"
                  value={formData.yourFee}
                  onChange={(e) => setFormData(prev => ({ ...prev, yourFee: Number(e.target.value) }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Total Cost Display */}
          <div className="mb-8">
            <div className="card-gradient shadow-gradient">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Cost per TripMate</span>
                <span className="text-3xl font-bold">€ {calculateTotal().toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => router.back()}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="btn-primary"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Cost Section Component
function CostSection({ 
  title, 
  items, 
  onAdd, 
  onRemove, 
  color 
}: { 
  title: string; 
  items: CostItem[]; 
  onAdd: (name: string, amount: number) => void; 
  onRemove: (id: string) => void;
  color: string;
}) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState(0);

  const handleAdd = () => {
    if (newItemName.trim()) {
      onAdd(newItemName.trim(), newItemAmount);
      setNewItemName('');
      setNewItemAmount(0);
    }
  };

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-md font-semibold text-gray-900">{title}</h4>
        <div className="flex items-center">
          <span className="text-lg font-semibold mr-2">€ {total}</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">{item.name}</span>
              <span className="text-sm text-gray-500">€ {item.amount}</span>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="text-teal-600 hover:text-teal-800"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Item name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
        <input
          type="number"
          value={newItemAmount}
          onChange={(e) => setNewItemAmount(Number(e.target.value))}
          placeholder="€"
          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
        <button
          onClick={handleAdd}
          className={`bg-${color}-600 hover:bg-${color}-700 text-white px-4 py-2 rounded-lg font-bold`}
        >
          +
        </button>
      </div>
    </div>
  );
}
