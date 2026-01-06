import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface AuctionCountdownProps {
  endTime: string;
  compact?: boolean;
}

export function AuctionCountdown({ endTime, compact = false }: AuctionCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(endTime).getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft.expired) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Clock size={16} />
        <span className="text-sm">Auction Ended</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-red-600" />
        <span className="text-sm">
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {String(timeLeft.hours).padStart(2, "0")}:
          {String(timeLeft.minutes).padStart(2, "0")}:
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center bg-black text-white rounded px-3 py-2 min-w-[60px]">
          <span className="text-2xl">{timeLeft.days}</span>
          <span className="text-xs text-gray-400">Days</span>
        </div>
      )}
      <div className="flex flex-col items-center bg-black text-white rounded px-3 py-2 min-w-[60px]">
        <span className="text-2xl">{String(timeLeft.hours).padStart(2, "0")}</span>
        <span className="text-xs text-gray-400">Hours</span>
      </div>
      <div className="flex flex-col items-center bg-black text-white rounded px-3 py-2 min-w-[60px]">
        <span className="text-2xl">{String(timeLeft.minutes).padStart(2, "0")}</span>
        <span className="text-xs text-gray-400">Mins</span>
      </div>
      <div className="flex flex-col items-center bg-black text-white rounded px-3 py-2 min-w-[60px]">
        <span className="text-2xl">{String(timeLeft.seconds).padStart(2, "0")}</span>
        <span className="text-xs text-gray-400">Secs</span>
      </div>
    </div>
  );
}
