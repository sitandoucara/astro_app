import { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { AuthenticatedRequest, requireAuth } from "./middleware/auth";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const deleteAccountHandler = async (
  req: AuthenticatedRequest,
  res: VercelResponse
) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const { userId } = req.body as { userId?: string };
    const authenticatedUserId = req.user?.id;

    // Security checks
    if (!userId) {
      res.status(400).json({ error: "Missing userId" });
      return;
    }

    if (!authenticatedUserId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (userId !== authenticatedUserId) {
      res.status(403).json({
        error: "Forbidden",
        message: "You can only delete your own account",
      });
      return;
    }

    // Delete the user
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Delete failed:", error.message);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Headers CORS
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Apply authentication
  return requireAuth(deleteAccountHandler)(req as AuthenticatedRequest, res);
}
