import { supabase } from "./supabaseClient";

export interface Report {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "draft" | "submitted" | "in_progress" | "resolved" | "closed";
  location_latitude?: number;
  location_longitude?: number;
  address?: string;
  user_id?: string;
  department?: string;
  assigned_to?: string;
  created_at: string;
  updated_at?: string;
  resolved_at?: string;
  image_url?: string;
  comments?: any[];
  reporter?: string; // User's name or email who created the report
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  department?: string;
  role?: string;
  created_at: string;
}

export interface DashboardStats {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  activeUsers: number;
  averageResponseTime: number;
  resolutionRate: number;
}

// Dashboard Overview Functions
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get report counts
    const { data: reports, error: reportsError } = await supabase
      .from("reports")
      .select("status, created_at, resolved_at");

    if (reportsError) throw reportsError;

    // Get user count
    const { count: userCount, error: userError } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (userError) console.warn("User count error:", userError);

    const totalReports = reports?.length || 0;
    const resolvedReports =
      reports?.filter((r) => r.status === "resolved" || r.status === "closed")
        .length || 0;
    const pendingReports =
      reports?.filter(
        (r) => r.status === "submitted" || r.status === "in_progress"
      ).length || 0;

    // Calculate average response time (in hours)
    const resolvedWithTime =
      reports?.filter((r) => r.resolved_at && r.created_at) || [];
    const avgResponseTime =
      resolvedWithTime.length > 0
        ? resolvedWithTime.reduce((sum, report) => {
            const created = new Date(report.created_at).getTime();
            const resolved = new Date(report.resolved_at!).getTime();
            return sum + (resolved - created) / (1000 * 60 * 60); // Convert to hours
          }, 0) / resolvedWithTime.length
        : 0;

    const resolutionRate =
      totalReports > 0 ? (resolvedReports / totalReports) * 100 : 0;

    return {
      totalReports,
      resolvedReports,
      pendingReports,
      activeUsers: userCount || 0,
      averageResponseTime: Math.round(avgResponseTime * 10) / 10,
      resolutionRate: Math.round(resolutionRate * 10) / 10,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalReports: 0,
      resolvedReports: 0,
      pendingReports: 0,
      activeUsers: 0,
      averageResponseTime: 0,
      resolutionRate: 0,
    };
  }
}

// Chart Data Functions
export async function getReportsOverTime() {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("created_at, status")
      .gte(
        "created_at",
        new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString()
      ); // Last 6 months

    if (error) throw error;

    // Group by month
    const monthlyData: {
      [key: string]: { resolved: number; pending: number; total: number };
    } = {};

    data?.forEach((report) => {
      const month = new Date(report.created_at).toLocaleDateString("en-US", {
        month: "short",
      });
      if (!monthlyData[month]) {
        monthlyData[month] = { resolved: 0, pending: 0, total: 0 };
      }

      monthlyData[month].total++;
      if (report.status === "resolved" || report.status === "closed") {
        monthlyData[month].resolved++;
      } else if (
        report.status === "submitted" ||
        report.status === "in_progress"
      ) {
        monthlyData[month].pending++;
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
    }));
  } catch (error) {
    console.error("Error fetching reports over time:", error);
    return [];
  }
}

export async function getCategoryDistribution() {
  try {
    const { data, error } = await supabase.from("reports").select("category");

    if (error) throw error;

    const categoryCount: { [key: string]: number } = {};
    data?.forEach((report) => {
      const category = report.category || "Others";
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    const total = Object.values(categoryCount).reduce(
      (sum, count) => sum + count,
      0
    );

    const colors = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#06B6D4",
      "#F97316",
    ];

    return Object.entries(categoryCount).map(([name, value], index) => ({
      name,
      value: total > 0 ? Math.round((value / total) * 100) : 0,
      color: colors[index % colors.length],
    }));
  } catch (error) {
    console.error("Error fetching category distribution:", error);
    return [];
  }
}

export async function getResponseTimeData() {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("created_at, resolved_at")
      .not("resolved_at", "is", null)
      .gte(
        "created_at",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      ); // Last 7 days

    if (error) throw error;

    // Group by day of week
    const weeklyData: { [key: string]: number[] } = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: [],
    };

    data?.forEach((report) => {
      const day = new Date(report.created_at).toLocaleDateString("en-US", {
        weekday: "short",
      });
      const responseTime =
        (new Date(report.resolved_at!).getTime() -
          new Date(report.created_at).getTime()) /
        (1000 * 60 * 60); // hours

      if (weeklyData[day]) {
        weeklyData[day].push(responseTime);
      }
    });

    return Object.entries(weeklyData).map(([day, times]) => ({
      day,
      avgTime:
        times.length > 0
          ? Math.round(
              (times.reduce((sum, time) => sum + time, 0) / times.length) * 10
            ) / 10
          : 0,
    }));
  } catch (error) {
    console.error("Error fetching response time data:", error);
    return [];
  }
}

// Recent Reports
export async function getRecentReports(limit: number = 10): Promise<Report[]> {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select(
        `
        *,
        profiles:user_id(full_name, email)
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (
      data?.map((report) => ({
        ...report,
        reporter:
          report.profiles?.full_name || report.profiles?.email || "Anonymous",
      })) || []
    );
  } catch (error) {
    console.error("Error fetching recent reports:", error);
    return [];
  }
}

// Report Management
export async function updateReportStatus(reportId: string, status: string) {
  try {
    const updateData: any = { status };

    // Add resolved_at timestamp when resolving
    if (status === "resolved") {
      updateData.resolved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("reports")
      .update(updateData)
      .eq("id", reportId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error updating report status:", error);
    throw error;
  }
}

export async function assignReport(reportId: string, assignedTo: string) {
  try {
    const { data, error } = await supabase
      .from("reports")
      .update({ assigned_to: assignedTo })
      .eq("id", reportId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error assigning report:", error);
    throw error;
  }
}

export async function addReportComment(
  reportId: string,
  comment: string,
  userId: string
) {
  try {
    // Get existing comments
    const { data: report, error: fetchError } = await supabase
      .from("reports")
      .select("comments")
      .eq("id", reportId)
      .single();

    if (fetchError) throw fetchError;

    const existingComments = report.comments || [];
    const newComment = {
      id: Date.now().toString(),
      text: comment,
      user_id: userId,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("reports")
      .update({ comments: [...existingComments, newComment] })
      .eq("id", reportId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

// User Management
export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Try to get profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      // Return basic user info if profile doesn't exist
      return {
        id: user.id,
        email: user.email || "",
        full_name:
          user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
        created_at: user.created_at,
      };
    }

    return profile;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export async function getUsers(limit: number = 50) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Search and Filtering
export async function searchReports(
  query: string,
  filters?: {
    status?: string;
    category?: string;
    priority?: string;
    dateFrom?: string;
    dateTo?: string;
  }
) {
  try {
    let supabaseQuery = supabase.from("reports").select(`
        *,
        profiles:user_id(full_name, email)
      `);

    // Text search
    if (query) {
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${query}%,description.ilike.%${query}%,address.ilike.%${query}%`
      );
    }

    // Apply filters
    if (filters?.status) {
      supabaseQuery = supabaseQuery.eq("status", filters.status);
    }
    if (filters?.category) {
      supabaseQuery = supabaseQuery.eq("category", filters.category);
    }
    if (filters?.priority) {
      supabaseQuery = supabaseQuery.eq("priority", filters.priority);
    }
    if (filters?.dateFrom) {
      supabaseQuery = supabaseQuery.gte("created_at", filters.dateFrom);
    }
    if (filters?.dateTo) {
      supabaseQuery = supabaseQuery.lte("created_at", filters.dateTo);
    }

    supabaseQuery = supabaseQuery.order("created_at", { ascending: false });

    const { data, error } = await supabaseQuery;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error searching reports:", error);
    return [];
  }
}

// Real-time subscriptions
export function subscribeToReports(callback: (reports: Report[]) => void) {
  const subscription = supabase
    .channel("reports-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "reports" },
      () => {
        // Refetch reports when changes occur
        getRecentReports().then(callback);
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
}

export function subscribeToReportUpdates(
  reportId: string,
  callback: (report: Report) => void
) {
  const subscription = supabase
    .channel(`report-${reportId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "reports",
        filter: `id=eq.${reportId}`,
      },
      (payload) => {
        callback(payload.new as Report);
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
}
