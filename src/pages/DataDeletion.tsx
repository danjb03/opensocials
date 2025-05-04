import { useState } from "react";
import { Trash2, Shield, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/auth";

const DataDeletion = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestDeletion = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch("https://pcnrnciwgdrukzciwexi.supabase.co/functions/v1/request-data-deletion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabase.auth.session()?.access_token || ""}`,
        },
        body: JSON.stringify({
          userId: user?.id || null,
          userEmail: user?.email || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Request Submitted",
          description: "Your data deletion request has been submitted successfully.",
        });
      } else {
        toast({
          title: "Request Failed",
          description: "There was a problem submitting your request. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting data deletion request:", error);
      toast({
        title: "Request Failed",
        description: "There was a problem submitting your request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Data Deletion URL Documentation</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Overview
          </CardTitle>
          <CardDescription>
            Information about our data deletion policy
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            In compliance with data privacy regulations (such as GDPR), Open Socials provides a Data Deletion URL for users to request the removal of their personal data from the platform. This URL will facilitate the process of permanently deleting user data in accordance with the company's privacy policy.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Purpose</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            The Data Deletion URL serves as the endpoint where users can submit a request for their personal data to be erased from our system, ensuring that Open Socials complies with data protection laws and maintains user trust.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Endpoint URL</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">The endpoint for data deletion is hosted at:</p>
          <div className="bg-muted p-3 rounded-md font-mono text-sm">
            https://opensocials.net/data-deletion
          </div>
          <p className="mt-4 text-muted-foreground">
            This URL is accessible by users who wish to have their personal information deleted. When a request is made, the system will initiate a secure deletion of user data.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <div className="flex gap-3">
            <div className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center shrink-0">1</div>
            <p><strong>User Access:</strong> The user will navigate to the Data Deletion URL.</p>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center shrink-0">2</div>
            <p><strong>Request Submission:</strong> Users will need to submit a request to delete their data by providing their account details.</p>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center shrink-0">3</div>
            <p><strong>Verification:</strong> The system will verify the identity of the user to prevent unauthorized deletion requests.</p>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center shrink-0">4</div>
            <p><strong>Data Deletion:</strong> Upon successful verification, the system will automatically delete all user data stored in Open Socials' databases. This includes profile information, activity logs, and any associated data with their account.</p>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center shrink-0">5</div>
            <p><strong>Confirmation:</strong> The user will receive an email confirming the completion of the deletion process.</p>
          </div>
          
          <div className="mt-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Request Data Deletion
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will submit a request to delete all your personal data from our systems.
                    Once processed, this action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRequestDeletion}
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Yes, submit request"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security and Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>• The Data Deletion URL ensures secure data handling by using HTTPS to encrypt all communication.</p>
          <p>• We follow all relevant data privacy laws, including GDPR, to ensure users have full control over their personal data.</p>
          <p>• All deletions will be irreversible once processed.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact and Support
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p className="mb-2">For any inquiries or issues related to data deletion, please contact our support team at:</p>
          <div className="bg-muted p-3 rounded-md font-mono text-sm">
            support@opensocials.net
          </div>
        </CardContent>
      </Card>
      
      <Separator className="my-10" />
      
      <div className="text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} OpenSocials. All rights reserved.</p>
      </div>
    </div>
  );
};

export default DataDeletion;
