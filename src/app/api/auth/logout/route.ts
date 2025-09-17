import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // delete the cookie
  (await
    // delete the cookie
    cookies()).delete("app_token");
    

  return NextResponse.json({ success: true });
}
