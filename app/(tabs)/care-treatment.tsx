import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Users, Shield, Clock, Menu, UserPlus, Activity, TrendingUp, CircleAlert as AlertCircle, CircleCheck as CheckCircle, FileText, Calendar, Pill, Stethoscope, ChartBar as BarChart3 } from 'lucide-react-native';
import NavigationDrawer from '../../components/NavigationDrawer';
import FacilityDetails from '../../components/FacilityDetails';
import CalendarFilter from '../../components/CalendarFilter';
import { useDateRange } from '../../contexts/DateRangeContext';
import { Facility, County, fetchFacilities, fetchCareAndTreatmentData, fetchCareTreatmentDashboardMetrics, getDateRangeForAPI } from '../../services/facilityService';
import { useEffect } from 'react';

export default function CareAndTreatmentScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [counties, setCounties] = useState<County[]>([]);
  const [careData, setCareData] = useState({
    newlyEnrolled: { totalValue: 0, maleCount: 0, femaleCount: 0, malePercentage: 0, femalePercentage: 0 },
    txCurr: { totalValue: 0, maleCount: 0, femaleCount: 0, malePercentage: 0, femalePercentage: 0 },
    totalPatient: { totalValue: 0, maleCount: 0, femaleCount: 0, malePercentage: 0, femalePercentage: 0 },
    vlEligibility: { totalValue: 0, maleCount: 0, femaleCount: 0, malePercentage: 0, femalePercentage: 0 },
    validViralLoad: { totalValue: 0, maleCount: 0, femaleCount: 0, malePercentage: 0, femalePercentage: 0 },
    vlSuppression: { totalValue: 0, maleCount: 0, femaleCount: 0, malePercentage: 0, femalePercentage: 0 },
    hvl: { totalValue: 0, maleCount: 0, femaleCount: 0, malePercentage: 0, femalePercentage: 0 },
    lvl: { totalValue: 0, maleCount: 0, femaleCount: 0, malePercentage: 0, femalePercentage: 0 },
    ldlOutcome: { totalValue: 0, maleCount: 0, femaleCount: 0, malePercentage: 0, femalePercentage: 0 }
  });
  const [loadingCareData, setLoadingCareData] = useState(true);
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
    const loadCareData = async () => {
      if (counties.length === 0) return;
      
      try {
        setLoadingCareData(true);
        const { startDate, endDate } = getDateRangeForAPI(
          selectedDateRange.startDate,
          selectedDateRange.endDate
        );
        
        const mflCodes = counties.flatMap(county => 
          county.facilities.map(facility => facility.locationId || facility.mflCode)
        );
        
        // Fetch all nine care & treatment metrics in parallel
        const [
          newlyEnrolledData,
          txCurrData,
          totalPatientData,
          vlEligibilityData,
          validViralLoadData,
          vlSuppressionData,
          hvlData,
          lvlData,
          ldlOutcomeData
        ] = await Promise.all([
          fetchCareAndTreatmentData(startDate, endDate, mflCodes, 'CARE_AND_TREATMENT', 'New_IN_CARE'),
          fetchCareAndTreatmentData(startDate, endDate, mflCodes, 'CARE_AND_TREATMENT', 'CURRENT_ON_ART'),
          fetchCareAndTreatmentData(startDate, endDate, mflCodes, 'VL_REGIMEN_OUTCOME', 'TOTAL_TLD'),
          fetchCareAndTreatmentData(startDate, endDate, mflCodes, 'VL_ELIGIBILITY', 'TOTAL_ELIGIBLE'),
          fetchCareAndTreatmentData(startDate, endDate, mflCodes, 'VL_UPTAKE', 'TOTAL_UPTAKE'),
          fetchCareAndTreatmentData(startDate, endDate, mflCodes, 'VL_SUPPRESSION', 'TOTAL_SUPPRESSION'),
          fetchCareAndTreatmentData(startDate, endDate, mflCodes, 'VL_OUTCOME', 'TOTAL_HVL'),
          fetchCareAndTreatmentData(startDate, endDate, mflCodes, 'VL_OUTCOME', 'TOTAL_LVL'),
          fetchCareAndTreatmentData(startDate, endDate, mflCodes, 'VL_OUTCOME', 'TOTAL_LDL')
        ]);
        
        setCareData({
          newlyEnrolled: newlyEnrolledData,
          txCurr: txCurrData,
          totalPatient: totalPatientData,
          vlEligibility: vlEligibilityData,
          validViralLoad: validViralLoadData,
          vlSuppression: vlSuppressionData,
          hvl: hvlData,
          lvl: lvlData,
          ldlOutcome: ldlOutcomeData
        });
      } catch (error) {
        console.error('Error loading Care & Treatment data:', error);
      } finally {
        setLoadingCareData(false);
      }
    };

    loadCareData();
  }, [counties, selectedDateRange]);

  const careEnrollmentCards = [
    {
      title: 'Newly enrolled',
      value: loadingCareData ? '...' : careData.newlyEnrolled.totalValue.toLocaleString(),
      maleCount: loadingCareData ? 0 : careData.newlyEnrolled.maleCount,
      femaleCount: loadingCareData ? 0 : careData.newlyEnrolled.femaleCount,
      malePercentage: loadingCareData ? 0 : careData.newlyEnrolled.malePercentage,
      femalePercentage: loadingCareData ? 0 : careData.newlyEnrolled.femalePercentage,
      subtitle: 'New enrollments',
      icon: UserPlus,
      color: '#10b981',
      bgColor: '#dcfce7'
    },
    {
      title: 'Tx_Curr',
      value: loadingCareData ? '...' : careData.txCurr.totalValue.toLocaleString(),
      maleCount: loadingCareData ? 0 : careData.txCurr.maleCount,
      femaleCount: loadingCareData ? 0 : careData.txCurr.femaleCount,
      malePercentage: loadingCareData ? 0 : careData.txCurr.malePercentage,
      femalePercentage: loadingCareData ? 0 : careData.txCurr.femalePercentage,
      subtitle: 'Current on treatment',
      icon: Pill,
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      title: 'Total patient',
      value: loadingCareData ? '...' : careData.totalPatient.totalValue.toLocaleString(),
      maleCount: loadingCareData ? 0 : careData.totalPatient.maleCount,
      femaleCount: loadingCareData ? 0 : careData.totalPatient.femaleCount,
      malePercentage: loadingCareData ? 0 : careData.totalPatient.malePercentage,
      femalePercentage: loadingCareData ? 0 : careData.totalPatient.femalePercentage,
      subtitle: 'Total enrolled',
      icon: Users,
      color: '#8b5cf6',
      bgColor: '#ede9fe'
    }
  ];

  const treatmentOutcomeCards = [
    {
      title: 'VL Eligibility',
      value: loadingCareData ? '...' : careData.vlEligibility.totalValue.toLocaleString(),
      maleCount: loadingCareData ? 0 : careData.vlEligibility.maleCount,
      femaleCount: loadingCareData ? 0 : careData.vlEligibility.femaleCount,
      malePercentage: loadingCareData ? 0 : careData.vlEligibility.malePercentage,
      femalePercentage: loadingCareData ? 0 : careData.vlEligibility.femalePercentage,
      subtitle: 'Eligible for VL',
      icon: FileText,
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    {
      title: 'Valid Viral load',
      value: loadingCareData ? '...' : careData.validViralLoad.totalValue.toLocaleString(),
      maleCount: loadingCareData ? 0 : careData.validViralLoad.maleCount,
      femaleCount: loadingCareData ? 0 : careData.validViralLoad.femaleCount,
      malePercentage: loadingCareData ? 0 : careData.validViralLoad.malePercentage,
      femalePercentage: loadingCareData ? 0 : careData.validViralLoad.femalePercentage,
      subtitle: 'Valid results',
      icon: Activity,
      color: '#06b6d4',
      bgColor: '#cffafe'
    },
    {
      title: 'VL Suppression',
      value: loadingCareData ? '...' : careData.vlSuppression.totalValue.toLocaleString(),
      maleCount: loadingCareData ? 0 : careData.vlSuppression.maleCount,
      femaleCount: loadingCareData ? 0 : careData.vlSuppression.femaleCount,
      malePercentage: loadingCareData ? 0 : careData.vlSuppression.malePercentage,
      femalePercentage: loadingCareData ? 0 : careData.vlSuppression.femalePercentage,
      subtitle: 'Suppressed',
      icon: Shield,
      color: '#10b981',
      bgColor: '#dcfce7'
    }
  ];

  const clinicalOutcomeCards = [
    {
      title: 'HVL',
      value: loadingCareData ? '...' : careData.hvl.totalValue.toLocaleString(),
      maleCount: loadingCareData ? 0 : careData.hvl.maleCount,
      femaleCount: loadingCareData ? 0 : careData.hvl.femaleCount,
      malePercentage: loadingCareData ? 0 : careData.hvl.malePercentage,
      femalePercentage: loadingCareData ? 0 : careData.hvl.femalePercentage,
      subtitle: 'High viral load',
      icon: TrendingUp,
      color: '#ef4444',
      bgColor: '#fee2e2'
    },
    {
      title: 'LVL',
      value: loadingCareData ? '...' : careData.lvl.totalValue.toLocaleString(),
      maleCount: loadingCareData ? 0 : careData.lvl.maleCount,
      femaleCount: loadingCareData ? 0 : careData.lvl.femaleCount,
      malePercentage: loadingCareData ? 0 : careData.lvl.malePercentage,
      femalePercentage: loadingCareData ? 0 : careData.lvl.femalePercentage,
      subtitle: 'Low viral load',
      icon: CheckCircle,
      color: '#10b981',
      bgColor: '#dcfce7'
    },
    {
      title: 'LDL outcome',
      value: loadingCareData ? '...' : careData.ldlOutcome.totalValue.toLocaleString(),
      maleCount: loadingCareData ? 0 : careData.ldlOutcome.maleCount,
      femaleCount: loadingCareData ? 0 : careData.ldlOutcome.femaleCount,
      malePercentage: loadingCareData ? 0 : careData.ldlOutcome.malePercentage,
      femalePercentage: loadingCareData ? 0 : careData.ldlOutcome.femalePercentage,
      subtitle: 'Below detection',
      icon: BarChart3,
      color: '#3b82f6',
      bgColor: '#dbeafe'
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
            <Text style={styles.backButtonText}>← Back to Care & Treatment</Text>
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
            <Text style={styles.title}>Care & Treatment</Text>
            <Text style={styles.subtitle}>Patient care and treatment outcomes</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Calendar Filter */}
          <View style={styles.filterSection}>
            <CalendarFilter />
          </View>

          {/* Care & Treatment Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Care & Treatment</Text>
            <View style={styles.cardGrid}>
              {careEnrollmentCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <View key={index} style={[styles.categoryCard, { backgroundColor: card.color }]}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>{card.title}</Text>
                    </View>
                    <Text style={styles.cardValue}>{card.value}</Text>
                    <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                    {!loadingCareData && (
                      <View style={styles.genderBreakdown}>
                        <View style={styles.genderRow}>
                          <Text style={styles.genderLabel}>♂ {card.maleCount.toLocaleString()}</Text>
                          <Text style={styles.genderPercentage}>({card.malePercentage}%)</Text>
                        </View>
                        <View style={styles.genderRow}>
                          <Text style={styles.genderLabel}>♀ {card.femaleCount.toLocaleString()}</Text>
                          <Text style={styles.genderPercentage}>({card.femalePercentage}%)</Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Second Row */}
          <View style={styles.section}>
            <View style={styles.cardGrid}>
              {treatmentOutcomeCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <View key={index} style={[styles.categoryCard, { backgroundColor: card.color }]}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>{card.title}</Text>
                    </View>
                    <Text style={styles.cardValue}>{card.value}</Text>
                    <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                    {!loadingCareData && (
                      <View style={styles.genderBreakdown}>
                        <View style={styles.genderRow}>
                          <Text style={styles.genderLabel}>♂ {card.maleCount.toLocaleString()}</Text>
                          <Text style={styles.genderPercentage}>({card.malePercentage}%)</Text>
                        </View>
                        <View style={styles.genderRow}>
                          <Text style={styles.genderLabel}>♀ {card.femaleCount.toLocaleString()}</Text>
                          <Text style={styles.genderPercentage}>({card.femalePercentage}%)</Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Third Row */}
          <View style={styles.section}>
            <View style={styles.cardGrid}>
              {clinicalOutcomeCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <View key={index} style={[styles.categoryCard, { backgroundColor: card.color }]}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>{card.title}</Text>
                    </View>
                    <Text style={styles.cardValue}>{card.value}</Text>
                    <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                    {!loadingCareData && (
                      <View style={styles.genderBreakdown}>
                        <View style={styles.genderRow}>
                          <Text style={styles.genderLabel}>♂ {card.maleCount.toLocaleString()}</Text>
                          <Text style={styles.genderPercentage}>({card.malePercentage}%)</Text>
                        </View>
                        <View style={styles.genderRow}>
                          <Text style={styles.genderLabel}>♀ {card.femaleCount.toLocaleString()}</Text>
                          <Text style={styles.genderPercentage}>({card.femalePercentage}%)</Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Performance Indicators */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance Indicators</Text>
            <View style={styles.performanceGrid}>
              <View style={styles.performanceCard}>
                <View style={styles.performanceHeader}>
                  <Stethoscope size={24} color="#3b82f6" />
                  <Text style={styles.performanceTitle}>Treatment Adherence</Text>
                </View>
                <Text style={styles.performanceValue}>94.2%</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '94.2%', backgroundColor: '#3b82f6' }]} />
                </View>
                <Text style={styles.performanceSubtext}>Above target (90%)</Text>
              </View>
              
              <View style={styles.performanceCard}>
                <View style={styles.performanceHeader}>
                  <Calendar size={24} color="#10b981" />
                  <Text style={styles.performanceTitle}>Appointment Adherence</Text>
                </View>
                <Text style={styles.performanceValue}>87.6%</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '87.6%', backgroundColor: '#10b981' }]} />
                </View>
                <Text style={styles.performanceSubtext}>Meeting expectations</Text>
              </View>
            </View>
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
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  categoryCard: {
    width: '30%',
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    flex: 1,
  },
  cardValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  cardChange: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  performanceGrid: {
    marginTop: 12,
  },
  performanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  performanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  performanceTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginLeft: 12,
  },
  performanceValue: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  performanceSubtext: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#059669',
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
});