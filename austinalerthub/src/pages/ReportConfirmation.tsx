
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ReportConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reportId, category } = location.state || { reportId: 'UNKNOWN', category: 'unknown' };
  
  const getCategoryInfo = (categoryId: string) => {
    const categories = {
      'infrastructure': { name: 'Infrastructure', department: 'Public Works' },
      'traffic': { name: 'Traffic', department: 'Transportation' },
      'crime': { name: 'Crime', department: 'Police' },
      'environment': { name: 'Environment', department: 'Environmental Services' },
      'public_services': { name: 'Public Services', department: 'City Services' },
      'noise': { name: 'Noise', department: 'Noise Control' },
      'animals': { name: 'Animals', department: 'Animal Control' },
      'other': { name: 'Other', department: 'City Administration' },
    };
    
    return categories[categoryId as keyof typeof categories] || { name: 'Unknown', department: 'City Administration' };
  };
  
  const categoryInfo = getCategoryInfo(category);
  
  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="container max-w-md py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-safety-green rounded-full p-4">
            <Check className="h-12 w-12 text-white" />
          </div>
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Report Submitted</CardTitle>
            <CardDescription>
              Thank you for helping keep our community safe!
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md text-center">
                <div className="text-sm text-muted-foreground">Report ID</div>
                <div className="text-xl font-bold tracking-wider">{reportId}</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{categoryInfo.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned to:</span>
                  <span className="font-medium">{categoryInfo.department}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-safety-blue">Submitted</span>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => navigate('/my-reports')}
            >
              View My Reports
            </Button>
            
            <Button 
              className="w-full"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportConfirmation;
