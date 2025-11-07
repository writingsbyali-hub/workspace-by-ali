interface WelcomeHeaderProps {
  userName: string;
  subtitle?: string;
}

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "Good evening";
  } else {
    return "Welcome back";
  }
}

export default function WelcomeHeader({ userName, subtitle }: WelcomeHeaderProps) {
  const greeting = getTimeBasedGreeting();

  return (
    <div className="welcome-header">
      <h1>{greeting}, {userName}! 👋</h1>
      <p className="subtitle">
        {subtitle || "Here's what's happening with your workspace today."}
      </p>
    </div>
  );
}
