import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Fetch statistics (highest score, average score, total count)
    const statsResult = await query(`
      SELECT
        MAX(ai_score) as highest_score,
        AVG(ai_score) as average_score,
        COUNT(*) as total_participants
      FROM aider_un_proche_nominations
      WHERE ai_score IS NOT NULL;
    `);

    // Fetch nomination data with participant details
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
      ORDER BY n.ai_score DESC;
    `);

    const stats = statsResult.rows[0] || {
      highest_score: 0,
      average_score: 0,
      total_participants: 0
    };

    return NextResponse.json({
      success: true,
      stats: {
        highestScore: parseFloat(stats.highest_score) || 0,
        averageScore: parseFloat(stats.average_score) || 0,
        totalParticipants: parseInt(stats.total_participants) || 0
      },
      nominations: nominationsResult.rows
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch data',
        details: error.message || String(error),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
