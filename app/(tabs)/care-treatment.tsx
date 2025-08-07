import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Users, Shield, Clock, Menu, UserPlus, Activity, TrendingUp, CircleAlert as AlertCircle, CircleCheck as CheckCircle, FileText, Calendar, Pill, Stethoscope, ChartBar as BarChart3 } from 'lucide-react-native';
import NavigationDrawer from '../../components/NavigationDrawer';
import FacilityDetails from '../../components/FacilityDetails';
import CalendarFilter, { DateRange } from '../../components/CalendarFilter';
import { Facility, County } from '../../services/facilityService';

export default function CareAndTreatmentScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
    startDate: new Date(2024, 9, 1), // Q4 2024
    endDate: new Date(2024, 11, 31),
    label: 'Q4 2024'
  });

  const overviewStats = [
    {
      title: 'Active Patients',
      value: '8,945',
      change: '+2.8%',
      icon: Users,
      color: '#3b82f6'
    },
    {
      title: 'New Enrollments',
      value: '234',
      change: '+4.2%',
      icon: Heart,
      color: '#10b981'
    },
    {
      title: 'Viral Suppression',
      value: '92.4%',
      change: '+0.8%',
      icon: Shield,
      color: '#ef4444'
    },
    {
      title: 'Retention Rate',
      value: '87.6%',
      change: '+1.5%',
      icon: Clock,
      color: '#f59e0b'
    }
  ];

  const careEnrollmentCards = [
    {
      title: 'Newly Enrolled',
      value: '234',
      subtitle: 'This month',
      icon: UserPlus,
      color: '#10b981',
      bgColor: '#dcfce7'
    },
    {
      title: 'Tx_Curr',
      value: '8,945',
      subtitle: 'Currently on treatment',
      icon: Pill,
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      title: 'Total Patients',
      value: '12,847',
      subtitle: 'Ever enrolled',
      icon: Users,
      color: '#8b5cf6',
      bgColor: '#ede9fe'
    }
  ];

  const treatmentOutcomeCards = [
    {
      title: 'VL Eligibility',
      value: '7,234',
      subtitle: 'Eligible for VL test',
      icon: FileText,
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    {
      title: 'Valid Viral Load',
      value: '6,892',
      subtitle: 'Valid VL results',
      icon: Activity,
      color: '#06b6d4',
      bgColor: '#cffafe'
    },
    {
      title: 'VL Suppression',
      value: '92.4%',
      subtitle: 'Suppressed patients',
      icon: Shield,
      color: '#10b981',
      bgColor: '#dcfce7'
    }
  ];

  const clinicalOutcomeCards = [
    {
      title: 'HVL',
      value: '523',
      subtitle: 'High viral load',
      icon: TrendingUp,
      color: '#ef4444',
      bgColor: '#fee2e2'
    },
    {
      title: 'LVL',
      value: '6,369',
      subtitle: 'Low viral load',
      icon: CheckCircle,
      color: '#10b981',
      bgColor: '#dcfce7'
    },
    {
      title: 'LDL Outcome',
      value: '5,847',
      subtitle: 'Below detection limit',
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
        <FacilityDetails 
          facility={selectedFacility} 
          county={selectedCounty} 
          selectedDateRange={selectedDateRange}
        />
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
            <CalendarFilter
              selectedRange={selectedDateRange}
              onRangeChange={setSelectedDateRange}
            />
          </View>

          {/* Overview Stats */}
          <View style={styles.statsGrid}>
            {overviewStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <View style={styles.statHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
                      <IconComponent size={24} color={stat.color} />
                    </View>
                    <Text style={styles.statTitle}>{stat.title}</Text>
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={[styles.statChange, { color: '#10b981' }]}>{stat.change}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Care & Treatment Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Care & Treatment</Text>
            <View style={styles.cardGrid}>
              {careEnrollmentCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <TouchableOpacity key={index} style={[styles.categoryCard, { backgroundColor: card.bgColor }]} activeOpacity={0.8}>
                    <View style={styles.cardHeader}>
                      <View style={[styles.cardIconContainer, { backgroundColor: card.color }]}>
                        <IconComponent size={20} color="#ffffff" />
                      </View>
                      <Text style={[styles.cardTitle, { color: card.color }]}>{card.title}</Text>
                    </View>
                    <Text style={styles.cardValue}>{card.value}</Text>
                    <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Treatment Outcomes Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Treatment Outcomes</Text>
            <View style={styles.cardGrid}>
              {treatmentOutcomeCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <TouchableOpacity key={index} style={[styles.categoryCard, { backgroundColor: card.bgColor }]} activeOpacity={0.8}>
                    <View style={styles.cardHeader}>
                      <View style={[styles.cardIconContainer, { backgroundColor: card.color }]}>
                        <IconComponent size={20} color="#ffffff" />
                      </View>
                      <Text style={[styles.cardTitle, { color: card.color }]}>{card.title}</Text>
                    </View>
                    <Text style={styles.cardValue}>{card.value}</Text>
                    <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Clinical Outcomes Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Clinical Outcomes</Text>
            <View style={styles.cardGrid}>
              {clinicalOutcomeCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <TouchableOpacity key={index} style={[styles.categoryCard, { backgroundColor: card.bgColor }]} activeOpacity={0.8}>
                    <View style={styles.cardHeader}>
                      <View style={[styles.cardIconContainer, { backgroundColor: card.color }]}>
                        <IconComponent size={20} color="#ffffff" />
                      </View>
                      <Text style={[styles.cardTitle, { color: card.color }]}>{card.title}</Text>
                    </View>
                    <Text style={styles.cardValue}>{card.value}</Text>
                    <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                  </TouchableOpacity>
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
  statsGrid: {
    padding: 16,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  statChange: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
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
    justifyContent: 'space-between',
    marginTop: 12,
  },
  categoryCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  cardValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  performanceGrid: {
    marginTop: 12,
  },
  performanceCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  performanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  performanceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginLeft: 12,
  },
  performanceValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  performanceSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
});