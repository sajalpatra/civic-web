"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { supabase } from "@/lib/supabaseClient";
import { Report } from "@/lib/dashboardService";

// Fix default Leaflet icon path issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom marker icons for different statuses
const getMarkerIcon = (status: string) => {
  let color = "#3B82F6"; // default blue

  switch (status) {
    case "resolved":
    case "closed":
      color = "#10B981"; // green
      break;
    case "in_progress":
      color = "#F59E0B"; // yellow/orange
      break;
    case "submitted":
      color = "#3B82F6"; // blue
      break;
    case "draft":
      color = "#6B7280"; // gray
      break;
    default:
      color = "#EF4444"; // red
  }

  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    ">
      <div style="
        width: 8px;
        height: 8px;
        margin: 6px;
        background-color: white;
        border-radius: 50%;
      "></div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: "custom-marker-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

interface MapProps {
  statusFilter?: string;
  categoryFilter?: string;
}

export default function Map({ statusFilter, categoryFilter }: MapProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<[number, number]>([20.5937, 78.9629]); // Center of India

  useEffect(() => {
    fetchReports();
  }, [statusFilter, categoryFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("reports")
        .select("*")
        .not("location_latitude", "is", null)
        .not("location_longitude", "is", null);

      // Apply status filter
      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      // Apply category filter
      if (categoryFilter && categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching reports:", error);
        return;
      }

      if (data && data.length > 0) {
        setReports(data);

        // Calculate center based on reports
        const avgLat =
          data.reduce((sum, r) => sum + (r.location_latitude || 0), 0) /
          data.length;
        const avgLng =
          data.reduce((sum, r) => sum + (r.location_longitude || 0), 0) /
          data.length;
        setCenter([avgLat, avgLng]);
      } else {
        setReports([]);
        setCenter([20.5937, 78.9629]); // Default to India center
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "resolved":
      case "closed":
        return "bg-green-500";
      case "in_progress":
        return "bg-yellow-500";
      case "submitted":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-sm text-gray-700 dark:text-gray-200">
              Loading reports...
            </span>
          </div>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={reports.length > 0 ? 10 : 5}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reports.map(
          (report) =>
            report.location_latitude &&
            report.location_longitude && (
              <Marker
                key={report.id}
                position={[report.location_latitude, report.location_longitude]}
                icon={getMarkerIcon(report.status)}
              >
                <Popup>
                  <div className="min-w-[200px] p-2">
                    <h3 className="font-semibold text-sm mb-2">
                      {report.title}
                    </h3>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-white text-xs ${getStatusBadgeColor(
                            report.status
                          )}`}
                        >
                          {formatStatus(report.status)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{report.category}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span className="font-medium capitalize">
                          {report.priority}
                        </span>
                      </div>

                      {report.address && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-gray-600 text-xs">
                            📍 {report.address}
                          </p>
                        </div>
                      )}

                      {report.description && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-gray-700 text-xs line-clamp-2">
                            {report.description}
                          </p>
                        </div>
                      )}

                      <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                        {new Date(report.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>

      {!loading && reports.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white dark:bg-gray-800 px-6 py-4 rounded-lg shadow-lg text-center">
          <p className="text-gray-600 dark:text-gray-300">
            No reports found with the current filters
          </p>
        </div>
      )}
    </div>
  );
}
