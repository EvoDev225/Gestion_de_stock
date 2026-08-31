"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

export interface SalesChartDataPoint {
  date: string; // format "YYYY-MM-DD" ou libellé court déjà formaté
  montant: number; // en euros
}

export interface SalesChartProps {
  data: SalesChartDataPoint[];
  periodLabel?: string; // ex: "7 derniers jours"
  isLoading?: boolean;
}

// Note technique : --primary contient déjà une couleur hexadécimale complète
// (ex: #0E6B4F), pas un triplet HSL — donc pas d'enrobage hsl() ici.
const PRIMARY_COLOR = "var(--primary)";
const MUTED_FOREGROUND_COLOR = "var(--muted-foreground)";

// Composant Tooltip personnalisé pour afficher le montant en euros
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const value = payload[0].value ?? 0;
    const formattedAmount = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
    return (
      <div className="bg-foreground text-background text-xs px-3 py-1.5 rounded-md shadow-lg font-sans">
        <p className="font-semibold mb-0.5">{label}</p>
        <p>{formattedAmount}</p>
      </div>
    );
  }
  return null;
};

export default function SalesChart({
  data,
  periodLabel = "7 derniers jours",
  isLoading = false,
}: SalesChartProps) {
  return (
    <div className="lg:col-span-2 bg-card rounded-[24px] p-8 ambient-shadow flex flex-col">
      {/* En-tête de la carte */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Évolution des ventes
        </h3>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {periodLabel}
        </span>
      </div>

      {/* Contenu du graphique / États de chargement ou vide */}
      <div className="flex-1 relative min-h-[240px] flex flex-col justify-end pt-4">
        {isLoading ? (
          <div className="w-full h-[240px] bg-muted animate-pulse rounded-xl" />
        ) : data.length === 0 ? (
          <div className="w-full h-[240px] flex items-center justify-center text-muted-foreground text-sm font-sans">
            Aucune donnée de vente sur cette période
          </div>
        ) : (
          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="date"
                  stroke={MUTED_FOREGROUND_COLOR}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "color-mix(in srgb, var(--muted) 40%, transparent)" }}
                />
                <Bar
                  dataKey="montant"
                  fill={PRIMARY_COLOR}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}