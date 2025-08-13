export interface ApiFacility {
  mflcode: string;
  facility: string;
  type: string;
  county: string;
  subcounty: string;
  ward: string;
  program: string;
}

export interface SummaryIndicator {
  indicatorid: string;
  indicator_name: string;
  disagrgender: string;
  disagragegroup: string;
  locationid: string;
  total_value: number;
}

export interface Facility {
  id: string;
  name: string;
  mflCode: string;
  type: 'hospital' | 'clinic' | 'health_center' | 'kp_site';
  patients: number;
  htsTests: number;
  careEnrollments: number;
  viralSuppression: number;
  retentionRate: number;
  subcounty: string;
  ward: string;
  program: string;
  locationId?: string;
}

export interface County {
  id: string;
  name: string;
  facilities: Facility[];
}

export interface FacilitySummaryData {
  totalTests: number;
  maleTests: number;
  femaleTests: number;
  ageGroups: {
    [key: string]: number;
  };
  genderBreakdown: {
    male: number;
    female: number;
  };
  topAgeGroup: {
    ageGroup: string;
    count: number;
  };
  malePercentage: number;
  femalePercentage: number;
}

const API_BASE_URL = 'http://197.248.180.210:9091/api';

// Enhanced fallback data with more facilities
const fallbackFacilities: ApiFacility[] = [
  {
    "mflcode": "11931",
    "facility": "Apdk Dispensary (Machakos)",
    "type": "Health Facility",
    "county": "Machakos",
    "subcounty": "Machakos Sub County",
    "ward": "Machakos Central Ward",
    "program": "PACT IMARA"
  },
  {
    "mflcode": "20203",
    "facility": "University of Nairobi-MARPS Project- Mwingi",
    "type": "KP Site",
    "county": "Kitui",
    "subcounty": "Mwingi Central Sub County",
    "ward": "Central Ward",
    "program": "PACT IMARA"
  },
  {
    "mflcode": "20209",
    "facility": "Onyuongo Dispensary",
    "type": "Health Facility",
    "county": "Kisumu",
    "subcounty": "Nyakach",
    "ward": "North Nyakach",
    "program": "ENTRENCH"
  },
  {
    "mflcode": "20261",
    "facility": "Kibera Level 3",
    "type": "Health Facility",
    "county": "Nairobi",
    "subcounty": "Kibra",
    "ward": "Sarang'ombe",
    "program": "CONNECT"
  },
  {
    "mflcode": "20425",
    "facility": "Ap Kanyonyoo Dispensary",
    "type": "Health Facility",
    "county": "Kitui",
    "subcounty": "Kitui Rural Sub County",
    "ward": "Kwavonza/Yatta Ward",
    "program": "PACT IMARA"
  },
  {
    "mflcode": "20448",
    "facility": "University Of Nairobi Kitui Drop In Centre",
    "type": "KP Site",
    "county": "Kitui",
    "subcounty": "Kitui Central Sub County",
    "ward": "Township Ward",
    "program": "PACT IMARA"
  },
  {
    "mflcode": "20523",
    "facility": "Tumaini DICE Kisumu",
    "type": "KP Site",
    "county": "Kisumu",
    "subcounty": "Kisumu Central",
    "ward": "Market Milimani",
    "program": "ENTRENCH"
  },
  {
    "mflcode": "20568",
    "facility": "Obware Dispensary",
    "type": "Health Facility",
    "county": "Migori",
    "subcounty": "Nyatike",
    "ward": "Kanyasa",
    "program": "ENTRENCH"
  },
  {
    "mflcode": "20934",
    "facility": "Tumaini DICE Sondu",
    "type": "KP Site",
    "county": "Kisumu",
    "subcounty": "Nyakach",
    "ward": "South East Nyakach",
    "program": "ENTRENCH"
  },
  {
    "mflcode": "21144",
    "facility": "MARPS Project Machakos Dice",
    "type": "KP Site",
    "county": "Machakos",
    "subcounty": "Machakos Sub County",
    "ward": "Machakos Central Ward",
    "program": "PACT IMARA"
  },
  {
    "mflcode": "21220",
    "facility": "Anza Mapema Clinic",
    "type": "KP Site",
    "county": "Kisumu",
    "subcounty": "Kisumu Central",
    "ward": "Railways",
    "program": "ENTRENCH"
  },
  {
    "mflcode": "22349",
    "facility": "Swop Outreach Project Clinic",
    "type": "KP Site",
    "county": "Nairobi",
    "subcounty": "Embakasi East",
    "ward": "Upper Savannah",
    "program": "CONNECT"
  },
  {
    "mflcode": "22564",
    "facility": "Tumaini DICE Awasi",
    "type": "KP Site",
    "county": "Kisumu",
    "subcounty": "Muhoroni",
    "ward": "Masogo/Nyang'oma",
    "program": "ENTRENCH"
  },
  {
    "mflcode": "23200",
    "facility": "BHESP--Roysambu",
    "type": "KP Site",
    "county": "Nairobi",
    "subcounty": "Roysambu",
    "ward": "Roysambu",
    "program": "CONNECT"
  },
  {
    "mflcode": "23414",
    "facility": "Kware Dispensary",
    "type": "KP Site",
    "county": "Nairobi",
    "subcounty": "Embakasi South",
    "ward": "Kware",
    "program": "CONNECT"
  },
  {
    "mflcode": "23786",
    "facility": "NGARA MAT CLINIC",
    "type": "Health Facility",
    "county": "Nairobi",
    "subcounty": "Starehe",
    "ward": "Ngara",
    "program": "CONNECT"
  },
  {
    "mflcode": "24200",
    "facility": "LVCT Health Manyatta DICE",
    "type": "KP Site",
    "county": "Kisumu",
    "subcounty": "Kisumu Central",
    "ward": "Kondele",
    "program": "ENTRENCH"
  },
  {
    "mflcode": "24341",
    "facility": "Migingo Island Clinic",
    "type": "Health Facility",
    "county": "Migori",
    "subcounty": "Nyatike",
    "ward": "Muhuru",
    "program": "ENTRENCH"
  },
  {
    "mflcode": "25229",
    "facility": "CHS Mlolongo DiCe",
    "type": "KP Site",
    "county": "Machakos",
    "subcounty": "Athi River Sub County",
    "ward": "Syokimau/Mulolongo Ward",
    "program": "PACT IMARA"
  },
  {
    "mflcode": "26816",
    "facility": "Kyumbi CHS Dice",
    "type": "KP Site",
    "county": "Machakos",
    "subcounty": "Athi River Sub County",
    "ward": "Kinanie Ward",
    "program": "PACT IMARA"
  }
];

// Generate mock performance data for facilities
const generateMockData = (mflCode: string) => {
  const seed = parseInt(mflCode) || 1000;
  const random = (min: number, max: number) => Math.floor((seed * 9301 + 49297) % 233280 / 233280 * (max - min) + min);
  
  return {
    patients: random(200, 3000),
    htsTests: random(100, 1500),
    careEnrollments: random(50, 800),
    viralSuppression: random(80, 95),
    retentionRate: random(75, 92)
  };
};

const mapFacilityType = (apiType: string): Facility['type'] => {
  const type = apiType.toLowerCase();
  if (type.includes('hospital')) return 'hospital';
  if (type.includes('clinic')) return 'clinic';
  if (type.includes('kp site')) return 'kp_site';
  return 'health_center';
};

const transformApiFacility = (apiFacility: ApiFacility): Facility => {
  const mockData = generateMockData(apiFacility.mflcode);
  
  return {
    id: apiFacility.mflcode,
    name: apiFacility.facility,
    mflCode: apiFacility.mflcode,
    type: mapFacilityType(apiFacility.type),
    subcounty: apiFacility.subcounty,
    ward: apiFacility.ward,
    program: apiFacility.program,
    locationId: apiFacility.mflcode, // Use MFL code as location ID
    ...mockData
  };
};

// Fetch facilities from API with fallback
export const fetchFacilities = async (): Promise<County[]> => {
  try {
    console.log('Attempting to fetch facilities from API...');
    const response = await fetch(`${API_BASE_URL}/locations/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiFacility[] = await response.json();
    console.log('Successfully fetched facilities from API:', data.length, 'facilities');
    
    return processFacilityData(data);
  } catch (error) {
    console.log('API fetch failed, using fallback data:', error);
    return processFacilityData(fallbackFacilities);
  }
};

// Process facility data into counties
const processFacilityData = (facilities: ApiFacility[]): County[] => {
  const countiesMap = new Map<string, Facility[]>();
  
  facilities.forEach(apiFacility => {
    const facility = transformApiFacility(apiFacility);
    const countyName = apiFacility.county;
    
    if (!countiesMap.has(countyName)) {
      countiesMap.set(countyName, []);
    }
    
    countiesMap.get(countyName)!.push(facility);
  });
  
  // Convert to County array and sort
  const counties: County[] = Array.from(countiesMap.entries()).map(([name, facilities]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    facilities: facilities.sort((a, b) => a.name.localeCompare(b.name))
  }));
  
  return counties.sort((a, b) => a.name.localeCompare(b.name));
};

// Fetch facility summary data
export const fetchFacilitySummary = async (
  facilityMflCode: string,
  reportDept: string = 'HTS_UPTAKE',
  modality: string = 'NEW_TESTING',
  startDate: string,
  endDate: string
): Promise<FacilitySummaryData> => {
  try {
    console.log(`Fetching summary for facility ${facilityMflCode}...`);
    const url = `${API_BASE_URL}/summary/?reportdept=${reportDept}&modality=${modality}&locationid=${facilityMflCode}&startdate=${startDate}&enddate=${endDate}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SummaryIndicator[] = await response.json();
    console.log('Successfully fetched summary data:', data.length, 'indicators');
    
    return processSummaryData(data);
  } catch (error) {
    console.log('Summary API fetch failed, using mock data:', error);
    return generateMockSummaryData(facilityMflCode);
  }
};

// Process summary data into structured format
const processSummaryData = (indicators: SummaryIndicator[]): FacilitySummaryData => {
  let totalTests = 0;
  let maleTests = 0;
  let femaleTests = 0;
  const ageGroups: { [key: string]: number } = {};

  indicators.forEach(indicator => {
    const value = indicator.total_value;
    totalTests += value;

    // Gender breakdown
    if (indicator.disagrgender === 'male') {
      maleTests += value;
    } else if (indicator.disagrgender === 'female') {
      femaleTests += value;
    }

    // Age group breakdown
    const ageGroup = indicator.disagragegroup;
    if (!ageGroups[ageGroup]) {
      ageGroups[ageGroup] = 0;
    }
    ageGroups[ageGroup] += value;
  });

  // Find top age group
  const topAgeGroup = Object.entries(ageGroups).reduce(
    (max, [ageGroup, count]) => count > max.count ? { ageGroup, count } : max,
    { ageGroup: 'N/A', count: 0 }
  );

  // Calculate percentages
  const malePercentage = totalTests > 0 ? Math.round((maleTests / totalTests) * 100) : 0;
  const femalePercentage = totalTests > 0 ? Math.round((femaleTests / totalTests) * 100) : 0;

  return {
    totalTests,
    maleTests,
    femaleTests,
    ageGroups,
    genderBreakdown: {
      male: maleTests,
      female: femaleTests
    },
    topAgeGroup,
    malePercentage,
    femalePercentage
  };
};

// Generate mock summary data when API fails
const generateMockSummaryData = (mflCode: string): FacilitySummaryData => {
  const seed = parseInt(mflCode) || 1000;
  const random = (min: number, max: number) => Math.floor((seed * 9301 + 49297) % 233280 / 233280 * (max - min) + min);
  
  const totalTests = random(50, 500);
  const maleTests = Math.floor(totalTests * 0.4); // 40% male
  const femaleTests = totalTests - maleTests; // 60% female
  
  const ageGroups = {
    '15-19': random(5, 25),
    '20-24': random(10, 40),
    '25-29': random(15, 45),
    '30-34': random(10, 35),
    '35-39': random(5, 20),
    '40-44': random(2, 15),
    '45-49': random(1, 10),
    '50-54': random(0, 5),
  };

  const topAgeGroup = Object.entries(ageGroups).reduce(
    (max, [ageGroup, count]) => count > max.count ? { ageGroup, count } : max,
    { ageGroup: '25-29', count: ageGroups['25-29'] }
  );

  return {
    totalTests,
    maleTests,
    femaleTests,
    ageGroups,
    genderBreakdown: {
      male: maleTests,
      female: femaleTests
    },
    topAgeGroup,
    malePercentage: Math.round((maleTests / totalTests) * 100),
    femalePercentage: Math.round((femaleTests / totalTests) * 100)
  };
};

// Fetch multiple facilities summary data
export const fetchMultipleFacilitiesSummary = async (
  facilityMflCodes: string[],
  reportDept: string = 'VARIATION_ANALYSIS',
  modality: string = 'CURRENT_ON_ART_PREVIOUS_MONTH',
  startDate: string,
  endDate: string
): Promise<{ [mflCode: string]: FacilitySummaryData }> => {
  try {
    console.log(`Fetching summary for ${facilityMflCodes.length} facilities...`);
    const locationIds = facilityMflCodes.join('%2C'); // URL encode comma
    const url = `${API_BASE_URL}/summary/total/?reportdept=${reportDept}&modality=${modality}&locationid=${locationIds}&startdate=${startDate}&enddate=${endDate}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SummaryIndicator[] = await response.json();
    console.log('Successfully fetched multiple facilities summary:', data.length, 'indicators');
    
    // Group by location ID
    const facilitiesData: { [mflCode: string]: FacilitySummaryData } = {};
    const groupedByLocation = data.reduce((acc, indicator) => {
      const locationId = indicator.locationid;
      if (!acc[locationId]) {
        acc[locationId] = [];
      }
      acc[locationId].push(indicator);
      return acc;
    }, {} as { [key: string]: SummaryIndicator[] });

    // Process each facility's data
    Object.entries(groupedByLocation).forEach(([locationId, indicators]) => {
      facilitiesData[locationId] = processSummaryData(indicators);
    });

    return facilitiesData;
  } catch (error) {
    console.log('Multiple facilities summary API fetch failed, using mock data:', error);
    
    // Generate mock data for all requested facilities
    const mockData: { [mflCode: string]: FacilitySummaryData } = {};
    facilityMflCodes.forEach(mflCode => {
      mockData[mflCode] = generateMockSummaryData(mflCode);
    });
    
    return mockData;
  }
};

// Fetch HTS dashboard summary data across all facilities
export const fetchHTSDashboardData = async (
  startDate: string,
  endDate: string,
  facilityMflCodes: string[]
): Promise<{
  totalTested: number;
  positive: number;
  retest: number;
}> => {
  try {
    console.log(`Fetching HTS dashboard data for ${facilityMflCodes.length} facilities...`);
    
    // Prepare location IDs for API call
    const locationIds = facilityMflCodes.join('%2C'); // URL encode comma
    
    // Make three parallel API calls for each modality
    const [totalTestedResponse, positiveResponse, retestResponse] = await Promise.all([
      // HTS_TOTAL_TESTED with NEW_TESTING modality
      fetch(`${API_BASE_URL}/summary/total/?reportdept=HTS_UPTAKE&modality=NEW_TESTING&locationid=${locationIds}&startdate=${startDate}&enddate=${endDate}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
      // HTS_POSITIVE with REPEAT_TESTING modality
      fetch(`${API_BASE_URL}/summary/total/?reportdept=HTS_UPTAKE&modality=REPEAT_TESTING&locationid=${locationIds}&startdate=${startDate}&enddate=${endDate}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }),
      // HTS_RETEST with TOTAL_POSITIVE modality
      fetch(`${API_BASE_URL}/summary/total/?reportdept=HTS_UPTAKE&modality=TOTAL_POSITIVE&locationid=${locationIds}&startdate=${startDate}&enddate=${endDate}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
    ]);

    // Check if all responses are ok
    if (!totalTestedResponse.ok || !positiveResponse.ok || !retestResponse.ok) {
      throw new Error('One or more API calls failed');
    }

    // Parse responses
    const [totalTestedData, positiveData, retestData] = await Promise.all([
      totalTestedResponse.json() as Promise<SummaryIndicator[]>,
      positiveResponse.json() as Promise<SummaryIndicator[]>,
      retestResponse.json() as Promise<SummaryIndicator[]>
    ]);

    // Calculate totals from each dataset
    const totalTested = totalTestedData.reduce((sum, indicator) => sum + indicator.total_value, 0);
    const positive = positiveData.reduce((sum, indicator) => sum + indicator.total_value, 0);
    const retest = retestData.reduce((sum, indicator) => sum + indicator.total_value, 0);

    console.log('HTS Dashboard API results:', { totalTested, positive, retest });

    return {
      totalTested,
      positive,
      retest
    };
  } catch (error) {
    console.log('HTS Dashboard API fetch failed, using mock data:', error);
    
    // Generate mock data based on facility count
    const facilityCount = facilityMflCodes.length;
    return {
      totalTested: Math.floor(facilityCount * 45), // ~45 tests per facility
      positive: Math.floor(facilityCount * 2.3), // ~2.3 positive per facility
      retest: Math.floor(facilityCount * 8.7) // ~8.7 retests per facility
    };
  }
};

// Helper function to format date for API
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

// Helper function to get date range string for API calls
export const getDateRangeForAPI = (startDate: Date, endDate: Date) => {
  return {
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(endDate)
  };
};