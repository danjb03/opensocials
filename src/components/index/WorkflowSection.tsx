
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/SocialIcons';

export const WorkflowSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl font-light mb-6">Workflow integration</h3>
            <p className="text-gray-400 text-lg mb-8">Seamlessly connect all your existing apps.</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Facebook className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                <TikTokIcon className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <Youtube className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center">
                <Linkedin className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded text-purple-600 flex items-center justify-center text-xs font-bold">T</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-light mb-6">Collaborate real-time</h3>
            <p className="text-gray-400 text-lg">Seamlessly connect all your existing apps.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
