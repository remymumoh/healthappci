import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, Activity, Heart, TrendingUp } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isLargeScreen = width > 768;

export default function Dashboard() {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Healthcare Dashboard</Text>
          <Text style={styles.subtitle}>National Health Data Overview</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
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
