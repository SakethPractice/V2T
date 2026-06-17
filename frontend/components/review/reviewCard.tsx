interface ReviewCardProps {
  title: string;
  children: React.ReactNode;
}

export default function ReviewCard({
  title,
  children,
}: ReviewCardProps) {
  return (
    <div
      className="
        bg-white
        rounded-3xl
        shadow-sm
        border
        border-slate-200
        p-8
        mb-6
      "
    >
      <h2 className="text-2xl font-semibold mb-6 text-slate-900">
        {title}
      </h2>

      {children}
    </div>
  );
}