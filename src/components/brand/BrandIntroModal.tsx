
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { CheckCircle, Zap, Users } from 'lucide-react';

interface BrandIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandIntroModal = ({ isOpen, onClose }: BrandIntroModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDismiss = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await supabase.functions.invoke('dismiss-intro', {
        body: { intro_type: 'brand' },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });
      
      onClose();
      navigate('/brand', { replace: true });
    } catch (error) {
      console.error('Error dismissing intro:', error);
      onClose();
      navigate('/brand', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-none w-full h-full p-0 border-none bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="flex flex-col items-center justify-center min-h-full px-4 py-8 sm:px-8">
          {/* Main Content Container */}
          <div className="max-w-4xl w-full text-center space-y-12">
            
            {/* Headlines */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Launch campaigns that{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  actually convert
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 font-medium max-w-2xl mx-auto">
                Just brief, match and go live in hours.
              </p>
            </div>

            {/* Visual Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              
              {/* Smart Matching */}
              <div className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Matching</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The right creators, pre-vetted. ROI ready.
                  </p>
                </div>
              </div>

              {/* Speed to Launch */}
              <div className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Speed to Launch</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Campaigns live in hours, not weeks.
                  </p>
                </div>
              </div>

              {/* Clear Outcomes */}
              <div className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Clear Outcomes</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Carefully qualified, campaign proven. Ready to work.
                  </p>
                </div>
              </div>

            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <Button
                onClick={handleDismiss}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Setting up...
                  </div>
                ) : (
                  'Find creators that deliver'
                )}
              </Button>
            </div>

          </div>

          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 -z-10 opacity-40">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};
