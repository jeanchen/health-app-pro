import { useState } from "react";
import { ChevronLeft, Trophy, TrendingUp, Medal, Zap, Shield, Settings, HelpCircle, ChevronRight, Users, AlertCircle, Home, FileText, User, Activity } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { toast } from "sonner@2.0.3";

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  count: number;
  isCurrentUser?: boolean;
}

interface PerformanceProps {
  onBack?: () => void;
  onNavigate?: (tab: "workbench" | "monitor" | "files" | "profile") => void;
}

export function Performance({ onBack, onNavigate }: PerformanceProps) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBadgeDetail, setShowBadgeDetail] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // 核心战绩数据
  const scoreContribution = 158; // 提分贡献
  const averageScore = 82.5; // 责任区均分
  const hospitalAverage = 78.0; // 全院平均
  const dailyRank = 3; // 今日排名
  const dailyCount = 25; // 今日监测人数
  const targetCount = 28; // 第2名的人数
  const goldReports = 5; // 金色战报数量

  // 机构资产
  const remainingTests = 12450;
  const lowBalanceThreshold = 500;
  const isLowBalance = remainingTests < lowBalanceThreshold;

  // 荣誉徽章
  const badges: Badge[] = [
    {
      id: "score_star",
      name: "提分之星",
      icon: "🏅",
      description: "累计提分超过500分",
      unlocked: false,
      progress: 158,
      total: 500
    },
    {
      id: "speed_pioneer",
      name: "极速先锋",
      icon: "⚡",
      description: "单日监测超过50人",
      unlocked: false,
      progress: 25,
      total: 50
    },
    {
      id: "guardian_angel",
      name: "守护天使",
      icon: "🛡️",
      description: "负责区域红灯人群连续7天0漏测",
      unlocked: true,
      progress: 7,
      total: 7
    },
    {
      id: "quality_master",
      name: "质量大师",
      icon: "💎",
      description: "责任区均分连续30天≥85分",
      unlocked: false,
      progress: 12,
      total: 30
    }
  ];

  // 排行榜数据
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: "王强", avatar: "👨", count: 32 },
    { rank: 2, name: "张敏", avatar: "👩", count: 28 },
    { rank: 3, name: "李红", avatar: "👩", count: 25, isCurrentUser: true },
    { rank: 4, name: "刘芳", avatar: "👩", count: 23 },
    { rank: 5, name: "赵华", avatar: "👨", count: 21 }
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getScoreStatusColor = () => {
    if (averageScore >= 85) return { bg: "bg-green-50", border: "border-green-500", text: "text-green-700", label: "优秀", emoji: "🟢" };
    if (averageScore >= 80) return { bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-700", label: "良好", emoji: "🔵" };
    if (averageScore >= 70) return { bg: "bg-yellow-50", border: "border-yellow-500", text: "text-yellow-700", label: "合格", emoji: "🟡" };
    return { bg: "bg-red-50", border: "border-red-500", text: "text-red-700", label: "待改进", emoji: "🔴" };
  };

  const scoreStatus = getScoreStatusColor();

  const handleViewLeaderboard = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setShowLeaderboard(true);
  };

  const handleBadgeClick = (badge: Badge) => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setSelectedBadge(badge);
    setShowBadgeDetail(true);
  };

  const handleRequestRecharge = () => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    toast.success("已发送充值申请", {
      description: "管理员将尽快处理您的申请",
      duration: 3000
    });
  };

  const handleDeviceManagement = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    toast.info("设备管理", {
      description: "蓝牙设备：PPG-2024",
      duration: 2000
    });
  };

  const handleHelp = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    toast.info("帮助中心", {
      description: "客服热线：400-123-4567",
      duration: 3000
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* 顶部个人信息 */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-500 px-6 py-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl">
              👩
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-medium">李红</span>
                <span className="text-sm opacity-90">(工号003)</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>在线</span>
              </div>
            </div>
          </div>
          <button className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center active:scale-95 transition-transform">
            <span className="text-xl">🔔</span>
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-90">
          <span>📍</span>
          <span>责任区：2楼 - 失能区</span>
        </div>
      </div>

      {/* 核心战绩 HUD */}
      <div className="px-4 py-6 space-y-4">
        {/* 提分贡献 + 责任区均分 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 提分贡献 */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-5 border-2 border-yellow-400">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <span className="text-gray-700 font-medium">提分贡献</span>
            </div>
            <div className="mb-2">
              <div className="text-4xl font-bold text-yellow-700 mb-1">+{scoreContribution}</div>
              <div className="text-sm text-gray-600">累计提分贡献</div>
            </div>
            <div className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full inline-block">
              🌟 {goldReports} 次金色战报
            </div>
          </div>

          {/* 责任区均分 */}
          <div className={cn("rounded-2xl p-5 border-2", scoreStatus.bg, scoreStatus.border)}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className={cn("w-6 h-6", scoreStatus.text)} />
              <span className="text-gray-700 font-medium">责任区均分</span>
            </div>
            <div className="mb-2">
              <div className={cn("text-4xl font-bold mb-1", scoreStatus.text)}>{averageScore}</div>
              <div className="text-sm text-gray-600">平均健康分</div>
            </div>
            <div className={cn("text-xs px-2 py-1 rounded-full inline-block", scoreStatus.text, `${scoreStatus.bg}`)} style={{backgroundColor: scoreStatus.bg.replace('bg-', '')}}>
              {scoreStatus.emoji} 高于全院平均 ({hospitalAverage})
            </div>
          </div>
        </div>

        {/* 今日监测工作量排名 */}
        <button
          onClick={handleViewLeaderboard}
          className="w-full bg-white rounded-2xl p-5 border-2 border-gray-200 hover:border-blue-400 active:scale-98 transition-all text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getRankIcon(dailyRank)}</span>
              <span className="font-medium text-gray-800">今日监测工作量排名</span>
            </div>
            <div className="text-3xl font-bold text-gray-700">No. {dailyRank}</div>
          </div>

          {/* 进度条 */}
          <div className="mb-3">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all"
                style={{ width: `${(dailyCount / 50) * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600">{dailyCount} 人</span>
              <span className="text-sm text-gray-400">目标: 50 人</span>
            </div>
          </div>

          {/* 激励提示 */}
          <div className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2">
            <span className="text-sm text-blue-700">
              💪 再测 {targetCount - dailyCount} 人可超越第 2 名！
            </span>
            <ChevronRight className="w-5 h-5 text-blue-600" />
          </div>
        </button>

        {/* 荣誉徽章墙 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="font-medium text-gray-800">荣誉徽章墙</div>
            <div className="text-sm text-gray-500">
              {badges.filter(b => b.unlocked).length}/{badges.length}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {badges.map((badge) => (
              <button
                key={badge.id}
                onClick={() => handleBadgeClick(badge)}
                className={cn(
                  "aspect-square rounded-xl flex flex-col items-center justify-center p-3 transition-all active:scale-95 relative",
                  badge.unlocked
                    ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400"
                    : "bg-gray-100 border-2 border-gray-300 opacity-60"
                )}
              >
                <span className="text-3xl mb-1">{badge.icon}</span>
                <span className="text-xs text-center text-gray-700 leading-tight">
                  {badge.name}
                </span>
                {badge.unlocked && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 机构资产卡 */}
        <div className={cn(
          "rounded-2xl p-5 border-2",
          isLowBalance 
            ? "bg-red-50 border-red-500" 
            : "bg-white border-gray-200"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-medium text-gray-800 mb-1">张家口第一分院</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">剩余监测次数：</span>
                <span className={cn(
                  "text-xl font-bold",
                  isLowBalance ? "text-red-600" : "text-gray-800"
                )}>
                  {remainingTests.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600">次</span>
              </div>
            </div>
          </div>

          {isLowBalance && (
            <div className="bg-red-100 rounded-lg px-3 py-2 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-sm text-red-700">余额不足，���尽快充值</span>
            </div>
          )}

          <Button
            onClick={handleRequestRecharge}
            className={cn(
              "w-full min-h-[60px] text-base",
              isLowBalance
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {isLowBalance ? "紧急催充" : "申请充值"}
          </Button>
        </div>

        {/* 通用功能 */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <button
            onClick={handleDeviceManagement}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-200 min-h-[70px]"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-gray-600" />
              <span className="text-gray-800">设备管理</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button
            onClick={handleHelp}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[70px]"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6 text-gray-600" />
              <span className="text-gray-800">帮助中心</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* 光荣榜浮窗 */}
      {showLeaderboard && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
          onClick={() => setShowLeaderboard(false)}
        >
          <div
            className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 拖拽指示条 */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

            <div className="mb-6">
              <div className="text-2xl font-bold text-gray-800 mb-2">今日光荣榜</div>
              <div className="text-sm text-gray-600">监测工作量排名 Top 5</div>
            </div>

            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl",
                    entry.isCurrentUser 
                      ? "bg-blue-50 border-2 border-blue-500" 
                      : "bg-gray-50"
                  )}
                >
                  <div className="text-3xl">{getRankIcon(entry.rank)}</div>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl border-2 border-gray-200">
                    {entry.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {entry.name}
                      {entry.isCurrentUser && (
                        <span className="ml-2 text-xs text-blue-600">(我)</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">监测 {entry.count} 人</div>
                  </div>
                  {entry.rank <= 3 && (
                    <div className="text-2xl">
                      {entry.rank === 1 && "👑"}
                      {entry.rank === 2 && "🎖️"}
                      {entry.rank === 3 && "🏆"}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={() => setShowLeaderboard(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white min-h-[60px] text-lg mt-6"
            >
              我知道了
            </Button>
          </div>
        </div>
      )}

      {/* 徽章详情浮窗 */}
      {showBadgeDetail && selectedBadge && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
          onClick={() => setShowBadgeDetail(false)}
        >
          <div
            className="bg-white w-full rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 拖拽指示条 */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{selectedBadge.icon}</div>
              <div className="text-2xl font-bold text-gray-800 mb-2">
                {selectedBadge.name}
              </div>
              <div className="text-gray-600">{selectedBadge.description}</div>
            </div>

            {selectedBadge.progress !== undefined && selectedBadge.total !== undefined && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">进度</span>
                  <span className="text-sm font-medium text-gray-800">
                    {selectedBadge.progress} / {selectedBadge.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={cn(
                      "h-3 rounded-full transition-all",
                      selectedBadge.unlocked 
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : "bg-gradient-to-r from-blue-500 to-blue-400"
                    )}
                    style={{ width: `${(selectedBadge.progress / selectedBadge.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {selectedBadge.unlocked ? (
              <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <span className="text-xl">✓</span>
                  <span className="font-medium">已解锁</span>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700">
                  <span className="text-xl">💪</span>
                  <span>继续努力，即将解锁！</span>
                </div>
              </div>
            )}

            <Button
              onClick={() => setShowBadgeDetail(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white min-h-[60px] text-lg"
            >
              关闭
            </Button>
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
            <FileText className="w-6 h-6 text-gray-400" />
            <span className="text-gray-400">档案</span>
          </button>
          <button 
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(30);
              onNavigate("profile");
            }}
            className="flex flex-col items-center gap-1 px-6 py-2 min-h-[60px] active:bg-gray-100 rounded-lg transition-colors"
          >
            <User className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600">我的</span>
          </button>
        </div>
      )}
    </div>
  );
}