import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Send, Loader2, Building2, Mail, User, MessageSquare } from 'lucide-react';

const investorContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Valid email required").max(255, "Email must be less than 255 characters"),
  firm: z.string().trim().max(200, "Firm name must be less than 200 characters").optional().or(z.literal('')),
  investment_interest: z.enum(["exploring", "interested", "ready_to_commit", "strategic_partner"]),
  message: z.string().trim().max(1000, "Message must be less than 1000 characters").optional().or(z.literal(''))
});

type InvestorContactData = z.infer<typeof investorContactSchema>;

interface InvestorContactFormProps {
  lang: 'en' | 'jp';
}

const translations = {
  en: {
    title: 'Contact Our Investment Team',
    subtitle: 'Schedule a call or request additional materials',
    name: 'Full Name',
    namePlaceholder: 'Your full name',
    email: 'Business Email',
    emailPlaceholder: 'you@company.com',
    firm: 'Firm / Organization',
    firmPlaceholder: 'Your company or fund name',
    interest: 'Investment Interest',
    interestPlaceholder: 'Select your interest level',
    message: 'Message (Optional)',
    messagePlaceholder: 'Any specific questions or topics you\'d like to discuss...',
    submit: 'Submit Inquiry',
    submitting: 'Submitting...',
    success: 'Your inquiry has been submitted. We will be in touch shortly.',
    error: 'Failed to submit inquiry. Please try again.',
    interests: {
      exploring: 'Exploring — Early-stage research',
      interested: 'Interested — Actively evaluating',
      ready_to_commit: 'Ready to Commit — Looking to invest soon',
      strategic_partner: 'Strategic Partner — Non-financial partnership'
    }
  },
  jp: {
    title: '投資チームに連絡',
    subtitle: '電話のスケジュールまたは追加資料のリクエスト',
    name: 'お名前',
    namePlaceholder: 'フルネーム',
    email: 'ビジネスメール',
    emailPlaceholder: 'you@company.com',
    firm: '会社 / 組織',
    firmPlaceholder: '会社名またはファンド名',
    interest: '投資への関心度',
    interestPlaceholder: '関心度を選択',
    message: 'メッセージ（任意）',
    messagePlaceholder: '具体的なご質問やご相談内容があればお書きください...',
    submit: 'お問い合わせを送信',
    submitting: '送信中...',
    success: 'お問い合わせを受け付けました。近日中にご連絡いたします。',
    error: '送信に失敗しました。もう一度お試しください。',
    interests: {
      exploring: '検討中 — 初期調査段階',
      interested: '関心あり — 積極的に評価中',
      ready_to_commit: '投資準備完了 — 近日中の投資を希望',
      strategic_partner: '戦略的パートナー — 非金融パートナーシップ'
    }
  }
};

export function InvestorContactForm({ lang }: InvestorContactFormProps) {
  const t = translations[lang];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InvestorContactData>({
    name: '',
    email: '',
    firm: '',
    investment_interest: 'exploring',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof InvestorContactData, string>>>({});

  const handleChange = (field: keyof InvestorContactData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const result = investorContactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof InvestorContactData, string>> = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof InvestorContactData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('investor_contacts')
        .insert({
          name: result.data.name,
          email: result.data.email,
          firm: result.data.firm || null,
          investment_interest: result.data.investment_interest,
          message: result.data.message || null
        });

      if (error) throw error;

      toast({
        title: lang === 'en' ? 'Success!' : '成功！',
        description: t.success,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        firm: '',
        investment_interest: 'exploring',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting investor contact:', error);
      toast({
        title: lang === 'en' ? 'Error' : 'エラー',
        description: t.error,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-xl">
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
          {t.title}
        </h3>
        <p className="text-muted-foreground">
          {t.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
              <User className="w-4 h-4 text-muted-foreground" />
              {t.name} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder={t.namePlaceholder}
              className={errors.name ? 'border-destructive' : ''}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="w-4 h-4 text-muted-foreground" />
              {t.email} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder={t.emailPlaceholder}
              className={errors.email ? 'border-destructive' : ''}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Firm Field */}
          <div className="space-y-2">
            <Label htmlFor="firm" className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              {t.firm}
            </Label>
            <Input
              id="firm"
              value={formData.firm}
              onChange={(e) => handleChange('firm', e.target.value)}
              placeholder={t.firmPlaceholder}
              disabled={isSubmitting}
            />
          </div>

          {/* Investment Interest Field */}
          <div className="space-y-2">
            <Label htmlFor="investment_interest" className="flex items-center gap-2 text-sm font-medium">
              {t.interest} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.investment_interest}
              onValueChange={(value) => handleChange('investment_interest', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className={errors.investment_interest ? 'border-destructive' : ''}>
                <SelectValue placeholder={t.interestPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exploring">{t.interests.exploring}</SelectItem>
                <SelectItem value="interested">{t.interests.interested}</SelectItem>
                <SelectItem value="ready_to_commit">{t.interests.ready_to_commit}</SelectItem>
                <SelectItem value="strategic_partner">{t.interests.strategic_partner}</SelectItem>
              </SelectContent>
            </Select>
            {errors.investment_interest && (
              <p className="text-sm text-destructive">{errors.investment_interest}</p>
            )}
          </div>
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <Label htmlFor="message" className="flex items-center gap-2 text-sm font-medium">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            {t.message}
          </Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder={t.messagePlaceholder}
            rows={4}
            className="resize-none"
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="text-sm text-destructive">{errors.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t.submitting}
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              {t.submit}
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
