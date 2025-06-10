
export const TrustedBySection = () => {
  const stats = [
    "92% of consumers trust influencer marketing content over traditional ads",
    "Traditional paid ads cost 35% more to acquire a customer than creator led content",
    "74% of brands say creators now drive their highest performing content",
    "84.8% say influencer marketing is effective not a gamble",
    "Brands earn $6.16 for every $1 spent on creator campaigns",
    "That's 6x ROI"
  ];

  return (
    <div className="text-center mb-20 overflow-hidden">
      <p className="text-gray-500 text-sm mb-8 uppercase tracking-wider">Already chosen by leaders</p>
      
      {/* Scrolling Stats Container */}
      <div className="relative">
        <div className="flex animate-scroll whitespace-nowrap">
          {/* First set of stats */}
          {stats.map((stat, index) => (
            <div
              key={`first-${index}`}
              className="inline-flex items-center mx-8 text-gray-400 text-lg font-medium"
            >
              <span className="mr-2">•</span>
              {stat}
            </div>
          ))}
          
          {/* Duplicate set for seamless loop */}
          {stats.map((stat, index) => (
            <div
              key={`second-${index}`}
              className="inline-flex items-center mx-8 text-gray-400 text-lg font-medium"
            >
              <span className="mr-2">•</span>
              {stat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
