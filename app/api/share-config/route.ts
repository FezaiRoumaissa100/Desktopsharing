import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { ip, password } = await request.json();

    // Store the configuration in the session
    const response = NextResponse.json({ success: true });
    response.cookies.set('share_config', JSON.stringify({ ip, password }), {
      httpOnly: true, // Makes the cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    });

    return response;
  } catch (error) {
    console.error('Error in share-config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const shareConfig = cookieStore.get('share_config');
    
    if (!shareConfig) {
      return NextResponse.json({ error: 'No configuration found' }, { status: 404 });
    }

    const config = JSON.parse(shareConfig.value);
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error retrieving share config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 