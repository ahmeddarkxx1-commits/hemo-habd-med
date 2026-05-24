import toast from 'react-hot-toast';
import { AlertTriangle, X, Check } from 'lucide-react';

export const confirmAction = (message: string, onConfirm: () => void) => {
  toast.custom((t) => (
    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex flex-col p-5 border border-sand-200`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-rose-50 rounded-full text-rose-500 shrink-0">
          <AlertTriangle size={20} />
        </div>
        <div className="flex-1 mt-1">
          <h3 className="font-semibold text-foreground text-sm">{message}</h3>
        </div>
      </div>
      <div className="flex gap-2 w-full">
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
          className="flex-1 bg-rose-500 text-white rounded-xl py-2 text-sm font-medium hover:bg-rose-600 transition-colors flex items-center justify-center gap-1"
        >
          <Check size={16} /> تأكيد
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex-1 bg-sand-50 text-foreground rounded-xl py-2 text-sm font-medium hover:bg-sand-100 transition-colors flex items-center justify-center gap-1"
        >
          <X size={16} /> إلغاء
        </button>
      </div>
    </div>
  ), {
    duration: 10000,
    position: 'top-center'
  });
};
