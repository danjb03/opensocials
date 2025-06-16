
import NavigationLogo from "@/components/ui/navigation-logo";

export const IndexFooter = () => {
  return (
    <footer className="border-t border-gray-800 bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <NavigationLogo />
            <p className="text-gray-400 text-sm leading-relaxed">
              The leading creator partnership marketplace connecting brands 
              with authentic content creators worldwide.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Creator Search</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Campaign Management</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Analytics</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Payments</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Press</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Help Center</a></li>
              <li><a href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a></li>
              <li><a href="/tos" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a></li>
              <li><a href="/data-deletion" className="text-gray-400 hover:text-white text-sm transition-colors">Data Deletion</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 OS Platform. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
