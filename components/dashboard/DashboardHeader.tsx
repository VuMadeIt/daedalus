interface DashboardHeaderProps {
  userName: string;
}

const greetings = [
  { heading: "Hey", subtitle: "Ready to build something?" },
  { heading: "Welcome back", subtitle: "Here's what's happening this weekend." },
  { heading: "Hello", subtitle: "Good to see you again." },
  { heading: "Hey there", subtitle: "Everything you need is right here." },
  { heading: "Hi", subtitle: "Grab a snack and let's get hacking." },
];

export const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  const firstName = userName?.split(" ")[0] || "Hacker";
  const { heading, subtitle } = greetings[firstName.charCodeAt(0) % greetings.length];

  return (
    <div className="space-y-1">
      <h1 className="text-[28px] leading-tight font-bold tracking-tight text-textPrimary md:text-[32px]">
        {heading}, {firstName}
      </h1>
      <p className="text-sm text-textSecondary md:text-[15px]">{subtitle}</p>
    </div>
  );
};
