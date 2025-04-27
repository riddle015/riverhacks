import React, { useEffect } from 'react';
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
import { Separator } from '@/components/ui/separator';

// Custom Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategorySelector, { Category } from '@/components/CategorySelector';
import MediaUploader from '@/components/MediaUploader';
import LocationPicker, { LocationData } from '@/components/LocationPicker';
import SeverityPicker from '@/components/SeverityPicker';

// Auth + API
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { createReport } from '@/api';

// Add this near the top of the file
const categories: Category[] = [
  { id: 'roads', name: 'Roads & Infrastructure', icon: 'construction' },
  { id: 'lighting', name: 'Street Lighting', icon: 'lightbulb' },
  { id: 'trash', name: 'Trash & Sanitation', icon: 'delete' },
  { id: 'safety', name: 'Public Safety', icon: 'security' },
  { id: 'other', name: 'Other', icon: 'more_horiz' }
];

// 1. Form schema
const formSchema = z.object({
  title: z.string().min(5).max(100),
  category: z.string(),
  description: z.string().min(10).max(500),
  severity: z.enum(['low', 'medium', 'high']),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
      address: z.string().optional()
    })
    .optional(),
  mediaFiles: z.array(z.any()).optional()
});

type FormValues = z.infer<typeof formSchema>;


// 2. Component
const ReportIssue = ({ requireAuth }: { requireAuth?: boolean }) => {
  const { token, userId } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (requireAuth && !token) {
      navigate('/login');
    }
  }, [requireAuth, token, navigate]);

  // React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { severity: 'medium' }
  });

  // Mutation to call your Flask API
  // Updated useMutation for React Query v4+
  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      createReport(
        {
          ...data,
          user_id: userId!,
        },
        token!
      ),
    onSuccess: (report) => {
      toast.success('Report submitted!');
      navigate('/report-confirmation', {
        state: { reportId: report.report_id }
      });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    }
  });

  // Single onSubmit that calls the mutation
  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* Title */}
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Title</FormLabel>
                      <FormControl>
                        <input
                          className="input"
                          placeholder="e.g. Broken streetlight on Main St"
                          {...field}
                        />
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

            {/* Category */}
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
                          onCategorySelect={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <textarea
                          className="textarea"
                          placeholder="Please describe the issue in detail"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include details to help address the issue
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Media */}
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="mediaFiles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photos / Videos</FormLabel>
                      <FormControl>
                        <MediaUploader onMediaCapture={field.onChange} />
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

            {/* Location */}
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={() => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <LocationPicker
                          onLocationSelect={(loc: LocationData) =>
                            form.setValue('location', loc)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Severity */}
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
                        Select how urgent this issue is
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
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? 'Submitting...' : 'Submit Report'}
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
