
import { Shield, Mail, FileText, BookOpen, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TermsOfService = () => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-muted-foreground mb-6">Effective Date: {today}</p>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Acceptance
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            By using Open Socials, you agree to these Terms. If you don't, don't use the platform.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Our Role
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            We are a connector, not a middleman. You own your content, your brand, and your relationships.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Eligibility</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            You must be 18+ or have legal authorization to represent your brand. You must own the rights to any content or social media account connected.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Brand Deals</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            We facilitate partnerships but do not guarantee income. All partnerships are subject to brand terms and your approval.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Termination</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            You can leave anytime. We can suspend your access for abuse, fraud, or policy violations. No drama—just fairness.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Liability
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            We are not liable for lost income, platform outages, or third-party platform issues (e.g. Meta API bugs). You assume all risk by using the platform.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Changes
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            We may update these Terms. Continued use means you accept any updates.
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
          <p>For questions: <a href="mailto:support@opensocials.net" className="text-primary hover:underline">support@opensocials.net</a></p>
        </CardContent>
      </Card>
      
      <Separator className="my-10" />
      
      <div className="text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} OpenSocials. All rights reserved.</p>
      </div>
    </div>
  );
};

export default TermsOfService;
