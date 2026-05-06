import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable, registerSchema, loginSchema, refreshTokenSchema } from "@workspace/db";
import {
  requireAuth,
  signAccessToken,
  signRefreshToken,
  verifyToken,
} from "../middleware/auth";

const router: IRouter = Router();

function toProfile(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };
}

router.post("/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: parsed.error.message });
    return;
  }
  const { email, password, name, role } = parsed.data;

  try {
    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db
      .insert(usersTable)
      .values({ email, name, passwordHash, role })
      .returning();

    const tokenPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    await db
      .update(usersTable)
      .set({ refreshToken })
      .where(eq(usersTable.id, user.id));

    res.status(201).json({ accessToken, refreshToken, user: toProfile(user) });
  } catch (err) {
    req.log.error({ err }, "register error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: parsed.error.message });
    return;
  }
  const { email, password } = parsed.data;

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const tokenPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    await db
      .update(usersTable)
      .set({ refreshToken, updatedAt: new Date() })
      .where(eq(usersTable.id, user.id));

    res.json({ accessToken, refreshToken, user: toProfile(user) });
  } catch (err) {
    req.log.error({ err }, "login error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/refresh", async (req, res) => {
  const parsed = refreshTokenSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: parsed.error.message });
    return;
  }
  const { refreshToken } = parsed.data;

  try {
    const payload = verifyToken(refreshToken);
    if (payload.type !== "refresh") {
      res.status(401).json({ error: "Invalid token type" });
      return;
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, payload.sub))
      .limit(1);

    if (!user || user.refreshToken !== refreshToken) {
      res.status(401).json({ error: "Invalid or expired refresh token" });
      return;
    }

    const tokenPayload = { sub: user.id, email: user.email, role: user.role };
    const newAccessToken = signAccessToken(tokenPayload);
    const newRefreshToken = signRefreshToken(tokenPayload);

    await db
      .update(usersTable)
      .set({ refreshToken: newRefreshToken, updatedAt: new Date() })
      .where(eq(usersTable.id, user.id));

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: toProfile(user),
    });
  } catch {
    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

router.get("/auth/me", requireAuth, async (req, res) => {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.sub))
      .limit(1);

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    res.json(toProfile(user));
  } catch (err) {
    req.log.error({ err }, "getMe error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
