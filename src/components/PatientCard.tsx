import { AlertTriangle, TrendingDown, Sparkles, Pill, Apple, Heart, TrendingUp, ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { cn } from "../lib/utils";

interface Task {
  id: string;
  type: "medicine" | "meal" | "care";
  description: string;
  completed: boolean;
}

interface Patient {
  id: string;
  bedNumber: string;
  name: string;
  age: number;
  score: number;
  status: "urgent" | "warning" | "normal";
  alert?: string;
  lastCheck?: string;
  scoreChange?: number;
  tasks?: Task[];
}

interface PatientCardProps {
  patient: Patient;
  onTaskToggle: (patientId: string, taskId: string) => void;
  onAssessment: (patientId: string) => void;
  onAdjustment?: () => void;
}

export function PatientCard({ patient, onTaskToggle, onAssessment, onAdjustment }: PatientCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return {
          bg: "bg-red-50",
          border: "border-l-red-500",
          text: "text-red-700",
          icon: "text-red-500",
          scoreText: "text-red-600"
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-l-yellow-500",
          text: "text-yellow-700",
          icon: "text-yellow-500",
          scoreText: "text-yellow-600"
        };
      default:
        return {
          bg: "bg-white",
          border: "border-l-green-500",
          text: "text-gray-700",
          icon: "text-green-500",
          scoreText: "text-green-600"
        };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "urgent":
        return <AlertTriangle className="w-6 h-6" />;
      case "warning":
        return <TrendingDown className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "medicine":
        return <Pill className="w-5 h-5" />;
      case "meal":
        return <Apple className="w-5 h-5" />;
      case "care":
        return <Heart className="w-5 h-5" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (score: number) => {
    if (score < 70) return "风险 - 请密切关注";
    if (score < 90) return "亚健康 - 需调理";
    return "健康 - 状态极佳";
  };

  const colors = getStatusColor(patient.status);

  return (
    <div
      className={cn(
        "border-l-4 rounded-lg p-4 shadow-sm transition-all",
        colors.bg,
        colors.border,
        patient.status === "urgent" && patient.alert && "animate-pulse"
      )}
    >
      {/* 第一行：床号、姓名、年龄 | 分数 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={colors.icon}>
            {getStatusIcon(patient.status)}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className={cn("font-medium", colors.text)}>
                [{patient.bedNumber}床]
              </span>
              <span className={cn(colors.text)}>
                {patient.name}
              </span>
              <span className="text-gray-500">
                ({patient.age}岁)
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={cn("text-3xl font-bold leading-none", colors.scoreText)}>
            {patient.score}分
          </div>
          <div className={cn("text-sm mt-1", colors.text)}>
            {getStatusText(patient.score)}
          </div>
        </div>
      </div>

      {/* 第二行：警告信息 */}
      {patient.alert && (
        <div className={cn("flex items-start gap-2 mb-3 p-3 rounded-lg", 
          patient.status === "urgent" ? "bg-red-100" : "bg-yellow-100"
        )}>
          <AlertTriangle className={cn("w-5 h-5 flex-shrink-0 mt-0.5", colors.icon)} />
          <span className={colors.text}>{patient.alert}</span>
        </div>
      )}

      {/* 分数变化 */}
      {patient.scoreChange !== undefined && (
        <div className="mb-3">
          {patient.scoreChange < 0 ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg inline-flex">
              <ArrowDown className="w-5 h-5 text-orange-600" />
              <span className="text-orange-700 font-medium">
                昨日 {patient.scoreChange}分
              </span>
            </div>
          ) : patient.scoreChange > 0 ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg inline-flex">
              <ArrowUp className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">
                昨日 +{patient.scoreChange}分
              </span>
            </div>
          ) : null}
        </div>
      )}

      {/* 状态文案 */}
      {!patient.alert && (
        <div className="flex items-center gap-2 mb-3 text-gray-600">
          <span>上次监测：{patient.lastCheck}</span>
        </div>
      )}

      {/* 任务列表 */}
      {patient.tasks && patient.tasks.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {patient.tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskToggle(patient.id, task.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all min-h-[60px] active:scale-95 cursor-pointer",
                task.completed
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
              )}
            >
              <Checkbox checked={task.completed} className="pointer-events-none" />
              <div className="flex items-center gap-2">
                {getTaskIcon(task.type)}
                <span className={cn(task.completed && "line-through")}>
                  {task.type === "medicine" && "待喂药: "}
                  {task.type === "meal" && "待加餐: "}
                  {task.type === "care" && "待护理: "}
                  {task.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 去评估按钮 */}
      {patient.status === "urgent" && patient.alert && (
        <Button
          onClick={onAdjustment || (() => onAssessment(patient.id))}
          className="w-full bg-red-600 hover:bg-red-700 text-white min-h-[60px] text-base active:scale-95 transition-transform"
        >
          去评估
        </Button>
      )}
    </div>
  );
}