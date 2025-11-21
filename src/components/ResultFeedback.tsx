import { useState, useEffect } from "react";
import { ChevronLeft, Share2, TrendingUp, TrendingDown, ArrowRight, Trophy, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { cn } from "../lib/utils";
import { toast } from "sonner@2.0.3";

interface Task {
  id: string;
  type: "medicine" | "food" | "care";
  icon: string;
  title: string;
  description: string;
  completed: boolean;
}

interface ResultFeedbackProps {
  patientName?: string;
  bedNumber?: string;
  score: number;
  previousScore?: number;
  isRecheck?: boolean;
  baselineScore?: number;
  onBack: () => void;
  onNext?: () => void;
}

export function ResultFeedback({
  patientName = "张建国",
  bedNumber = "201-A",
  score = 72,
  previousScore = 67,
  isRecheck = false,
  baselineScore = 62,
  onBack,
  onNext
}: ResultFeedbackProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [showGoldenMoment, setShowGoldenMoment] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const scoreChange = previousScore ? score - previousScore : 0;
  const recheckImprovement = isRecheck && baselineScore ? score - baselineScore : 0;

  // 判断是否触发高光时刻
  const isGoldenMoment = isRecheck && recheckImprovement >= 10;

  // 获取分数等级
  const getScoreLevel = (s: number) => {
    if (s < 70) return { level: "risk", label: "风险人群", color: "red", emoji: "🔴" };
    if (s < 90) return { level: "warning", label: "亚健康人群", color: "yellow", emoji: "🟡" };
    return { level: "healthy", label: "健康人群", color: "green", emoji: "🟢" };
  };

  const currentLevel = getScoreLevel(score);

  // 获取诊断文案
  const getDiagnosisText = () => {
    if (score < 70) {
      return "得分不及格！检测到严重营养流失，心脑血管风险较高，请立即加强干预。";
    }
    if (score < 90) {
      return "得分一般，检测到钙、锌流失较快，身体处于损耗状态，建议及时调理。";
    }
    return "身体状态极佳！各项指标均处于健康范围，请继续保持。";
  };

  // 根据分数生成任务
  useEffect(() => {
    const generatedTasks: Task[] = [];
    
    if (score < 70) {
      // 风险人群：药补
      generatedTasks.push({
        id: "t1",
        type: "medicine",
        icon: "💊",
        title: "药补任务",
        description: "喂服：盈养液体钙 10ml (餐后)",
        completed: false
      });
      generatedTasks.push({
        id: "t2",
        type: "medicine",
        icon: "💊",
        title: "药补任务",
        description: "喂服：维生素D 1粒 (早餐)",
        completed: false
      });
    } else if (score < 90) {
      // 亚健康：食补
      generatedTasks.push({
        id: "t3",
        type: "food",
        icon: "🥦",
        title: "食补任务",
        description: "膳食：通知食堂晚餐加蛋",
        completed: false
      });
      generatedTasks.push({
        id: "t4",
        type: "food",
        icon: "🥛",
        title: "食补任务",
        description: "喂服：纯牛奶 200ml",
        completed: false
      });
    } else {
      // 健康：维持
      generatedTasks.push({
        id: "t5",
        type: "care",
        icon: "🚶",
        title: "护理任务",
        description: "户外活动 20分钟",
        completed: false
      });
    }
    
    setTasks(generatedTasks);
  }, [score]);

  // 分数跑分动画
  useEffect(() => {
    if (isGoldenMoment) {
      // 高光时刻：先显示特效
      setShowGoldenMoment(true);
      setTimeout(() => {
        setShowGoldenMoment(false);
        startScoreAnimation();
      }, 3000);
    } else {
      startScoreAnimation();
    }
  }, []);

  const startScoreAnimation = () => {
    const duration = 2000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
        // 震动反馈
        if (navigator.vibrate) {
          navigator.vibrate(100);
        }
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);
  };

  const handleTaskToggle = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newCompleted = !task.completed;
        if (newCompleted) {
          // 震动反馈
          if (navigator.vibrate) {
            navigator.vibrate([50, 30, 50]);
          }
          toast.success("任务已完成", {
            description: task.description,
            duration: 2000
          });
        }
        return { ...task, completed: newCompleted };
      }
      return task;
    }));
  };

  const handleShare = () => {
    toast.success("报告已生成", {
      description: "可通过微信分享给家属",
      duration: 2000
    });
  };

  // 高光时刻全屏特效
  if (showGoldenMoment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-yellow-400 to-orange-400 flex items-center justify-center p-8 relative overflow-hidden">
        {/* 粒子效果 */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-white rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="text-center relative z-10">
          <Trophy className="w-32 h-32 text-white mx-auto mb-6 animate-bounce" />
          <div className="text-white text-4xl font-bold mb-4">
            显著改善！干预有效！
          </div>
          <div className="text-white text-2xl mb-6">
            基线 {baselineScore} ➔ 复查 {score}
          </div>
          <div className="flex items-center justify-center gap-2 text-white text-xl">
            <TrendingUp className="w-8 h-8" />
            <span className="text-3xl font-bold">+{recheckImprovement}分</span>
          </div>
          <div className="mt-8 text-white text-lg">
            已生成战报，同步至集团指挥中心
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-32">
      {/* 顶部导航 */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 min-h-[44px] min-w-[44px] active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" />
          <span>返回</span>
        </button>
        <div className="text-gray-600">监测完成</div>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-blue-600 min-h-[44px] min-w-[44px] active:scale-95 transition-transform"
        >
          <Share2 className="w-5 h-5" />
          <span>分享</span>
        </button>
      </div>

      {/* 仪表盘区域 */}
      <div
        className={cn(
          "px-6 py-12 transition-colors duration-1000",
          currentLevel.color === "red" && "bg-gradient-to-b from-red-500 to-red-400",
          currentLevel.color === "yellow" && "bg-gradient-to-b from-yellow-500 to-yellow-400",
          currentLevel.color === "green" && "bg-gradient-to-b from-green-500 to-green-400"
        )}
      >
        <div className="text-center text-white">
          {/* 圆形仪表盘 */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-48 h-48 transform -rotate-90">
              {/* 背景圆环 */}
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="12"
                fill="none"
              />
              {/* 进度圆环 */}
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="white"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - displayScore / 100)}`}
                className="transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-7xl font-bold">{displayScore}</div>
              <div className="text-xl mt-2">分</div>
            </div>
          </div>

          {/* 人群标签 */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-4xl">{currentLevel.emoji}</span>
            <span className="text-2xl font-medium">{currentLevel.label}</span>
          </div>

          {/* 分数变化 */}
          {scoreChange !== 0 && (
            <div className="flex items-center justify-center gap-2">
              {scoreChange > 0 ? (
                <>
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-xl">比上次 +{scoreChange}分 (继续加油)</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-6 h-6" />
                  <span className="text-xl">比上次 {scoreChange}分 (需要注意)</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 诊断卡片 */}
      <div className="px-4 -mt-6 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="mb-4">
            <div className="text-xl font-medium text-gray-800 mb-3 leading-relaxed">
              {getDiagnosisText()}
            </div>
          </div>

          {/* 3D人体模型区域（简化版） */}
          <div className="bg-gray-50 rounded-lg p-6 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-6xl">🧍</div>
                <div>
                  <div className="text-red-600 font-medium mb-1 flex items-center gap-2">
                    🔴 腿骨 (严重缺钙)
                  </div>
                  <div className="text-sm text-gray-600">
                    缺钙易导致骨质疏松、跌倒风险
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 text-blue-600 py-3 hover:bg-blue-50 rounded-lg transition-colors min-h-[60px]">
            <Sparkles className="w-5 h-5" />
            <span>点击查看 26 项详情</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 干预任务区 */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="mb-4">
            <div className="text-lg font-medium text-gray-800 mb-2">
              分层干预任务
            </div>
            <div className="text-gray-600">
              基于您的得分，今日需执行：
            </div>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleTaskToggle(task.id)}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border-2 transition-all min-h-[80px] cursor-pointer active:scale-98",
                  task.completed
                    ? "bg-green-50 border-green-500"
                    : "bg-white border-gray-300 hover:border-blue-400"
                )}
              >
                <Checkbox checked={task.completed} className="mt-1 pointer-events-none" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{task.icon}</span>
                    <span className={cn("font-medium", task.completed && "line-through text-gray-500")}>
                      {task.title}
                    </span>
                  </div>
                  <div className={cn("text-gray-700", task.completed && "line-through text-gray-400")}>
                    {task.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部固定按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-6">
        <Button
          onClick={onNext || onBack}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white min-h-[80px] text-xl font-medium active:scale-95 transition-transform"
        >
          下一位: 202床 王大力
        </Button>
      </div>
    </div>
  );
}
