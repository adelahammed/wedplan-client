# WedPlan — Wedding Planning Platform

**WedPlan** is a role-based luxury wedding planning platform where engaged couples can discover verified wedding venues, fine art photographers, florists, and caterers, while wedding professionals can showcase offerings, receive booking requests, and grow their businesses.

---

## Important Features

### Customer Experience

- **Browse & Search Services**: Discover curated wedding services with real-time text search, location filtering, and category browsing.
- **Price Sorting & Filtering**: Sort service packages ascending and descending by rate.
- **Service Details & High-Res Galleries**: Interactive image carousels with package inclusions and verified vendor profiles.
- **Booking Request Submission**: Direct inquiry form with ceremony date selection, guest counts, and custom notes.
- **Customer Itinerary Dashboard**: Track booking statuses (Pending, Accepted, Rejected, Cancelled) with one-click cancellation for pending inquiries.
- **Personal Profile Management**: Update personal bridal details, location, and wedding vision.

### Vendor Experience

- **Dedicated Business Suite**: View published offerings, active services, and incoming client requests.
- **Add New Wedding Packages**: Multi-image file uploading up to 5 photos via ImgBB integration, rate configuration, and service descriptions.
- **Manage Service Availability**: One-click pause and activate toggles, in-line package editing, and deletion.
- **Booking Inquiries Moderation**: Review event logistics and accept or reject client booking inquiries with guaranteed immutable states once processed.
- **Tier Quota Protection**: Enforces free plan limits (up to 3 active packages) with upgrade notifications.
- **Business Profile Management**: Manage studio logo, contact channels, operating location, and bio.

### Administrator Experience

- **System Metrics & Analytics**: Aggregated counters for total registered users, vendors, customers, services, pending approvals, and transactions.
- **User Directory Governance**: Search and filter registered members by role, view detailed account histories, and block/unblock accounts.
- **Catalog Moderation Queue**: Review submitted packages, approve pending services to make them public, reject unsuitable submissions, and remove violations.
- **Audit Logs**: Monitor Stripe checkout records and subscription transactions.

---

## Technology Stack

- **Frontend Framework**: Next.js 16 (App Router)
- **UI & Components**: React 19, Tailwind CSS v4, Radix UI / Shadcn UI, Lucide Icons, Sonner Toasts
- **Animations**: Framer Motion
- **Authentication**: Better Auth with MongoDB Adapter and JWT support, email/password & Google OAuth
- **Image Hosting**: ImgBB API
- **Backend API**: Node.js & Express.js 5
- **Database**: MongoDB Atlas

---

## Repository & Deployment Links

- **Client Repository**: [https://github.com/adelahammed/wedplan-client](https://github.com/adelahammed/wedplan-client)
- **Server Repository**: [https://github.com/adelahammed/wedplan-server](https://github.com/adelahammed/wedplan-server)
- **Live Website**: [https://wedplan-client-omega-nine.vercel.app/](https://wedplan-client-omega-nine.vercel.app/)
