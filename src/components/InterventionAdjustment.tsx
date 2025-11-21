import { useState } from "react";
import { ChevronLeft, AlertTriangle, TrendingDown, CheckCircle, Trophy, Package } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { toast } from "sonner@2.0.3";

interface Solution {
  id: string;
  type: "upgrade" | "increase" | "maintain";
  title: string;
  icon: string;
  product?: string;
  sku?: string;
  effectiveness?: number;
  expectedImprovement?: number;
  stock?: "sufficient" | "low" | "out";
  isChampion?: boolean;
  description: string;
  details?: string[];
}

interface InterventionAdjustmentProps {
  patient?: {
    bedNumber: string;
    name: string;
    age: number;
  };
  baselineScore?: number;
  currentScore?: number;
  interventionDays?: number;
  scoreDrop?: number;
  complianceRate?: number;
  currentIntervention?: string;
  onBack: () => void;
  onConfirm?: () => void;
  onAdjustmentComplete?: () => void;
}

export function InterventionAdjustment({
  patient,
  baselineScore = 80,
  currentScore = 65,
  interventionDays = 14,
  scoreDrop = 15,
  complianceRate = 100,
  currentIntervention = "补钙片剂",
  onBack,
  onConfirm,
  onAdjustmentComplete
}: InterventionAdjustmentProps) {
  const [selectedSolution, setSelectedSolution] = useState<string>("upgrade");
  
  const patientName = patient?.name || "张建国";
  const bedNumber = patient?.bedNumber || "205";

  // 根据打卡率决定推荐方案
  const isExecutionPerfect = complianceRate >= 80;

  const solutions: Solution[] = isExecutionPerfect ? [
    {
      id: "upgrade",
      type: "upgrade",
      title: "推荐方案：更换干预物",
      icon: "🏆",
      product: "盈养液体钙",
      sku: "SKU-001",
      effectiveness: 85,
      expectedImprovement: 30,
      stock: "sufficient",
      isChampion: true,
      description: "升级为高吸收率的液体钙制剂",
      details: [
        "临床有效率: 85%",
        "预计提分效率: +30%",
        "库存充足",
        "🟢 集团冠军商品"
      ]
    },
    {
      id: "increase",
      type: "increase",
      title: "保守方案：增加剂量",
      icon: "⚪",
      description: "改为每日 2 片（原方案 x2）",
      details: [
        "效果不确定",
        "可能增加肠胃负担"
      ]
    }
  ] : [
    {
      id: "maintain",
      type: "maintain",
      title: "推荐方案：督促护工落实",
      icon: "⚠️",
      description: "原方案未充分执行，需加强督导",
      details: [
        `当前打卡率仅 ${complianceRate}%`,
        "先确保执行到位再考虑换药"
      ]
    }
  ];

  const handleConfirm = () => {
    const selected = solutions.find(s => s.id === selectedSolution);
    
    // 震动反馈
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }

    if (selected?.type === "upgrade") {
      toast.success("方案已调整", {
        description: `已更换为${selected.product}，护工任务列表已更新`,
        duration: 3000
      });
      setTimeout(() => {
        toast.success("SaaS黄灯已熄灭", {
          description: "分院监控屏已同步更新",
          duration: 2000
        });
      }, 1500);
    } else if (selected?.type === "maintain") {
      toast.success("已发送督促通知", {
        description: "责任护工将收到震动催办",
        duration: 3000
      });
    } else {
      toast.success("方案已调整", {
        description: "剂量已增加至每日2片",
        duration: 3000
      });
    }

    setTimeout(() => {
      if (onConfirm) {
        onConfirm();
      } else {
        onBack();
      }
      if (onAdjustmentComplete) {
        onAdjustmentComplete();
      }
    }, 2000);
  };

  // 计算掉分百分比
  const dropPercentage = ((scoreDrop / baselineScore) * 100).toFixed(1);

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
        <div className="font-medium text-gray-800">方案调整</div>
        <div className="w-16"></div>
      </div>

      {/* 警示栏 */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-6">
        <div className="flex items-start gap-3 text-white">
          <AlertTriangle className="w-8 h-8 flex-shrink-0 animate-pulse" />
          <div className="flex-1">
            <div className="text-2xl font-bold mb-2">⚠️ 警告：干预失效</div>
            <div className="text-lg mb-1">
              {patientName} ({bedNumber}床)
            </div>
            <div className="text-lg">
              {currentIntervention} {interventionDays} 天，健康分不升反降
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingDown className="w-6 h-6" />
              <span className="text-xl font-bold">-{scoreDrop}分 (下降{dropPercentage}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 证据与审计区 */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="mb-6">
            <div className="text-xl font-medium text-gray-800 mb-4">证据与审计</div>

            {/* 掉分曲线 */}
            <div className="mb-6">
              <div className="text-gray-700 font-medium mb-3">1. 掉分曲线</div>
              <div className="bg-gray-50 rounded-lg p-6 relative">
                {/* 简化的图表 */}
                <div className="flex items-end justify-between h-48 relative">
                  {/* Y轴刻度 */}
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
                    <span>100分</span>
                    <span>75分</span>
                    <span>50分</span>
                    <span>25分</span>
                    <span>0分</span>
                  </div>

                  {/* 数据点 */}
                  <div className="flex-1 ml-12 flex items-end justify-around relative">
                    {/* 预期虚线 */}
                    <svg className="absolute inset-0 w-full h-full" style={{pointerEvents: 'none'}}>
                      <line 
                        x1="15%" 
                        y1={`${100 - baselineScore}%`}
                        x2="85%" 
                        y2={`${100 - (baselineScore + 10)}%`}
                        stroke="#d1d5db" 
                        strokeWidth="2" 
                        strokeDasharray="5,5"
                      />
                      {/* 实际下降线 */}
                      <line 
                        x1="15%" 
                        y1={`${100 - baselineScore}%`}
                        x2="85%" 
                        y2={`${100 - currentScore}%`}
                        stroke="#ef4444" 
                        strokeWidth="3"
                      />
                    </svg>

                    {/* 基线点 */}
                    <div className="flex flex-col items-center" style={{height: `${baselineScore}%`}}>
                      <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                      <div className="mt-2 text-center">
                        <div className="text-sm font-medium text-gray-700">基线</div>
                        <div className="text-lg font-bold text-blue-600">{baselineScore}分</div>
                        <div className="text-xs text-gray-500">{interventionDays}天前</div>
                      </div>
                    </div>

                    {/* 预期点（虚线终点） */}
                    <div className="flex flex-col items-center opacity-40" style={{height: `${baselineScore + 10}%`}}>
                      <div className="w-4 h-4 bg-gray-400 rounded-full border-2 border-white shadow"></div>
                      <div className="mt-2 text-center">
                        <div className="text-sm font-medium text-gray-500">预期</div>
                        <div className="text-lg font-bold text-gray-500">{baselineScore + 10}分</div>
                      </div>
                    </div>

                    {/* 复查点 */}
                    <div className="flex flex-col items-center" style={{height: `${currentScore}%`}}>
                      <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                      <div className="mt-2 text-center">
                        <div className="text-sm font-medium text-gray-700">复查</div>
                        <div className="text-lg font-bold text-red-600">{currentScore}分</div>
                        <div className="text-xs text-gray-500">今日</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 执行审计 */}
            <div>
              <div className="text-gray-700 font-medium mb-3">2. 执行审计</div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-700">护工打卡率:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-800">{complianceRate}%</span>
                    {isExecutionPerfect ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={cn(
                      "h-3 rounded-full transition-all",
                      isExecutionPerfect ? "bg-green-500" : "bg-red-500"
                    )}
                    style={{width: `${complianceRate}%`}}
                  ></div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border-l-4 border-blue-500">
                  <div className="text-sm text-gray-700">
                    💡 <span className="font-medium">系统分析：</span>
                    {isExecutionPerfect ? (
                      <span> 执行完美但分值下降，大概率因老人肠胃对'{currentIntervention}'吸收能力差。建议升级为高吸收率的液体钙。</span>
                    ) : (
                      <span> 护工执行不到位是主要原因，需先督促护工按时喂药，确保执行率达标。</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 智能决策区 */}
      <div className="px-4 pb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="mb-4">
            <div className="text-xl font-medium text-gray-800 mb-2">智能决策</div>
            <div className="text-gray-600">
              基于 [供应链效能库] 推荐：
            </div>
          </div>

          <div className="space-y-3">
            {solutions.map((solution) => (
              <button
                key={solution.id}
                onClick={() => {
                  setSelectedSolution(solution.id);
                  if (navigator.vibrate) {
                    navigator.vibrate(30);
                  }
                }}
                className={cn(
                  "w-full text-left p-5 rounded-xl border-2 transition-all min-h-[100px] active:scale-98",
                  selectedSolution === solution.id
                    ? solution.isChampion
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-500 shadow-lg"
                      : "bg-blue-50 border-blue-500"
                    : "bg-white border-gray-300 hover:border-gray-400"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* 选择圆圈 */}
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1",
                    selectedSolution === solution.id
                      ? solution.isChampion
                        ? "border-yellow-500 bg-yellow-500"
                        : "border-blue-500 bg-blue-500"
                      : "border-gray-400"
                  )}>
                    {selectedSolution === solution.id && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1">
                    {/* 标题 */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{solution.icon}</span>
                      <span className="font-medium text-gray-800">{solution.title}</span>
                      {solution.isChampion && (
                        <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          🔥 集团优选
                        </span>
                      )}
                    </div>

                    {/* 产品信息 */}
                    {solution.product && (
                      <div className="mb-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-medium text-gray-800">{solution.product}</span>
                          <span className="text-sm text-gray-500">{solution.sku}</span>
                        </div>
                        <div className="text-sm text-gray-600">{solution.description}</div>
                      </div>
                    )}

                    {/* 描述 */}
                    {!solution.product && (
                      <div className="text-gray-700 mb-3">{solution.description}</div>
                    )}

                    {/* 详细信息 */}
                    {solution.details && (
                      <div className="space-y-2">
                        {solution.details.map((detail, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {detail.includes("🟢") || detail.includes("临床有效率") || detail.includes("预计提分") || detail.includes("库存充足") ? (
                              <Trophy className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                            ) : detail.includes("效果不确定") || detail.includes("肠胃负担") ? (
                              <AlertTriangle className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            ) : (
                              <Package className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            )}
                            <span className={cn(
                              detail.includes("🟢") || detail.includes("临床有效率") || detail.includes("预计提分")
                                ? "text-gray-800 font-medium"
                                : "text-gray-600"
                            )}>
                              {detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 底部固定按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-6">
        <Button
          onClick={handleConfirm}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white min-h-[80px] text-xl font-medium active:scale-95 transition-transform shadow-lg"
        >
          确认调整并下发
        </Button>
        <div className="text-center text-sm text-gray-500 mt-3">
          提交后将更新护工任务列表，并熄灭 SaaS 黄灯
        </div>
      </div>
    </div>
  );
}