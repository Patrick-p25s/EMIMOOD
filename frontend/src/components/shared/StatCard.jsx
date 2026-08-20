import { Card, CardContent, CardHeader } from "@/components/ui/card";
export default function StatCard({
  title,
  value,
  icon: Icon,
  tone = "default",
}) {
  const toneStyles = {
    default: "bg-muted/50 text-foreground",
    warning: "bg-amber-50 text-amber-900 border-amber-200",
    success: "bg-emerald-50 text-emerald-900 border-emerald-200",
    danger: "bg-red-50 text-red-900 border-red-200",
  };

  return (
    <Card className={toneStyles[tone]}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium opacity-70">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        {Icon && <Icon className="h-8 w-8 opacity-40" />}
      </CardContent>
    </Card>
  );
}
