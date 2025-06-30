import { useState, useEffect, useCallback } from 'react';
import { County, Facility, DashboardCard, FilterState, CategoryType } from '@/types';
import { dataService } from '@/services/dataService';

export function useDataStore() {
  const [counties, setCounties] = useState<County[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [dashboardCards, setDashboardCards] = useState<DashboardCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filterState, setFilterState] = useState<FilterState>({
    selectedCounty: null,
    selectedFacility: null,
    category: 'hts'
  });

  const loadCounties = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dataService.getCounties();
      setCounties(data);
    } catch (err) {
      setError('Failed to load counties');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFacilities = useCallback(async (countyId: string) => {
    try {
      setLoading(true);
      const data = await dataService.getFacilitiesByCounty(countyId);
      setFacilities(data);
    } catch (err) {
      setError('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDashboardData = useCallback(async (category: CategoryType, facilityId?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (category === 'hts') {
        const htsData = await dataService.getHTSData(facilityId);
        const cards = dataService.convertHTSToCards(htsData);
        setDashboardCards(cards);
      } else {
        const careData = await dataService.getCareAndTreatmentData(facilityId);
        const cards = dataService.convertCareAndTreatmentToCards(careData);
        setDashboardCards(cards);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFilter = useCallback((updates: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...updates }));
  }, []);

  const selectCounty = useCallback((countyId: string | null) => {
    updateFilter({ 
      selectedCounty: countyId, 
      selectedFacility: null 
    });
    
    if (countyId) {
      loadFacilities(countyId);
    } else {
      setFacilities([]);
    }
  }, [updateFilter, loadFacilities]);

  const selectFacility = useCallback((facilityId: string | null) => {
    updateFilter({ selectedFacility: facilityId });
  }, [updateFilter]);

  const setCategory = useCallback((category: CategoryType) => {
    updateFilter({ category });
  }, [updateFilter]);

  useEffect(() => {
    loadCounties();
  }, [loadCounties]);

  useEffect(() => {
    loadDashboardData(filterState.category, filterState.selectedFacility || undefined);
  }, [loadDashboardData, filterState.category, filterState.selectedFacility]);

  return {
    counties,
    facilities,
    dashboardCards,
    loading,
    error,
    filterState,
    selectCounty,
    selectFacility,
    setCategory,
  };
}
