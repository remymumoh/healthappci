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

// Fallback data based on real API structure
const fallbackFacilities: ApiFacility[] = [
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
    ...mockData
  };
};

export const fetchFacilities = async (): Promise<County[]> => {
  // Use real facility data directly (API not accessible in browser environment)
  const countiesMap = new Map<string, Facility[]>();
  
  fallbackFacilities.forEach(apiFacility => {
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