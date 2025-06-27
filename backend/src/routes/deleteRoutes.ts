import { Router, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { config } from "../config/env";

const router = Router();

const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_ROLE_KEY
);

router.post(
  "/delete-account",

  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body as { userId?: string };

    if (!userId) {
      res.status(400).json({ error: "Missing userId" });
      return;
    }

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Failed to delete user:", error.message);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ success: true });
  }
);

export default router;
