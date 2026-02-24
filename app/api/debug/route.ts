import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;

  if (!authToken || authToken !== process.env.AUTH_PASSWORD) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // List all tables
    const tablesResult = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    // Try to get column info for aider_un_proche_nominations
    let nominationColumns = [];
    try {
      const columnsResult = await query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'aider_un_proche_nominations'
        ORDER BY ordinal_position;
      `);
      nominationColumns = columnsResult.rows;
    } catch (err) {
      console.error('Error fetching nomination columns:', err);
    }

    // Try to get column info for contest_participants
    let participantColumns = [];
    try {
      const participantColumnsResult = await query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'contest_participants'
        ORDER BY ordinal_position;
      `);
      participantColumns = participantColumnsResult.rows;
    } catch (err) {
      console.error('Error fetching participant columns:', err);
    }

    return NextResponse.json({
      success: true,
      tables: tablesResult.rows,
      nominationColumns,
      participantColumns
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch debug info',
        details: error.message || String(error)
      },
      { status: 500 }
    );
  }
}
