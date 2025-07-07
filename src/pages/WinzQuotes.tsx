import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, CreditCard, FileText } from 'lucide-react';
import WinzQuoteForm from '@/components/WinzQuoteForm';

const WinzQuotes = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">WINZ Quotes</h1>
        
        <div className="mb-12 text-center">
          <p className="text-lg mb-4">
            <strong>James Blond can provide you with a moving assistance quote on trucks, vans, trailers and any other vehicle you might require.</strong>
          </p>
          <p className="text-lg">
            <strong>Our experienced team will provide you with a quote with all costs included so you can apply with WINZ.</strong>
          </p>
        </div>

        {/* How it works section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              How does it work?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Please start by filling the form below</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Your WINZ 9-digit client number must be entered</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>James Blond will send you the quote via email</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Submit the quote with your case officer for approval</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Once you receive the approval, send us the details and you are good to go</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* What will be included section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-primary" />
              What will be included with the quote?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Our Best Insurance for vehicles</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Our comprehensive Insurance for trailers</span>
              </li>
              <li className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold">$1000 bond for vehicle or trailer hire which includes but not limited to:</span>
                  <ul className="mt-2 ml-4 space-y-1 text-sm text-muted-foreground">
                    <li>• Possible extension of hire</li>
                    <li>• Refuelling costs</li>
                    <li>• Mileage</li>
                  </ul>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* At the time of vehicle collection section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-primary" />
              At the time of vehicle collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>A full valid driver's licence matching the name on the Moving Assistant Quote must be provided at the time of vehicle pickup.</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>We cannot hire the vehicle unless we have the WINZ 9-digit client number.</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>The name provided on the Moving Assistant Quote will need to be the primary driver who signs the rental agreement prior to hiring the vehicle.</span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>Proof from MSD is required if paying by Green Payment Card.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Important notice */}
        <div className="bg-muted/50 p-6 rounded-lg mb-8">
          <p className="text-sm text-muted-foreground italic">
            Any outstanding monies will be refunded to Work and Income 4 weeks after the vehicle is returned. 
            Refunds cannot be processed at the Branch; they can only be processed via the Head Office.
          </p>
        </div>

        {/* WINZ Quote Form */}
        <WinzQuoteForm />
      </div>
    </div>
  );
};

export default WinzQuotes;