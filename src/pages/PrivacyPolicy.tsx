
import { Shield, Mail, User, Link as LinkIcon, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground mb-6">Effective Date: {today}</p>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Who We Are
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            Open Socials empowers creators to control their income, brand, and data. 
            We connect creators and brands through secure, scalable infrastructure.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Information We Collect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>We collect the following personal information when you interact with our platform:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Profile data (name, bio, email)</li>
            <li>Social platform data via OAuth (followers, engagement, post analytics)</li>
            <li>Usage data (logins, interactions, referrals)</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How We Use Your Data</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p className="mb-4">We use your information to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Authenticate and connect your social accounts</li>
            <li>Display and match you with brand deal opportunities</li>
            <li>Analyze your content performance and insights</li>
            <li>Comply with platform and legal requirements</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sharing of Data</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p className="mb-4">We do not sell your data. We may share minimal necessary data with:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Brand partners (only after your consent)</li>
            <li>Platform APIs (Meta, TikTok, YouTube, etc.)</li>
            <li>Service providers (for analytics, hosting, and messaging)</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Data Security
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            We use Supabase for encrypted storage and access control. 
            Access tokens are stored securely and never shared externally.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Data Retention</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            We retain data as long as your account is active or required by law. 
            You may request deletion at any time via <a href="mailto:data-deletion@opensocials.net" className="text-primary hover:underline">data-deletion@opensocials.net</a>.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Rights
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            You have the right to access, update, or delete your data. 
            Contact us directly and we'll act fast.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>For any concerns, email: <a href="mailto:privacy@opensocials.net" className="text-primary hover:underline">privacy@opensocials.net</a></p>
        </CardContent>
      </Card>
      
      <Separator className="my-10" />
      
      <div className="text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} OpenSocials. All rights reserved.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
