import { NextResponse } from "next/server";
import { query } from "@/lib/db";

interface NominationRow {
  id: number;
  ai_score: number;
  video: string;
  participant_id: number;
  first_name: string;
  last_name: string;
}

export async function GET() {
  try {
    // Fetch statistics (highest score, average score, total count) for AI score > 85
    const statsResult = await query(`
      SELECT
        MAX(ai_score) as highest_score,
        AVG(ai_score) as average_score,
        COUNT(*) as total_participants
      FROM aider_un_proche_nominations
      WHERE ai_score IS NOT NULL
        AND ai_score > 85;
    `);

    // Fetch nomination data with participant details (AI score > 85)
    const nominationsResult = await query(`
      SELECT
        n.id,
        n.ai_score,
        n.video_url as video,
        n.participant_id,
        p.first_name,
        p.last_name
      FROM aider_un_proche_nominations n
      LEFT JOIN contest_participants p ON n.participant_id = p.id
      WHERE n.ai_score IS NOT NULL
        AND n.ai_score > 85
      ORDER BY n.ai_score DESC;
    `);

    const stats = statsResult.rows[0] || {
      highest_score: 0,
      average_score: 0,
      total_participants: 0,
    };

    // Generate presigned URLs using broker-portal's internal endpoint
    const brokerPortalUrl = process.env.BROKER_PORTAL_URL;
    const nominations = await Promise.all(
      nominationsResult.rows.map(async (nomination: NominationRow) => {
        if (nomination.video && brokerPortalUrl) {
          try {
            // Call broker-portal's internal presigned URL endpoint
            const response = await fetch(
              `${brokerPortalUrl}/api/internal/v1/video/presigned-url`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-Internal-API-Key": process.env.INTERNAL_API_KEY || "",
                },
                body: JSON.stringify({ videoKey: nomination.video }),
              },
            );

            if (response.ok) {
              const data = await response.json();
              nomination.video = data.url;
            } else {
              const errorText = await response.text();
              console.error(
                `Failed to get presigned URL for ${nomination.video}:`,
                response.status,
                errorText,
              );
            }
          } catch (error) {
            console.error(
              `Error fetching presigned URL for ${nomination.video}:`,
              error,
            );
          }
        }
        return nomination;
      }),
    );

    return NextResponse.json({
      success: true,
      stats: {
        highestScore: parseFloat(stats.highest_score) || 0,
        averageScore: parseFloat(stats.average_score) || 0,
        totalParticipants: parseInt(stats.total_participants) || 0,
      },
      nominations,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch data",
        details: error.message || String(error),
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
