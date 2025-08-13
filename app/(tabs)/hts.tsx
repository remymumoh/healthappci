import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Users, Target, TrendingUp, Menu } from 'lucide-react-native';
import NavigationDrawer from '../../components/NavigationDrawer';
import FacilityDetails from '../../components/FacilityDetails';
import CalendarFilter from '../../components/CalendarFilter';
import { useDateRange } from '../../contexts/DateRangeContext';
import { Facility, County } from '../../services/facilityService';

export default function HTSScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const { selectedDateRange } = useDateRange();

  const htsStats = [
    {
      title: 'HTS Total Tested',
      value: '2,847',
      change: '+12.5%',
      icon: Activity,
      color: '#3b82f6'
    },
    {
      title: 'HTS Positive',
      value: '127',
      change: '+2.1%',
      icon: Target,
      color: '#ef4444'
    },
    {
      title: 'HTS Retest',
      value: '456',
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
            <Text style={styles.title}>HIV Testing Services</Text>
            <Text style={styles.subtitle}>Testing data and program performance</Text>
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

          {/* Additional Metrics */}
          <View style={styles.additionalStatsGrid}>
            {additionalStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View key={index} style={styles.additionalStatCard}>
                  <View style={styles.statHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
                      <IconComponent size={20} color={stat.color} />
                    </View>
                    <Text style={styles.additionalStatTitle}>{stat.title}</Text>
                  </View>
                  <View style={styles.statContent}>
                    <Text style={styles.additionalStatValue}>{stat.value}</Text>
                    <Text style={[styles.statChange, { color: '#10b981' }]}>{stat.change}</Text>
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
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  additionalStatTitle: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    flex: 1,
  },
  additionalStatValue: {
    fontSize: 20,
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