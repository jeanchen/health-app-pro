import { useState, useEffect } from "react";
import { ChevronLeft, Bluetooth, AlertTriangle, Check } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { toast } from "sonner@2.0.3";

interface MonitoringExecutionProps {
  patientName?: string;
  bedNumber?: string;
  age?: number;
  onBack: () => void;
  onComplete?: (data: { score: number; isRecheck: boolean }) => void;
}

export function MonitoringExecution({ 
  patientName = "张建国", 
  bedNumber = "201-A",
  age = 82,
  onBack,
  onComplete
}: MonitoringExecutionProps) {
  const [spo2, setSpo2] = useState(98);
  const [pr, setPr] = useState(72);
  const [pi, setPi] = useState(3.8);
  const [isConnected, setIsConnected] = useState(true);
  const [signalQuality, setSignalQuality] = useState<"good" | "weak" | "disconnected">("good");
  const [selectedTag, setSelectedTag] = useState<"routine" | "baseline" | "recheck">("routine");
  const [progress, setProgress] = useState(0);
  const [isCollecting, setIsCollecting] = useState(true);
  const [wavePoints, setWavePoints] = useState<number[]>([]);

  // 模拟波形数据
  useEffect(() => {
    const interval = setInterval(() => {
      setWavePoints(prev => {
        const newPoints = [...prev];
        // 生成心跳波形（简化的PPG波形）
        const time = Date.now() / 100;
        const heartbeat = Math.sin(time * 0.5) * 30 + Math.sin(time * 2) * 15;
        newPoints.push(50 + heartbeat);
        if (newPoints.length > 100) {
          newPoints.shift();
        }
        return newPoints;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // 模拟数据采集进度
  useEffect(() => {
    if (isCollecting && progress < 100) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsCollecting(false);
            // 震动反馈
            if (navigator.vibrate) {
              navigator.vibrate(100);
            }
            return 100;
          }
          return prev + 100 / 30; // 30秒完成
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isCollecting, progress]);

  // 模拟数值轻微波动
  useEffect(() => {
    const interval = setInterval(() => {
      setSpo2(prev => Math.min(100, Math.max(95, prev + (Math.random() - 0.5))));
      setPr(prev => Math.min(85, Math.max(65, prev + (Math.random() - 0.5) * 2)));
      setPi(prev => Math.min(5, Math.max(2, prev + (Math.random() - 0.5) * 0.2)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSave = () => {
    if (spo2 < 90) {
      toast.error("数值危急！", {
        description: `血氧 ${spo2.toFixed(0)}% 过低！请确认老人状态后再上传。`,
        duration: 5000
      });
      return;
    }

    // 震动反馈
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    if (selectedTag === "recheck") {
      toast.success("正在验证干预效果...", {
        description: "数据比对中，请稍候",
        duration: 1500
      });
      setTimeout(() => {
        if (onComplete) {
          onComplete({ score: 78, isRecheck: true });
        }
      }, 1500);
    } else {
      toast.success("数据已保存", {
        description: "正在生成健康报告...",
        duration: 1500
      });
      setTimeout(() => {
        if (onComplete) {
          onComplete({ score: 72, isRecheck: false });
        }
      }, 1500);
    }
  };

  const getTagLabel = (tag: string) => {
    switch (tag) {
      case "routine": return "日常巡检";
      case "baseline": return "基线建档";
      case "recheck": return "干预复查";
      default: return "";
    }
  };

  const getTagDescription = (tag: string) => {
    switch (tag) {
      case "routine": return "每日例行记录";
      case "baseline": return "设定对比原点";
      case "recheck": return "验证食补/药补效果 (关联政绩工分)";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* 顶部信息栏 */}
      <div className="bg-gray-900 px-4 py-4 flex items-center justify-between border-b border-gray-800">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-300 hover:text-white min-h-[44px] min-w-[44px] active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" />
          <span>返回</span>
        </button>
        <div className="flex items-center gap-3">
          <div>
            <span className="font-medium">{patientName}</span>
            <span className="text-gray-400 ml-2">({bedNumber})</span>
          </div>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">{age}岁</span>
        </div>
        <div className="flex items-center gap-2">
          <Bluetooth className={cn("w-5 h-5", isConnected ? "text-blue-400" : "text-gray-500")} />
          <span className={cn("text-sm", isConnected ? "text-blue-400" : "text-gray-500")}>
            {isConnected ? "已连接" : "未连接"}
          </span>
        </div>
      </div>

      {/* 波形显示区 */}
      <div className="px-4 py-8 bg-black">
        <div className="h-32 relative">
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* 网格线 */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 32}
                x2="100%"
                y2={i * 32}
                stroke="#1a1a1a"
                strokeWidth="1"
              />
            ))}
            
            {/* PPG波形 */}
            {wavePoints.length > 1 && (
              <polyline
                points={wavePoints.map((y, x) => `${(x / wavePoints.length) * 100}%,${y}`).join(" ")}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
                className="animate-pulse"
              />
            )}
          </svg>
        </div>
      </div>

      {/* 数据显示区 */}
      <div className="px-4 py-6 grid grid-cols-3 gap-4 border-b border-gray-800">
        <div className="text-center">
          <div className="text-gray-400 mb-2">SpO2 (血氧)</div>
          <div className="text-5xl font-bold text-cyan-400">
            {spo2.toFixed(0)}
            <span className="text-2xl ml-1">%</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 mb-2">PR (脉率)</div>
          <div className="text-5xl font-bold text-green-400">
            {pr.toFixed(0)}
            <span className="text-2xl ml-1">bpm</span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 mb-2">PI (灌注)</div>
          <div className="text-5xl font-bold text-gray-500">
            {pi.toFixed(1)}
          </div>
        </div>
      </div>

      {/* 信号质量提示 */}
      <div className="px-4 py-4 border-b border-gray-800">
        {signalQuality === "good" && (
          <div className="flex items-center gap-2 text-green-400">
            <Check className="w-5 h-5" />
            <span>信号良好，数据有效</span>
          </div>
        )}
        {signalQuality === "weak" && (
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-5 h-5" />
            <span>信号微弱 (PI{"<"}0.5)。请帮老人搓热手指或更换中指复测。</span>
          </div>
        )}
        {signalQuality === "disconnected" && (
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span>未检测到手指，请检查夹子是否夹稳。</span>
          </div>
        )}
      </div>

      {/* 战略标签选择区 */}
      <div className="flex-1 px-4 py-6">
        <div className="mb-4 text-gray-400">此数据用于：</div>
        <div className="space-y-3">
          {(["routine", "baseline", "recheck"] as const).map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTag(tag);
                if (navigator.vibrate) {
                  navigator.vibrate(30);
                }
              }}
              className={cn(
                "w-full flex items-start gap-4 p-4 rounded-lg border-2 transition-all min-h-[80px] active:scale-98",
                selectedTag === tag
                  ? tag === "recheck"
                    ? "bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border-yellow-500"
                    : "bg-blue-900/30 border-blue-500"
                  : "bg-gray-900 border-gray-700 hover:border-gray-600"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0",
                selectedTag === tag
                  ? tag === "recheck"
                    ? "border-yellow-500 bg-yellow-500"
                    : "border-blue-500 bg-blue-500"
                  : "border-gray-600"
              )}>
                {selectedTag === tag && <div className="w-3 h-3 bg-white rounded-full" />}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  {tag === "recheck" && <span className="text-yellow-400">🏆</span>}
                  {tag === "routine" && <span className="text-blue-400">🔵</span>}
                  {tag === "baseline" && <span className="text-gray-400">⚪</span>}
                  <span className="font-medium">{getTagLabel(tag)}</span>
                </div>
                <div className="text-sm text-gray-400">{getTagDescription(tag)}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="px-4 py-6 bg-gray-900 border-t border-gray-800">
        <Button
          onClick={handleSave}
          disabled={isCollecting}
          className={cn(
            "w-full min-h-[80px] text-xl font-medium transition-all relative overflow-hidden",
            isCollecting
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : selectedTag === "recheck"
              ? "bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
          )}
        >
          {isCollecting ? (
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#374151"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm">
                  {Math.ceil(30 - (progress / 100) * 30)}s
                </div>
              </div>
              <span>正在采集数据...</span>
            </div>
          ) : selectedTag === "recheck" ? (
            "上传并验证效果"
          ) : (
            "保存并上传"
          )}
        </Button>
      </div>
    </div>
  );
}