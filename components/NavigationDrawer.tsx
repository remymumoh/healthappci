import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, ChevronRight, MapPin, Building2, X, Menu, Activity, Heart, Users } from 'lucide-react-native';

const { width } = Dimensions.get('window');

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

interface NavigationDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  onFacilitySelect: (facility: Facility, county: County) => void;
  selectedFacility?: Facility;
}

const mockCounties: County[] = [
  {
    id: '1',
    name: 'Nairobi County',
    facilities: [
      {
        id: '1-1',
        name: 'Kenyatta National Hospital',
        type: 'hospital',
        patients: 2847,
        htsTests: 1234,
        careEnrollments: 892,
        viralSuppression: 94.2,
        retentionRate: 89.5
      },
      {
        id: '1-2',
        name: 'Pumwani Maternity Hospital',
        type: 'hospital',
        patients: 1456,
        htsTests: 678,
        careEnrollments: 445,
        viralSuppression: 91.8,
        retentionRate: 87.3
      },
      {
        id: '1-3',
        name: 'Mbagathi District Hospital',
        type: 'hospital',
        patients: 987,
        htsTests: 432,
        careEnrollments: 321,
        viralSuppression: 88.9,
        retentionRate: 85.1
      },
      {
        id: '1-4',
        name: 'Mathare North Health Center',
        type: 'health_center',
        patients: 654,
        htsTests: 298,
        careEnrollments: 187,
        viralSuppression: 86.4,
        retentionRate: 82.7
      }
    ]
  },
  {
    id: '2',
    name: 'Nakuru County',
    facilities: [
      {
        id: '2-1',
        name: 'Nakuru Provincial General Hospital',
        type: 'hospital',
        patients: 1876,
        htsTests: 823,
        careEnrollments: 567,
        viralSuppression: 92.1,
        retentionRate: 88.9
      },
      {
        id: '2-2',
        name: 'Rift Valley Provincial Hospital',
        type: 'hospital',
        patients: 1234,
        htsTests: 567,
        careEnrollments: 389,
        viralSuppression: 90.3,
        retentionRate: 86.2
      },
      {
        id: '2-3',
        name: 'Nakuru Health Center',
        type: 'health_center',
        patients: 654,
        htsTests: 298,
        careEnrollments: 187,
        viralSuppression: 87.6,
        retentionRate: 83.4
      }
    ]
  },
  {
    id: '3',
    name: 'Mombasa County',
    facilities: [
      {
        id: '3-1',
        name: 'Coast Provincial General Hospital',
        type: 'hospital',
        patients: 2156,
        htsTests: 945,
        careEnrollments: 678,
        viralSuppression: 93.7,
        retentionRate: 90.1
      },
      {
        id: '3-2',
        name: 'Port Reitz District Hospital',
        type: 'hospital',
        patients: 1345,
        htsTests: 589,
        careEnrollments: 423,
        viralSuppression: 89.8,
        retentionRate: 85.9
      },
      {
        id: '3-3',
        name: 'Tudor Health Center',
        type: 'health_center',
        patients: 789,
        htsTests: 345,
        careEnrollments: 234,
        viralSuppression: 85.2,
        retentionRate: 81.6
      }
    ]
  },
  {
    id: '4',
    name: 'Kisumu County',
    facilities: [
      {
        id: '4-1',
        name: 'Jaramogi Oginga Odinga Teaching Hospital',
        type: 'hospital',
        patients: 1987,
        htsTests: 876,
        careEnrollments: 598,
        viralSuppression: 91.4,
        retentionRate: 87.8
      },
      {
        id: '4-2',
        name: 'Kisumu District Hospital',
        type: 'hospital',
        patients: 1123,
        htsTests: 498,
        careEnrollments: 334,
        viralSuppression: 88.7,
        retentionRate: 84.3
      }
    ]
  }
];

export default function NavigationDrawer({ isOpen, onToggle, onFacilitySelect, selectedFacility }: NavigationDrawerProps) {
  const [expandedCounties, setExpandedCounties] = useState<Set<string>>(new Set());

  const toggleCounty = (countyId: string) => {
    const newExpanded = new Set(expandedCounties);
    if (newExpanded.has(countyId)) {
      newExpanded.delete(countyId);
    } else {
      newExpanded.add(countyId);
    }
    setExpandedCounties(newExpanded);
  };

  const getFacilityIcon = (type: Facility['type']) => {
    switch (type) {
      case 'hospital':
        return <Building2 size={16} color="#3b82f6" />;
      case 'clinic':
        return <Building2 size={16} color="#10b981" />;
      case 'health_center':
        return <Building2 size={16} color="#f59e0b" />;
      default:
        return <Building2 size={16} color="#6b7280" />;
    }
  };

  const getFacilityTypeLabel = (type: Facility['type']) => {
    switch (type) {
      case 'hospital':
        return 'Hospital';
      case 'clinic':
        return 'Clinic';
      case 'health_center':
        return 'Health Center';
      default:
        return 'Facility';
    }
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onToggle}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.overlay} onPress={onToggle} />
        <View style={styles.drawer}>
          <SafeAreaView style={styles.drawerContent}>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <MapPin size={24} color="#3b82f6" />
                <Text style={styles.headerTitle}>Healthcare Facilities</Text>
              </View>
              <TouchableOpacity onPress={onToggle} style={styles.closeButton}>
                <X size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {mockCounties.map((county) => (
                <View key={county.id} style={styles.countyContainer}>
                  <TouchableOpacity
                    style={styles.countyHeader}
                    onPress={() => toggleCounty(county.id)}
                  >
                    <View style={styles.countyHeaderContent}>
                      <MapPin size={18} color="#6b7280" />
                      <Text style={styles.countyName}>{county.name}</Text>
                      <Text style={styles.facilityCount}>({county.facilities.length})</Text>
                    </View>
                    {expandedCounties.has(county.id) ? (
                      <ChevronDown size={20} color="#6b7280" />
                    ) : (
                      <ChevronRight size={20} color="#6b7280" />
                    )}
                  </TouchableOpacity>

                  {expandedCounties.has(county.id) && (
                    <View style={styles.facilitiesList}>
                      {county.facilities.map((facility) => (
                        <TouchableOpacity
                          key={facility.id}
                          style={[
                            styles.facilityItem,
                            selectedFacility?.id === facility.id && styles.selectedFacility
                          ]}
                          onPress={() => {
                            onFacilitySelect(facility, county);
                            onToggle();
                          }}
                        >
                          <View style={styles.facilityHeader}>
                            {getFacilityIcon(facility.type)}
                            <View style={styles.facilityInfo}>
                              <Text style={styles.facilityName}>{facility.name}</Text>
                              <Text style={styles.facilityType}>
                                {getFacilityTypeLabel(facility.type)}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.facilityStats}>
                            <View style={styles.statItem}>
                              <Users size={12} color="#6b7280" />
                              <Text style={styles.statText}>{facility.patients.toLocaleString()}</Text>
                            </View>
                            <View style={styles.statItem}>
                              <Activity size={12} color="#6b7280" />
                              <Text style={styles.statText}>{facility.htsTests.toLocaleString()}</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end', // This positions the drawer on the right
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: width * 0.85,
    maxWidth: 400,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 }, // Shadow pointing left for right-side drawer
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 15,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  drawerContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginLeft: 12,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  countyContainer: {
    marginBottom: 12,
  },
  countyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  countyHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  countyName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginLeft: 12,
  },
  facilityCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    marginLeft: 8,
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  facilitiesList: {
    marginTop: 8,
    marginLeft: 16,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#e2e8f0',
  },
  facilityItem: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedFacility: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  facilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  facilityInfo: {
    marginLeft: 12,
    flex: 1,
  },
  facilityName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 2,
  },
  facilityType: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  facilityStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#475569',
    marginLeft: 4,
  },
});