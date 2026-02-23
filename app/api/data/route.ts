import { NextResponse } from "next/server";
import { query } from "@/lib/db";

interface NominationRow {
  id: number;
  ai_score: number;
  video: string;
  participant_id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  nominee_first_name: string;
  nominee_last_name: string;
  nominee_phone_number: string;
  nominee_email: string;
  why_help_text: string;
  how_help_text: string;
}

export async function GET() {
  try {
    // Fetch statistics from ALL participants
    const statsResult = await query(`
      SELECT
        MAX(ai_score) as highest_score,
        AVG(ai_score) as average_score,
        COUNT(*) as total_participants
      FROM aider_un_proche_nominations
      WHERE ai_score IS NOT NULL;
    `);

    // Fetch nomination data with participant details (only AI score > 80 for display)
    const nominationsResult = await query(`
      SELECT
        n.id,
        n.ai_score,
        n.video_url as video,
        n.participant_id,
        p.first_name,
        p.last_name,
        p.phone as phone_number,
        p.email,
        n.loved_one_first_name as nominee_first_name,
        n.loved_one_last_name as nominee_last_name,
        n.loved_one_phone as nominee_phone_number,
        n.loved_one_email as nominee_email,
        n.why as why_help_text,
        n.how as how_help_text
      FROM aider_un_proche_nominations n
      LEFT JOIN contest_participants p ON n.participant_id = p.id
      WHERE n.ai_score IS NOT NULL
        AND n.ai_score > 80
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
                `Échec de récupération de l'URL présignée pour ${nomination.video}:`,
                response.status,
                errorText,
              );
            }
          } catch (error) {
            console.error(
              `Erreur lors de la récupération de l'URL présignée pour ${nomination.video}:`,
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
        error: "Échec du chargement des données",
        details: error.message || String(error),
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
