import { useState } from "react";
import { Bell, Bluetooth, Search, MapPin, ChevronDown, Zap, Home, FileText, User, Activity } from "lucide-react";
import { PatientCard } from "./PatientCard";
import { FloatingButton } from "./FloatingButton";
import { MonitoringExecution } from "./MonitoringExecution";
import { ResultFeedback } from "./ResultFeedback";
import { InterventionAdjustment } from "./InterventionAdjustment";
import { ResidentsList } from "./ResidentsList";
import { ResidentProfile } from "./ResidentProfile";
import { Performance } from "./Performance";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { toast } from "sonner@2.0.3";

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
  tasks?: Array<{
    id: string;
    type: "medicine" | "meal" | "care";
    description: string;
    completed: boolean;
  }>;
}

export function Workbench() {
  const [currentTab, setCurrentTab] = useState<"workbench" | "monitor" | "result" | "adjustment" | "files" | "residentProfile" | "profile">("workbench");
  const [selectedZone, setSelectedZone] = useState("2楼 - 失能区");
  const [showZoneMenu, setShowZoneMenu] = useState(false);
  const [monitoringResult, setMonitoringResult] = useState<{score: number; isRecheck: boolean} | null>(null);
  const [selectedPatientForAdjustment, setSelectedPatientForAdjustment] = useState<Patient | null>(null);
  const [selectedResident, setSelectedResident] = useState<any>(null);
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      bedNumber: "205",
      name: "张建国",
      age: 82,
      score: 62,
      status: "urgent",
      alert: "干预失效警告 (补钙无效)",
      scoreChange: -5,
      lastCheck: "1天前"
    },
    {
      id: "2",
      bedNumber: "201",
      name: "李淑芬",
      age: 78,
      score: 78,
      status: "warning",
      scoreChange: -3,
      lastCheck: "昨日",
      tasks: [
        { id: "t1", type: "medicine", description: "液体钙", completed: false },
        { id: "t2", type: "meal", description: "营养加餐", completed: false }
      ]
    },
    {
      id: "3",
      bedNumber: "203",
      name: "赵强",
      age: 71,
      score: 88,
      status: "normal",
      lastCheck: "2天前",
      scoreChange: 2
    },
    {
      id: "4",
      bedNumber: "202",
      name: "王大力",
      age: 65,
      score: 92,
      status: "normal",
      lastCheck: "3天前"
    },
    {
      id: "5",
      bedNumber: "206",
      name: "刘芳",
      age: 76,
      score: 95,
      status: "normal",
      lastCheck: "1天前",
      scoreChange: 3
    }
  ]);

  const zones = ["全部区域", "2楼 - 失能区", "3楼 - 失智区", "4楼 - 康养区"];
  
  // 按分数从低到高排序，急件置顶
  const sortedPatients = [...patients].sort((a, b) => {
    if (a.alert && !b.alert) return -1;
    if (!a.alert && b.alert) return 1;
    return a.score - b.score;
  });
  
  const urgentCount = patients.filter(p => p.status === "urgent").length;
  const lowScoreCount = patients.filter(p => p.score < 70).length;

  const handleTaskToggle = (patientId: string, taskId: string) => {
    setPatients(prev => prev.map(patient => {
      if (patient.id === patientId && patient.tasks) {
        return {
          ...patient,
          tasks: patient.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return patient;
    }));

    // 触觉反馈和提示
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    toast.success("任务已完成", {
      description: "库存已自动扣减，依从性已记录"
    });
  };

  const handleStartMonitor = () => {
    setCurrentTab("monitor");
  };

  const handleAssessment = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    toast.info(`正在进入评估页面`, {
      description: `${patient?.bedNumber}床 - ${patient?.name}`
    });
  };

  if (currentTab !== "workbench") {
    if (currentTab === "monitor") {
      return (
        <MonitoringExecution 
          onBack={() => setCurrentTab("workbench")}
          onComplete={(data) => {
            setMonitoringResult(data);
            setCurrentTab("result");
          }}
        />
      );
    }
    
    if (currentTab === "result" && monitoringResult) {
      return (
        <ResultFeedback
          score={monitoringResult.isRecheck ? 78 : 72}
          previousScore={67}
          isRecheck={monitoringResult.isRecheck}
          baselineScore={62}
          onBack={() => setCurrentTab("workbench")}
          onNext={() => setCurrentTab("workbench")}
        />
      );
    }
    
    if (currentTab === "adjustment" && selectedPatientForAdjustment) {
      return (
        <InterventionAdjustment
          patient={selectedPatientForAdjustment}
          onBack={() => setCurrentTab("workbench")}
          onAdjustmentComplete={() => setCurrentTab("workbench")}
        />
      );
    }
    
    if (currentTab === "files") {
      return (
        <ResidentsList
          onSelectResident={(resident) => {
            setSelectedResident(resident);
            setCurrentTab("residentProfile");
          }}
          onNavigate={(tab) => setCurrentTab(tab)}
        />
      );
    }
    
    if (currentTab === "residentProfile" && selectedResident) {
      return (
        <ResidentProfile
          resident={selectedResident}
          onBack={() => setCurrentTab("files")}
          onNavigate={(tab) => setCurrentTab(tab)}
          onEditPlan={() => {
            setSelectedPatientForAdjustment({
              id: selectedResident.id,
              bedNumber: selectedResident.bedNumber,
              name: selectedResident.name,
              age: selectedResident.age,
              score: selectedResident.score,
              status: selectedResident.score < 70 ? "urgent" : selectedResident.score < 90 ? "warning" : "normal"
            });
            setCurrentTab("adjustment");
          }}
        />
      );
    }
    
    if (currentTab === "profile") {
      return <Performance onNavigate={(tab) => setCurrentTab(tab)} />;
    }
    
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              {currentTab === "files" ? (
                <FileText className="w-16 h-16 mx-auto" />
              ) : (
                <User className="w-16 h-16 mx-auto" />
              )}
            </div>
            <p className="text-gray-500">
              {currentTab === "files" ? "档案页面" : "个人中心"}
            </p>
          </div>
        </div>
        
        {/* 底部导航栏 */}
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex justify-around items-center">
          <button 
            onClick={() => setCurrentTab("workbench")}
            className="flex flex-col items-center gap-1 px-6 py-2 min-h-[60px] active:bg-gray-100 rounded-lg transition-colors"
          >
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-gray-400">作业台</span>
          </button>
          <button 
            onClick={() => setCurrentTab("monitor")}
            className="flex flex-col items-center gap-1 px-6 py-2 min-h-[60px] active:bg-gray-100 rounded-lg transition-colors"
          >
            <Activity className="w-6 h-6 text-gray-400" />
            <span className="text-gray-400">监测</span>
          </button>
          <button 
            onClick={() => setCurrentTab("files")}
            className="flex flex-col items-center gap-1 px-6 py-2 min-h-[60px] active:bg-gray-100 rounded-lg transition-colors"
          >
            <FileText className={cn("w-6 h-6", currentTab === "files" ? "text-blue-600" : "text-gray-400")} />
            <span className={cn(currentTab === "files" ? "text-blue-600" : "text-gray-400")}>档案</span>
          </button>
          <button 
            onClick={() => setCurrentTab("profile")}
            className="flex flex-col items-center gap-1 px-6 py-2 min-h-[60px] active:bg-gray-100 rounded-lg transition-colors"
          >
            <User className={cn("w-6 h-6", currentTab === "profile" ? "text-blue-600" : "text-gray-400")} />
            <span className={cn(currentTab === "profile" ? "text-blue-600" : "text-gray-400")}>我的</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* 顶部状态栏 */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-gray-700">
            张家口一院 - <span className="font-medium">李红</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Bluetooth className="w-5 h-5 text-blue-500" />
              <span className="text-blue-600">蓝牙已连</span>
            </div>
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
              剩余: <span className="font-medium">12,450</span>次
            </div>
          </div>
        </div>
      </div>

      {/* 区域筛选和搜索 */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setShowZoneMenu(!showZoneMenu)}
              className="flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg min-h-[60px] active:bg-blue-100 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              <span>{selectedZone}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showZoneMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-20">
                {zones.map((zone) => (
                  <button
                    key={zone}
                    onClick={() => {
                      setSelectedZone(zone);
                      setShowZoneMenu(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors",
                      selectedZone === zone && "bg-blue-50 text-blue-600"
                    )}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="搜索床位/姓名"
              className="pl-10 h-[60px] text-base"
            />
          </div>
        </div>
      </div>

      {/* 急件通知栏 */}
      {urgentCount > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 px-4 py-4 mx-4 mt-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Bell className="w-6 h-6 text-red-500 flex-shrink-0 animate-pulse" />
            <div className="flex-1">
              <div className="text-red-700 font-medium mb-1">调度中心</div>
              <div className="text-red-600">205床干预失效（掉分严重），请立即查看！</div>
            </div>
          </div>
        </div>
      )}

      {/* 智能任务列表 */}
      <div className="flex-1 px-4 pt-4 pb-4 space-y-3">
        {sortedPatients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onTaskToggle={handleTaskToggle}
            onAssessment={handleAssessment}
            onAdjustment={() => {
              setSelectedPatientForAdjustment(patient);
              setCurrentTab("adjustment");
            }}
          />
        ))}
      </div>

      {/* 悬浮操作按钮 */}
      <FloatingButton onClick={handleStartMonitor} />

      {/* 底部导航栏 */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex justify-around items-center fixed bottom-0 left-0 right-0">
        <button 
          onClick={() => setCurrentTab("workbench")}
          className="flex flex-col items-center gap-1 px-6 py-2 min-h-[60px] active:bg-gray-100 rounded-lg transition-colors"
        >
          <Home className="w-6 h-6 text-blue-600" />
          <span className="text-blue-600">作业台</span>
        </button>
        <button 
          onClick={() => setCurrentTab("monitor")}
          className="flex flex-col items-center gap-1 px-6 py-2 min-h-[60px] active:bg-gray-100 rounded-lg transition-colors"
        >
          <Activity className="w-6 h-6 text-gray-400" />
          <span className="text-gray-400">监测</span>
        </button>
        <button 
          onClick={() => setCurrentTab("files")}
          className="flex flex-col items-center gap-1 px-6 py-2 min-h-[60px] active:bg-gray-100 rounded-lg transition-colors"
        >
          <FileText className="w-6 h-6 text-gray-400" />
          <span className="text-gray-400">档案</span>
        </button>
        <button 
          onClick={() => setCurrentTab("profile")}
          className="flex flex-col items-center gap-1 px-6 py-2 min-h-[60px] active:bg-gray-100 rounded-lg transition-colors"
        >
          <User className="w-6 h-6 text-gray-400" />
          <span className="text-gray-400">我的</span>
        </button>
      </div>
    </div>
  );
}