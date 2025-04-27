// src/data/sampleMapData.js

export const sampleMapData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-97.7431, 30.2672]
      },
      "properties": {
        "report_id": "1001",
        "category_id": "infrastructure",
        "severity": 3,
        "status": "submitted",
        "created_at": "2025-04-20T14:30:00Z",
        "resolved_at": null,
        "title": "Pothole on Congress Ave",
        "description": "Large pothole in the middle of the road causing traffic issues"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-97.7501, 30.2751]
      },
      "properties": {
        "report_id": "1002",
        "category_id": "traffic",
        "severity": 4,
        "status": "in_progress",
        "created_at": "2025-04-21T09:15:00Z",
        "resolved_at": null,
        "title": "Traffic light malfunction",
        "description": "Traffic light at 6th and Lamar is stuck on red in all directions"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-97.7370, 30.2629]
      },
      "properties": {
        "report_id": "1003",
        "category_id": "crime",
        "severity": 5,
        "status": "submitted",
        "created_at": "2025-04-22T23:45:00Z",
        "resolved_at": null,
        "title": "Car break-in",
        "description": "Multiple cars had windows broken in parking garage"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-97.7531, 30.2752]
      },
      "properties": {
        "report_id": "1004",
        "category_id": "environment",
        "severity": 2,
        "status": "resolved",
        "created_at": "2025-04-19T13:20:00Z",
        "resolved_at": "2025-04-23T10:30:00Z",
        "title": "Illegal dumping",
        "description": "Trash and construction materials dumped near Shoal Creek"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-97.7332, 30.2845]
      },
      "properties": {
        "report_id": "1005",
        "category_id": "public_services",
        "severity": 2,
        "status": "submitted",
        "created_at": "2025-04-23T08:10:00Z",
        "resolved_at": null,
        "title": "Street light out",
        "description": "Street light near UT campus has been out for several days"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-97.7601, 30.2621]
      },
      "properties": {
        "report_id": "1006",
        "category_id": "noise",
        "severity": 3,
        "status": "in_progress",
        "created_at": "2025-04-22T22:05:00Z",
        "resolved_at": null,
        "title": "Loud construction",
        "description": "Construction site operating past permitted hours"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-97.7401, 30.2702]
      },
      "properties": {
        "report_id": "1007",
        "category_id": "animals",
        "severity": 3,
        "status": "submitted",
        "created_at": "2025-04-23T07:30:00Z",
        "resolved_at": null,
        "title": "Stray dog",
        "description": "Stray dog wandering downtown area, looks injured"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-97.7398, 30.2583]
      },
      "properties": {
        "report_id": "1008",
        "category_id": "other",
        "severity": 1,
        "status": "closed",
        "created_at": "2025-04-20T16:45:00Z",
        "resolved_at": "2025-04-21T09:30:00Z",
        "title": "Graffiti",
        "description": "New graffiti on business walls along South Congress"
      }
    }
  ]
};

export const sampleStatistics = {
  "neighborhood_statistics": [
    {
      "neighborhood_id": 1,
      "neighborhood_name": "Downtown",
      "report_count": 24,
      "avg_resolution_hours": 36.5
    },
    {
      "neighborhood_id": 2,
      "neighborhood_name": "South Congress",
      "report_count": 18,
      "avg_resolution_hours": 48.2
    },
    {
      "neighborhood_id": 3,
      "neighborhood_name": "East Austin",
      "report_count": 15,
      "avg_resolution_hours": 24.8
    },
    {
      "neighborhood_id": 4,
      "neighborhood_name": "North Austin",
      "report_count": 12,
      "avg_resolution_hours": 52.3
    },
    {
      "neighborhood_id": 5,
      "neighborhood_name": "West Austin",
      "report_count": 9,
      "avg_resolution_hours": 38.7
    }
  ],
  "time_trends": [
    {
      "month": "2025-01",
      "report_count": 45
    },
    {
      "month": "2025-02",
      "report_count": 52
    },
    {
      "month": "2025-03",
      "report_count": 38
    },
    {
      "month": "2025-04",
      "report_count": 30
    }
  ]
};