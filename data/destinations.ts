export type TransportMode = "bike" | "cab" | "train" | "bus" | "auto";
export type Vibe = "peaceful" | "friends" | "romantic" | "photography" | "heritage" | "beach" | "nature" | "food";

export type Destination = {
  name: string;
  slug: string;
  category: string;
  image: string;
  distance: string;
  distanceKm: number;
  budget: number;
  budgetLabel: string;
  duration: string;
  durationType: ("2-4 hours" | "half day" | "full day" | "overnight")[];
  bestTime: string;
  transport: TransportMode[];
  vibes: Vibe[];
  summary: string;
  overview: string;
  itinerary: string[];
  hiddenTips: string[];
  foodSpots: string[];
  idealFor: string[];
};

export const destinations: Destination[] = [
  {
    name: "Puri",
    slug: "puri",
    category: "Intercity Adventure",
    image: "/images/puri.jpg",
    distance: "75 km from KIIT",
    distanceKm: 75,
    budget: 1200,
    budgetLabel: "₹900–₹1,800",
    duration: "Full day / overnight",
    durationType: ["full day", "overnight"],
    bestTime: "Sunrise, winter mornings, or post-monsoon evenings",
    transport: ["train", "bus", "cab"],
    vibes: ["friends", "romantic", "photography", "beach", "food"],
    summary: "The classic KIIT escape: beach, food, temple lanes and that reset button feeling.",
    overview: "Puri works because it can be spontaneous or planned. Leave early, catch the sea before crowds, eat properly, roam the beach road, and return tired but reset.",
    itinerary: [
      "Leave KIIT around 6–7 AM before traffic builds",
      "Board a cab or bus from Baramunda and take a chai stop midway",
      "Reach Puri by late morning and spend time around the beach stretch",
      "Lunch near the shore, explore local lanes and stay till sunset",
      "Return at night by cab or train depending on energy levels"
    ],
    hiddenTips: [
      "Book a cab with your group if possible — public transport timings can feel irregular on return",
      "Prefer Blue Flag Beach if you want a quieter and cleaner experience",
      "Do not miss the khaja shops around the temple area",
      "Carry cash, slippers and an extra set of clothes for beach time"
    ],
    foodSpots: ["Beach-side breakfast stalls", "Local Odia thali spots", "Khaja shops near temple area"],
    idealFor: ["Friend groups", "Beach photos", "One-day reset", "Budget weekend"]
  },
  {
    name: "Dhauli",
    slug: "dhauli",
    category: "Local Day Trip",
    image: "/images/dhauli.jpg",
    distance: "28 km from KIIT",
    distanceKm: 28,
    budget: 500,
    budgetLabel: "₹300–₹900",
    duration: "Half day",
    durationType: ["half day"],
    bestTime: "Late afternoon to sunset",
    transport: ["bike", "cab", "auto"],
    vibes: ["romantic", "heritage", "peaceful", "photography"],
    summary: "A peaceful heritage escape with open sky, sunset light and calm views.",
    overview: "Dhauli is perfect when you need a break but cannot spend a full day. The stupa, open roads and sunset atmosphere make it feel cinematic with very little effort.",
    itinerary: [
      "Book Ola/Uber at around 10–11 AM with your friends",
      "Reach Dhauli and explore the local market around the area",
      "Visit the Shanti Stupa and enjoy the view from the top",
      "Might stay till sunset if the weather feels good",
      "Return by evening through cab or auto"
    ],

    hiddenTips: [
      "There is a mandir near the Stupa — do not forget to offer your prayers there",
      "Carry water or other drinks because quite some walking is involved",
      "Weekdays feel much more peaceful compared to weekends",
      "Tip for boys — best local outing in case your significant other is religious"
    ],
    foodSpots: ["Local tea stalls", "Roadside snacks near Dhauli route"],
    idealFor: ["Peaceful evenings", "Photography", "Low-budget plans"]
  },
  {
    name: "Khandagiri",
    slug: "khandagiri",
    category: "Local Day Trip",
    image: "/images/khandagiri.jpg",
    distance: "14 km from KIIT",
    distanceKm: 14,
    budget: 350,
    budgetLabel: "₹200–₹700",
    duration: "Half day",
    durationType: ["half day"],
    bestTime: "Winter afternoons and cloudy evenings",
    transport: ["bike", "cab", "auto"],
    vibes: ["heritage", "photography", "friends"],
    summary: "Caves, stairs, city views and a quick break from campus repetition.",
    overview: "Khandagiri works as a compact outing. It has history, small climbs, photo corners and enough movement to feel like you actually went somewhere.",
    itinerary: [
      "Book Ola/Uber preferably after lunch",
      "Reach Khandagiri and enjoy the small hike towards the caves",
      "Explore the caves and historical sights around the area",
      "Take group photos or maybe single ones from the viewpoints",
      "Snack break after coming down from the hike and return by cab or auto"
    ],

    hiddenTips: [
      "Wear comfortable clothes and shoes because the hike involves quite some walking",
      "Avoid days with harsh sunshine if possible",
      "Carry water or other drinks during the climb"
    ],
    foodSpots: ["Nearby snack stalls", "Cafés on return route"],
    idealFor: ["Small groups", "Short escape", "Casual photos"]
  },
  {
    name: "Konark",
    slug: "konark",
    category: "Intercity Adventure",
    image: "/images/konark.jpeg",
    distance: "80 km from KIIT",
    distanceKm: 80,
    budget: 1400,
    budgetLabel: "₹1,000–₹2,200",
    duration: "Full day",
    durationType: ["full day"],
    bestTime: "Winter mornings",
    transport: ["cab", "bus", "bike"],
    vibes: ["friends", "photography", "heritage", "beach"],
    summary: "A heritage-heavy day trip with iconic architecture and coastal-route energy.",
    overview: "Konark is for when you want a proper day plan. The Sun Temple gives the trip weight, while the route and nearby coast make it feel bigger than a normal city outing.",
    itinerary: [
      "Leave KIIT around 6–7 AM before traffic starts building",
      "Book a cab with your group and take a chai stop somewhere midway",
      "Reach Konark and spend time exploring the Sun Temple and nearby surroundings",
      "Visit the nearby beach later in the afternoon and relax near the shore",
      "Stay till evening if possible and return by cab at night"
    ],

    hiddenTips: [
      "Book a cab with your group because public transport on this route can feel confusing",
      "Carry water or cold drinks since the temple area involves a fair amount of walking",
      "Try visiting during slightly cloudy weather if possible",
      "Do not rush through the Sun Temple — the carvings and structure are the main experience"
    ],
    foodSpots: ["Local lunch spots", "Tea stalls near temple area"],
    idealFor: ["History lovers", "Photography", "Full-day friends trip"]
  },
  {
    name: "Raotarapur Sunset Point",
    slug: "raotarapur-sunset-point",
    category: "Outskirts Escape",
    image: "/images/raotarapur.jpeg",
    distance: "28 km from KIIT",
    distanceKm: 28,
    budget: 700,
    budgetLabel: "₹300-600",
    duration: "Half day",
    durationType: ["half day"],
    bestTime: "Late afternoon to sunset",
    transport: ["bike", "cab"],
    vibes: ["nature", "peaceful", "photography", "friends"],
    summary: "A calm outskirts ride known for open skies, sunset views and relaxed evening energy.",
    overview: "Raotarapur Sunset Point is one of those low-pressure rides perfect for KIIT students wanting a quick escape from campus routine. The road journey itself is part of the experience — especially on bikes or scooties during cloudy evenings.",
    itinerary: [
      "Book bike/Scooty from DriEV or Royal Brothers",
      "Leave in the morning around 10 AM and enjoy the ride through forest stretches",
      "Reach Raotarapur Sunset Point and explore the open valley-type area just ahead of the point",
      "Stop at riverside spots on the way back and spend some time there",
      "Return before sunset around 5 PM"
    ],

    hiddenTips: [
      "Prefer going in groups instead of alone",
      "There are not many stores nearby so carry food and drinks",
      "Do not try staying till sunset if you do not know the area well"
    ],
    foodSpots: [
      "Roadside tea stalls",
      "Highway snack points",
      "Patia cafés after return"
    ],
    idealFor: [
      "Bike rides",
      "Sunset photography",
      "Relaxed evening trips",
      "Small friend groups"
    ]
  },
  {
    name: "Nandankanan",
    slug: "nandankanan",
    category: "Local Day Trip",
    image: "/images/nandankanan.jpg",
    distance: "6 km from KIIT",
    distanceKm: 6,
    budget: 450,
    budgetLabel: "₹250-500",
    duration: "Half day",
    durationType: ["half day"],
    bestTime: "Morning during cooler months",
    transport: ["auto", "cab", "bike"],
    vibes: ["friends", "nature", "photography"],
    summary: "The easiest proper outing from KIIT when nobody wants complicated planning.",
    overview: "Nandankanan is close, familiar and reliable. It works for a half-day student plan with friends, especially when you want something more than just cafés.",
    itinerary: [
      "Leave in the morning around 9–10 AM by cab or auto",
      "Spend a few hours exploring different parts of the zoo",
      "Enjoy the rope-way and boat rides inside the park",
      "Take snack breaks at the food courts during the visit",
      "Return by cab or auto by evening"
    ],

    hiddenTips: [
      "Wear comfortable shoes because quite a lot of walking is involved",
      "Carry umbrella and sunscreen during sunny days",
      "Ideal for couples and groups alike"
    ],
    foodSpots: ["Snack counters nearby", "Patia cafés after return"],
    idealFor: ["Easy group trip", "Low planning", "Close to campus"]
  },
  {
    name: "Cuttack",
    slug: "cuttack",
    category: "Intercity Adventure",
    image: "/images/cuttack.jpg",
    distance: "18 km from KIIT",
    distanceKm: 18,
    budget: 700,
    budgetLabel: "₹400–₹1,200",
    duration: "Half / full day",
    durationType: ["half day", "full day"],
    bestTime: "Evening food trail or winter afternoon",
    transport: ["train", "bus", "cab", "bike"],
    vibes: ["food", "friends", "heritage", "photography"],
    summary: "Food lanes, old-city energy and a quick intercity change of scene.",
    overview: "Cuttack is ideal when Bhubaneswar feels repetitive but a big trip is not possible. Go for food, old streets, river-side views and a different city texture.",
    itinerary: [
      "Leave KIIT around late morning by cab or bus",
      "Reach Cuttack and explore the old city roads and local market areas",
      "Visit the Netaji Birthplace Museum and spend time around the historical sections",
      "Take a food or chai break somewhere near the busy market stretches",
      "Return by evening through cab or bus"
    ],

    hiddenTips: [
      "Weekdays usually feel less crowded compared to weekends",
      "Carry cash because smaller local shops may not always accept UPI",
      "Try local snacks or street food while exploring the old city areas",
      "Avoid peak evening traffic timings while returning"
    ],
    foodSpots: ["Dahibara aloo dum spots", "Local sweets", "Evening snack lanes"],
    idealFor: ["Food trail", "Budget evening", "Friend groups"]
  },
  {
    name: "Chilika",
    slug: "chilika",
    category: "Intercity Adventure",
    image: "/images/chilika.jpg",
    distance: "100 km from KIIT",
    distanceKm: 100,
    budget: 1800,
    budgetLabel: "₹1,200–₹2,800",
    duration: "Full day",
    durationType: ["full day"],
    bestTime: "Winter mornings",
    transport: ["train", "cab", "bus"],
    vibes: ["peaceful", "romantic", "photography", "nature"],
    summary: "Water, boats, migratory-bird season and a proper day-away feeling.",
    overview: "Chilika is a calmer intercity trip. It needs better planning than Puri, but the water views and quiet atmosphere can make it feel more special.",
    itinerary: [
      "Leave around 6 AM from KIIT because of the long distance",
      "Book a cab with your group since it is the most convenient option for hostel timings",
      "Reach Balugaon as it is the closest Chilika entry point from Bhubaneswar",
      "Enjoy the lake views, boat rides and spend time around the water stretches",
      "Have lunch nearby and return towards Bhubaneswar before late evening"
    ],

    hiddenTips: [
      "Cab is preferred because public transport timings can become difficult while returning",
      "Carry sunscreen, sunglasses and water because the weather can feel harsh during afternoons",
      "Try visiting during slightly cloudy weather for a much better experience",
      "Go in groups if possible since the route feels much more enjoyable that way"
    ],
    foodSpots: ["Local seafood spots", "Tea stalls near boat points"],
    idealFor: ["Nature lovers", "Calm day trip", "Photography"]
  },
  {
    name: "Daringbadi",
    slug: "daringbadi",
    category: "Overnight Journey",
    image: "/images/daringbadi.jpg",
    distance: "250 km from KIIT",
    distanceKm: 250,
    budget: 3500,
    budgetLabel: "₹2,800–₹5,500",
    duration: "Overnight / weekend",
    durationType: ["overnight"],
    bestTime: "Winter or post-monsoon",
    transport: ["cab", "bus"],
    vibes: ["nature", "peaceful", "photography", "romantic", "friends"],
    summary: "A proper weekend escape with hills, mist and cold-weather Odisha energy.",
    overview: "Daringbadi is not a casual plan; it needs a group, transport and stay planning. But for a memorable weekend from KIIT, it has the strongest mood.",
    itinerary: [
      "Board an overnight bus from Bhubaneswar with your group",
      "Reach Daringbadi by morning and check into a hotel or homestay nearby",
      "Spend the first day exploring viewpoints, pine forest areas and local market spots",
      "Use the second day for waterfalls, long walks and slower sightseeing around the hills",
      "Board the return overnight bus on the second night and reach Bhubaneswar by morning"
    ],

    hiddenTips: [
      "Carry jackets or hoodies because nights can feel surprisingly cold compared to Bhubaneswar",
      "Prefer staying for at least 2 nights because the journey itself is quite long",
      "Book hotels and return buses in advance during tourist season",
      "Cloudy or rainy weather usually makes the entire trip feel much more cinematic"
    ],
    foodSpots: ["Homestay meals", "Local breakfast spots"],
    idealFor: ["Weekend groups", "Photography", "Cold-weather escape"]
  },
  {
    name: "Gopalpur",
    slug: "gopalpur",
    category: "Overnight Journey",
    image: "/images/gopalpur.jpg",
    distance: "180 km from KIIT",
    distanceKm: 180,
    budget: 3000,
    budgetLabel: "₹2,200–₹4,800",
    duration: "Overnight / weekend",
    durationType: ["overnight"],
    bestTime: "Winter sunsets and calm mornings",
    transport: ["train", "bus", "cab"],
    vibes: ["beach", "nature", "peaceful", "romantic", "photography", "food"],
    summary: "A quieter beach weekend when Puri feels too crowded and predictable.",
    overview: "Gopalpur has a slower beach-town feeling. It is better as an overnight trip where the point is not rushing, but staying near the sea and letting the trip breathe.",
    itinerary: [
      "Board an overnight bus from Bhubaneswar with your group",
      "Reach Gopalpur by morning and check into a hotel near the beach",
      "Spend the first day relaxing around the shoreline and exploring nearby café areas",
      "Use the second day for quieter beach time, sunset walks and local food spots",
      "Board the return overnight bus on the second night and reach Bhubaneswar by morning"
    ],

    hiddenTips: [
      "Prefer staying for at least 2 nights because the long distance does not feel worth it for a single day",
      "Carry extra clothes and slippers because beach time is unavoidable here",
      "Try staying near the beach stretch itself for the best experience",
      "Cloudy weather and evenings usually make Gopalpur feel much calmer than Puri"
    ],
    foodSpots: ["Beach-side cafés", "Local seafood places", "Berhampur snacks"],
    idealFor: ["Quiet beach weekend", "Couples", "Small groups"]
  },
  {
    name: "Deras Dam",
    slug: "deras-dam",
    category: "Outskirts Escape",
    image: "/images/deras.jpg",
    distance: "21 km from KIIT",
    distanceKm: 21,
    budget: 450,
    budgetLabel: "₹300–₹600",
    duration: "Half day",
    durationType: ["half day"],
    bestTime: "Sunrise or sunset",
    transport: ["bike", "cab"],
    vibes: ["peaceful", "friends", "nature"],
    summary: "A calm outskirts ride known for quiet roads, water views and peaceful sunrise or sunset moments.",
    overview: "Deras Dam is one of the best low-effort escape rides from KIIT. The road journey itself feels relaxing, especially on bikes or scooties during early mornings or golden-hour evenings.",
    itinerary: [
      "Book bike/Scooty from DriEV or Royal Brothers",
      "Leave around 10 AM and enjoy the ride through village-side roads",
      "Reach Deras Dam and spend time around the water and open stretches nearby",
      "Stop for photos, chai or snack breaks during the ride back",
      "Return before sunset by evening"
    ],

    hiddenTips: [
      "Prefer going in groups instead of alone",
      "Roads can feel isolated in some stretches so avoid staying too late",
      "Cloudy weather usually makes the ride much more enjoyable"
    ],
    foodSpots: [
      "Roadside tea stalls",
      "Small highway snack points",
      "Patia cafés after return"
    ],
    idealFor: [
      "Bike rides",
      "Friends trip",
      "Road trip dates",
      "Sunset photography"
    ]
  },
  {
    name: "Jhumka Dam",
    slug: "jhumka-dam",
    category: "Outskirts Escape",
    image: "/images/jhumka.jpg",
    distance: "19 km from KIIT",
    distanceKm: 19,
    budget: 450,
    budgetLabel: "₹300–₹600",
    duration: "Half day",
    durationType: ["half day"],
    bestTime: "Sunrise or sunset",
    transport: ["bike", "cab"],
    vibes: ["peaceful", "friends", "nature"],
    summary: "A relaxed outskirts ride popular for group bike trips, open-road energy and calm water views.",
    overview: "Jhumka Dam works best as a casual friends-trip destination from KIIT. The route is enjoyable on bikes and scooties, especially during cool evenings or cloudy weather.",
    itinerary: [
      "Book bike/Scooty from DriEV or Royal Brothers",
      "Leave around 10 AM and enjoy the ride through village-side roads",
      "Reach Jhumka Dam and spend time around the water and quieter open areas nearby",
      "Stop for photos and short breaks during the ride back",
      "Return before sunset by evening"
    ],

    hiddenTips: [
      "Prefer going in groups instead of alone",
      "Carry food and drinks because there are not many stores nearby",
      "Roads can feel isolated in some stretches so avoid staying too late",
      "Better suited for friends trips and group rides than dates"
    ],
    foodSpots: [
      "Roadside tea stalls",
      "Highway snack stops",
      "Patia cafés after return"
    ],
    idealFor: [
      "Friends trips",
      "Bike rides",
      "Group photography",
      "Evening road trips"
    ]
  },
];

export const getDestination = (slug: string) => destinations.find((destination) => destination.slug === slug);
export const featuredDestinations = destinations.filter((item) => ["puri", "dhauli", "daringbadi"].includes(item.slug));
