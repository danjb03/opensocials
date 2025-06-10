
import { Instagram, Linkedin, Youtube, Facebook } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/SocialIcons';

export const WorkflowSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-gray-900/50 rounded-3xl p-12 border border-gray-800/50">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-light mb-6 text-white">Channels to market</h3>
              <p className="text-gray-400 text-lg leading-relaxed">Seamlessly connect with creators on all your platforms</p>
            </div>
            <div>
              <div className="grid grid-cols-3 gap-4">
                {/* Instagram */}
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-pink-500" />
                </div>

                {/* Facebook */}
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <Facebook className="w-8 h-8 text-blue-500" />
                </div>

                {/* YouTube */}
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <Youtube className="w-8 h-8 text-red-500" />
                </div>

                {/* TikTok */}
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <TikTokIcon className="w-8 h-8 text-white" />
                </div>

                {/* X (Twitter) */}
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#fff">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>

                {/* LinkedIn */}
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <Linkedin className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              {/* Many More section */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center justify-center w-32 h-12 bg-gray-800/50 rounded-xl border border-gray-700">
                  <span className="text-gray-400 text-sm font-medium">+ Many More</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
