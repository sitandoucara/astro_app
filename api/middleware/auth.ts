import { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface AuthenticatedRequest extends VercelRequest {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: VercelResponse
): Promise<{ isAuthenticated: boolean; user?: any }> => {
  try {
    // Retrieve the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Missing or invalid authorization header",
      });
      return { isAuthenticated: false };
    }

    const token = authHeader.substring(7);

    // Verify the token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Invalid or expired token",
      });
      return { isAuthenticated: false };
    }

    // Add the user to the query
    req.user = user;

    return { isAuthenticated: true, user };
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      error: "Unauthorized",
      message: "Authentication failed",
    });
    return { isAuthenticated: false };
  }
};

export const requireAuth = (
  handler: (req: AuthenticatedRequest, res: VercelResponse) => Promise<void>
) => {
  return async (req: AuthenticatedRequest, res: VercelResponse) => {
    const { isAuthenticated } = await authenticateUser(req, res);

    if (!isAuthenticated) {
      return;
    }

    return handler(req, res);
  };
};
