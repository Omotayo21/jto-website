import { CheckCircle2, Circle } from 'lucide-react';

export function OrderStatusTracker({ status, history }) {
  const stages = [
    { id: 'pending', label: 'Order Placed' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' }
  ];

  if (status === 'cancelled') {
    return (
      <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex items-center gap-4 text-rose-600">
        <div className="bg-rose-100 p-3 rounded-2xl">
          <Circle className="w-6 h-6 fill-rose-500 text-rose-500" />
        </div>
        <div>
          <h4 className="font-bold text-lg">Order Cancelled</h4>
          <p className="text-sm opacity-80">This order has been cancelled and will not be processed.</p>
        </div>
      </div>
    );
  }

  const currentStageIndex = stages.findIndex(s => s.id === status);
  
  return (
    <div className="relative py-8">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
      
      {/* Active Progress Line */}
      <div 
        className="absolute top-1/2 left-0 h-1 bg-black -translate-y-1/2 rounded-full transition-all duration-1000"
        style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
      />

      <div className="relative flex justify-between">
        {stages.map((stage, index) => {
          const isCompleted = index < currentStageIndex || status === 'delivered';
          const isActive = index === currentStageIndex;
          const statusInfo = history?.find(h => h.status === stage.id);

          return (
            <div key={stage.id} className="flex flex-col items-center group">
              <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-500 z-10 ${isCompleted ? 'bg-black border-black text-white shadow-lg shadow-gray-200' : isActive ? 'bg-[#FFFCE0] border-black text-black scale-125 shadow-xl' : 'bg-[#FFFCE0] border-gray-100 text-gray-300'}`}>
                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold">{index + 1}</span>}
              </div>
              <div className="mt-4 text-center">
                <p className={`text-sm font-bold transition-colors serif-font italic ${isCompleted || isActive ? 'text-gray-900' : 'text-gray-400'}`}>{stage.label}</p>
                {statusInfo && (
                  <p className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-widest">
                    {new Date(statusInfo.timestamp).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              {/* Note tooltip for active/completed stages */}
              {statusInfo?.note && (isActive || isCompleted) && (
                <div className="absolute -bottom-12 bg-[#FFFCE0] px-3 py-1.5 rounded-xl border border-gray-100 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                  <p className="text-[10px] font-bold text-black uppercase tracking-widest">{statusInfo.note}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
