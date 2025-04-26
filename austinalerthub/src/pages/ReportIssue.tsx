
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

// Custom Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategorySelector, { Category } from '@/components/CategorySelector';
import MediaUploader from '@/components/MediaUploader';
import LocationPicker, { LocationData } from '@/components/LocationPicker';
import SeverityPicker from '@/components/SeverityPicker';

// Define the form schema
const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }).max(100, {
    message: "Title must be at most 100 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description must be at most 500 characters.",
  }),
  severity: z.enum(['low', 'medium', 'high'], {
    required_error: "Please select severity level.",
  }),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional(),
  }, {
    required_error: "Location is required.",
  }).optional(),
  mediaFiles: z.array(z.any()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Categories data
const categories: Category[] = [
  { id: 'infrastructure', name: 'Infrastructure', icon: 'construction', color: '#FFA000' },
  { id: 'traffic', name: 'Traffic', icon: 'commute', color: '#F44336' },
  { id: 'crime', name: 'Crime', icon: 'local_police', color: '#3F51B5' },
  { id: 'environment', name: 'Environment', icon: 'eco', color: '#4CAF50' },
  { id: 'public_services', name: 'Public Services', icon: 'miscellaneous_services', color: '#9C27B0' },
  { id: 'noise', name: 'Noise', icon: 'volume_up', color: '#FF5722' },
  { id: 'animals', name: 'Animals', icon: 'pets', color: '#795548' },
  { id: 'other', name: 'Other', icon: 'help_outline', color: '#9E9E9E' },
];

// Generate a random report ID
const generateReportId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const ReportIssue = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  // Create form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      severity: 'medium',
    },
  });

  const handleMediaCapture = (files: File[]) => {
    setMediaFiles(files);
    form.setValue('mediaFiles', files);
  };

  const handleLocationSelect = (location: LocationData) => {
    form.setValue('location', location);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate report ID
      const reportId = generateReportId();
      
      // In a real app, we would upload the data to a server here
      console.log('Report submitted:', { ...data, reportId });
      
      // Store report in local storage for demo purposes
      const reports = JSON.parse(localStorage.getItem('safetyReports') || '[]');
      const newReport = {
        id: reportId,
        ...data,
        timestamp: new Date().toISOString(),
        status: 'submitted',
      };
      
      reports.push(newReport);
      localStorage.setItem('safetyReports', JSON.stringify(reports));
      
      toast.success('Report submitted successfully!');
      
      // Navigate to confirmation page
      navigate('/report-confirmation', { 
        state: { 
          reportId,
          category: data.category,
        }
      });
      
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="container max-w-xl py-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Report a Safety Issue</h1>
          <p className="text-muted-foreground mt-1">
            Help keep our community safe by reporting issues
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Broken streetlight on Main St" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a short title that describes the issue
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <CategorySelector 
                          categories={categories}
                          selectedCategory={field.value}
                          onCategorySelect={(category) => field.onChange(category)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe the issue in detail" 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Include any relevant details that might help address the issue
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="mediaFiles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photos/Videos</FormLabel>
                      <FormControl>
                        <MediaUploader onMediaCapture={handleMediaCapture} />
                      </FormControl>
                      <FormDescription>
                        Add up to 3 photos or videos
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={() => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <LocationPicker onLocationSelect={handleLocationSelect} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel>Severity Level</FormLabel>
                      <FormControl>
                        <SeverityPicker 
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Select the urgency level of this issue
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Separator />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        </Form>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportIssue;
