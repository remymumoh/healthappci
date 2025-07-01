import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Users, Shield, Clock, Menu } from 'lucide-react-native';
import NavigationDrawer from '../../components/NavigationDrawer';
import FacilityDetails from '../../components/FacilityDetails';

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

export default function CareAndTreatmentScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);

  const careStats = [
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

  const handleFacilitySelect = (facility: Facility, county: County) => {
    setSelectedFacility(facility);
    setSelectedCounty(county);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  if (selectedFacility && selectedCounty) {
    return (
      <>
        <View style={styles.facilityHeader}>
          <TouchableOpacity 
            onPress={() => {
              setSelectedFacility(null);
              setSelectedCounty(null);
            }}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back to Care & Treatment</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
            <Menu size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        <FacilityDetails facility={selectedFacility} county={selectedCounty} />
        <NavigationDrawer
          isOpen={isDrawerOpen}
          onToggle={toggleDrawer}
          onFacilitySelect={handleFacilitySelect}
          selectedFacility={selectedFacility}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Care & Treatment</Text>
          <Text style={styles.subtitle}>Patient care and treatment outcomes</Text>
        </View>
        <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
          <Menu size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {careStats.map((stat, index) => {
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Treatment Overview</Text>
          <Text style={styles.sectionDescription}>
            Comprehensive care and treatment data for all enrolled patients.
          </Text>
        </View>
      </ScrollView>

      <NavigationDrawer
        isOpen={isDrawerOpen}
        onToggle={toggleDrawer}
        onFacilitySelect={handleFacilitySelect}
        selectedFacility={selectedFacility}
      />
    </SafeAreaView>
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
    justifyContent: 'space-between',
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
  },
  facilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    flex: 1,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
  },
  scrollView: {
    flex: 1,
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
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 20,
  },
});