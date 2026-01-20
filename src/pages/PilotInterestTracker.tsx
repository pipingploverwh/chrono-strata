import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Building2, Clock, Target, Users, CheckCircle2, Rocket, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const industries = [
  'Financial Services',
  'Healthcare & Life Sciences',
  'Manufacturing',
  'Retail & E-commerce',
  'Technology',
  'Energy & Utilities',
  'Transportation & Logistics',
  'Media & Entertainment',
  'Government & Public Sector',
  'Professional Services',
  'Other'
];

const companySizes = [
  '1-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1001-5000 employees',
  '5000+ employees'
];

const timelines = [
  'Immediate (within 30 days)',
  'Q1 2025',
  'Q2 2025',
  'Q3 2025',
  'Q4 2025',
  '2026 or later'
];

const useCases = [
  'Weather Intelligence & Operations',
  'Predictive Analytics Dashboard',
  'Real-time Data Visualization',
  'Enterprise Audio/Visual Systems',
  'Custom Integration Platform',
  'IoT & Sensor Integration',
  'Other'
];

const budgetRanges = [
  'Under $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000 - $250,000',
  '$250,000+'
];

export default function PilotInterestTracker() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    company_size: '',
    industry: '',
    contact_name: '',
    contact_email: '',
    contact_title: '',
    use_case: '',
    use_case_details: '',
    desired_timeline: '',
    budget_range: '',
    current_solution: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const applicationData = {
      company_name: formData.company_name.trim(),
      company_size: formData.company_size,
      industry: formData.industry,
      contact_name: formData.contact_name.trim(),
      contact_email: formData.contact_email.trim().toLowerCase(),
      contact_title: formData.contact_title.trim() || null,
      use_case: formData.use_case,
      use_case_details: formData.use_case_details.trim() || null,
      desired_timeline: formData.desired_timeline,
      budget_range: formData.budget_range || null,
      current_solution: formData.current_solution.trim() || null
    };

    try {
      const { error } = await supabase
        .from('pilot_applications')
        .insert(applicationData);

      if (error) throw error;

      // Send admin notification email (fire and forget)
      supabase.functions.invoke('notify-pilot-application', {
        body: applicationData
      }).catch(err => console.error('Failed to send admin notification:', err));

      setSubmitted(true);
      toast.success('Pilot application submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Application Received</CardTitle>
            <CardDescription className="text-base mt-2">
              Thank you for your interest in our enterprise pilot program. Our team will review your application and contact you within 2-3 business days.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p><strong>Company:</strong> {formData.company_name}</p>
              <p><strong>Use Case:</strong> {formData.use_case}</p>
              <p><strong>Timeline:</strong> {formData.desired_timeline}</p>
            </div>
            <Link to="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Rocket className="w-3 h-3 mr-1" />
            Enterprise Pilot Program
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Join Our Enterprise Pilot
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Partner with us to implement cutting-edge solutions tailored to your organization's unique challenges.
          </p>
        </div>
      </div>

      {/* Benefits Strip */}
      <div className="border-y bg-muted/30 py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <p className="font-medium text-sm">Custom Implementation</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="font-medium text-sm">Dedicated Support</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <p className="font-medium text-sm">Priority Onboarding</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <p className="font-medium text-sm">Enterprise SLA</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto py-12 px-6">
        <Card>
          <CardHeader>
            <CardTitle>Pilot Application</CardTitle>
            <CardDescription>
              Complete the form below to apply for our enterprise pilot program. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      placeholder="Acme Corporation"
                      value={formData.company_name}
                      onChange={(e) => handleChange('company_name', e.target.value)}
                      required
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_size">Company Size *</Label>
                    <Select
                      value={formData.company_size}
                      onValueChange={(value) => handleChange('company_size', value)}
                      required
                    >
                      <SelectTrigger id="company_size">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizes.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => handleChange('industry', value)}
                      required
                    >
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map(industry => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_name">Full Name *</Label>
                    <Input
                      id="contact_name"
                      placeholder="Jane Smith"
                      value={formData.contact_name}
                      onChange={(e) => handleChange('contact_name', e.target.value)}
                      required
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_title">Job Title</Label>
                    <Input
                      id="contact_title"
                      placeholder="VP of Operations"
                      value={formData.contact_title}
                      onChange={(e) => handleChange('contact_title', e.target.value)}
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="contact_email">Business Email *</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      placeholder="jane.smith@acme.com"
                      value={formData.contact_email}
                      onChange={(e) => handleChange('contact_email', e.target.value)}
                      required
                      maxLength={255}
                    />
                  </div>
                </div>
              </div>

              {/* Use Case */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-muted-foreground" />
                  Use Case & Requirements
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="use_case">Primary Use Case *</Label>
                    <Select
                      value={formData.use_case}
                      onValueChange={(value) => handleChange('use_case', value)}
                      required
                    >
                      <SelectTrigger id="use_case">
                        <SelectValue placeholder="Select use case" />
                      </SelectTrigger>
                      <SelectContent>
                        {useCases.map(useCase => (
                          <SelectItem key={useCase} value={useCase}>{useCase}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="use_case_details">Describe Your Requirements</Label>
                    <Textarea
                      id="use_case_details"
                      placeholder="Tell us about your specific needs, challenges, and what success looks like for your organization..."
                      value={formData.use_case_details}
                      onChange={(e) => handleChange('use_case_details', e.target.value)}
                      rows={4}
                      maxLength={2000}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current_solution">Current Solution (if any)</Label>
                    <Input
                      id="current_solution"
                      placeholder="What are you using today?"
                      value={formData.current_solution}
                      onChange={(e) => handleChange('current_solution', e.target.value)}
                      maxLength={200}
                    />
                  </div>
                </div>
              </div>

              {/* Timeline & Budget */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  Timeline & Budget
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="desired_timeline">Desired Start Date *</Label>
                    <Select
                      value={formData.desired_timeline}
                      onValueChange={(value) => handleChange('desired_timeline', value)}
                      required
                    >
                      <SelectTrigger id="desired_timeline">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        {timelines.map(timeline => (
                          <SelectItem key={timeline} value={timeline}>{timeline}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget_range">Budget Range</Label>
                    <Select
                      value={formData.budget_range}
                      onValueChange={(value) => handleChange('budget_range', value)}
                    >
                      <SelectTrigger id="budget_range">
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetRanges.map(budget => (
                          <SelectItem key={budget} value={budget}>{budget}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting || !formData.company_name || !formData.company_size || !formData.industry || !formData.contact_name || !formData.contact_email || !formData.use_case || !formData.desired_timeline}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Pilot Application'}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By submitting this form, you agree to be contacted by our team regarding pilot opportunities.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Back Link */}
      <div className="max-w-3xl mx-auto pb-12 px-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
