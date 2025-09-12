export async function getReportStatusCounts(department: string) {
  const { data, error } = await supabase
    .from("reports")
    .select("status")
    .eq("department", department);
  if (error) throw error;
  const stats: any = {
    draft: 0,
    submitted: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
  };
  data?.forEach((row: any) => {
    if (row.status && stats.hasOwnProperty(row.status)) stats[row.status]++;
  });
  return stats;
}

// Debug function to get all reports regardless of department
export async function getAllReports() {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching all reports:", error);
    return [];
  }
  console.log("All reports in database:", data);
  console.log("Total reports found:", data?.length || 0);
  if (data && data.length > 0) {
    console.log("Sample report structure:", Object.keys(data[0]));
    console.log(
      "Categories in reports:",
      data.map((r) => r.category).filter(Boolean)
    );
    console.log(
      "Departments in reports:",
      data.map((r) => r.department).filter(Boolean)
    );
  }
  return data;
}

// Simple function to get reports by category (since category might be used instead of department)
export async function getReportsByCategory(category: string) {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .ilike("category", `%${category}%`)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching reports by category:", error);
    return [];
  }
  console.log(`Reports found for category '${category}':`, data);
  return data;
}

// Debug function to check table structure
export async function getReportsTableInfo() {
  const { data, error } = await supabase.from("reports").select("*").limit(1);
  if (error) throw error;
  if (data && data.length > 0) {
    console.log("Reports table columns:", Object.keys(data[0]));
    console.log("Sample report:", data[0]);
  }
  return data;
}

export async function getReportsByDepartmentWithFilters(
  department: string,
  filters: { status?: string; priority?: string; search?: string }
) {
  console.log("Querying reports for department:", department);
  console.log("Applied filters:", filters);

  // First, let's try to get all reports to see the structure
  let query = supabase.from("reports").select("*");

  // Try different possible department field names
  if (department && department !== "null") {
    // Check if reports have a department field OR if category matches department type
    // For water department, look for water-related categories
    if (department === "water") {
      query = query.or(
        "department.eq.water,category.ilike.%water%,category.ilike.%plumbing%,category.ilike.%drainage%,category.ilike.%sewage%"
      );
    } else if (department === "roads") {
      query = query.or(
        "department.eq.roads,category.ilike.%road%,category.ilike.%street%,category.ilike.%traffic%"
      );
    } else if (department === "electricity") {
      query = query.or(
        "department.eq.electricity,category.ilike.%electric%,category.ilike.%power%,category.ilike.%light%"
      );
    } else {
      // Fallback - try exact department match or similar category
      query = query.or(
        `department.eq.${department},category.ilike.%${department}%`
      );
    }
  }

  query = query.order("created_at", { ascending: false });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.priority) query = query.eq("priority", filters.priority);
  if (filters.search) {
    // Simple search on title or address
    query = query.or(
      `title.ilike.%${filters.search}%,address.ilike.%${filters.search}%`
    );
  }
  const { data, error } = await query;
  if (error) {
    console.error("Query error:", error);
    // If the OR query fails, try getting all reports
    const fallbackQuery = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });
    console.log("Fallback query result:", fallbackQuery.data);
    return fallbackQuery.data || [];
  }
  console.log("Found reports:", data);
  return data;
}
import { supabase } from "../lib/supabaseClient";

export async function getReportsByDepartment(department: string) {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("department", department)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateReportStatus(reportId: string, status: string) {
  const { data, error } = await supabase
    .from("reports")
    .update({ status })
    .eq("id", reportId)
    .select();
  if (error) throw error;
  return data;
}
