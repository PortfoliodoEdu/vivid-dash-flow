import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getPageData, savePageData, deletePageData, PageData, initDB } from '@/lib/indexedDB';
import { allTemplates } from '@/lib/templates';

interface DataContextType {
  getData: (pageId: string) => any[];
  setData: (pageId: string, data: any[], fileName: string) => Promise<void>;
  clearData: (pageId: string) => Promise<void>;
  getUploadInfo: (pageId: string) => { fileName: string; uploadedAt: Date } | null;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [pageDataMap, setPageDataMap] = useState<Record<string, PageData>>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await initDB();
      const pageIds = Object.keys(allTemplates);
      const dataMap: Record<string, PageData> = {};
      
      for (const pageId of pageIds) {
        const data = await getPageData(pageId);
        if (data) {
          dataMap[pageId] = data;
        }
      }
      
      setPageDataMap(dataMap);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const getData = (pageId: string): any[] => {
    const pageData = pageDataMap[pageId];
    if (pageData) {
      return pageData.data;
    }
    // Return sample data if no uploaded data
    return allTemplates[pageId]?.sampleData || [];
  };

  const setData = async (pageId: string, data: any[], fileName: string): Promise<void> => {
    await savePageData(pageId, data, fileName);
    setPageDataMap(prev => ({
      ...prev,
      [pageId]: { pageId, data, fileName, uploadedAt: new Date() }
    }));
  };

  const clearData = async (pageId: string): Promise<void> => {
    await deletePageData(pageId);
    setPageDataMap(prev => {
      const newMap = { ...prev };
      delete newMap[pageId];
      return newMap;
    });
  };

  const getUploadInfo = (pageId: string): { fileName: string; uploadedAt: Date } | null => {
    const pageData = pageDataMap[pageId];
    if (pageData) {
      return { fileName: pageData.fileName, uploadedAt: pageData.uploadedAt };
    }
    return null;
  };

  const refreshData = async () => {
    await loadAllData();
  };

  return (
    <DataContext.Provider value={{ getData, setData, clearData, getUploadInfo, isLoading, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
