import { Card, CardContent } from "@/components/ui/card";
export default function StatCard({
  title,
  value,
  icon: Icon,
  tone = "default",
}) {
  const toneStyles = {
    default: "text-foreground",
    warning: "text-foreground",
    success: "text-foreground",
    danger: "text-foreground",
  };

  return (
    <Card className={toneStyles[tone]}>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-xs font-medium opacity-70">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      </CardContent>
    </Card>
  );
}
