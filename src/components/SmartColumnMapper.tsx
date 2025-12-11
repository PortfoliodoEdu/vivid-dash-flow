import React, { useState, useMemo } from 'react';
import { 
  Check, 
  X, 
  AlertTriangle,
  Link2,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator
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
  sampleData?: Record<string, any>[];
  onConfirm: (mappings: ColumnMappingItem[]) => void;
  onCancel: () => void;
}

const SmartColumnMapper: React.FC<SmartColumnMapperProps> = ({
  sheetName,
  sourceColumns,
  targetColumns,
  suggestedMappings,
  sampleData = [],
  onConfirm,
  onCancel
}) => {
  const [mappings, setMappings] = useState<ColumnMappingItem[]>(suggestedMappings);

  // Available targets (not yet mapped) - split into required and optional
  const { requiredTargets, optionalTargets, mappedTargetKeys } = useMemo(() => {
    const mappedKeys = new Set(mappings.map(m => m.targetKey).filter(Boolean));
    const available = targetColumns.filter(t => !mappedKeys.has(t.key));
    return {
      requiredTargets: available.filter(t => t.required),
      optionalTargets: available.filter(t => !t.required),
      mappedTargetKeys: mappedKeys
    };
  }, [mappings, targetColumns]);

  // Missing required columns
  const missingRequired = useMemo(() => {
    return targetColumns.filter(t => t.required && !mappedTargetKeys.has(t.key));
  }, [targetColumns, mappedTargetKeys]);

  // Connected required fields (for progress)
  const connectedRequired = useMemo(() => {
    return targetColumns.filter(t => t.required && mappedTargetKeys.has(t.key));
  }, [targetColumns, mappedTargetKeys]);

  // Get sample values for a column
  const getSampleValues = (columnName: string): string[] => {
    if (!sampleData || sampleData.length === 0) return [];
    return sampleData
      .slice(0, 3)
      .map(row => row[columnName])
      .filter(v => v !== undefined && v !== null && v !== '')
      .map(v => String(v).slice(0, 20));
  };

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

  const totalRequired = targetColumns.filter(t => t.required).length;
  const allRequiredMapped = missingRequired.length === 0;

  // Unmapped source columns
  const unmappedSources = useMemo(() => {
    const mappedSources = new Set(mappings.map(m => m.sourceColumn));
    return sourceColumns.filter(s => !mappedSources.has(s));
  }, [mappings, sourceColumns]);

  return (
    <div className="space-y-5">
      {/* Header with visual guide */}
      <div className="flex items-center justify-center gap-4 py-3 px-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />
          <span className="text-sm font-medium text-muted-foreground">Sua Coluna</span>
        </div>
        <ArrowRight className="w-5 h-5 text-primary" />
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-sm font-medium text-primary">Campo do Sistema</span>
        </div>
      </div>

      {/* Status - only show missing count */}
      {!allRequiredMapped && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">
            {missingRequired.length} campo(s) obrigatório(s) pendente(s)
          </span>
        </div>
      )}

      {/* Mapping List */}
      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {mappings.map((mapping, idx) => {
          const target = targetColumns.find(t => t.key === mapping.targetKey);
          const isConnected = !!mapping.targetKey;
          const wasAutoDetected = mapping.confidence >= 0.7 && isConnected;
          const samples = getSampleValues(mapping.sourceColumn);
          
          return (
            <div 
              key={idx}
              className={cn(
                "rounded-xl border-2 p-4 transition-all",
                isConnected 
                  ? "border-green-500/40 bg-green-500/5" 
                  : "border-dashed border-muted-foreground/30 bg-muted/10"
              )}
            >
              {/* Connection Label */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Conecte: Coluna → Campo
                </span>
                {wasAutoDetected && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-0">
                    auto-detectado
                  </Badge>
                )}
              </div>

              <div className="flex items-stretch gap-3">
                {/* Source Column Block */}
                <div className="flex-1 bg-muted/50 rounded-lg p-3 border border-muted-foreground/20">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    SUA COLUNA
                  </p>
                  <p className="font-medium text-foreground text-sm truncate">
                    {mapping.sourceColumn}
                  </p>
                  {samples.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1.5 truncate">
                      Ex: {samples.join(', ')}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center w-10">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                    isConnected ? "bg-green-500/20" : "bg-muted"
                  )}>
                    {isConnected ? (
                      <Link2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Target Selector Block */}
                <div className="flex-1 rounded-lg p-3 border border-primary/30 bg-primary/5">
                  <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1">
                    CAMPO DO SISTEMA
                  </p>
                  <Select
                    value={mapping.targetKey || 'none'}
                    onValueChange={(val) => handleMappingChange(mapping.sourceColumn, val === 'none' ? null : val)}
                  >
                    <SelectTrigger className={cn(
                      "w-full h-8 text-sm bg-background/50",
                      !mapping.targetKey && "text-muted-foreground"
                    )}>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border z-50">
                      <SelectItem value="none">
                        <span className="text-muted-foreground">Ignorar coluna</span>
                      </SelectItem>
                      
                      {/* Current selection if any */}
                      {mapping.targetKey && (
                        <SelectItem value={mapping.targetKey}>
                          <div className="flex items-center gap-2">
                            {target?.required && (
                              <AlertCircle className="w-3 h-3 text-amber-500" />
                            )}
                            <span>{target?.label || mapping.targetKey}</span>
                          </div>
                        </SelectItem>
                      )}

                      {/* Required fields first */}
                      {requiredTargets.length > 0 && (
                        <>
                          <SelectSeparator />
                          <SelectGroup>
                            <SelectLabel className="text-amber-600 dark:text-amber-400 font-semibold">
                              ❗ Obrigatórios
                            </SelectLabel>
                            {requiredTargets.map(t => (
                              <SelectItem key={t.key} value={t.key}>
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="w-3 h-3 text-amber-500" />
                                  <span className="font-medium">{t.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </>
                      )}

                      {/* Optional fields */}
                      {optionalTargets.length > 0 && (
                        <>
                          <SelectSeparator />
                          <SelectGroup>
                            <SelectLabel className="text-muted-foreground">
                              Opcionais
                            </SelectLabel>
                            {optionalTargets.map(t => (
                              <SelectItem key={t.key} value={t.key}>
                                <span>{t.label}</span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => handleRemoveMapping(mapping.sourceColumn)}
                  className="self-center p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                  title="Remover"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unmapped source columns */}
      {unmappedSources.length > 0 && (
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">
            Outras colunas no arquivo (clique para adicionar):
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

      {/* Progress Checklist */}
      <div className="bg-muted/20 rounded-lg p-4 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Progresso ({connectedRequired.length}/{totalRequired} obrigatórios)
        </p>
        <div className="grid gap-1.5">
          {targetColumns.filter(t => t.required).map(field => {
            const isConnected = mappedTargetKeys.has(field.key);
            return (
              <div 
                key={field.key}
                className={cn(
                  "flex items-center gap-2 text-sm py-1",
                  isConnected ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                )}
              >
                {isConnected ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4 text-amber-500" />
                )}
                <span className={isConnected ? "line-through opacity-70" : "font-medium"}>
                  {field.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button variant="ghost" onClick={onCancel} className="text-muted-foreground">
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirm}
          disabled={!allRequiredMapped}
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
