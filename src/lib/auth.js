import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(
  process.env.MONGODB_URL || "mongodb://localhost:27017",
);
const db = client.db("wedplan");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        input: true,
        required: true,
        defaultValue: "customer",
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      businessName: {
        type: "string",
        required: false,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          let role = user.role || "customer";
          try {
            let cookieStr = "";
            if (ctx?.headers?.get) {
              cookieStr = ctx.headers.get("cookie") || "";
            } else if (ctx?.request?.headers?.get) {
              cookieStr = ctx.request.headers.get("cookie") || "";
            } else if (ctx?.context?.headers?.get) {
              cookieStr = ctx.context.headers.get("cookie") || "";
            }
            const match = cookieStr.match(/wedplan_oauth_role=([^;]+)/);
            if (match) {
              const parsed = decodeURIComponent(match[1]).trim().toLowerCase();
              if (parsed === "vendor" || parsed === "customer") {
                role = parsed;
              }
            }
          } catch {}

          if (role === "customer") {
            try {
              const { cookies } = await import("next/headers");
              const cookieStore = await cookies();
              const c = cookieStore.get("wedplan_oauth_role")?.value?.toLowerCase();
              if (c === "vendor" || c === "customer") {
                role = c;
              }
            } catch {}
          }

          return {
            data: {
              ...user,
              role,
            },
          };
        },
      },
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    },
  },

  plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: false,
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),
});
