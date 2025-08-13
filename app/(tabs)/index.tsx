import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, Activity, Heart, TrendingUp, Menu } from 'lucide-react-native';
import NavigationDrawer from '../../components/NavigationDrawer';
import FacilityDetails from '../../components/FacilityDetails';
import CalendarFilter from '../../components/CalendarFilter';
import { useDateRange } from '../../contexts/DateRangeContext';
import { Facility, County, fetchFacilities, fetchCareAndTreatmentData, getDateRangeForAPI } from '../../services/facilityService';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

export default function Dashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [counties, setCounties] = useState<County[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    opd: { totalValue: 0, maleCount: 0, femaleCount: 0, malePercentage: 0, femalePercentage: 0 },
    ipd: { totalValue: 0, maleCount: 0, femaleCount: 0, malePercentage: 0, femalePercentage: 0 },
    tb: { totalValue: 0, maleCount: 0, femaleCount: 0, malePercentage: 0, femalePercentage: 0 },
    sti: { totalValue: 0, maleCount: 0, femaleCount: 0, malePercentage: 0, femalePercentage: 0 }
  });
  const [loadingDashboardData, setLoadingDashboardData] = useState(true);
  const { selectedDateRange } = useDateRange();

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        setLoadingFacilities(true);
        const facilitiesData = await fetchFacilities();
        setCounties(facilitiesData);
      } catch (error) {
        console.error('Error loading facilities:', error);
      } finally {
        setLoadingFacilities(false);
      }
    };

    loadFacilities();
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (counties.length === 0) return;
      
      try {
        setLoadingDashboardData(true);
        const { startDate, endDate } = getDateRangeForAPI(
          selectedDateRange.startDate,
          selectedDateRange.endDate
        );
        
        const mflCodes = counties.flatMap(county => 
          county.facilities.map(facility => facility.locationId || facility.mflCode)
        );
        
        // Fetch all four dashboard metrics in parallel
        const [opdData, ipdData, tbData, stiData] = await Promise.all([
          fetchCareAndTreatmentData(startDate, endDate, mflCodes, 'HTS_TST', 'OPD'),
          fetchCareAndTreatmentData(startDate, endDate, mflCodes, 'HTS_TST', 'IPD'),
          fetchCareAndTreatmentData(startDate, endDate, mflCodes, 'HTS_TST', 'TB'),
          fetchCareAndTreatmentData(startDate, endDate, mflCodes, 'HTS_TST', 'STI')
        ]);
        
        setDashboardData({
          opd: opdData,
          ipd: ipdData,
          tb: tbData,
          sti: stiData
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoadingDashboardData(false);
      }
    };

    loadDashboardData();
  }, [counties, selectedDateRange]);

  const totalFacilities = counties.reduce((total, county) => total + county.facilities.length, 0);
  const htsActiveSites = counties.reduce((total, county) => 
    total + county.facilities.filter(f => f.type !== 'kp_site').length, 0
  );
  const careTreatmentSites = counties.reduce((total, county) => 
    total + county.facilities.filter(f => f.type === 'hospital' || f.type === 'clinic').length, 0
  );

  const overviewStats = [
    {
      title: 'OPD',
      value: loadingDashboardData ? '...' : dashboardData.opd.totalValue.toLocaleString(),
      maleCount: loadingDashboardData ? 0 : dashboardData.opd.maleCount,
      femaleCount: loadingDashboardData ? 0 : dashboardData.opd.femaleCount,
      malePercentage: loadingDashboardData ? 0 : dashboardData.opd.malePercentage,
      femalePercentage: loadingDashboardData ? 0 : dashboardData.opd.femalePercentage,
      change: '+8.3%',
      icon: Activity,
      color: '#3b82f6'
    },
    {
      title: 'IPD',
      value: loadingDashboardData ? '...' : dashboardData.ipd.totalValue.toLocaleString(),
      maleCount: loadingDashboardData ? 0 : dashboardData.ipd.maleCount,
      femaleCount: loadingDashboardData ? 0 : dashboardData.ipd.femaleCount,
      malePercentage: loadingDashboardData ? 0 : dashboardData.ipd.malePercentage,
      femalePercentage: loadingDashboardData ? 0 : dashboardData.ipd.femalePercentage,
      change: '+5.7%',
      icon: BarChart3,
      color: '#10b981'
    },
    {
      title: 'TB',
      value: loadingDashboardData ? '...' : dashboardData.tb.totalValue.toLocaleString(),
      maleCount: loadingDashboardData ? 0 : dashboardData.tb.maleCount,
      femaleCount: loadingDashboardData ? 0 : dashboardData.tb.femaleCount,
      malePercentage: loadingDashboardData ? 0 : dashboardData.tb.malePercentage,
      femalePercentage: loadingDashboardData ? 0 : dashboardData.tb.femalePercentage,
      change: '+4.2%',
      icon: Heart,
      color: '#ef4444'
    },
    {
      title: 'STI',
      value: loadingDashboardData ? '...' : dashboardData.sti.totalValue.toLocaleString(),
      maleCount: loadingDashboardData ? 0 : dashboardData.sti.maleCount,
      femaleCount: loadingDashboardData ? 0 : dashboardData.sti.femaleCount,
      malePercentage: loadingDashboardData ? 0 : dashboardData.sti.malePercentage,
      femalePercentage: loadingDashboardData ? 0 : dashboardData.sti.femalePercentage,
      change: '+6.1%',
      icon: TrendingUp,
      color: '#f59e0b'
    }
  ];

  const handleFacilitySelect = (facility: Facility, county: County) => {
    setSelectedFacility(facility);
    setSelectedCounty(county);
  };

  const handleBackToDashboard = () => {
    setSelectedFacility(null);
    setSelectedCounty(null);
    setIsDrawerOpen(false); // Also close the drawer when going back
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
      <NavigationDrawer
          isOpen={isDrawerOpen}
          onToggle={toggleDrawer}
          onFacilitySelect={handleFacilitySelect}
          selectedFacility={selectedFacility}
      >
        {selectedFacility && selectedCounty ? (
            // Facility Details View
            <SafeAreaView style={styles.container}>
              <View style={styles.facilityHeader}>
                <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
                  <Menu size={24} color="#374151" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleBackToDashboard}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                  <Text style={styles.backButtonText}>← Back to Dashboard</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.facilityDetailsContainer}>
                <FacilityDetails facility={selectedFacility} county={selectedCounty} />
              </View>
            </SafeAreaView>
        ) : (
            // Dashboard Overview
            <SafeAreaView style={styles.container}>
              <View style={styles.headerContainer}>
                <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
                  <Menu size={24} color="#374151" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                  <Text style={styles.title}>Healthcare Dashboard</Text>
                  <Text style={styles.subtitle}>National Health Data Overview</Text>
                </View>
              </View>

              <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Calendar Filter */}
                <View style={styles.filterSection}>
                  <CalendarFilter />
                </View>

                <View style={styles.statsGrid}>
                  {overviewStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    const cardStyle = {
                      backgroundColor: stat.color,
                    };
                    return (
                        <View key={index} style={[styles.statCard, cardStyle]}>
                          <View style={styles.statHeader}>
                            <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                              <IconComponent size={24} color="#ffffff" />
                            </View>
                            <Text style={styles.statTitle}>{stat.title}</Text>
                          </View>
                          <View style={styles.statContent}>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statChange}>{stat.change}</Text>
                          </View>
                          {!loadingDashboardData && (
                            <View style={styles.genderBreakdown}>
                              <View style={styles.genderRow}>
                                <Text style={styles.genderLabel}>Male:</Text>
                                <Text style={styles.genderValue}>{stat.maleCount.toLocaleString()} ({stat.malePercentage}%)</Text>
                              </View>
                              <View style={styles.genderRow}>
                                <Text style={styles.genderLabel}>Female:</Text>
                                <Text style={styles.genderValue}>{stat.femaleCount.toLocaleString()} ({stat.femalePercentage}%)</Text>
                              </View>
                            </View>
                          )}
                        </View>
                    );
                  })}
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Quick Access</Text>
                  <Text style={styles.sectionDescription}>
                    Select a category below to view detailed healthcare data and analytics.
                  </Text>

                  <View style={styles.quickAccessGrid}>
                    <View style={styles.quickAccessCard}>
                      <Activity size={32} color="#3b82f6" />
                      <Text style={styles.quickAccessTitle}>HIV Testing Services</Text>
                      <Text style={styles.quickAccessDescription}>
                        View HTS data, testing rates, and program performance metrics
                      </Text>
                    </View>

                    <View style={styles.quickAccessCard}>
                      <Heart size={32} color="#ef4444" />
                      <Text style={styles.quickAccessTitle}>Care & Treatment</Text>
                      <Text style={styles.quickAccessDescription}>
                        Monitor patient care, retention rates, and treatment outcomes
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Recent Updates</Text>
                  <View style={styles.updatesList}>
                    <View style={styles.updateItem}>
                      <View style={styles.updateDot} />
                      <View style={styles.updateContent}>
                        <Text style={styles.updateTitle}>Quarterly HTS Report Published</Text>
                        <Text style={styles.updateTime}>2 hours ago</Text>
                      </View>
                    </View>
                    <View style={styles.updateItem}>
                      <View style={styles.updateDot} />
                      <View style={styles.updateContent}>
                        <Text style={styles.updateTitle}>New Facilities Added in Nakuru County</Text>
                        <Text style={styles.updateTime}>5 hours ago</Text>
                      </View>
                    </View>
                    <View style={styles.updateItem}>
                      <View style={styles.updateDot} />
                      <View style={styles.updateContent}>
                        <Text style={styles.updateTitle}>Care & Treatment Data Updated</Text>
                        <Text style={styles.updateTime}>1 day ago</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
        )}
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
  menuButton: {
    padding: 8,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  facilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    marginHorizontal: -6,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
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
    marginBottom: 20,
    lineHeight: 20,
  },
  quickAccessGrid: {
    flexDirection: isLargeScreen ? 'row' : 'column',
    gap: 16,
  },
  quickAccessCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickAccessTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  quickAccessDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 20,
  },
  updatesList: {
    marginTop: 16,
  },
  updateItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  updateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginTop: 6,
    marginRight: 12,
  },
  updateContent: {
    flex: 1,
  },
  updateTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  facilityDetailsContainer: {
    flex: 1,
    paddingTop: 0,
  },
  updateTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
});