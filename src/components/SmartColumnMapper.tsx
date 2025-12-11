import React, { useState, useMemo } from 'react';
import { 
  Check, 
  X, 
  AlertTriangle,
  Link2,
  Link2Off,
  CircleDot,
  ArrowRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { cn } from '@/lib/utils';

export interface ColumnMappingItem {
  sourceColumn: string;
  targetKey: string | null;
  targetLabel: string | null;
  confidence: number;
  isRequired: boolean;
}

export interface TargetColumn {
  key: string;
  label: string;
  required: boolean;
  description?: string;
  type?: string;
}

interface SmartColumnMapperProps {
  sheetName: string;
  sourceColumns: string[];
  targetColumns: TargetColumn[];
  suggestedMappings: ColumnMappingItem[];
  onConfirm: (mappings: ColumnMappingItem[]) => void;
  onCancel: () => void;
}

const SmartColumnMapper: React.FC<SmartColumnMapperProps> = ({
  sheetName,
  sourceColumns,
  targetColumns,
  suggestedMappings,
  onConfirm,
  onCancel
}) => {
  const [mappings, setMappings] = useState<ColumnMappingItem[]>(suggestedMappings);

  // Available targets (not yet mapped)
  const availableTargets = useMemo(() => {
    const mappedTargets = new Set(mappings.map(m => m.targetKey).filter(Boolean));
    return targetColumns.filter(t => !mappedTargets.has(t.key));
  }, [mappings, targetColumns]);

  // Unmapped source columns
  const unmappedSources = useMemo(() => {
    const mappedSources = new Set(mappings.map(m => m.sourceColumn));
    return sourceColumns.filter(s => !mappedSources.has(s));
  }, [mappings, sourceColumns]);

  // Missing required columns
  const missingRequired = useMemo(() => {
    const mappedTargets = new Set(mappings.map(m => m.targetKey).filter(Boolean));
    return targetColumns.filter(t => t.required && !mappedTargets.has(t.key));
  }, [mappings, targetColumns]);

  const handleMappingChange = (sourceColumn: string, newTargetKey: string | null) => {
    setMappings(prev => {
      const updated = prev.map(m => {
        if (m.sourceColumn === sourceColumn) {
          const target = targetColumns.find(t => t.key === newTargetKey);
          return {
            ...m,
            targetKey: newTargetKey,
            targetLabel: target?.label || null,
            confidence: newTargetKey ? 1 : 0,
            isRequired: target?.required || false
          };
        }
        // If another mapping had this target, clear it
        if (m.targetKey === newTargetKey && newTargetKey !== null) {
          return { ...m, targetKey: null, targetLabel: null, confidence: 0 };
        }
        return m;
      });
      return updated;
    });
  };

  const handleAddUnmappedSource = (sourceColumn: string) => {
    setMappings(prev => [
      ...prev,
      {
        sourceColumn,
        targetKey: null,
        targetLabel: null,
        confidence: 0,
        isRequired: false
      }
    ]);
  };

  const handleRemoveMapping = (sourceColumn: string) => {
    setMappings(prev => prev.filter(m => m.sourceColumn !== sourceColumn));
  };

  const handleConfirm = () => {
    const validMappings = mappings.filter(m => m.targetKey !== null);
    onConfirm(validMappings);
  };

  const matchedCount = mappings.filter(m => m.targetKey).length;
  const requiredMatchedCount = mappings.filter(m => m.targetKey && m.isRequired).length;
  const totalRequired = targetColumns.filter(t => t.required).length;
  const allRequiredMapped = requiredMatchedCount === totalRequired;

  return (
    <div className="space-y-5">
      {/* Status Summary - Simplified */}
      <div className="flex items-center gap-4 text-sm">
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full",
          allRequiredMapped 
            ? "bg-green-500/10 text-green-600 dark:text-green-400" 
            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        )}>
          {allRequiredMapped ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <span className="font-medium">
            {allRequiredMapped 
              ? "Tudo pronto!" 
              : `${missingRequired.length} campo(s) obrigatório(s) pendente(s)`
            }
          </span>
        </div>
        
        <div className="text-muted-foreground">
          {matchedCount} de {targetColumns.length} conectadas
        </div>
      </div>

      {/* Mapping List - Cleaner */}
      <div className="space-y-2 max-h-[350px] overflow-y-auto">
        {mappings.map((mapping, idx) => {
          const target = targetColumns.find(t => t.key === mapping.targetKey);
          const isConnected = !!mapping.targetKey;
          const wasAutoDetected = mapping.confidence >= 0.7 && isConnected;
          
          return (
            <div 
              key={idx}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all",
                isConnected 
                  ? "bg-card border-green-500/30 dark:border-green-500/20" 
                  : "bg-muted/30 border-dashed border-muted-foreground/30"
              )}
            >
              {/* Status Icon */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                isConnected ? "bg-green-500/10" : "bg-muted"
              )}>
                {isConnected ? (
                  <Link2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Link2Off className="w-4 h-4 text-muted-foreground" />
                )}
              </div>

              {/* Source Column */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {mapping.sourceColumn}
                  </span>
                  {wasAutoDetected && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-0">
                      auto
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Sua coluna</p>
              </div>

              {/* Arrow */}
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />

              {/* Target Selector */}
              <div className="flex-1 min-w-0">
                <Select
                  value={mapping.targetKey || 'none'}
                  onValueChange={(val) => handleMappingChange(mapping.sourceColumn, val === 'none' ? null : val)}
                >
                  <SelectTrigger className={cn(
                    "w-full h-auto py-2",
                    !mapping.targetKey && "text-muted-foreground border-dashed"
                  )}>
                    <SelectValue placeholder="Selecionar campo..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <span className="text-muted-foreground">Ignorar esta coluna</span>
                    </SelectItem>
                    {mapping.targetKey && (
                      <SelectItem value={mapping.targetKey}>
                        <div className="flex items-center gap-2">
                          {target?.required && (
                            <CircleDot className="w-3 h-3 text-amber-500" />
                          )}
                          <span>{target?.label || mapping.targetKey}</span>
                        </div>
                      </SelectItem>
                    )}
                    {availableTargets.map(t => (
                      <SelectItem key={t.key} value={t.key}>
                        <div className="flex items-center gap-2">
                          {t.required && (
                            <CircleDot className="w-3 h-3 text-amber-500" />
                          )}
                          <span>{t.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Campo do sistema</p>
              </div>

              {/* Remove Button */}
              <button 
                onClick={() => handleRemoveMapping(mapping.sourceColumn)}
                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors shrink-0"
                title="Remover"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Unmapped source columns */}
      {unmappedSources.length > 0 && (
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">
            Outras colunas do seu arquivo (clique para adicionar):
          </p>
          <div className="flex flex-wrap gap-2">
            {unmappedSources.map(col => (
              <button
                key={col}
                onClick={() => handleAddUnmappedSource(col)}
                className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                + {col}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Missing required columns - Clear warning */}
      {missingRequired.length > 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Campos obrigatórios faltando:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingRequired.map(col => (
              <Badge 
                key={col.key} 
                variant="outline" 
                className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
              >
                {col.label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Actions - Clear and prominent */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button variant="ghost" onClick={onCancel} className="text-muted-foreground">
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirm}
          disabled={missingRequired.length > 0}
          className="gap-2 min-w-[180px]"
        >
          <Check className="w-4 h-4" />
          Confirmar Conexões
        </Button>
      </div>
    </div>
  );
};

export default SmartColumnMapper;