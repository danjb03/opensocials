
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { sendEmail } from '@/utils/email';
import { toast } from '@/components/ui/sonner';

export const EmailSender = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!to || !subject || !content) {
      toast.error('Please fill out all fields');
      return;
    }
    
    setIsSending(true);
    
    const result = await sendEmail({
      to,
      subject,
      html: content,
    });
    
    if (result.success) {
      toast.success('Email sent successfully!');
      // Clear form
      setTo('');
      setSubject('');
      setContent('');
    }
    
    setIsSending(false);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Send Email</CardTitle>
        <CardDescription>Send an email using Resend API</CardDescription>
      </CardHeader>
      <form onSubmit={handleSendEmail}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Recipient Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="recipient@example.com" 
              value={to} 
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              placeholder="Email subject" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content (HTML)</Label>
            <Textarea 
              id="content" 
              placeholder="<p>Your HTML content here</p>" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSending}>
            {isSending ? 'Sending...' : 'Send Email'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
