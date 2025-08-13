import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, ChevronRight, MapPin, Building2, X, Menu, Activity, Heart, Users, Search } from 'lucide-react-native';
import { fetchFacilities, Facility, County } from '../services/facilityService';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.85 > 400 ? 400 : width * 0.85;

interface NavigationDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  onFacilitySelect: (facility: Facility, county: County) => void;
  selectedFacility?: Facility;
  children: React.ReactNode;
}

export default function NavigationDrawer({ isOpen, onToggle, onFacilitySelect, selectedFacility, children }: NavigationDrawerProps) {
  const [expandedCounties, setExpandedCounties] = useState<Set<string>>(new Set());
  const [drawerAnimation] = useState(new Animated.Value(0));
  const [overlayAnimation] = useState(new Animated.Value(0));
  const [counties, setCounties] = useState<County[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCounties, setFilteredCounties] = useState<County[]>([]);

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        setLoading(true);
        setError(null);
        const facilitiesData = await fetchFacilities();
        setCounties(facilitiesData);
      } catch (err) {
        setError('Failed to load facilities');
        console.error('Error loading facilities:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFacilities();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCounties(counties);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = counties.map(county => {
      // Check if county name matches
      const countyMatches = county.name.toLowerCase().includes(query);
      
      // Filter facilities that match the search
      const matchingFacilities = county.facilities.filter(facility => 
        facility.name.toLowerCase().includes(query) ||
        facility.program.toLowerCase().includes(query) ||
        facility.subcounty.toLowerCase().includes(query) ||
        facility.ward.toLowerCase().includes(query) ||
        getFacilityTypeLabel(facility.type).toLowerCase().includes(query)
      );

      // If county matches or has matching facilities, include it
      if (countyMatches || matchingFacilities.length > 0) {
        return {
          ...county,
          facilities: countyMatches ? county.facilities : matchingFacilities
        };
      }
      
      return null;
    }).filter(Boolean) as County[];

    setFilteredCounties(filtered);
    
    // Auto-expand counties that have search results
    if (query && filtered.length > 0) {
      const newExpanded = new Set<string>();
      filtered.forEach(county => {
        if (county.facilities.length > 0) {
          newExpanded.add(county.id);
        }
      });
      setExpandedCounties(newExpanded);
    }
  }, [searchQuery, counties]);

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(drawerAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true, // Changed to true
        }),
        Animated.timing(overlayAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(drawerAnimation, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true, // Changed to true
        }),
        Animated.timing(overlayAnimation, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

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
        return <Building2 size={20} color="#1976d2" />;
      case 'clinic':
        return <Building2 size={20} color="#388e3c" />;
      case 'health_center':
        return <Building2 size={20} color="#f57c00" />;
      case 'kp_site':
        return <Building2 size={20} color="#9c27b0" />;
      default:
        return <Building2 size={20} color="#616161" />;
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
      case 'kp_site':
        return 'KP Site';
      default:
        return 'Facility';
    }
  };

  const getFacilityTypeColor = (type: Facility['type']) => {
    switch (type) {
      case 'hospital':
        return '#e3f2fd';
      case 'clinic':
        return '#e8f5e8';
      case 'health_center':
        return '#fff3e0';
      case 'kp_site':
        return '#f3e5f5';
      default:
        return '#f5f5f5';
    }
  };

  const drawerTranslateX = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-DRAWER_WIDTH, 0],
  });

  const contentTranslateX = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, DRAWER_WIDTH],
  });

  const overlayOpacity = overlayAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
      <View style={styles.container}>
        {/* Main Content */}
        <Animated.View
            style={[
              styles.contentContainer,
              {
                transform: [{ translateX: contentTranslateX }],
              }
            ]}
        >
          {children}
        </Animated.View>

        {/* Overlay */}
        {isOpen && (
            <Animated.View
                style={[
                  styles.overlay,
                  {
                    opacity: overlayOpacity,
                    transform: [{ translateX: contentTranslateX }],
                  }
                ]}
            >
              <TouchableOpacity
                  style={styles.overlayTouchable}
                  onPress={onToggle}
                  activeOpacity={1}
              />
            </Animated.View>
        )}

        {/* Drawer */}
        <Animated.View
            style={[
              styles.drawer,
              {
                transform: [{ translateX: drawerTranslateX }],
              }
            ]}
        >
          <SafeAreaView style={styles.drawerContent}>
            {/* Material Design Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <View style={styles.headerIcon}>
                  <MapPin size={24} color="#ffffff" />
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.headerTitle}>Healthcare Facilities</Text>
                  <Text style={styles.headerSubtitle}>Browse by location</Text>
                </View>
              </View>
              <TouchableOpacity onPress={onToggle} style={styles.closeButton}>
                <X size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Static Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Search size={20} color="#9ca3af" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search facilities, counties, or programs..."
                  placeholderTextColor="#9ca3af"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery('')}
                    style={styles.clearButton}
                  >
                    <X size={16} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Search Results Info */}
            {searchQuery.trim() && (
              <View style={styles.searchResultsInfo}>
                <Text style={styles.searchResultsText}>
                  {filteredCounties.reduce((total, county) => total + county.facilities.length, 0)} facilities found
                </Text>
              </View>
            )}

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {loading && (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading facilities...</Text>
                  </View>
              )}

              {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                          const loadFacilities = async () => {
                            try {
                              setLoading(true);
                              setError(null);
                              const facilitiesData = await fetchFacilities();
                              setCounties(facilitiesData);
                            } catch (err) {
                              setError('Failed to load facilities');
                            } finally {
                              setLoading(false);
                            }
                          };
                          loadFacilities();
                        }}
                    >
                      <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                  </View>
              )}

              {!loading && !error && filteredCounties.map((county) => (
                  <View key={county.id} style={styles.countyContainer}>
                    <TouchableOpacity
                        style={styles.countyHeader}
                        onPress={() => toggleCounty(county.id)}
                        activeOpacity={0.7}
                    >
                      <View style={styles.countyHeaderContent}>
                        <View style={styles.countyIcon}>
                          <MapPin size={20} color="#1976d2" />
                        </View>
                        <View style={styles.countyInfo}>
                          <Text style={styles.countyName}>{county.name}</Text>
                          <Text style={styles.facilityCount}>{county.facilities.length} facilities</Text>
                        </View>
                      </View>
                      <View style={[styles.expandIcon, expandedCounties.has(county.id) && styles.expandIconRotated]}>
                        {expandedCounties.has(county.id) ? (
                            <ChevronDown size={24} color="#757575" />
                        ) : (
                            <ChevronRight size={24} color="#757575" />
                        )}
                      </View>
                    </TouchableOpacity>

                    {expandedCounties.has(county.id) && (
                        <View style={styles.facilitiesList}>
                          {county.facilities.map((facility, index) => (
                              <TouchableOpacity
                                  key={facility.id}
                                  style={[
                                    styles.facilityItem,
                                    selectedFacility?.id === facility.id && styles.selectedFacility,
                                    index === county.facilities.length - 1 && styles.lastFacilityItem
                                  ]}
                                  onPress={() => {
                                    onFacilitySelect(facility, county);
                                    onToggle();
                                  }}
                                  activeOpacity={0.8}
                              >
                                <View style={styles.facilityHeader}>
                                  <View style={[styles.facilityIconContainer, { backgroundColor: getFacilityTypeColor(facility.type) }]}>
                                    {getFacilityIcon(facility.type)}
                                  </View>
                                  <View style={styles.facilityInfo}>
                                    <Text style={styles.facilityName} numberOfLines={2}>
                                      {facility.name}
                                    </Text>
                                    <View style={styles.facilityMeta}>
                                      <Text style={[styles.facilityType, { color: facility.type === 'hospital' ? '#1976d2' : facility.type === 'clinic' ? '#388e3c' : '#f57c00' }]}>
                                        {getFacilityTypeLabel(facility.type)}
                                        <Text style={styles.programText}>• {facility.program}</Text>
                                      </Text>
                                    </View>
                                  </View>
                                </View>

                                <View style={styles.facilityStats}>
                                  <View style={styles.statChip}>
                                    <Users size={14} color="#616161" />
                                    <Text style={styles.statText}>{facility.patients.toLocaleString()}</Text>
                                  </View>
                                  <View style={styles.statChip}>
                                    <Activity size={14} color="#616161" />
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
        </Animated.View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: 1,
  },
  overlayTouchable: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 16,
    zIndex: 2,
  },
  drawerContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    backgroundColor: '#1976d2',
    paddingTop: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  searchResultsInfo: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchResultsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  countyContainer: {
    marginBottom: 8,
    marginHorizontal: 16,
  },
  countyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  countyHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  countyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  countyInfo: {
    flex: 1,
  },
  countyName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#212121',
    marginBottom: 2,
  },
  facilityCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#757575',
  },
  expandIcon: {
    padding: 4,
  },
  expandIconRotated: {
    transform: [{ rotate: '0deg' }],
  },
  facilitiesList: {
    marginLeft: 8,
    paddingLeft: 24,
    borderLeftWidth: 2,
    borderLeftColor: '#e0e0e0',
  },
  facilityItem: {
    padding: 16,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e0e0e0',
  },
  lastFacilityItem: {
    marginBottom: 16,
  },
  selectedFacility: {
    backgroundColor: '#e3f2fd',
    borderLeftColor: '#1976d2',
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  facilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  facilityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  facilityInfo: {
    flex: 1,
  },
  facilityName: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#212121',
    marginBottom: 4,
    lineHeight: 20,
  },
  facilityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  facilityType: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  facilityStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#424242',
    marginLeft: 6,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#757575',
  },
  errorContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  programText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#757575',
    marginLeft: 8,
  },
});