
export const BackgroundElements = () => {
  return (
    <>
      <div className="absolute top-10 left-10 w-1 h-1 bg-white/10 rounded-full animate-float" 
        style={{ animationDelay: '0s' }} />
      <div className="absolute top-20 right-20 w-1 h-1 bg-white/15 rounded-full animate-float" 
        style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-20 w-1 h-1 bg-white/10 rounded-full animate-float" 
        style={{ animationDelay: '2s' }} />
    </>
  );
};
