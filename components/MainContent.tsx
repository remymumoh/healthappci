import { View, Text, StyleSheet, ScrollView } from "react-native"
import { DashboardGrid } from "./DashboardGrid"
import type { DashboardCard, County, Facility, CategoryType } from "@/types"

interface Props {
  category: CategoryType
  selectedCounty: string | null
  selectedFacility: string | null
  counties: County[]
  facilities: Facility[]
  dashboardCards: DashboardCard[]
  loading: boolean
}

export function MainContent({
  category,
  selectedCounty,
  selectedFacility,
  counties,
  facilities,
  dashboardCards,
  loading,
}: Props) {
  const getContentTitle = () => {
    if (selectedFacility) {
      const facility = facilities.find((f) => f.id === selectedFacility)
      return facility ? `${facility.name}` : "Facility Data"
    }

    if (selectedCounty) {
      const county = counties.find((c) => c.id === selectedCounty)
      return county ? `${county.name} County` : "County Data"
    }

    return `National Overview`
  }

  const getCategoryTitle = () => {
    return category === "hts" ? "HIV Testing Services" : "Care & Treatment"
  }

  const getContentDescription = () => {
    if (selectedFacility) {
      const facility = facilities.find((f) => f.id === selectedFacility)
      const county = counties.find((c) => c.id === selectedCounty)
      return `${getCategoryTitle()} data for ${facility?.name} in ${county?.name} County`
    }

    if (selectedCounty) {
      const county = counties.find((c) => c.id === selectedCounty)
      return `${getCategoryTitle()} overview for ${county?.name} County`
    }

    return `National ${getCategoryTitle().toLowerCase()} overview`
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentHeader}>
          <Text style={styles.contentTitle}>{getContentTitle()}</Text>
          <Text style={styles.contentDescription}>{getContentDescription()}</Text>
        </View>

        <DashboardGrid cards={dashboardCards} loading={loading} />

        {/* Additional content sections based on selection */}
        {selectedFacility && (
          <View style={styles.detailSection}>
            <Text style={styles.detailTitle}>Facility Details</Text>
            <View style={styles.detailCard}>
              {facilities
                .filter((f) => f.id === selectedFacility)
                .map((facility) => (
                  <View key={facility.id}>
                    <Text style={styles.detailLabel}>Name</Text>
                    <Text style={styles.detailValue}>{facility.name}</Text>

                    <Text style={styles.detailLabel}>Type</Text>
                    <Text style={styles.detailValue}>{facility.type}</Text>

                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailValue}>
                      {facility.location.latitude.toFixed(4)}, {facility.location.longitude.toFixed(4)}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        {selectedCounty && !selectedFacility && (
          <View style={styles.detailSection}>
            <Text style={styles.detailTitle}>County Overview</Text>
            <View style={styles.detailCard}>
              {counties
                .filter((c) => c.id === selectedCounty)
                .map((county) => (
                  <View key={county.id}>
                    <Text style={styles.detailLabel}>County</Text>
                    <Text style={styles.detailValue}>{county.name}</Text>

                    <Text style={styles.detailLabel}>Code</Text>
                    <Text style={styles.detailValue}>{county.code}</Text>

                    <Text style={styles.detailLabel}>Total Facilities</Text>
                    <Text style={styles.detailValue}>{facilities.length}</Text>
                  </View>
                ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    flex: 1,
  },
  contentHeader: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  contentTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#111827",
    marginBottom: 8,
  },
  contentDescription: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#6b7280",
    lineHeight: 24,
  },
  detailSection: {
    margin: 16,
    marginTop: 0,
  },
  detailTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#111827",
    marginBottom: 12,
  },
  detailCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#6b7280",
    marginBottom: 4,
    marginTop: 12,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#111827",
  },
})
