import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, Activity, Heart, TrendingUp, Menu } from 'lucide-react-native';
import NavigationDrawer from '../../components/NavigationDrawer';
import FacilityDetails from '../../components/FacilityDetails';
import CalendarFilter, { DateRange } from '../../components/CalendarFilter';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'health_center';
  patients: number;
  htsTests: number;
  careEnrollments: number;
  viralSuppression: number;
  retentionRate: number;
}

interface County {
  id: string;
  name: string;
  facilities: Facility[];
}

export default function Dashboard() {
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
      title: 'Total Health Facilities',
      value: '12,847',
      change: '+5.2%',
      icon: BarChart3,
      color: '#3b82f6'
    },
    {
      title: 'Active HTS Sites',
      value: '8,945',
      change: '+3.8%',
      icon: Activity,
      color: '#10b981'
    },
    {
      title: 'Care & Treatment Sites',
      value: '6,234',
      change: '+2.1%',
      icon: Heart,
      color: '#ef4444'
    },
    {
      title: 'Monthly Growth',
      value: '4.7%',
      change: '+0.9%',
      icon: TrendingUp,
      color: '#f59e0b'
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
            <Text style={styles.backButtonText}>← Back to Dashboard</Text>
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
            <Text style={styles.title}>Healthcare Dashboard</Text>
            <Text style={styles.subtitle}>National Health Data Overview</Text>
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

          <View style={styles.statsGrid}>
            {overviewStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View key={index} style={[styles.statCard, isLargeScreen && styles.statCardLarge]}>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    marginHorizontal: -8,
  },
  statCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statCardLarge: {
    width: '47%',
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
  updateTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
});