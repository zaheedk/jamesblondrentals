
import React from 'react';
import { Card } from '@/components/ui/card';

interface DebugApiResponseProps {
  title: string;
  data: any;
  className?: string;
}

const DebugApiResponse: React.FC<DebugApiResponseProps> = ({ 
  title, 
  data, 
  className = "" 
}) => {
  if (!data) return null;
  
  return (
    <Card className={`p-4 ${className}`}>
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <div className="bg-white p-4 rounded border overflow-auto max-h-96 text-xs font-mono">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </Card>
  );
};

export default DebugApiResponse;
