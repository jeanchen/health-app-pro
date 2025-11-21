import { useState } from "react";
import { Search, ScanLine, Plus, ChevronRight, TrendingUp, TrendingDown, Home, FileText, User, Activity } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

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

interface ResidentsListProps {
  onSelectResident: (resident: Resident) => void;
  onNavigate?: (tab: "workbench" | "monitor" | "files" | "profile") => void;
  currentTab?: string;
}

export function ResidentsList({ onSelectResident, onNavigate, currentTab }: ResidentsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "risk" | "warning" | "healthy">("all");

  const residents: Resident[] = [
    {
      id: "1",
      name: "张建国",
      bedNumber: "201-A",
      age: 82,
      careLevel: "失能",
      score: 65,
      scoreTrend: -3,
      riskTags: ["严重缺钙", "心肌供血不足"]
    },
    {
      id: "2",
      name: "李淑芬",
      bedNumber: "201-B",
      age: 78,
      careLevel: "半失能",
      score: 78,
      scoreTrend: 5,
      riskTags: ["轻度缺锌"]
    },
    {
      id: "3",
      name: "王大力",
      bedNumber: "202-A",
      age: 75,
      careLevel: "自理",
      score: 92,
      scoreTrend: 2,
      riskTags: []
    },
    {
      id: "4",
      name: "陈淑华",
      bedNumber: "203-A",
      age: 80,
      careLevel: "失能",
      score: 58,
      scoreTrend: -8,
      riskTags: ["严重缺钙", "贫血", "低蛋白"]
    },
    {
      id: "5",
      name: "刘国强",
      bedNumber: "203-B",
      age: 84,
      careLevel: "半失能",
      score: 72,
      scoreTrend: 3,
      riskTags: ["缺维生素D"]
    },
    {
      id: "6",
      name: "赵秀英",
      bedNumber: "204-A",
      age: 76,
      careLevel: "自理",
      score: 88,
      scoreTrend: 6,
      riskTags: []
    }
  ];

  const getScoreLevel = (score: number) => {
    if (score < 70) return { color: "red", label: "风险", emoji: "🔴" };
    if (score < 90) return { color: "yellow", label: "亚健康", emoji: "🟡" };
    return { color: "green", label: "健康", emoji: "🟢" };
  };

  const filteredResidents = residents
    .filter(r => {
      // 筛选器过滤
      if (selectedFilter === "risk" && r.score >= 70) return false;
      if (selectedFilter === "warning" && (r.score < 70 || r.score >= 90)) return false;
      if (selectedFilter === "healthy" && r.score < 90) return false;
      
      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          r.name.toLowerCase().includes(query) ||
          r.bedNumber.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => a.score - b.score); // 分数低的在前

  const filterCounts = {
    all: residents.length,
    risk: residents.filter(r => r.score < 70).length,
    warning: residents.filter(r => r.score >= 70 && r.score < 90).length,
    healthy: residents.filter(r => r.score >= 90).length
  };

  const handleScan = () => {
    // 震动反馈
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    // 这里可以集成扫码功能
    alert("扫一扫功能（扫床头码直达档案）");
  };

  const handleNewResident = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    alert("新入住建档功能");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* 顶部搜索栏 */}
      <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索姓名或床位号"
              className="pl-10 h-12 text-base"
            />
          </div>
          <button
            onClick={handleScan}
            className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg text-white active:scale-95 transition-transform"
          >
            <ScanLine className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 分值筛选器 */}
      <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-[72px] z-10">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedFilter("all")}
            className={cn(
              "px-4 py-2 rounded-full whitespace-nowrap min-h-[44px] transition-all active:scale-95",
              selectedFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            )}
          >
            全部 ({filterCounts.all})
          </button>
          <button
            onClick={() => setSelectedFilter("risk")}
            className={cn(
              "px-4 py-2 rounded-full whitespace-nowrap min-h-[44px] transition-all active:scale-95",
              selectedFilter === "risk"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700"
            )}
          >
            🔴 风险 {"<"}70 ({filterCounts.risk})
          </button>
          <button
            onClick={() => setSelectedFilter("warning")}
            className={cn(
              "px-4 py-2 rounded-full whitespace-nowrap min-h-[44px] transition-all active:scale-95",
              selectedFilter === "warning"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-700"
            )}
          >
            🟡 亚健康 ({filterCounts.warning})
          </button>
          <button
            onClick={() => setSelectedFilter("healthy")}
            className={cn(
              "px-4 py-2 rounded-full whitespace-nowrap min-h-[44px] transition-all active:scale-95",
              selectedFilter === "healthy"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700"
            )}
          >
            🟢 健康 ({filterCounts.healthy})
          </button>
        </div>
      </div>

      {/* 列表区 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {filteredResidents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              暂无匹配的长者
            </div>
          ) : (
            filteredResidents.map((resident) => {
              const level = getScoreLevel(resident.score);
              return (
                <button
                  key={resident.id}
                  onClick={() => {
                    if (navigator.vibrate) {
                      navigator.vibrate(30);
                    }
                    onSelectResident(resident);
                  }}
                  className="w-full bg-white rounded-2xl p-5 border border-gray-200 hover:border-blue-400 active:scale-98 transition-all text-left min-h-[100px]"
                >
                  <div className="flex items-start gap-4">
                    {/* 头像 + 分值色环 */}
                    <div className="relative flex-shrink-0">
                      <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center text-2xl border-4",
                        level.color === "red" && "border-red-500 bg-red-50",
                        level.color === "yellow" && "border-yellow-500 bg-yellow-50",
                        level.color === "green" && "border-green-500 bg-green-50"
                      )}>
                        {resident.avatar || "👤"}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* 第一行：床位号 + 姓名 + 年龄 + 护理等级 */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-600">{resident.bedNumber}</span>
                        <span className="font-medium text-gray-800">{resident.name}</span>
                        <span className="text-gray-600">({resident.age}岁 | {resident.careLevel})</span>
                      </div>

                      {/* 第二行：风险标签 */}
                      {resident.riskTags.length > 0 && (
                        <div className="mb-2">
                          <span className="text-sm text-gray-600">风险：</span>
                          <span className="text-sm text-red-600">
                            {resident.riskTags.join("、")}
                          </span>
                        </div>
                      )}

                      {/* 分数趋势 */}
                      {resident.scoreTrend !== undefined && resident.scoreTrend !== 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          {resident.scoreTrend > 0 ? (
                            <>
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span className="text-green-600">+{resident.scoreTrend}分</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-4 h-4 text-red-600" />
                              <span className="text-red-600">{resident.scoreTrend}分</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 右侧：分值 */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={cn(
                          "text-3xl font-bold",
                          level.color === "red" && "text-red-600",
                          level.color === "yellow" && "text-yellow-600",
                          level.color === "green" && "text-green-600"
                        )}>
                          {resident.score}
                        </div>
                        <div className="text-xs text-gray-500">分</div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 悬浮新建按钮 */}
      <button
        onClick={handleNewResident}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full shadow-lg flex items-center justify-center text-white active:scale-95 transition-transform z-20"
      >
        <Plus className="w-8 h-8" />
      </button>

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