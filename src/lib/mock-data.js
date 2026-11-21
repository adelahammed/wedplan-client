export const MOCK_SERVICES = [
  {
    id: "srv-1",
    name: "Royal Heritage Grand Palace & Gardens",
    category: "Wedding Venues",
    price: "$4,500",
    priceNum: 4500,
    location: "Manhattan, New York",
    image: "/assets/Slider Image (1).jpg",
    gallery: [
      "/assets/Slider Image (1).jpg",
      "/assets/Slider Image (2).jpg",
      "/assets/Slider Image (3).jpg",
      "/assets/Slider Image (4).jpg"
    ],
    vendor: {
      id: "vnd-1",
      name: "The Royal Ballroom Hospitality Group",
      email: "concierge@royalpalace.com",
      phone: "+1 (212) 555-0199",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      isPremium: true
    },
    rating: 4.9,
    reviewsCount: 124,
    description: "An awe-inspiring neoclassical estate featuring marble ballrooms, crystalline chandeliers, and three acres of manicured rose gardens. Designed for unforgettable grand ceremonies and lavish dinners.",
    features: [
      "Accommodates up to 550 seated guests",
      "Complimentary private bridal dressing suites",
      "Valet parking with 300 vehicle capacity",
      "State-of-the-art acoustic sound and architectural lighting",
      "Full professional catering prep kitchen"
    ],
    status: "Approved",
    isActive: true,
    createdDate: "2026-08-10"
  },
  {
    id: "srv-2",
    name: "Lumière Cinematics & Fine Art Photography",
    category: "Photography & Videography",
    price: "$2,800",
    priceNum: 2800,
    location: "Brooklyn, New York",
    image: "/assets/Slider Image (2).jpg",
    gallery: [
      "/assets/Slider Image (2).jpg",
      "/assets/Slider Image (3).jpg",
      "/assets/Slider Image (4).jpg",
      "/assets/Slider Image (1).jpg"
    ],
    vendor: {
      id: "vnd-2",
      name: "Julian & Clara Visuals",
      email: "hello@lumierephoto.com",
      phone: "+1 (718) 555-0144",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      isPremium: true
    },
    rating: 5.0,
    reviewsCount: 89,
    description: "Editorial documentary wedding photography and 4K cinema film capturing authentic, tear-jerking, joyous moments. Delivered with tailored color-grading and heirloom leather albums.",
    features: [
      "2 Lead photographers and 1 drone cinematographer",
      "Full-day 10 hours coverage",
      "Next-day sneak peek gallery with 50 retouched images",
      "Handcrafted Italian linen wedding album included",
      "Raw 4K footage and cinematic 7-minute highlight film"
    ],
    status: "Approved",
    isActive: true,
    createdDate: "2026-08-14"
  },
  {
    id: "srv-3",
    name: "Bloom & Blossom Luxury Floral Decor",
    category: "Decoration & Florist",
    price: "$3,200",
    priceNum: 3200,
    location: "Greenwich, Connecticut",
    image: "/assets/Slider Image (3).jpg",
    gallery: [
      "/assets/Slider Image (3).jpg",
      "/assets/Slider Image (4).jpg",
      "/assets/Slider Image (1).jpg",
      "/assets/Slider Image (2).jpg"
    ],
    vendor: {
      id: "vnd-3",
      name: "Seraphina Floral Atelier",
      email: "design@bloomandblossom.com",
      phone: "+1 (203) 555-0182",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      isPremium: true
    },
    rating: 4.8,
    reviewsCount: 67,
    description: "Sculptural botanical installations, cascading floral arches, candlelight tablescapes, and bespoke bridal bouquets curated from fresh premium blooms.",
    features: [
      "Custom 12-foot floral ceremony archway",
      "Centerpieces for 25 reception guest tables",
      "Bridal bouquet, 6 bridesmaid bouquets, 8 boutonnieres",
      "Full delivery, on-site morning setup, and midnight takedown",
      "Complimentary tabletop linen styling consultation"
    ],
    status: "Approved",
    isActive: true,
    createdDate: "2026-09-02"
  },
  {
    id: "srv-4",
    name: "The Epicurean Feast Artisanal Catering",
    category: "Catering Services",
    price: "$5,800",
    priceNum: 5800,
    location: "Manhattan, New York",
    image: "/assets/Slider Image (4).jpg",
    gallery: [
      "/assets/Slider Image (4).jpg",
      "/assets/Slider Image (1).jpg",
      "/assets/Slider Image (2).jpg",
      "/assets/Slider Image (3).jpg"
    ],
    vendor: {
      id: "vnd-4",
      name: "Chef Antoine & Gourmet Guild",
      email: "orders@epicureancatering.com",
      phone: "+1 (212) 555-0177",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      isPremium: true
    },
    rating: 4.9,
    reviewsCount: 112,
    description: "Michelin-inspired farm-to-table multi-course wedding banquets, cocktail hour hors d'oeuvres, signature mixology bar, and late-night artisan comfort bites.",
    features: [
      "Plated 4-course gourmet dinner for 150 guests",
      "Six handcrafted passed hors d'oeuvres during cocktail hour",
      "Licensed sommelier curated wine pairing",
      "Complete bar staff and white-glove server crew",
      "Complimentary private 4-person menu tasting session"
    ],
    status: "Approved",
    isActive: true,
    createdDate: "2026-09-18"
  },
  {
    id: "srv-5",
    name: "Radiance Bridal Artistry & Glow Styling",
    category: "Makeup & Styling",
    price: "$1,400",
    priceNum: 1400,
    location: "Jersey City, New Jersey",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
      "/assets/Slider Image (2).jpg",
      "/assets/Slider Image (3).jpg"
    ],
    vendor: {
      id: "vnd-5",
      name: "Elena Ross Bridal Glamour",
      email: "elena@radiancestudio.com",
      phone: "+1 (201) 555-0131",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      isPremium: false
    },
    rating: 4.9,
    reviewsCount: 78,
    description: "High-definition bridal makeup, couture hair designs, luxury skincare prep, and touch-up concierge services to ensure you look flawless from ceremony to afterparty.",
    features: [
      "Airbrush bridal makeup with 16-hour sweat-proof guarantee",
      "Hair styling with luxury veil and accessory placement",
      "Full makeup & hair for Mother of Bride and 4 Bridesmaids",
      "Includes 2-hour pre-wedding trial session",
      "Luxury touch-up kit containing lip color and oil-control sheets"
    ],
    status: "Approved",
    isActive: true,
    createdDate: "2026-09-24"
  },
  {
    id: "srv-6",
    name: "Aura Haute Couture Bridal & Groom Attire",
    category: "Wedding Fashion",
    price: "$2,600",
    priceNum: 2600,
    location: "SoHo, New York",
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=80",
      "/assets/Slider Image (1).jpg",
      "/assets/Slider Image (4).jpg"
    ],
    vendor: {
      id: "vnd-6",
      name: "Maison De L'Amour Atelier",
      email: "couture@maisondelamour.com",
      phone: "+1 (212) 555-0163",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      isPremium: true
    },
    rating: 4.7,
    reviewsCount: 54,
    description: "Bespoke bridal gowns, custom hand-embroidered veils, tailored tuxedo rental collections, and styling consultations with master couturiers.",
    features: [
      "Bespoke made-to-measure bridal gown or tailored tux",
      "Three private fittings with master tailor in SoHo salon",
      "Complimentary cathedral-length embroidered veil",
      "Emergency alteration kit and steaming on wedding morning",
      "Accessory coordination including shoes and headpieces"
    ],
    status: "Approved",
    isActive: true,
    createdDate: "2026-10-01"
  },
  {
    id: "srv-7",
    name: "Starlight Glasshouse Conservatory Estate",
    category: "Wedding Venues",
    price: "$6,200",
    priceNum: 6200,
    location: "Hudson Valley, New York",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
      "/assets/Slider Image (1).jpg",
      "/assets/Slider Image (3).jpg"
    ],
    vendor: {
      id: "vnd-1",
      name: "The Royal Ballroom Hospitality Group",
      email: "concierge@royalpalace.com",
      phone: "+1 (212) 555-0199",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      isPremium: true
    },
    rating: 4.9,
    reviewsCount: 96,
    description: "A greenhouse conservatory sanctuary surrounded by 40 acres of rolling hills, offering transparent panoramic ceiling views of starry night skies.",
    features: [
      "Capacity for 350 guests banquet seated",
      "Climate controlled all-season glass architecture",
      "Private bridal suite with champagne bar",
      "Scenic sunset terrace overlooking Hudson River",
      "On-site overnight suites for wedding party"
    ],
    status: "Approved",
    isActive: true,
    createdDate: "2026-10-12"
  },
  {
    id: "srv-8",
    name: "Golden Hour Acoustic Quartet & Jazz Ensemble",
    category: "Photography & Videography",
    price: "$1,900",
    priceNum: 1900,
    location: "Queens, New York",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
      "/assets/Slider Image (2).jpg"
    ],
    vendor: {
      id: "vnd-7",
      name: "Melody Strings Collective",
      email: "booking@melodystrings.com",
      phone: "+1 (718) 555-0112",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
      isPremium: false
    },
    rating: 4.8,
    reviewsCount: 42,
    description: "Live string quartet for traditional processional ceremony music transitioning into an upbeat swing jazz band for cocktails and dinner.",
    features: [
      "4-Piece conservatory trained string ensemble",
      "Custom arrangement of bride and groom entrance song",
      "4 Hours continuous performance with curated setlists",
      "Wireless acoustic amplification system included",
      "Repertoire covering classical to modern pop anthems"
    ],
    status: "Pending",
    isActive: true,
    createdDate: "2026-11-05"
  }
];

export const MOCK_CATEGORIES = [
  {
    name: "Photography & Videography",
    slug: "photography-videography",
    count: 34,
    description: "Preserve every timeless glance, happy tear, and celebratory dance with world-class artists.",
    image: "/assets/Slider Image (2).jpg"
  },
  {
    name: "Wedding Venues",
    slug: "wedding-venues",
    count: 48,
    description: "From historic royal ballrooms to glasshouses and rustic wine country estates.",
    image: "/assets/Slider Image (1).jpg"
  },
  {
    name: "Decoration & Florist",
    slug: "decoration-florist",
    count: 29,
    description: "Bespoke floral arches, whimsical candlelight, and opulent tablescape artistry.",
    image: "/assets/Slider Image (3).jpg"
  },
  {
    name: "Catering Services",
    slug: "catering-services",
    count: 22,
    description: "Artisanal banquet feasts, craft cocktail mixology, and delicate dessert tables.",
    image: "/assets/Slider Image (4).jpg"
  },
  {
    name: "Makeup & Styling",
    slug: "makeup-styling",
    count: 31,
    description: "High-definition bridal glam, couture hair artistry, and bridal party touch-ups.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Wedding Fashion",
    slug: "wedding-fashion",
    count: 19,
    description: "Hand-tailored tuxedos, designer bridal gowns, and custom bridal accessories.",
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80"
  }
];

export const MOCK_TIPS = [
  {
    id: 1,
    title: "12-Month Wedding Checklist & Milestones",
    tag: "Planning Guide",
    readTime: "5 min read",
    summary: "Stay organized and stress-free by breaking your wedding timeline into manageable monthly action items."
  },
  {
    id: 2,
    title: "How to Build an Intentional Wedding Budget",
    tag: "Budgeting",
    readTime: "4 min read",
    summary: "Learn how modern couples prioritize key vendors, avoid hidden fees, and maximize their overall budget."
  },
  {
    id: 3,
    title: "Choosing Your Dream Venue: Key Questions to Ask",
    tag: "Venues",
    readTime: "6 min read",
    summary: "Essential questions on curfew hours, acoustic limits, vendor policies, and weather backup plans."
  },
  {
    id: 4,
    title: "Designing Seamless Photography Timelines",
    tag: "Photography",
    readTime: "4 min read",
    summary: "Tips for scheduling first looks, golden hour portraits, and reception grand entrances without feeling rushed."
  }
];

export const MOCK_USERS = [
  {
    id: "usr-1",
    name: "Sophia Montgomery",
    email: "sophia.montgomery@example.com",
    role: "Customer",
    status: "Active",
    phone: "+1 (555) 234-8891",
    city: "New York, NY",
    bio: "Bride-to-be planning our autumn wedding in Central Park.",
    registeredDate: "2026-09-10",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "usr-2",
    name: "Alexander Wright",
    email: "alexander.wright@royalpalace.com",
    role: "Vendor",
    status: "Active",
    phone: "+1 (212) 555-0199",
    city: "Manhattan, NY",
    bio: "Head Event Director at The Royal Ballroom Hospitality Group.",
    registeredDate: "2026-08-10",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "usr-3",
    name: "Elena Rostova",
    email: "elena@radiancestudio.com",
    role: "Vendor",
    status: "Active",
    phone: "+1 (201) 555-0131",
    city: "Jersey City, NJ",
    bio: "Master bridal hair and makeup stylist with 10 years experience.",
    registeredDate: "2026-09-24",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "usr-4",
    name: "Marcus Vance",
    email: "marcus.vance@example.com",
    role: "Customer",
    status: "Active",
    phone: "+1 (555) 789-1022",
    city: "Brooklyn, NY",
    bio: "Groom organizing music, catering, and venue logistics.",
    registeredDate: "2026-10-05",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "usr-5",
    name: "Olivia Chen",
    email: "olivia.chen@wedplan.admin",
    role: "Admin",
    status: "Active",
    phone: "+1 (800) 555-0100",
    city: "New York, NY",
    bio: "Lead Operations Manager & Administrator at WedPlan.",
    registeredDate: "2026-01-01",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "usr-6",
    name: "Ethan Walker",
    email: "ethan.walker@example.com",
    role: "Customer",
    status: "Blocked",
    phone: "+1 (555) 998-1123",
    city: "Boston, MA",
    bio: "Account suspended due to policy violation.",
    registeredDate: "2026-07-15",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80"
  }
];

export const MOCK_BOOKINGS = [
  {
    id: "bk-901",
    serviceId: "srv-1",
    serviceName: "Royal Heritage Grand Palace & Gardens",
    serviceImage: "/assets/Slider Image (1).jpg",
    category: "Wedding Venues",
    customerName: "Sophia Montgomery",
    customerEmail: "sophia.montgomery@example.com",
    vendorName: "The Royal Ballroom Hospitality Group",
    vendorEmail: "concierge@royalpalace.com",
    eventDate: "2026-12-18",
    eventLocation: "Manhattan, New York",
    status: "Accepted",
    requestDate: "2026-11-05",
    message: "Evening reception celebration for 220 guests. Requesting evening candlelit setup.",
    price: "$4,500"
  },
  {
    id: "bk-902",
    serviceId: "srv-2",
    serviceName: "Lumière Cinematics & Fine Art Photography",
    serviceImage: "/assets/Slider Image (2).jpg",
    category: "Photography & Videography",
    customerName: "Sophia Montgomery",
    customerEmail: "sophia.montgomery@example.com",
    vendorName: "Julian & Clara Visuals",
    vendorEmail: "hello@lumierephoto.com",
    eventDate: "2026-12-18",
    eventLocation: "Manhattan, New York",
    status: "Pending",
    requestDate: "2026-11-12",
    message: "Seeking complete ceremony and dinner coverage including drone footage.",
    price: "$2,800"
  },
  {
    id: "bk-903",
    serviceId: "srv-3",
    serviceName: "Bloom & Blossom Luxury Floral Decor",
    serviceImage: "/assets/Slider Image (3).jpg",
    category: "Decoration & Florist",
    customerName: "Marcus Vance",
    customerEmail: "marcus.vance@example.com",
    vendorName: "Seraphina Floral Atelier",
    vendorEmail: "design@bloomandblossom.com",
    eventDate: "2027-01-20",
    eventLocation: "Greenwich, Connecticut",
    status: "Pending",
    requestDate: "2026-11-16",
    message: "Winter white botanical theme with custom floral altar.",
    price: "$3,200"
  },
  {
    id: "bk-904",
    serviceId: "srv-4",
    serviceName: "The Epicurean Feast Artisanal Catering",
    serviceImage: "/assets/Slider Image (4).jpg",
    category: "Catering Services",
    customerName: "Marcus Vance",
    customerEmail: "marcus.vance@example.com",
    vendorName: "Chef Antoine & Gourmet Guild",
    vendorEmail: "orders@epicureancatering.com",
    eventDate: "2027-01-20",
    eventLocation: "Greenwich, Connecticut",
    status: "Rejected",
    requestDate: "2026-11-02",
    message: "Plated French dinner option for 180 guests.",
    price: "$5,800"
  }
];

export const MOCK_TRANSACTIONS = [
  {
    id: "TXN-8801",
    vendorName: "The Royal Ballroom Hospitality Group",
    vendorEmail: "concierge@royalpalace.com",
    subscriptionPlan: "Premium Plan",
    paymentAmount: "$49.00",
    paymentStatus: "Completed",
    transactionDate: "2026-11-18"
  },
  {
    id: "TXN-8802",
    vendorName: "Julian & Clara Visuals",
    vendorEmail: "hello@lumierephoto.com",
    subscriptionPlan: "Premium Plan",
    paymentAmount: "$49.00",
    paymentStatus: "Completed",
    transactionDate: "2026-11-14"
  },
  {
    id: "TXN-8803",
    vendorName: "Seraphina Floral Atelier",
    vendorEmail: "design@bloomandblossom.com",
    subscriptionPlan: "Premium Plan",
    paymentAmount: "$49.00",
    paymentStatus: "Completed",
    transactionDate: "2026-11-10"
  },
  {
    id: "TXN-8804",
    vendorName: "Chef Antoine & Gourmet Guild",
    vendorEmail: "orders@epicureancatering.com",
    subscriptionPlan: "Premium Plan",
    paymentAmount: "$499.00",
    paymentStatus: "Completed",
    transactionDate: "2026-10-28"
  },
  {
    id: "TXN-8805",
    vendorName: "Elena Ross Bridal Glamour",
    vendorEmail: "elena@radiancestudio.com",
    subscriptionPlan: "Free Plan",
    paymentAmount: "$0.00",
    paymentStatus: "Active",
    transactionDate: "2026-09-24"
  }
];
