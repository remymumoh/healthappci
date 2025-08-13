import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Users, Target, TrendingUp, Menu } from 'lucide-react-native';
import NavigationDrawer from '../../components/NavigationDrawer';
import FacilityDetails from '../../components/FacilityDetails';
import CalendarFilter from '../../components/CalendarFilter';
import { useDateRange } from '../../contexts/DateRangeContext';
import { Facility, County, fetchFacilities, fetchCareAndTreatmentData, getDateRangeForAPI } from '../../services/facilityService';
import { useEffect } from 'react';

export default function HTSScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [counties, setCounties] = useState<County[]>([]);
  const [htsData, setHtsData] = useState({
    newTesting: { totalValue: 0, maleCount: 0, femaleCount: 0, malePercentage: 0, femalePercentage: 0 },
    repeatTesting: { totalValue: 0, maleCount: 0, femaleCount: 0, malePercentage: 0, femalePercentage: 0 },
    totalPositive: { totalValue: 0, maleCount: 0, femaleCount: 0, malePercentage: 0, femalePercentage: 0 }
  });
  const [loadingHtsData, setLoadingHtsData] = useState(true);
  const { selectedDateRange } = useDateRange();

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const facilitiesData = await fetchFacilities();
        setCounties(facilitiesData);
      } catch (error) {
        console.error('Error loading facilities:', error);
      }
    };

    loadFacilities();
  }, []);

  useEffect(() => {
    const loadHTSData = async () => {
      // If a facility is selected, use its locationId, otherwise use all facilities
      let mflCodes: string[];
      
      if (selectedFacility) {
        // Single facility - use its locationId
        mflCodes = [selectedFacility.locationId || selectedFacility.mflCode];
      } else {
        // All facilities
        if (counties.length === 0) return;
        mflCodes = counties.flatMap(county => 
          county.facilities.map(facility => facility.locationId || facility.mflCode)
        );
      }
      
      try {
        setLoadingHtsData(true);
        const { startDate, endDate } = getDateRangeForAPI(
          selectedDateRange.startDate,
          selectedDateRange.endDate
        );
        
        // Fetch all three HTS metrics in parallel
        const [newTestingData, repeatTestingData, totalPositiveData] = await Promise.all([
          fetchCareAndTreatmentData(startDate, endDate, mflCodes, 'HTS_UPTAKE', 'NEW_TESTING'),
          fetchCareAndTreatmentData(startDate, endDate, mflCodes, 'HTS_UPTAKE', 'REPEAT_TESTING'),
          fetchCareAndTreatmentData(startDate, endDate, mflCodes, 'HTS_UPTAKE', 'TOTAL_POSITIVE')
        ]);
        
        setHtsData({
          newTesting: newTestingData,
          repeatTesting: repeatTestingData,
          totalPositive: totalPositiveData
        });
      } catch (error) {
        console.error('Error loading HTS data:', error);
      } finally {
        setLoadingHtsData(false);
      }
    };

    loadHTSData();
  }, [counties, selectedDateRange, selectedFacility]);

  const htsStats = [
    {
      title: 'HTS Total Tested',
      value: loadingHtsData ? '...' : htsData.newTesting.totalValue.toLocaleString(),
      maleCount: loadingHtsData ? 0 : htsData.newTesting.maleCount,
      femaleCount: loadingHtsData ? 0 : htsData.newTesting.femaleCount,
      malePercentage: loadingHtsData ? 0 : htsData.newTesting.malePercentage,
      femalePercentage: loadingHtsData ? 0 : htsData.newTesting.femalePercentage,
      change: '+12.5%',
      icon: Activity,
      color: '#3b82f6'
    },
    {
      title: 'HTS Positive',
      value: loadingHtsData ? '...' : htsData.totalPositive.totalValue.toLocaleString(),
      maleCount: loadingHtsData ? 0 : htsData.totalPositive.maleCount,
      femaleCount: loadingHtsData ? 0 : htsData.totalPositive.femaleCount,
      malePercentage: loadingHtsData ? 0 : htsData.totalPositive.malePercentage,
      femalePercentage: loadingHtsData ? 0 : htsData.totalPositive.femalePercentage,
      change: '+2.1%',
      icon: Target,
      color: '#ef4444'
    },
    {
      title: 'HTS Retest',
      value: loadingHtsData ? '...' : htsData.repeatTesting.totalValue.toLocaleString(),
      maleCount: loadingHtsData ? 0 : htsData.repeatTesting.maleCount,
      femaleCount: loadingHtsData ? 0 : htsData.repeatTesting.femaleCount,
      malePercentage: loadingHtsData ? 0 : htsData.repeatTesting.malePercentage,
      femalePercentage: loadingHtsData ? 0 : htsData.repeatTesting.femalePercentage,
      change: '+5.7%',
      icon: TrendingUp,
      color: '#f59e0b'
    }
  ];

  const additionalStats = [
    {
      title: 'People Tested',
      value: '2,234',
      change: '+8.3%',
      icon: Users,
      color: '#10b981'
    },
    {
      title: 'Testing Rate',
      value: '89.2%',
      change: '+3.2%',
      icon: Activity,
      color: '#8b5cf6'
    }
  ];

  const handleFacilitySelect = (facility: Facility, county: County) => {
    setSelectedFacility(facility);
    setSelectedCounty(county);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  if (selectedFacility && selectedCounty) {
    return (
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onToggle={toggleDrawer}
        onFacilitySelect={handleFacilitySelect}
        selectedFacility={selectedFacility}
      >
        <View style={styles.facilityHeader}>
          <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
            <Menu size={24} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              setSelectedFacility(null);
              setSelectedCounty(null);
            }}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back to HTS</Text>
          </TouchableOpacity>
        </View>
        <FacilityDetails facility={selectedFacility} county={selectedCounty} />
      </NavigationDrawer>
    );
  }

  return (
    <NavigationDrawer
      isOpen={isDrawerOpen}
      onToggle={toggleDrawer}
      onFacilitySelect={handleFacilitySelect}
      selectedFacility={selectedFacility}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
            <Menu size={24} color="#374151" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>
              {selectedFacility ? selectedFacility.name : 'HIV Testing Services'}
            </Text>
            <Text style={styles.subtitle}>
              {selectedFacility 
                ? `${selectedCounty?.name} • ${selectedFacility.program}` 
                : 'Testing data and program performance'
              }
            </Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Calendar Filter */}
          <View style={styles.filterSection}>
            <CalendarFilter />
          </View>

          <View style={styles.statsGrid}>
            {htsStats.map((stat, index) => {
              const IconComponent = stat.icon;
              const cardStyle = {
                backgroundColor: stat.color,
              };
              return (
                <View key={index} style={[styles.statCard, cardStyle]}>
                  <View style={styles.statHeader}>
                    <View style={styles.iconContainer}>
                      <IconComponent size={24} color="#ffffff" />
                    </View>
                    <Text style={styles.statTitle}>{stat.title}</Text>
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statChange}>{stat.change}</Text>
                  </View>
                  {!loadingHtsData && (
                    <View style={styles.genderBreakdown}>
                      <Text style={styles.genderText}>{stat.maleCount.toLocaleString()} M</Text>
                      <Text style={styles.genderText}>{stat.femaleCount.toLocaleString()} F</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Additional Metrics */}
          <View style={styles.additionalStatsGrid}>
            {additionalStats.map((stat, index) => {
              const IconComponent = stat.icon;
              const cardStyle = index === 0 ? { backgroundColor: '#10b981' } : { backgroundColor: '#8b5cf6' };
              return (
                <View key={index} style={[styles.additionalStatCard, cardStyle]}>
                  <View style={styles.statHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                      <IconComponent size={20} color="#ffffff" />
                    </View>
                    <Text style={styles.additionalStatTitle}>{stat.title}</Text>
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.additionalStatValue}>{stat.value}</Text>
                    <Text style={styles.statChange}>{stat.change}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Testing Overview</Text>
            <Text style={styles.sectionDescription}>
              Comprehensive HIV testing services data across all facilities.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </NavigationDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flex: 1,
  },
  menuButton: {
    padding: 8,
    marginRight: 16,
  },
  facilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    flex: 1,
    marginLeft: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
  },
  scrollView: {
    flex: 1,
  },
  filterSection: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  statsGrid: {
    padding: 16,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    flex: 1,
  },
  statContent: {
    marginBottom: 20,
  },
  statValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  statChange: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  genderBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genderText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
  },
  additionalStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  additionalStatCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  additionalStatTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    flex: 1,
  },
  additionalStatValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  section: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 20,
  },
});