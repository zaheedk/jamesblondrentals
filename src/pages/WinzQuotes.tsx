import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, CreditCard, FileText, Users, Clock } from 'lucide-react';
import WinzQuoteForm from '@/components/WinzQuoteForm';

const WinzQuotes = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">WINZ Quote for Vans & Trucks, Auckland & Wellington</h1>
        
        <div className="mb-12 text-center">
          <p className="text-lg mb-4">
            <strong>James Blond Rentals specializes in providing comprehensive moving assistance quotes for WINZ applications, covering our full range of trucks, vans, trailers and accessories.</strong>
          </p>
          <p className="text-lg">
            <strong>Our dedicated team ensures your quote includes all necessary costs and documentation for a smooth WINZ application process.</strong>
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Simple 4-Step Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Complete our online form with your moving details and WINZ 9-digit client number</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Our team prepares a detailed quote within 24 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Present the quote to your WINZ case officer for approval</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Contact us with approval details to arrange your rental</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary" />
              Comprehensive Quote Inclusions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Better insurance with $500 excess for all vehicles</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Full comprehensive insurance for trailers and accessories</span>
              </li>
              <li className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold">$1000 security bond covering:</span>
                  <ul className="mt-2 ml-4 space-y-1 text-sm text-muted-foreground">
                    <li>• Rental period extensions if needed</li>
                    <li>• Fuel replacement costs</li>
                    <li>• Additional mileage charges</li>
                    <li>• Any incidental expenses</li>
                  </ul>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Important Collection Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>Valid full driver's licence (must match the name on your WINZ Moving Assistance Quote)</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>Your WINZ 9-digit client number is mandatory for vehicle release</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>Primary driver named on the quote must sign all rental documentation</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>MSD documentation required when using Green Payment Card</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="bg-muted/50 p-6 rounded-lg mb-8">
          <p className="text-sm text-muted-foreground italic">
            <strong>Refund Policy:</strong> Any unused funds will be returned to Work and Income within 4 weeks of vehicle return. 
            All refunds are processed through our Head Office to ensure proper documentation and compliance.
          </p>
        </div>

        {/* WINZ Quote Form */}
        <WinzQuoteForm />
      </div>
    </div>
  );
};

export default WinzQuotes;