import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1E2A4F]">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information and security settings.</p>
      </div>
      
      {/* Container for Clerk UserProfile */}
      <div className="flex justify-center md:justify-start">
        <UserProfile 
          appearance={{
            elements: {
              card: "shadow-none border border-gray-100 rounded-xl",
              navbar: "hidden", // Hide the clerk sidebar since we have our own
              pageScrollBox: "p-0",
            }
          }}
        />
      </div>
    </div>
  );
}
