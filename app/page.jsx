"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MapPin, Flame } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getTrendingProperties, getCities } from "@/app/lib/api";

const cities = [
	"Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar",
	"Bhavnagar", "Jamnagar", "Junagadh", "Anand", "Nadiad",
	"Bharuch", "Vapi", "Mehsana", "Morbi", "Bhuj", "Porbandar", "Navsari", "Palanpur"
];

const PRICE_OPTIONS = {
	rent: [
		{ label: "All price", value: "" },
		{ label: "Under INR 20,000 / mo", value: "0-20000" },
		{ label: "INR 20,000 – 40,000 / mo", value: "20000-40000" },
		{ label: "INR 40,000 – 60,000 / mo", value: "40000-60000" },
		{ label: "INR 60,000 – 80,000 / mo", value: "60000-80000" },
		{ label: "Above INR 80,000 / mo", value: "80000+" },
	],
	buy: [
		{ label: "All price", value: "" },
		{ label: "Under INR 50 L", value: "0-5000000" },
		{ label: "INR 50 L – 1 Cr", value: "5000000-10000000" },
		{ label: "INR 1 Cr – 2 Cr", value: "10000000-20000000" },
		{ label: "INR 2 Cr – 3 Cr", value: "20000000-30000000" },
		{ label: "Above INR 3 Cr", value: "30000000+" },
	],
	"short-term": [
		{ label: "All price", value: "" },
		{ label: "Under INR 2,000 / night", value: "0-2000" },
		{ label: "INR 2,000 – 3,000 / night", value: "2000-3000" },
		{ label: "INR 3,000 – 4,000 / night", value: "3000-4000" },
		{ label: "INR 4,000 – 5,000 / night", value: "4000-5000" },
		{ label: "Above INR 5,000 / night", value: "5000+" },
	],
};

const TRENDING_PROPERTIES = [
	{
		id: "trend-1",
		name: "The Juniper Villa",
		city: "Ahmedabad",
		location: "Bodakdev, Ahmedabad",
		price: "INR 2.48 Cr",
		type: "Villa",
		tag: "Trending",
		bedrooms: 4,
		bathrooms: 4,
		area: "3,200 sq ft",
		image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
		link: "/property/trend-1"
	},
	{
		id: "trend-2",
		name: "Arcadia Sky Residence",
		city: "Surat",
		location: "Vesu, Surat",
		price: "INR 1.75 Cr",
		type: "Apartment",
		tag: "Popular",
		bedrooms: 3,
		bathrooms: 3,
		area: "2,150 sq ft",
		image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
		link: "/property/trend-2"
	},
	{
		id: "trend-3",
		name: "Canyon Palm Estate",
		city: "Vadodara",
		location: "Alkapuri, Vadodara",
		price: "INR 1.86 Cr",
		type: "Bungalow",
		tag: "Featured",
		bedrooms: 4,
		bathrooms: 3,
		area: "2,600 sq ft",
		image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
		link: "/property/trend-3"
	},
	{
		id: "trend-4",
		name: "The Capital Heights",
		city: "Gandhinagar",
		location: "Kudasan, Gandhinagar",
		price: "INR 3.10 Cr",
		type: "Penthouse",
		tag: "Trending",
		bedrooms: 5,
		bathrooms: 5,
		area: "4,100 sq ft",
		image: "https://images.unsplash.com/photo-1600573472556-e636c2acda88?auto=format&fit=crop&w=800&q=80",
		link: "/property/trend-4"
	},
	{
		id: "trend-5",
		name: "Sapphire Haven",
		city: "Rajkot",
		location: "Kalawad Road, Rajkot",
		price: "INR 85 L",
		type: "Apartment",
		tag: "Hot Deal",
		bedrooms: 3,
		bathrooms: 2,
		area: "1,550 sq ft",
		image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80",
		link: "/property/trend-5"
	},
	{
		id: "trend-6",
		name: "Marble Crest Manor",
		city: "Bhavnagar",
		location: "Victoria Park, Bhavnagar",
		price: "INR 1.52 Cr",
		type: "Bungalow",
		tag: "Featured",
		bedrooms: 4,
		bathrooms: 3,
		area: "2,400 sq ft",
		image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
		link: "/property/trend-6"
	},
	{
		id: "trend-7",
		name: "Riverside Courtyard",
		city: "Ahmedabad",
		location: "Ambli, Ahmedabad",
		price: "INR 4.20 Cr",
		type: "Villa",
		tag: "Luxury",
		bedrooms: 5,
		bathrooms: 6,
		area: "5,200 sq ft",
		image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
		link: "/property/trend-7"
	},
	{
		id: "trend-8",
		name: "Green Meadows Residence",
		city: "Anand",
		location: "Vidyanagar Road, Anand",
		price: "INR 95 L",
		type: "Row House",
		tag: "Trending",
		bedrooms: 3,
		bathrooms: 3,
		area: "1,850 sq ft",
		image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
		link: "/property/trend-8"
	}
];

const GUJARAT_CITIES = [
	{
		name: "Ahmedabad",
		properties: 488,
		image: "/images/cities/ahmedabad.jpg"
	},
	{
		name: "Surat",
		properties: 398,
		image: "/images/cities/surat.jpg"
	},
	{
		name: "Vadodara",
		properties: 468,
		image: "/images/cities/vadodara.jpg"
	},
	{
		name: "Rajkot",
		properties: 336,
		image: "/images/cities/rajkot.jpg"
	},
	{
		name: "Gandhinagar",
		properties: 481,
		image: "/images/cities/gandhinagar.jpg"
	},
	{
		name: "Bhavnagar",
		properties: 218,
		image: "/images/cities/bhavnagar.jpg"
	},
	{
		name: "Jamnagar",
		properties: 185,
		image: "/images/cities/jamnagar.jpg"
	},
	{
		name: "Junagadh",
		properties: 160,
		image: "/images/cities/junagadh.jpg"
	},
	{
		name: "Anand",
		properties: 195,
		image: "/images/cities/anand.jpg"
	},
	{
		name: "Navsari",
		properties: 145,
		image: "/images/cities/navsari.jpg"
	},
	{
		name: "Bharuch",
		properties: 170,
		image: "/images/cities/bharuch.jpg"
	},
	{
		name: "Vapi",
		properties: 210,
		image: "/images/cities/vapi.jpg"
	}
];

export default function HomePage() {
	const router = useRouter();
	const [activeMode, setActiveMode] = useState("buy");
	const [city, setCity] = useState("");
	const [bedrooms, setBedrooms] = useState("");
	const [price, setPrice] = useState("");
	const [showAllCities, setShowAllCities] = useState(false);
	const trendingScrollRef = useRef(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	const handleTrendingScroll = () => {
		if (trendingScrollRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = trendingScrollRef.current;
			setCanScrollLeft(scrollLeft > 10);
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
		}
	};

	const scrollTrending = (dir) => {
		if (trendingScrollRef.current) {
			const scrollAmount = dir === "left" ? -360 : 360;
			trendingScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	const handleSearch = () => {
		const params = new URLSearchParams();
		if (city) params.set("city", city);
		if (bedrooms) params.set("bedrooms", bedrooms);
		if (price) {
			if (price.endsWith("+")) {
				params.set("priceMin", price.slice(0, -1));
			} else {
				const [pMin, pMax] = price.split("-");
				if (pMin) params.set("priceMin", pMin);
				if (pMax) params.set("priceMax", pMax);
			}
		}
		const qs = params.toString();
		router.push(`/${activeMode}${qs ? `?${qs}` : ""}`);
	};

	const handleModeChange = (mode) => {
		setActiveMode(mode);
		setPrice(""); // reset price when mode changes
	};

	const [trendingProperties, setTrendingProperties] = useState(TRENDING_PROPERTIES);
	const [gujaratCities, setGujaratCities] = useState(GUJARAT_CITIES);

	useEffect(() => {
		async function fetchBackendData() {
			try {
				const [apiTrending, apiCities] = await Promise.all([
					getTrendingProperties(),
					getCities(),
				]);

				if (Array.isArray(apiTrending) && apiTrending.length > 0) {
					const formatted = apiTrending.map((p) => ({
						id: `trend-${p.id}`,
						name: p.name,
						city: p.city,
						location: p.location,
						price: p.priceLabel || `INR ${p.price}`,
						type: p.type,
						tag: p.tag || "Trending",
						bedrooms: p.bedrooms,
						bathrooms: p.bathrooms,
						area: p.size ? `${Number(p.size).toLocaleString()} sq ft` : "Spacious",
						image: p.image,
						link: `/property/${p.id}`
					}));
					setTrendingProperties(formatted);
				}

				if (Array.isArray(apiCities) && apiCities.length > 0) {
					const formattedCities = apiCities.map((c) => ({
						name: c.name,
						properties: c.propertiesCount || c.properties || 100,
						image: c.image || `/images/cities/${c.name.toLowerCase()}.jpg`
					}));
					setGujaratCities(formattedCities);
				}
			} catch (e) {
				console.warn("Could not load from AdonisJS API:", e);
			}
		}
		fetchBackendData();
	}, []);

	const priceOptions = PRICE_OPTIONS[activeMode];
	const displayedCities = showAllCities ? gujaratCities : gujaratCities.slice(0, 6);

	return (
		<main className="app-shell home-page">
			<section className="home-hero">
				<div>
					<p className="eyebrow" style={{ color: "#ffff" }}>Independent real estate / Los Angeles</p>
					<h1>Find a place<br /><em>with a pulse.</em></h1>
					<p className="hero-description">Thoughtful homes, considered advice, and a better way to move through the city.</p>

					{/* Search Widget */}
					<div className="hero-search-widget">
						{/* Mode Tabs */}
						<div className="hero-mode-tabs">
							{[
								{ key: "buy", label: "Buy" },
								{ key: "rent", label: "Rent" },
								{ key: "short-term", label: "Short-term" },
							].map(({ key, label }) => (
								<button
									key={key}
									id={`mode-tab-${key}`}
									type="button"
									className={`hero-mode-tab${activeMode === key ? " active" : ""}`}
									onClick={() => handleModeChange(key)}
								>
									{label}
								</button>
							))}
						</div>

						{/* Filter Row */}
						<div className="hero-filter-row">
							{/* City */}
							<div className="hero-filter-field">
								<label className="hero-filter-label" htmlFor="hero-city">Location</label>
								<select
									id="hero-city"
									className="hero-filter-select"
									value={city}
									onChange={(e) => setCity(e.target.value)}
									aria-label="Filter by city"
								>
									<option value="">All cities</option>
									{cities.map((c) => (
										<option key={c} value={c}>{c}</option>
									))}
								</select>
							</div>

							<div className="hero-filter-divider" aria-hidden="true" />

							{/* Bedrooms */}
							<div className="hero-filter-field">
								<label className="hero-filter-label" htmlFor="hero-bedrooms">Bedrooms</label>
								<select
									id="hero-bedrooms"
									className="hero-filter-select"
									value={bedrooms}
									onChange={(e) => setBedrooms(e.target.value)}
									aria-label="Filter by bedrooms"
								>
									<option value="">Any bedrooms</option>
									<option value="1">1 bedroom</option>
									<option value="2">2 bedrooms</option>
									<option value="3">3 bedrooms</option>
									<option value="4">4+ bedrooms</option>
								</select>
							</div>

							<div className="hero-filter-divider" aria-hidden="true" />

							{/* Price — changes based on activeMode */}
							<div className="hero-filter-field">
								<label className="hero-filter-label" htmlFor="hero-price">
									{activeMode === "buy" ? "Budget" : activeMode === "rent" ? "Rent" : "Price"}
								</label>
								<select
									id="hero-price"
									className="hero-filter-select"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									aria-label="Filter by price"
								>
									{priceOptions.map((opt) => (
										<option key={opt.value} value={opt.value}>{opt.label}</option>
									))}
								</select>
							</div>

							{/* Search Button */}
							<button
								id="hero-search-btn"
								type="button"
								className="hero-search-btn"
								onClick={handleSearch}
								aria-label={`Search ${activeMode} properties`}
							>
								<Search size={22} strokeWidth={2.2} />
							</button>
						</div>
					</div>
				</div>
				<div className="home-hero-image" role="img" aria-label="Bright city skyline beside a green lake"><span>01 / 04</span></div>
			</section>

			<section className="home-intro">
				<p className="eyebrow">A better way to move</p>
				<h2>Good spaces make<br /><em>good days.</em></h2>
				<p>Fieldhouse is a small, sharp team of local agents who believe real estate should feel more human. Less noise. More instinct. Always in your corner.</p>
			</section>

			{/* Discover Gujarat Cities Section */}
			<section className="discover-cities-section">
				<h2 className="discover-cities-title">Discover Gujarat Cities</h2>
				<div className="cities-grid">
					{displayedCities.map((c) => (
						<Link
							key={c.name}
							href={`/buy?city=${encodeURIComponent(c.name)}`}
							className="city-card"
							id={`city-card-${c.name.toLowerCase()}`}
						>
							<div
								className="city-card-bg"
								style={{ backgroundImage: `url(${c.image})` }}
							/>
							<div className="city-card-overlay" />
							<div className="city-card-content">
								<h3>{c.name}</h3>
								<p>{c.properties} properties</p>
							</div>
						</Link>
					))}
				</div>
				<div className="cities-show-more-wrap">
					<button
						type="button"
						className="cities-show-more-btn"
						onClick={() => setShowAllCities(!showAllCities)}
						aria-expanded={showAllCities}
					>
						<span>{showAllCities ? "Show less" : "Show more"}</span>
						{showAllCities ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
					</button>
				</div>
			</section>
			{/* Trending Properties Section */}
			<section className="trending-section">
				<div className="trending-header">
					<div>
						<p className="eyebrow"><Flame size={13} style={{ display: "inline", verticalAlign: "-1px", marginRight: 4 }} /> Handpicked for you</p>
						<h2>Trending <em>properties.</em></h2>
					</div>
					<div className="trending-controls">
						<button
							type="button"
							className="trending-nav-btn"
							onClick={() => scrollTrending("left")}
							disabled={!canScrollLeft}
							aria-label="Previous trending properties"
						>
							<ChevronLeft size={20} strokeWidth={2.2} />
						</button>
						<button
							type="button"
							className="trending-nav-btn"
							onClick={() => scrollTrending("right")}
							disabled={!canScrollRight}
							aria-label="Next trending properties"
						>
							<ChevronRight size={20} strokeWidth={2.2} />
						</button>
					</div>
				</div>

				<div
					ref={trendingScrollRef}
					onScroll={handleTrendingScroll}
					className="trending-cards-track"
				>
					{trendingProperties.map((prop) => (
						<Link
							key={prop.id}
							href={prop.link}
							target="_blank"
							rel="noopener noreferrer"
							className="trending-card"
							id={`trending-${prop.id}`}
							title={`Open ${prop.name} in new tab`}
						>
							<div className="trending-card-img-wrap">
								<div
									className="trending-card-img"
									style={{ backgroundImage: `url(${prop.image})` }}
								/>
								<span className="trending-badge">
									<Flame size={12} fill="#ee705b" color="#ee705b" />
									{prop.tag}
								</span>
								<span className="trending-type-badge">{prop.type}</span>
							</div>
							<div className="trending-card-body">
								<div className="trending-card-price">{prop.price}</div>
								<h3 className="trending-card-name">{prop.name}</h3>
								<div className="trending-card-location">
									<MapPin size={13} strokeWidth={2} />
									<span>{prop.location}</span>
								</div>
								<div className="trending-card-specs">
									<span>{prop.bedrooms} BHK</span>
									<span>•</span>
									<span>{prop.bathrooms} Baths</span>
									<span>•</span>
									<span>{prop.area}</span>
								</div>
							</div>
						</Link>
					))}
				</div>
			</section>
			<section className="home-journal">
				<div>
					<p className="eyebrow">From the journal</p>
					<h2>Notes on<br /><em>living well.</em></h2>
				</div>
				<Link className="text-link" href="/blog">Read the journal <span>↗</span></Link>
			</section>
			<footer>
				<span>© 2026 Fieldhouse Realty</span>
				<span>Los Angeles, CA</span>
				<span>Instagram &nbsp; LinkedIn</span>
			</footer>
		</main>
	);
}
