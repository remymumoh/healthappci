import { County, Facility, HTSData, CareAndTreatmentData, DashboardCard } from '@/types';

class DataService {
  private counties: County[] = [
    { id: '1', name: 'Nairobi', code: 'NRB' },
    { id: '2', name: 'Mombasa', code: 'MSA' },
    { id: '3', name: 'Kisumu', code: 'KSM' },
    { id: '4', name: 'Nakuru', code: 'NKR' },
    { id: '5', name: 'Eldoret', code: 'ELD' },
    { id: '6', name: 'Kakamega', code: 'KKG' },
    { id: '7', name: 'Meru', code: 'MRU' },
    { id: '8', name: 'Nyeri', code: 'NYR' },
  ];

  private facilities: Facility[] = [
    { id: '1', name: 'Kenyatta National Hospital', type: 'National Referral', county: '1', location: { latitude: -1.3006, longitude: 36.8073 } },
    { id: '2', name: 'Nairobi Hospital', type: 'Private', county: '1', location: { latitude: -1.2921, longitude: 36.8219 } },
    { id: '3', name: 'Pumwani Maternity Hospital', type: 'Public', county: '1', location: { latitude: -1.2841, longitude: 36.8365 } },
    { id: '4', name: 'Coast General Hospital', type: 'Public', county: '2', location: { latitude: -4.0435, longitude: 39.6682 } },
    { id: '5', name: 'Aga Khan Hospital Mombasa', type: 'Private', county: '2', location: { latitude: -4.0469, longitude: 39.6645 } },
    { id: '6', name: 'Jaramogi Oginga Odinga Hospital', type: 'County Referral', county: '3', location: { latitude: -0.0917, longitude: 34.7680 } },
    { id: '7', name: 'Nakuru Level 5 Hospital', type: 'County Referral', county: '4', location: { latitude: -0.3031, longitude: 36.0800 } },
    { id: '8', name: 'Moi Teaching Hospital', type: 'Teaching', county: '5', location: { latitude: 0.5143, longitude: 35.2697 } },
  ];

  async getCounties(): Promise<County[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.counties), 300);
    });
  }

  async getFacilitiesByCounty(countyId: string): Promise<Facility[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const facilities = this.facilities.filter(f => f.county === countyId);
        resolve(facilities);
      }, 300);
    });
  }

  async getHTSData(facilityId?: string): Promise<HTSData> {
    // Simulate API call with different data based on facility
    return new Promise((resolve) => {
      setTimeout(() => {
        const baseData = {
          totalTests: facilityId ? Math.floor(Math.random() * 500) + 100 : 12847,
          positiveTests: facilityId ? Math.floor(Math.random() * 50) + 10 : 1247,
          negativeTests: facilityId ? Math.floor(Math.random() * 450) + 90 : 11600,
          testingRate: facilityId ? Math.floor(Math.random() * 30) + 70 : 89.2,
          monthlyGrowth: facilityId ? Math.floor(Math.random() * 20) - 10 : 5.7,
          targetAchievement: facilityId ? Math.floor(Math.random() * 40) + 60 : 94.3,
        };
        resolve(baseData);
      }, 300);
    });
  }

  async getCareAndTreatmentData(facilityId?: string): Promise<CareAndTreatmentData> {
    // Simulate API call with different data based on facility
    return new Promise((resolve) => {
      setTimeout(() => {
        const baseData = {
          activePatients: facilityId ? Math.floor(Math.random() * 200) + 50 : 8945,
          newEnrollments: facilityId ? Math.floor(Math.random() * 20) + 5 : 234,
          retentionRate: facilityId ? Math.floor(Math.random() * 20) + 75 : 87.6,
          viralSuppression: facilityId ? Math.floor(Math.random() * 15) + 80 : 92.4,
          adherenceRate: facilityId ? Math.floor(Math.random() * 10) + 85 : 89.7,
          lostToFollowUp: facilityId ? Math.floor(Math.random() * 10) + 2 : 78,
        };
        resolve(baseData);
      }, 300);
    });
  }

  convertHTSToCards(data: HTSData): DashboardCard[] {
    return [
      {
        id: '1',
        title: 'Total Tests',
        value: data.totalTests.toLocaleString(),
        change: data.monthlyGrowth,
        changeType: data.monthlyGrowth > 0 ? 'increase' : 'decrease',
        icon: 'Activity',
        description: 'HIV tests conducted this month'
      },
      {
        id: '2',
        title: 'Positive Tests',
        value: data.positiveTests.toLocaleString(),
        change: 2.3,
        changeType: 'increase',
        icon: 'AlertCircle',
        description: 'Positive test results'
      },
      {
        id: '3',
        title: 'Testing Rate',
        value: `${data.testingRate}%`,
        change: 1.2,
        changeType: 'increase',
        icon: 'TrendingUp',
        description: 'Population testing coverage'
      },
      {
        id: '4',
        title: 'Target Achievement',
        value: `${data.targetAchievement}%`,
        change: data.targetAchievement > 90 ? 3.4 : -1.2,
        changeType: data.targetAchievement > 90 ? 'increase' : 'decrease',
        icon: 'Target',
        description: 'Monthly target progress'
      }
    ];
  }

  convertCareAndTreatmentToCards(data: CareAndTreatmentData): DashboardCard[] {
    return [
      {
        id: '1',
        title: 'Active Patients',
        value: data.activePatients.toLocaleString(),
        change: 2.8,
        changeType: 'increase',
        icon: 'Users',
        description: 'Patients currently on treatment'
      },
      {
        id: '2',
        title: 'New Enrollments',
        value: data.newEnrollments.toLocaleString(),
        change: 4.2,
        changeType: 'increase',
        icon: 'UserPlus',
        description: 'New patients this month'
      },
      {
        id: '3',
        title: 'Retention Rate',
        value: `${data.retentionRate}%`,
        change: 1.5,
        changeType: 'increase',
        icon: 'Heart',
        description: 'Patient retention in program'
      },
      {
        id: '4',
        title: 'Viral Suppression',
        value: `${data.viralSuppression}%`,
        change: 0.8,
        changeType: 'increase',
        icon: 'Shield',
        description: 'Patients with suppressed viral load'
      },
      {
        id: '5',
        title: 'Adherence Rate',
        value: `${data.adherenceRate}%`,
        change: -0.5,
        changeType: 'decrease',
        icon: 'Clock',
        description: 'Treatment adherence rate'
      },
      {
        id: '6',
        title: 'Lost to Follow-up',
        value: data.lostToFollowUp.toLocaleString(),
        change: -12.3,
        changeType: 'decrease',
        icon: 'AlertTriangle',
        description: 'Patients lost to follow-up'
      }
    ];
  }
}

export const dataService = new DataService();
