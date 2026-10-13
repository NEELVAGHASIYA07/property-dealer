"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MapPin, Flame } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import SoftSandSelect from "@/components/SoftSandSelect";
import { getTrendingProperties, getCities } from "@/lib/api";
import { FALLBACK_PROPERTIES } from "@/lib/propertiesData";

import {
	GUJARAT_CITY_NAMES as cities,
	PRICE_OPTIONS,
	GUJARAT_FEATURED_CITIES as GUJARAT_CITIES,
} from "@/constants";

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

	// Use FALLBACK_PROPERTIES (buy mode only) as initial trending — single source of truth
	const initialTrending = FALLBACK_PROPERTIES
		.filter((p) => p.mode === "buy" && p.tag)
		.slice(0, 8)
		.map((p) => ({
			id: p.id,
			name: p.name,
			city: p.city,
			location: p.location || `${p.area}, ${p.city}`,
			price: p.priceLabel,
			type: p.type,
			tag: p.tag,
			bedrooms: p.bedrooms,
			bathrooms: p.bathrooms,
			area: p.size ? `${Number(p.size).toLocaleString()} sq ft` : "Spacious",
			image: p.image,
			link: `/property/${p.id}`,
		}));

	const [trendingProperties, setTrendingProperties] = useState(initialTrending);
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
					<p className="eyebrow" style={{ color: "#ffff" }}>Independent real estate / Gujarat</p>
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
								<SoftSandSelect
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
								</SoftSandSelect>
							</div>

							<div className="hero-filter-divider" aria-hidden="true" />

							{/* Bedrooms */}
							<div className="hero-filter-field">
								<label className="hero-filter-label" htmlFor="hero-bedrooms">Bedrooms</label>
								<SoftSandSelect
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
								</SoftSandSelect>
							</div>

							<div className="hero-filter-divider" aria-hidden="true" />

							{/* Price — changes based on activeMode */}
							<div className="hero-filter-field">
								<label className="hero-filter-label" htmlFor="hero-price">
									{activeMode === "buy" ? "Budget" : activeMode === "rent" ? "Rent" : "Price"}
								</label>
								<SoftSandSelect
									id="hero-price"
									className="hero-filter-select"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									aria-label="Filter by price"
								>
									{priceOptions.map((opt) => (
										<option key={opt.value} value={opt.value}>{opt.label}</option>
									))}
								</SoftSandSelect>
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
				<span>Gujarat, India</span>
				<span>
					<a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
					&nbsp;&nbsp;·&nbsp;&nbsp;
					<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
				</span>
			</footer>
		</main>
	);
}
