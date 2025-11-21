import { Zap } from "lucide-react";

interface FloatingButtonProps {
  onClick: () => void;
}

export function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg active:scale-95 transition-all z-20 min-w-[80px] min-h-[80px] flex flex-col items-center justify-center gap-1"
      style={{ width: "80px", height: "80px" }}
    >
      <Zap className="w-8 h-8 fill-current" />
      <span className="text-xs font-medium">开始监测</span>
    </button>
  );
}
