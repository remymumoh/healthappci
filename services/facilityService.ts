export interface ApiFacility {
  mflcode: string;
  facility: string;
  type: string;
  county: string;
  subcounty: string;
  ward: string;
  program: string;
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
}

export interface County {
  id: string;
  name: string;
  facilities: Facility[];
}

const API_BASE_URL = 'http://197.248.180.210:9091/api';

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
    ...mockData
  };
};

export const fetchFacilities = async (): Promise<County[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const apiFacilities: ApiFacility[] = await response.json();
    
    // Group facilities by county
    const countiesMap = new Map<string, Facility[]>();
    
    apiFacilities.forEach(apiFacility => {
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
    
  } catch (error) {
    console.error('Error fetching facilities:', error);
    
    // Return fallback data in case of API failure
    return [
      {
        id: 'nairobi',
        name: 'Nairobi County',
        facilities: [
          {
            id: 'fallback-1',
            name: 'Kenyatta National Hospital',
            mflCode: '10000',
            type: 'hospital',
            patients: 2847,
            htsTests: 1234,
            careEnrollments: 892,
            viralSuppression: 94.2,
            retentionRate: 89.5,
            subcounty: 'Nairobi Central',
            ward: 'Central Ward',
            program: 'CONNECT'
          }
        ]
      }
    ];
  }
};