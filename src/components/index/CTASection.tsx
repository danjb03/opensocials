
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  user: any;
}

export const CTASection = ({ user }: CTASectionProps) => {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-5xl md:text-6xl font-light mb-8">
          Elevate the way you<br />
          <span className="text-gray-400">source partnerships</span>
        </h2>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Get ready to start producing stunning, efficient campaign work without the hassles of hiring. Soon available.
        </p>
        {!user && (
          <div className="flex items-center justify-center">
            <div className="flex items-center bg-gray-900 rounded-full p-2 max-w-md w-full">
              <input
                type="email"
                placeholder="name@email.com"
                className="bg-transparent text-white placeholder-gray-500 px-4 py-3 flex-1 focus:outline-none"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full">
                Get notified
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
