/**
 * All prompts used in the BrickPress application for generating LEGO posters.
 * 
 * This file contains:
 * - Theme-specific prompts for 5 different universes
 * - Original/default prompt for "Let us decide" option
 * - Master catalog style instructions
 */

export type Theme = "galactic-conquest" | "ninja-warriors" | "urban-metropolis" | "fantasy-realm" | "deep-sea-adventure"
export type ModelType = "vehicle" | "building" | "creature" | "figure" | "unknown"

/**
 * Master Catalog Style - Applied to all theme-based prompts
 * Ensures authentic 1990s LEGO photography aesthetic
 */
export const masterCatalogStyle = `
Professional three-point studio lighting with strong key light, dramatic rim lighting, warm fill.
Medium format camera with 80mm lens, f/2.8 aperture.
Kodak Ektar 100 film grain with nostalgic 90s color science.
Shallow depth of field (toy sharp, background blurred).
Subtle lens flare and light leaks.
Realistic shadows grounding the toy in the scene.
`

/**
 * Theme-specific prompts organized by universe and model type
 * Each theme has 5 model type variations: vehicle, building, creature, figure, unknown
 */
export const themePrompts: Record<Theme, Record<ModelType, string>> = {
    "galactic-conquest": {
        vehicle: `1990s LEGO Space catalog action shot. The vehicle is in the midst of a high-speed pursuit through a dense, colorful asteroid field. Glowing engine trails and thruster fire blazing behind it. Laser bolts zipping past, narrowly missing. Vibrant purple and electric blue nebulae swirling in the background. Distant ringed planets and countless stars. Sharp 'studio strobe' rim lighting catching every edge of the plastic bricks. Dramatic lens flares from nearby explosions. Shot on Kodak Ektar 100 with that iconic 90s saturation.`,
        building: `1990s LEGO Space catalog base shot. The structure is positioned on a cratered lunar surface with a massive gas giant planet looming dramatically in the sky above. Twinkling stars scattered across the void. Communication arrays with blinking lights. Subtle glow emanating from windows and hatches. Astronaut minifigure silhouettes visible through transparent pieces. Sharp studio lighting with dramatic rim glow. That classic space base catalog aesthetic.`,
        creature: `1990s LEGO Space catalog creature feature. The alien creature emerges from swirling cosmic mist, surrounded by floating space debris and glowing energy particles that match its primary color. Distant nebulae creating an otherworldly backdrop. Dramatic backlighting creating a silhouette halo effect. Eyes or sensors glowing ominously. Shot with that vintage sci-fi movie poster aesthetic.`,
        figure: `1990s LEGO Space catalog hero shot. The space warrior stands on an asteroid surface with a massive space battle raging in the background. Laser fire crisscrossing the void. Exploding ships creating lens flares. The figure is dramatically lit from below with rim lighting creating a heroic glow. Cape or accessories caught in zero-gravity motion.`,
        unknown: `1990s LEGO Space catalog centerfold. Epic deep-space void with vibrant purple and blue nebulae swirling majestically. Glowing laser trails and distant explosions. Ringed planets on the horizon. Countless twinkling stars. Dramatic backlighting with lens flares and light halos. Shot on Kodak Ektar 100 with nostalgic 90s color saturation.`
    },
    "ninja-warriors": {
        vehicle: `1990s LEGO Ninja catalog action shot. The vehicle races across a weathered ancient stone bridge, kicking up dust and debris. Cherry blossom petals scattering in its wake. Misty bamboo forest rushing past on either side. Golden hour sunlight breaking through the mist. Distant mountain temples silhouetted against a warm orange and purple sky. Motion blur on the wheels/base suggesting incredible speed.`,
        building: `1990s LEGO Ninja catalog fortress shot. The structure stands proudly atop a misty mountain peak at twilight. Ancient stone steps leading up to ornate gates. Paper lanterns glowing warmly. Cherry blossom trees framing the scene. Bamboo scaffolding and wooden training equipment nearby. Incense smoke wisping through the air. That legendary, mystical atmosphere of ancient Japan.`,
        creature: `1990s LEGO Ninja catalog creature legend. The mystical beast emerges from swirling elemental energy that matches its primary color - fire, water, earth, or wind effects surrounding it. Misty mountain backdrop with ancient temples visible in the distance. Glowing spirit particles dancing around it. Dramatic moonlight breaking through storm clouds. Deep ink-black shadows creating that legendary, heroic feel.`,
        figure: `1990s LEGO Ninja catalog warrior portrait. The ninja stands in a dramatic stance under a hidden spotlight from the moon above. Swirling elemental effects around them - whirlwinds of leaves, sparks of fire, or spirit energy matching their color. Misty bamboo forest backdrop. Cherry blossom petals frozen mid-fall. Deep shadows and dramatic rim lighting creating a legendary hero silhouette.`,
        unknown: `1990s LEGO Ninja catalog mystical scene. Misty Japanese mountain temple sanctuary at golden hour. Ancient pagoda architecture with red and black roofing. Cherry blossoms drifting through golden light rays. Bamboo forest creating atmospheric depth. Moonlight breaking through clouds. Stone lanterns glowing. That iconic 90s LEGO adventure photography aesthetic.`
    },
    "urban-metropolis": {
        vehicle: `1990s LEGO City catalog action shot. The vehicle races down a busy neon-lit city street at golden hour. Motion blur streaks on the road beneath the wheels. Tilt-shift photography effect making surrounding buildings look miniature and toylike. Traffic lights creating colorful bokeh circles. Sunset reflecting off glass skyscraper windows. Warm, inviting lighting making the plastic look glossy and brand new.`,
        building: `1990s LEGO City catalog corner shot. The structure sits on a bustling street corner with the metropolitan skyline stretching behind it. Tiny plastic-style pedestrians and vehicles bringing the scene to life. Street lamps beginning to glow. Neon shop signs flickering on. Golden hour sunlight warming the scene. Tilt-shift blur creating that classic toytown miniature effect.`,
        creature: `1990s LEGO City catalog creature chaos. The creature towers over the cityscape causing playful mayhem. Tiny cars scattering below. Building windows reflecting its silhouette. Helicopters circling with searchlights. News vans with satellite dishes. That classic monster-movie-poster composition with dramatic upward angle. City lights creating colorful bokeh in the background.`,
        figure: `1990s LEGO City catalog hero moment. The minifigure in action pose with the busy city bustling behind them. Fire trucks, police cars, or construction vehicles in the background depending on their role. Golden hour lighting with long dramatic shadows. Tilt-shift effect making surrounding buildings look like a perfect toy city. That aspirational "this could be you" catalog feeling.`,
        unknown: `1990s LEGO City catalog metropolitan scene. Dynamic city skyline at golden hour. Glass and steel skyscrapers reflecting warm orange sunset. Busy streets with tiny vehicles below. Neon lights beginning to glow. Tilt-shift photography making everything look miniature and toylike. Clean geometric architecture. Magazine-ready product photography.`
    },
    "fantasy-realm": {
        vehicle: `1990s LEGO Castle catalog quest shot. The vehicle charges along a winding dirt path through a rugged fantasy landscape. A thunderous stormy horizon with purple lightning forks ahead. Ancient castle ruins visible in the misty distance. Swirling embers and falling leaves trailing behind. Dramatic atmospheric haze making the background feel miles away. That epic quest adventure feeling.`,
        building: `1990s LEGO Castle catalog fortress shot. The majestic structure perched on a volcanic cliff edge with glowing lava rivers flowing far below. Mystical purple and blue fog swirling around its base. Dramatic storm clouds gathering above with lightning strikes. Enchanted forest visible in the distance. Fireflies and magical sparkles dancing in the mist. Painted diorama backdrop style photography.`,
        creature: `1990s LEGO Castle catalog beast encounter. The creature surrounded by swirling embers and volcanic glow matching its color palette. Rugged fantasy landscape with ancient ruins crumbling nearby. Mystical fog rolling across the ground. Thunder and lightning in the dramatic sky above. Glowing magic particles orbiting around it. That larger-than-life legendary monster scale.`,
        figure: `1990s LEGO Castle catalog hero portrait. The knight or wizard stands triumphantly on rocky terrain with a massive fantasy kingdom stretching behind them. Glowing enchanted weapon or staff. Cape billowing dramatically. Storm clouds parting to reveal shafts of golden light. Fireflies and magic sparkles in the air. That epic hero's journey moment.`,
        unknown: `1990s LEGO Castle catalog fantasy realm. Majestic medieval castle on volcanic cliff. Glowing lava rivers below. Mystical purple fog swirling throughout. Enchanted forest with ancient trees. Fireflies and magical sparkles dancing. Storm clouds with purple lightning. Painted diorama style. Rich saturated 90s adventure colors.`
    },
    "deep-sea-adventure": {
        vehicle: `1990s LEGO Aquazone catalog pursuit shot. The submarine vessel dives through the deep blue-green abyss with a colossal shadowy sea monster silhouette lurking in the murky background. God rays filtering down from the distant surface. Bubbles streaming from vents and propellers. Bioluminescent jellyfish drifting past. Caustic light patterns dancing across the hull. That vintage underwater adventure aesthetic.`,
        building: `1990s LEGO Aquazone catalog base shot. The underwater structure anchored to a vibrant coral reef formation. Observation domes glowing warmly from within. Fish schools swimming past windows. Giant kelp forests swaying nearby. Treasure chests and ancient ruins visible in the murky distance. God rays creating dramatic shafts of light from above.`,
        creature: `1990s LEGO Aquazone catalog creature feature. The sea creature glides through the deep abyss surrounded by bioluminescent particles matching its colors. Smaller fish scattering in its wake. Coral reef structures visible in the background. Caustic light patterns rippling across its form. A colossal ancient ruin or shipwreck silhouette in the murky distance. That mysterious deep-sea discovery feeling.`,
        figure: `1990s LEGO Aquazone catalog diver portrait. The aquanaut hovers dramatically in the blue-green depths with equipment lights cutting through the murk. Bubbles rising from their gear. Coral reef and colorful fish surrounding them. A massive whale or shark silhouette passing in the background. God rays filtering down creating an ethereal glow.`,
        unknown: `1990s LEGO Aquazone catalog underwater world. Deep ocean abyss with god rays filtering through turquoise water. Bioluminescent jellyfish drifting peacefully. Vibrant coral reef with neon colors. Fish silhouettes swimming through light shafts. Caustic patterns on the sandy bottom. Aquamarine gradients. Vintage aquarium diorama style. Kodak film colors.`
    }
}

/**
 * Original/default prompt used when "Let us decide" option is selected
 * This prompt allows the AI to choose the style based on the description
 * Now accepts optional theme details to combine theme with original prompt structure
 */
export function getOriginalPrompt(name: string, description: string, themeDetails: string = ""): string {
    return `Create a professional, glossy LEGO marketing poster for a set named "${name}" the final image should be the full poster and not a picture of the poster.
               
               User's Description: "${description}"
               ${themeDetails ? `\nTheme Specifications:\n${themeDetails}` : ""}

               Instructions:
               - The output must be a high-quality IMAGE of a single page poster with 3:4 aspect ratio (portrait orientation).
               - It should feature the Lego creation depicted in the uploaded image, but professionally rendered.
               - Include dynamic lighting and a suitable background (e.g. space, city, nature) based on the description${themeDetails ? " and theme specifications" : ""}.
               - If possible, include the text "${name}" stylized as a logo.
               ${themeDetails ? "" : "- Style: Commercial Product Photography, Vibrant, High Resolution."}
               - Use the user description to create a story for the image. Make it interesting and engaging.
               - The final image must be exactly 3:4 aspect ratio (width:height) as a single page poster.`
}

/**
 * Get theme-based prompt with master catalog style applied
 */
export function getThemePrompt(
    theme: Theme,
    modelType: ModelType,
    name: string,
    description: string
): string {
    const themePrompt = themePrompts[theme][modelType]
    const fullThemeDetails = `${themePrompt}\n\n${masterCatalogStyle}`
    
    return getOriginalPrompt(name, description, fullThemeDetails)
}

