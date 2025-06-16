
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CampaignForReview {
  id: string;
  name: string;
  brand_id: string;
  campaign_type: string;
  budget: number;
  currency: string;
  description?: string;
  content_requirements?: any;
  platforms?: string[];
  brand_profiles?: {
    company_name: string;
  } | null;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface R4ReviewInterfaceProps {
  campaign: CampaignForReview;
  onReviewComplete: () => void;
}

export function R4ReviewInterface({ campaign, onReviewComplete }: R4ReviewInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateCampaignContext = () => {
    const context = `
Campaign Name: ${campaign.name}
Brand: ${campaign.brand_profiles?.company_name || 'Unknown'}
Campaign Type: ${campaign.campaign_type}
Budget: ${campaign.budget} ${campaign.currency}
Description: ${campaign.description || 'No description provided'}
Platforms: ${campaign.platforms?.join(', ') || 'Not specified'}
Content Requirements: ${JSON.stringify(campaign.content_requirements || {}, null, 2)}
    `.trim();
    
    return context;
  };

  const startR4Review = async () => {
    const systemPrompt = `R4, I need you to review this campaign and either give me the green light or reject it. Here is the context on the campaign:

${generateCampaignContext()}

Please analyze this campaign for:
1. Budget appropriateness and feasibility
2. Content requirements clarity and reasonableness
3. Brand safety and compliance considerations
4. Platform alignment and target audience fit
5. Overall campaign viability

Provide your recommendation: APPROVE, REJECT, or NEEDS_REVISION with detailed reasoning.`;

    const newMessage: ChatMessage = {
      role: 'user',
      content: systemPrompt,
      timestamp: new Date()
    };

    setMessages([newMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/supabase/functions/v1/r4-campaign-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are R4, an AI campaign reviewer. Analyze campaigns thoroughly and provide clear recommendations with detailed reasoning.'
            },
            newMessage
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get R4 response');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting R4 review:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while reviewing this campaign. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/supabase/functions/v1/r4-campaign-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are R4, an AI campaign reviewer. You are currently reviewing this campaign: ${campaign.name}. Continue the conversation based on the previous context.`
            },
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            userMessage
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get R4 response');
      }

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message to R4:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            R4 AI Campaign Review
          </CardTitle>
          <CardDescription>
            Get an AI-powered analysis of this campaign with detailed recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Start an R4 review session for this campaign
              </p>
              <Button onClick={startR4Review} className="gap-2">
                <Bot className="h-4 w-4" />
                Start R4 Review
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Chat Messages */}
              <div className="max-h-96 overflow-y-auto space-y-4 border rounded-lg p-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2">
                          <Bot className="h-4 w-4" />
                          <Badge variant="secondary">R4</Badge>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                      <div className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">R4 is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask R4 for more details or clarification..."
                  className="flex-1"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!inputMessage.trim() || isLoading}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaign Context Display */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Context for R4</CardTitle>
          <CardDescription>
            This is the information that will be provided to R4 for analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
            {generateCampaignContext()}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
