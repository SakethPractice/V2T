interface ReviewRowProps {
  label: string;
  value?: string | number;
}

export default function ReviewRow({
  label,
  value,
}: ReviewRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-100">
      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-medium text-slate-800 text-right">
        {value ?? "-"}
      </span>
    </div>
  );
}