
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Report {
  id: string;
  title: string;
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  status: 'submitted' | 'in-progress' | 'resolved' | 'closed';
}

const MyReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // Get reports from localStorage
    const savedReports = localStorage.getItem('safetyReports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, []);
  
  const getFilteredReports = () => {
    if (activeTab === 'all') {
      return reports;
    }
    return reports.filter(report => {
      if (activeTab === 'active') {
        return ['submitted', 'in-progress'].includes(report.status);
      }
      return report.status === 'resolved' || report.status === 'closed';
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-safety-blue">Submitted</Badge>;
      case 'in-progress':
        return <Badge className="bg-safety-yellow">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-safety-green">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const filteredReports = getFilteredReports();
  
  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Reports</h1>
          <p className="text-muted-foreground mt-1">
            Track the status of your submitted reports
          </p>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {filteredReports.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-muted-foreground">
                  {activeTab === 'all' 
                    ? "You haven't submitted any reports yet." 
                    : `No ${activeTab} reports found.`}
                </p>
                <Link 
                  to="/report" 
                  className="mt-4 inline-block text-safety-blue hover:underline"
                >
                  Submit a new report
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <Card key={report.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <CardDescription>
                            Report #{report.id} • {formatDate(report.timestamp)}
                          </CardDescription>
                        </div>
                        {getStatusBadge(report.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {report.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyReports;
