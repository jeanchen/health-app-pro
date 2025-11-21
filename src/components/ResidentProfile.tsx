import { useState } from "react";
import { ChevronLeft, AlertCircle, TrendingUp, Edit, CheckCircle, Home, FileText, User, Activity } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { toast } from "sonner@2.0.3";

interface Resident {
  id: string;
  name: string;
  bedNumber: string;
  age: number;
  careLevel: string;
  score: number;
  scoreTrend?: number;
  riskTags: string[];
  avatar?: string;
}

interface NutrientData {
  name: string;
  value: number;
  status: "normal" | "low" | "critical";
  description?: string;
}

interface HistoryPoint {
  date: string;
  score: number;
  label?: string;
}

interface Task {
  id: string;
  type: "medicine" | "food" | "care";
  icon: string;
  description: string;
}

interface ResidentProfileProps {
  resident: Resident;
  onBack: () => void;
  onEditPlan?: () => void;
  onNavigate?: (tab: "workbench" | "monitor" | "files" | "profile") => void;
}

export function ResidentProfile({ resident, onBack, onEditPlan, onNavigate }: ResidentProfileProps) {
  const [activeTab, setActiveTab] = useState<"health" | "trends" | "plan">("health");
  const [showWiki, setShowWiki] = useState(false);
  const [selectedNutrient, setSelectedNutrient] = useState<NutrientData | null>(null);

  const getScoreLevel = (score: number) => {
    if (score < 70) return { color: "red", label: "风险", emoji: "🔴" };
    if (score < 90) return { color: "yellow", label: "亚健康", emoji: "🟡" };
    return { color: "green", label: "健康", emoji: "🟢" };
  };

  const level = getScoreLevel(resident.score);

  // 26项数据（简化版，显示关键项）
  const nutrients: NutrientData[] = [
    { name: "钙", value: 1.8, status: "critical", description: "严重缺乏" },
    { name: "锌", value: 6.5, status: "low", description: "轻度缺乏" },
    { name: "维生素D", value: 15, status: "low", description: "偏低" },
    { name: "铁", value: 48, status: "normal", description: "正常" },
    { name: "硒", value: 42, status: "normal", description: "正常" },
    { name: "维生素B12", value: 380, status: "normal", description: "正常" }
  ];

  // 历史趋势数据
  const historyData: HistoryPoint[] = [
    { date: "10月1日", score: 62, label: "入住基线" },
    { date: "10月8日", score: 68, label: "首次复查" },
    { date: "10月15日", score: 78, label: "干预后" },
    { date: "今日", score: 65, label: "本次检测" }
  ];

  // 当前干预方案
  const currentPlan: Task[] = [
    { id: "1", type: "medicine", icon: "💊", description: "盈养液体钙 10ml (每日餐后)" },
    { id: "2", type: "food", icon: "🥛", description: "每日增加 200ml 纯牛奶" },
    { id: "3", type: "care", icon: "☀️", description: "户外晒太阳 30分钟" }
  ];

  const complianceRate = 100; // 近7天打卡率

  // 百科数据
  const wikiData: { [key: string]: any } = {
    "钙": {
      title: "钙 (Calcium) —— 骨骼的基石",
      harm: "易导致骨质疏松、腿抽筋、睡眠质量差、牙齿松动。",
      foodSuggestion: "牛奶、豆制品、深绿叶蔬菜、芝麻、虾皮。",
      script: "（念给家属听）大爷目前缺钙比较严重，这也是他最近腿疼的主要原因。建议坚持服用液体钙，同时配合食补，每天喝牛奶。"
    },
    "锌": {
      title: "锌 (Zinc) —— 免疫力的卫士",
      harm: "易导致食欲不振、免疫力下降、伤口愈合慢、味觉减退。",
      foodSuggestion: "瘦肉、海鲜、坚果、全谷物。",
      script: "（念给家属听）老人缺锌会影响免疫力和食欲，建议适当补充富锌食物。"
    },
    "硒": {
      title: "硒 (Selenium) —— 心脏的守护神",
      harm: "缺硒可能导致心肌无力、免疫功能下降、甲状腺功能异常。",
      foodSuggestion: "海产品、动物内脏、蘑菇、大蒜。",
      script: "（念给家属听）硒是保护心脏的重要元素，建议适当增加海产品摄入。"
    }
  };

  const handleNutrientClick = (nutrient: NutrientData) => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setSelectedNutrient(nutrient);
    setShowWiki(true);
  };

  const handleCloseWiki = () => {
    setShowWiki(false);
    setTimeout(() => setSelectedNutrient(null), 300);
  };

  const maxScore = Math.max(...historyData.map(d => d.score));
  const minScore = Math.min(...historyData.map(d => d.score));
  const firstScore = historyData[0].score;
  const lastScore = historyData[historyData.length - 1].score;
  const improvement = lastScore - firstScore;
  const days = 15; // 示例天数

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* 顶部导航 */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 min-h-[44px] min-w-[44px] active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" />
          <span>返回</span>
        </button>
        <div className="font-medium text-gray-800">长者档案</div>
        <div className="w-16"></div>
      </div>

      {/* 头部画像卡 */}
      <div className="bg-white px-6 py-6 border-b border-gray-200">
        <div className="flex items-start gap-4 mb-4">
          {/* 头像 + 分值色环 */}
          <div className="relative">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center text-3xl border-4",
              level.color === "red" && "border-red-500 bg-red-50",
              level.color === "yellow" && "border-yellow-500 bg-yellow-50",
              level.color === "green" && "border-green-500 bg-green-50"
            )}>
              {resident.avatar || "👤"}
            </div>
            <div className={cn(
              "absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
              level.color === "red" && "bg-red-600",
              level.color === "yellow" && "bg-yellow-600",
              level.color === "green" && "bg-green-600"
            )}>
              {resident.score}
            </div>
          </div>

          {/* 基本信息 */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-gray-800">{resident.name}</span>
              <span className="text-gray-600">{resident.age}岁</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-gray-600">{resident.bedNumber}床</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                {resident.careLevel}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              健康状态：{level.emoji} {level.label}
            </div>
          </div>
        </div>

        {/* 风险标签 */}
        {resident.riskTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {resident.riskTags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
              >
                ⚠️ {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tab导航 */}
      <div className="bg-white border-b border-gray-200 sticky top-[73px] z-10">
        <div className="flex">
          <button
            onClick={() => setActiveTab("health")}
            className={cn(
              "flex-1 py-4 text-center font-medium transition-colors min-h-[60px]",
              activeTab === "health"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            )}
          >
            健康透视
          </button>
          <button
            onClick={() => setActiveTab("trends")}
            className={cn(
              "flex-1 py-4 text-center font-medium transition-colors min-h-[60px]",
              activeTab === "trends"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            )}
          >
            改善趋势
          </button>
          <button
            onClick={() => setActiveTab("plan")}
            className={cn(
              "flex-1 py-4 text-center font-medium transition-colors min-h-[60px]",
              activeTab === "plan"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            )}
          >
            干预方案
          </button>
        </div>
      </div>

      {/* Tab内容区 */}
      <div className="flex-1 overflow-y-auto">
        {/* Tab 1: 健康透视 */}
        {activeTab === "health" && (
          <div className="p-4 space-y-4">
            {/* 简化版雷达图（用列表表示） */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="text-lg font-medium text-gray-800 mb-4">26项健康指标</div>
              <div className="space-y-3">
                {nutrients.map((nutrient, index) => (
                  <button
                    key={index}
                    onClick={() => handleNutrientClick(nutrient)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 active:scale-98 transition-all min-h-[70px]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        nutrient.status === "critical" && "bg-red-500 animate-pulse",
                        nutrient.status === "low" && "bg-yellow-500",
                        nutrient.status === "normal" && "bg-green-500"
                      )}></div>
                      <div className="text-left">
                        <div className="font-medium text-gray-800">{nutrient.name}</div>
                        <div className={cn(
                          "text-sm",
                          nutrient.status === "critical" && "text-red-600",
                          nutrient.status === "low" && "text-yellow-600",
                          nutrient.status === "normal" && "text-green-600"
                        )}>
                          {nutrient.status === "critical" && "🔴 "}
                          {nutrient.status === "low" && "🟠 "}
                          {nutrient.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{nutrient.value}</span>
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 改善趋势 */}
        {activeTab === "trends" && (
          <div className="p-4 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="text-lg font-medium text-gray-800 mb-6">健康分值变化</div>
              
              {/* 趋势图 */}
              <div className="mb-6">
                <div className="relative h-64 bg-gray-50 rounded-lg p-4">
                  {/* Y轴刻度 */}
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
                    <span>100</span>
                    <span>80</span>
                    <span>60</span>
                    <span>40</span>
                    <span>20</span>
                  </div>

                  {/* 图表区域 */}
                  <div className="ml-8 h-full relative">
                    {/* 连接线 */}
                    <svg className="absolute inset-0 w-full h-full" style={{pointerEvents: 'none'}}>
                      {historyData.map((point, index) => {
                        if (index === historyData.length - 1) return null;
                        const nextPoint = historyData[index + 1];
                        const x1 = (index / (historyData.length - 1)) * 100;
                        const x2 = ((index + 1) / (historyData.length - 1)) * 100;
                        const y1 = 100 - (point.score / 100 * 100);
                        const y2 = 100 - (nextPoint.score / 100 * 100);
                        return (
                          <line
                            key={index}
                            x1={`${x1}%`}
                            y1={`${y1}%`}
                            x2={`${x2}%`}
                            y2={`${y2}%`}
                            stroke="#3b82f6"
                            strokeWidth="3"
                          />
                        );
                      })}
                    </svg>

                    {/* 数据点 */}
                    <div className="relative h-full flex items-end justify-between">
                      {historyData.map((point, index) => {
                        const isFirst = index === 0;
                        const isLast = index === historyData.length - 1;
                        return (
                          <div
                            key={index}
                            className="flex flex-col items-center"
                            style={{ height: `${point.score}%` }}
                          >
                            <div className={cn(
                              "w-4 h-4 rounded-full border-2 border-white shadow-lg",
                              isFirst && "bg-red-500",
                              isLast && "bg-blue-500 animate-pulse",
                              !isFirst && !isLast && "bg-blue-400"
                            )}></div>
                            <div className="mt-2 text-center whitespace-nowrap">
                              <div className="text-xs text-gray-500 mb-1">{point.date}</div>
                              <div className={cn(
                                "font-bold",
                                isFirst && "text-red-600",
                                isLast && "text-blue-600",
                                !isFirst && !isLast && "text-gray-700"
                              )}>
                                {point.score}分
                              </div>
                              {point.label && (
                                <div className="text-xs text-gray-500 mt-1">{point.label}</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 结论卡片 */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
                <div className="flex items-start gap-3">
                  {improvement > 0 ? (
                    <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 mb-2">趋势分析</div>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {improvement > 0 ? (
                        <>经过 {days} 天干预，健康分提升 {improvement} 分，身体状况显著改善。</>
                      ) : (
                        <>近期健康分下降 {Math.abs(improvement)} 分，建议调整干预方案。</>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 干预方案 */}
        {activeTab === "plan" && (
          <div className="p-4 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-medium text-gray-800">当前干预方案</div>
                {onEditPlan && (
                  <button
                    onClick={onEditPlan}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-transform min-h-[44px]"
                  >
                    <Edit className="w-4 h-4" />
                    <span>编辑</span>
                  </button>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {currentPlan.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <span className="text-2xl">{task.icon}</span>
                    <div className="flex-1">
                      <div className="text-gray-800">{task.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 执行审计 */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-700 font-medium">近 7 天打卡率</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-700">{complianceRate}%</span>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="w-full bg-green-200 rounded-full h-3">
                  <div
                    className="h-3 bg-green-600 rounded-full transition-all"
                    style={{ width: `${complianceRate}%` }}
                  ></div>
                </div>
                <div className="mt-3 text-sm text-gray-700">
                  护工执行到位，方案落实良好 ✓
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 百科浮窗 */}
      {showWiki && selectedNutrient && wikiData[selectedNutrient.name] && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
          onClick={handleCloseWiki}
        >
          <div
            className={cn(
              "bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto transition-transform duration-300",
              showWiki ? "translate-y-0" : "translate-y-full"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 拖拽指示条 */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

            <div className="space-y-6">
              {/* 标题 */}
              <div className="text-2xl font-bold text-gray-800">
                {wikiData[selectedNutrient.name].title}
              </div>

              {/* 缺乏危害 */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="font-medium text-red-800 mb-2">⚠️ 缺乏危害</div>
                <div className="text-gray-700 leading-relaxed">
                  {wikiData[selectedNutrient.name].harm}
                </div>
              </div>

              {/* 食补建议 */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="font-medium text-green-800 mb-2">🥗 食补建议</div>
                <div className="text-gray-700 leading-relaxed">
                  {wikiData[selectedNutrient.name].foodSuggestion}
                </div>
              </div>

              {/* 话术提示 */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="font-medium text-blue-800 mb-2">💬 话术提示</div>
                <div className="text-gray-700 leading-relaxed italic">
                  {wikiData[selectedNutrient.name].script}
                </div>
              </div>

              {/* 关闭按钮 */}
              <Button
                onClick={handleCloseWiki}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white min-h-[60px] text-lg"
              >
                我知道了
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 底部导航栏 */}
      {onNavigate && (
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex justify-around items-center fixed bottom-0 left-0 right-0 z-30">
          <button 
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(30);
              onNavigate("workbench");
            }}
            className="flex flex-col items-center gap-1 px-6 py-2 min-h-[60px] active:bg-gray-100 rounded-lg transition-colors"
          >
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-gray-400">作业台</span>
          </button>
          <button 
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(30);
              onNavigate("monitor");
            }}
            className="flex flex-col items-center gap-1 px-6 py-2 min-h-[60px] active:bg-gray-100 rounded-lg transition-colors"
          >
            <Activity className="w-6 h-6 text-gray-400" />
            <span className="text-gray-400">监测</span>
          </button>
          <button 
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(30);
              onNavigate("files");
            }}
            className="flex flex-col items-center gap-1 px-6 py-2 min-h-[60px] active:bg-gray-100 rounded-lg transition-colors"
          >
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600">档案</span>
          </button>
          <button 
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(30);
              onNavigate("profile");
            }}
            className="flex flex-col items-center gap-1 px-6 py-2 min-h-[60px] active:bg-gray-100 rounded-lg transition-colors"
          >
            <User className="w-6 h-6 text-gray-400" />
            <span className="text-gray-400">我的</span>
          </button>
        </div>
      )}
    </div>
  );
}