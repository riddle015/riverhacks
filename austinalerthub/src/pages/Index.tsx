
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();
  
  // Get current hour to customize greeting
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon";
  } else if (hour >= 17) {
    greeting = "Good evening";
  }
  
  const featuredCategories = [
    { id: 'infrastructure', name: 'Infrastructure', icon: 'construction', color: '#FFA000' },
    { id: 'traffic', name: 'Traffic', icon: 'commute', color: '#F44336' },
    { id: 'crime', name: 'Crime', icon: 'local_police', color: '#3F51B5' },
    { id: 'environment', name: 'Environment', icon: 'eco', color: '#4CAF50' },
  ];
  
  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="container py-6 space-y-8">
        {/* Hero section */}
        <section className="bg-gradient-to-br from-safety-blue to-blue-700 text-white rounded-lg p-6 md:p-8">
          <h1 className="text-2xl font-bold">{greeting}!</h1>
          <p className="mt-2 opacity-90">
            Help make our community safer by reporting safety concerns
          </p>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/report')}
              className="bg-safety-yellow text-black hover:bg-yellow-500"
              size="lg"
            >
              Report an Issue
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent text-white border-white hover:bg-white/10"
              onClick={() => navigate('/my-reports')}
            >
              My Reports
            </Button>
          </div>
        </section>
        
        {/* Quick report categories */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Report</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {featuredCategories.map((category) => (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => navigate('/report', { state: { preselectedCategory: category.id } })}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <span 
                    className="material-icons text-3xl mb-2"
                    style={{ color: category.color }}
                  >
                    {category.icon}
                  </span>
                  <p className="text-center font-medium">{category.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Recent activity or tips */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Safety Tips</h2>
          <Card>
            <CardHeader>
              <CardTitle>Stay Safe, Report Issues</CardTitle>
              <CardDescription>
                Help keep our community safer for everyone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="bg-blue-100 text-safety-blue p-2 rounded-full">
                  <span className="material-icons">tips_and_updates</span>
                </div>
                <div>
                  <h3 className="font-medium">Be Specific</h3>
                  <p className="text-sm text-muted-foreground">
                    Provide clear details about the issue location and nature
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-yellow-100 text-safety-yellow p-2 rounded-full">
                  <span className="material-icons">photo_camera</span>
                </div>
                <div>
                  <h3 className="font-medium">Add Media</h3>
                  <p className="text-sm text-muted-foreground">
                    Photos and videos help authorities respond more effectively
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="bg-red-100 text-safety-red p-2 rounded-full">
                  <span className="material-icons">emergency</span>
                </div>
                <div>
                  <h3 className="font-medium">For Emergencies</h3>
                  <p className="text-sm text-muted-foreground">
                    Always call emergency services (911) for immediate dangers
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="link" 
                className="text-safety-blue"
                onClick={() => navigate('/safety-guide')}
              >
                View Safety Guide
              </Button>
            </CardFooter>
          </Card>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
