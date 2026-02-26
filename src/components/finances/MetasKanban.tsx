import { useState } from "react";
import { Plus, Target, Clock, Pause, CheckCircle2, LayoutGrid, Table } from "lucide-react";
import { Button } from "@/components/ui/button";

type MetaStatus = "planning" | "in_progress" | "paused" | "completed";

interface Meta {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  status: MetaStatus;
  emoji: string;
}

type ViewMode = "kanban" | "table";

const columns: { key: MetaStatus; label: string; icon: React.ElementType; color: string }[] = [
  { key: "planning", label: "Planejamento", icon: Target, color: "text-muted-foreground" },
  { key: "in_progress", label: "Em Progresso", icon: Clock, color: "text-blue-500" },
  { key: "paused", label: "Pausado", icon: Pause, color: "text-amber-500" },
  { key: "completed", label: "Concluído", icon: CheckCircle2, color: "text-green-500" },
];

const emptyMessages: Record<MetaStatus, string> = {
  planning: "Arraste metas aqui ou clique no + para criar uma nova",
  in_progress: "Arraste metas em planejamento para cá quando começar",
  paused: "Metas pausadas aparecerão aqui",
  completed: "Suas conquistas aparecerão aqui! 🎉",
};

const MetasKanban = () => {
  const [metas] = useState<Meta[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");

  const getMetasByStatus = (status: MetaStatus) =>
    metas.filter((m) => m.status === status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Quadro de Metas</h2>
          <p className="text-sm text-muted-foreground">
            Organize suas metas financeiras em um kanban visual
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center rounded-full bg-muted p-1 gap-0.5">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                viewMode === "kanban"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Table className="w-4 h-4" />
              Tabela
            </button>
          </div>

          <Button className="btn-gradient gap-2 rounded-full">
            <Plus className="w-4 h-4" />
            Nova Meta
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => {
            const Icon = col.icon;
            const items = getMetasByStatus(col.key);

            return (
              <div key={col.key} className="space-y-3">
                {/* Column Header */}
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${col.color}`} />
                  <span className="font-semibold text-sm">{col.label}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {items.length}
                  </span>
                  {col.key === "planning" && (
                    <button className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Empty State */}
                {items.length === 0 && (
                  <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[140px]">
                    <div className="p-3 rounded-full bg-muted mb-3">
                      <Target className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {emptyMessages[col.key]}
                    </p>
                  </div>
                )}

                {/* Meta Cards would go here */}
                {items.map((meta) => (
                  <div
                    key={meta.id}
                    className="glass-card p-4 rounded-xl space-y-2 cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-center gap-2">
                      <span>{meta.emoji}</span>
                      <span className="font-medium text-sm">{meta.title}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (meta.currentAmount / meta.targetAmount) * 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {meta.currentAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} /{" "}
                      {meta.targetAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View - Empty State */
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="p-4 rounded-full bg-muted inline-block mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-1">Nenhuma meta cadastrada</h3>
          <p className="text-muted-foreground text-sm">
            Crie sua primeira meta financeira para visualizar aqui.
          </p>
        </div>
      )}
    </div>
  );
};

export default MetasKanban;
