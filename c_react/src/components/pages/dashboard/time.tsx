import { useEffect, useState, use } from "react"
import { AppContext } from "@/contexts/app"
const Time = () => {
  const { isAdmin } = use(AppContext)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [uptime, setUptime] = useState(0)
  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)

  }, [])
  // Set Uptime
  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      setUptime(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUpTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  return !isAdmin && <div className="col-span-2 h-[200px] bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden rounded-md">
        <div className="p-0">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-2 border-b border-slate-700/50">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1 font-mono">
                SYSTEM TIME
              </div>
              <div className="text-3xl font-mono text-cyan-400 mb-1">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-slate-400">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                <div className="text-xs text-slate-500 mb-1">Uptime</div>
                <div className="text-sm font-mono text-slate-200">
                   {formatUpTime(uptime)}
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                <div className="text-xs text-slate-500 mb-1">Time Zone</div>
                <div className="text-sm font-mono text-slate-200">
                  {currentTime.toString().split(" ")[5]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

}
export default Time
