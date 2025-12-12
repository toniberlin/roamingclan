'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabase() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test basic connection
        const { data, error } = await supabase
          .from('trips')
          .select('count')
          .limit(1);

        if (error) {
          setConnectionStatus(`Error: ${error.message}`);
          console.error('Supabase error:', error);
        } else {
          setConnectionStatus('✅ Connected to Supabase successfully!');
          
          // Try to get table names
          const { data: tableData, error: tableError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public');

          if (!tableError && tableData) {
            setTables(tableData.map(t => t.table_name));
          }
        }
      } catch (err) {
        setConnectionStatus(`Connection failed: ${err}`);
        console.error('Connection test failed:', err);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <p className="text-lg">{connectionStatus}</p>
        </div>

        {tables.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Database Tables</h2>
            <ul className="space-y-2">
              {tables.map((table, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  {table}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8">
          <a 
            href="/create-trip/submit" 
            className="btn-primary"
          >
            Back to Trip Creation
          </a>
        </div>
      </div>
    </div>
  );
}
