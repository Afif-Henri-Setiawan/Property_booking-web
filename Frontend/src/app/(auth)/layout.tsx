import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-forest-900">
        <div className="absolute inset-0 bg-primary/20 z-10 mix-blend-multiply" />
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Luxury Property" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 z-20 bg-gradient-to-t from-black/80 to-transparent">
          <h1 className="text-4xl font-bold text-white mb-4">StayNest</h1>
          <p className="text-white/80 text-lg max-w-md">Discover premium properties for your perfect getaway or manage your luxury listings with ease.</p>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="lg:hidden mb-8 self-start">
            <h1 className="text-3xl font-bold text-primary">StayNest</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
