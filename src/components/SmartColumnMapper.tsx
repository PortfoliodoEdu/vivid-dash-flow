import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  Check, 
  X, 
  AlertTriangle,
  HelpCircle,
  Link2,
  Link2Off,
  Sparkles,
  ChevronDown
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
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

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.9) return 'text-green-500 bg-green-500/10 border-green-500/30';
  if (confidence >= 0.7) return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
  if (confidence >= 0.5) return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
  return 'text-red-500 bg-red-500/10 border-red-500/30';
};

const getConfidenceLabel = (confidence: number) => {
  if (confidence >= 0.9) return 'Certeza alta';
  if (confidence >= 0.7) return 'Provável';
  if (confidence >= 0.5) return 'Possível';
  return 'Incerto';
};

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

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{matchedCount}</div>
            <div className="text-xs text-muted-foreground">Mapeadas</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className={cn(
              "text-2xl font-bold",
              requiredMatchedCount === totalRequired ? "text-green-500" : "text-amber-500"
            )}>
              {requiredMatchedCount}/{totalRequired}
            </div>
            <div className="text-xs text-muted-foreground">Obrigatórias</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">{unmappedSources.length}</div>
            <div className="text-xs text-muted-foreground">Ignoradas</div>
          </div>
        </div>
        
        {missingRequired.length > 0 && (
          <div className="flex items-center gap-2 text-amber-500 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>{missingRequired.length} obrigatória(s) faltando</span>
          </div>
        )}
      </div>

      {/* Mapping List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        <div className="text-xs text-muted-foreground uppercase tracking-wide px-2 mb-3">
          Sua Coluna → Coluna do Sistema
        </div>
        
        {mappings.map((mapping, idx) => {
          const target = targetColumns.find(t => t.key === mapping.targetKey);
          
          return (
            <div 
              key={idx}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all",
                mapping.targetKey 
                  ? "bg-card border-border hover:border-primary/30" 
                  : "bg-muted/30 border-dashed border-border/50"
              )}
            >
              {/* Source Column */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-foreground truncate">
                    {mapping.sourceColumn}
                  </code>
                </div>
              </div>

              {/* Arrow + Confidence */}
              <div className="flex items-center gap-2 shrink-0">
                {mapping.targetKey ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs gap-1", getConfidenceColor(mapping.confidence))}
                        >
                          {mapping.confidence >= 0.9 ? (
                            <Sparkles className="w-3 h-3" />
                          ) : (
                            <HelpCircle className="w-3 h-3" />
                          )}
                          {Math.round(mapping.confidence * 100)}%
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {getConfidenceLabel(mapping.confidence)}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : null}
                
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  mapping.targetKey ? "bg-primary/10" : "bg-muted"
                )}>
                  {mapping.targetKey ? (
                    <Link2 className="w-4 h-4 text-primary" />
                  ) : (
                    <Link2Off className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Target Selector */}
              <div className="flex-1 min-w-0">
                <Select
                  value={mapping.targetKey || 'none'}
                  onValueChange={(val) => handleMappingChange(mapping.sourceColumn, val === 'none' ? null : val)}
                >
                  <SelectTrigger className={cn(
                    "w-full",
                    !mapping.targetKey && "text-muted-foreground"
                  )}>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      <span className="text-muted-foreground">— Ignorar coluna —</span>
                    </SelectItem>
                    {mapping.targetKey && (
                      <SelectItem value={mapping.targetKey}>
                        <div className="flex items-center gap-2">
                          {target?.required && (
                            <span className="text-destructive">*</span>
                          )}
                          <span>{target?.label || mapping.targetKey}</span>
                          {target?.description && (
                            <span className="text-muted-foreground text-xs">
                              ({target.description})
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    )}
                    {availableTargets.map(t => (
                      <SelectItem key={t.key} value={t.key}>
                        <div className="flex items-center gap-2">
                          {t.required && (
                            <span className="text-destructive">*</span>
                          )}
                          <span>{t.label}</span>
                          {t.description && (
                            <span className="text-muted-foreground text-xs ml-1">
                              ({t.description})
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Remove Button */}
              <button 
                onClick={() => handleRemoveMapping(mapping.sourceColumn)}
                className="p-1 text-muted-foreground hover:text-destructive transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {/* Unmapped source columns */}
        {unmappedSources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground uppercase tracking-wide px-2 mb-3">
              Colunas não reconhecidas do seu arquivo
            </div>
            <div className="flex flex-wrap gap-2">
              {unmappedSources.map(col => (
                <button
                  key={col}
                  onClick={() => handleAddUnmappedSource(col)}
                  className="px-3 py-1.5 bg-muted rounded-full text-sm text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <span className="font-mono text-xs">{col}</span>
                  <span className="text-xs">+ mapear</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Missing required columns */}
        {missingRequired.length > 0 && (
          <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
                  Colunas obrigatórias não mapeadas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {missingRequired.map(col => (
                    <Badge key={col.key} variant="outline" className="text-amber-600 border-amber-500/30">
                      {col.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirm}
          disabled={missingRequired.length > 0}
          className="gap-2"
        >
          <Check className="w-4 h-4" />
          Confirmar Mapeamento
        </Button>
      </div>
    </div>
  );
};

export default SmartColumnMapper;
