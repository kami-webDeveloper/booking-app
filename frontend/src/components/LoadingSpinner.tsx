import { Loader2 } from "lucide-react";

type LoadingSpinnerProps = {
  size?: number;
  text?: string;
};

const LoadingSpinner = ({ size = 32, text }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <Loader2
        size={size}
        className="animate-spin text-blue-600"
        aria-hidden="true"
      />
      {text && <span className="text-sm text-slate-600">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
