/**
 * Generates graceful, service-specific card descriptions (walima-style copy).
 * Run: node scripts/generate-graceful-descriptions.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../src/lib/service-descriptions.ts");

/** Graceful descriptions keyed by exact service name. */
const DESCRIPTIONS = {
  // ── Hair cuts ──
  "Hair Trim":
    "Refresh your hairstyle with a precise trim that neatens ends, maintains your shape, and keeps every strand looking healthy and polished.",
  "Straight Cut":
    "Enjoy a sleek straight cut with clean one-length lines for a smooth, polished silhouette that frames your face beautifully.",
  "Layer Cut":
    "Add movement and volume with expertly shaped layers — soft or defined — tailored to your hair texture and personal style.",
  "Step Cut":
    "Get a dynamic step cut with graduated layers that add texture, bounce, and a lively shape to your everyday look.",
  "Feather Cut":
    "Achieve light, feathered ends for a soft, airy finish that moves naturally and feels effortlessly elegant.",
  "Bob Cut":
    "Rock a classic or modern bob sculpted to your jawline — chic, versatile, and perfectly suited to your features.",
  "Pixie Cut":
    "Embrace a bold pixie cut with sculpted detailing — short, stylish, and crafted to highlight your best angles.",
  "Bangs (Fringe)":
    "Frame your face with a bespoke fringe — curtain, blunt, or side-swept — designed to complement your hairstyle.",
  "U Cut / V Cut":
    "Shape your hair with a flattering U or V cut that adds flow at the back while keeping length where you want it.",

  // ── Hair colour ──
  "Root Touch-Up":
    "Blend away regrowth seamlessly with a root touch-up that matches your tone perfectly for a fresh, salon-finished look.",
  "Full Hair Color":
    "Transform your hair with rich, even colour from roots to ends — vibrant, glossy, and beautifully balanced.",
  "Highlights":
    "Illuminate your hair with dimensional highlights placed to catch the light and add natural-looking depth and glow.",
  "Lowlights":
    "Deepen your colour with subtle lowlights that add contrast, richness, and a fuller, more luxurious appearance.",
  "Balayage":
    "Get a hand-painted balayage with sun-kissed gradients that grow out gracefully and need minimal upkeep.",
  "Ombre":
    "Enjoy a stunning ombre melt from deep roots to lighter ends — bold or soft, styled exactly how you envision.",
  "Global Color":
    "Achieve one flawless shade from scalp to tips with a global colour application for a unified, salon-perfect finish.",
  "Fashion Colors (Red, Blue, Purple etc.)":
    "Express yourself with creative fashion colours — vivid reds, blues, purples, and pastels applied with healthy prep and care.",

  // ── Hair treatments ──
  "Hair Spa":
    "Indulge in a nourishing hair spa with deep conditioning, relaxing massage, and a shine ritual that revives tired strands.",
  "Keratin Treatment":
    "Smooth away frizz with a keratin treatment that leaves hair sleek, manageable, and easier to style every morning.",
  "Protein Treatment":
    "Rebuild strength and elasticity with a protein treatment designed to repair stressed, damaged, or over-processed hair.",
  "Smoothening Treatment":
    "Enjoy silky, manageable hair with an expert smoothening treatment for a sleek finish that lasts for weeks.",
  "Rebonding":
    "Get beautifully straight, structured hair with a professional rebonding service tailored to resistant or curly textures.",
  "Botox Hair Treatment":
    "Restore silky softness with a hair botox treatment that fills, plumps, and rejuvenates dull or lifeless strands.",
  "Scalp Treatment":
    "Nourish your scalp with a targeted treatment that balances, soothes, and creates the perfect foundation for healthy growth.",
  "Dandruff Treatment":
    "Calm a flaky scalp with a clarifying dandruff treatment that brings comfort, freshness, and lasting relief.",
  "Hair Fall Treatment":
    "Strengthen thinning hair with a fortifying ritual that supports density, reduces breakage, and promotes healthier growth.",

  // ── Hair styling ──
  "Blow Dry":
    "Finish your look with a professional blow dry — voluminous, smooth, or wavy — styled to perfection for any occasion.",
  "Straightening (Temporary)":
    "Get sleek, straight hair with heat-protected temporary straightening for a polished look that lasts through your event.",
  "Curling":
    "Create beautiful waves or curls sized to your occasion — from soft romantic ringlets to glamorous Hollywood waves.",
  "Ironing":
    "Achieve pin-straight, glossy hair with expert ironing and heat protection for a flawless, long-lasting finish.",
  "Party Hairstyle":
    "Turn heads with a statement party hairstyle crafted for evenings, celebrations, and every special moment.",
  "Bridal Hairstyle":
    "Look breathtaking on your big day with a secure, photogenic bridal hairstyle designed to stay perfect all night.",
  "Braids / Plaits":
    "Style elegant braids and plaits — classic French, fishtail, or trend-forward — tailored beautifully to your hair.",
  "Bun Styles":
    "Wear a sophisticated bun — low, high, or textured — with refined detailing that complements your outfit and occasion.",

  // ── Bridal hair ──
  "Bridal Hairstyling":
    "Perfect your wedding-day hair with trial and day-of bridal styling aligned with your veil, jewellery, and makeup look.",
  "Hair Accessories Setting":
    "Secure pins, vines, and jewels in place with expert accessory setting that stays flawless from ceremony to reception.",
  "Dupatta Setting":
    "Drape your dupatta with comfort and elegance — securely pinned and styled to complement your bridal hairstyle.",
  "Hair Extensions Setup":
    "Add volume or length for your big day with seamlessly blended extensions styled for a natural bridal finish.",

  // ── Hair care ──
  "Hair Wash":
    "Enjoy a gentle salon hair wash with premium products that cleanse, refresh, and leave your hair feeling light and clean.",
  "Conditioning":
    "Restore instant softness and slip with a conditioning treatment that detangles and smooths every strand.",
  "Deep Conditioning":
    "Treat dry or damaged hair to an intensive deep conditioning session for lasting moisture and renewed vitality.",
  "Oil Massage (Head Massage)":
    "Relax with a soothing head oil massage that eases tension, boosts circulation, and nourishes your scalp deeply.",

  // ── Advanced hair ──
  "Hair Extensions":
    "Add length or volume with professionally matched extensions — tape, weave, or keratin — blended to your natural colour.",
  "Hair Volume Treatment":
    "Boost body and lift without heavy product with a volume treatment that gives fine hair a fuller, bouncier feel.",
  "Scalp Detox":
    "Refresh your roots with a deep scalp detox that removes buildup, unclogs follicles, and revives tired hair.",
  "Laser Hair Therapy (premium salons)":
    "Support scalp health with light-based laser therapy — consult with our experts to see if this treatment suits you.",
  "Laser Hair Removal":
    "Achieve smoother skin with consultation-led laser hair removal sessions tailored to your skin type and goals.",

  // ── Makeup bridal ──
  "Bridal Makeup Barat":
    "Create a bold and glamorous barat look with stunning makeup, rich colour, and camera-ready finishing for your grand entrance.",
  "Bridal Makeup Walima":
    "Create a graceful and radiant walima look with flawless makeup, soft glam finishing, and long-lasting elegance for your special day.",
  "Nikkah & Engagement Makeup":
    "Achieve a timeless bride look with soft, refined makeup perfect for your nikkah ceremony or intimate engagement celebration.",
  "Bridal Trial":
    "Perfect your bridal makeup look before the big day with a personalised trial and expert colour and style consultation.",

  // ── Makeup events ──
  "Party Makeup":
    "Get party-ready with glamorous makeup designed for weddings, gatherings, and celebrations that lasts beautifully all evening.",
  "Mehndi Makeup":
    "Complement your henna and traditional attire with vibrant, festive makeup crafted for mehndi night radiance.",
  "Engagement Makeup":
    "Shine at your engagement with elegant, photo-perfect makeup that highlights your natural beauty on this special day.",
  "Festive Makeup":
    "Celebrate Eid, Diwali, and festive occasions with colour-pop makeup that feels joyful, fresh, and beautifully you.",

  // ── Makeup everyday ──
  "Everyday Makeup":
    "Enhance your natural features with light, effortless everyday makeup that looks fresh, polished, and beautifully understated.",
  "Office Makeup":
    "Look professional and polished with refined office makeup perfect for work, meetings, and everyday confidence.",
  "Photoshoot Makeup":
    "Get camera-ready with makeup tailored to your lighting, angles, and photography needs for flawless on-screen results.",
  "Editorial Makeup":
    "Make a creative statement with artistic editorial makeup designed for magazine shoots and bold visual projects.",

  // ── Makeup correction ──
  "Makeup Touch-Up":
    "Keep your makeup fresh with a quick touch-up that restores colour, coverage, and glow throughout your day or event.",
  "Makeup Correction":
    "Refine and fix any makeup imperfections with expert correction for a seamless, flawless finished look.",
  "Makeup Removal & Refresh":
    "Feel comfortable again with gentle makeup removal followed by a fresh, clean application tailored to your needs.",

  // ── Makeup specialized ──
  "HD Makeup":
    "Look flawless on camera and in person with high-definition makeup formulated for smooth, poreless, picture-perfect skin.",
  "Airbrush Makeup":
    "Enjoy a weightless airbrushed finish with long-lasting, camera-perfect coverage that feels light on your skin.",
  "Bridal Party Makeup":
    "Coordinate beautiful makeup for the bride, bridesmaids, and family with harmonious looks for your entire wedding party.",
  "Consultation / Trial":
    "Discover your perfect makeup style with an expert consultation to find colours, techniques, and looks that suit you best.",

  // ── Basic facials ──
  "Clean Up Facial":
    "Refresh your skin with a quick clean-up facial featuring gentle cleanse, steam, and extraction for clearer, smoother pores.",
  "Basic Facial":
    "Restore everyday glow with a classic facial of cleanse, exfoliation, mask, and moisture for healthy, balanced skin.",
  "Express Facial":
    "Get a fast skin refresh when time is short — bright, fresh, and radiant in just half an hour.",
  "Mini Facial":
    "Target what your skin needs most with a focused mini facial centred on cleanse and an instant hydration boost.",

  // ── Brightening facials ──
  "Whitening Facial":
    "Reveal a brighter, more even complexion with a gentle whitening facial designed for visible radiance and clarity.",
  "Brightening Facial":
    "Revive dull, tired skin with a brightening facial that restores luminosity and a healthy, youthful glow.",
  "Glow Facial":
    "Achieve a lit-from-within glow with a facial perfect before weddings, parties, and special occasions.",
  "Gold Facial":
    "Indulge in a luxury gold-infused facial that firms, brightens, and leaves skin feeling sumptuously smooth.",
  "Pearl Facial":
    "Enjoy pearl-enriched care for softer texture, refined pores, and a delicate, natural radiance.",
  "Diamond Facial":
    "Experience a premium diamond facial for polished, high-shine skin with a red-carpet-ready finish.",

  // ── Advanced facials ──
  "Hydra Facial":
    "Deeply hydrate and glow with a hydra facial that cleanses, extracts, and infuses skin with nourishing serums.",
  "Oxygen Facial":
    "Plump and refresh tired skin with an oxygen-rich infusion for a dewy, revitalised complexion.",
  "Anti-Aging Facial":
    "Soften fine lines and firm skin with an anti-aging facial combining targeted actives and a lifting massage.",
  "Collagen Facial":
    "Boost elasticity and bounce with a collagen-focused facial that supports firmer, more youthful-looking skin.",
  "Vitamin C Facial":
    "Brighten sun-stressed skin with an antioxidant-rich vitamin C facial for clarity and environmental protection.",
  "Skin Polish Facial":
    "Smooth texture and even tone with a skin polish facial for silky, refined skin that reflects light beautifully.",

  // ── Problem skin facials ──
  "Acne Treatment Facial":
    "Calm breakout-prone skin with a clarifying acne facial designed to reduce congestion and restore balance gently.",
  "Anti-Pimple Facial":
    "Target excess oil and congestion with an anti-pimple facial that clears pores without stripping your skin.",
  "Dark Spots Removal Facial":
    "Gradually fade uneven patches with a dark spot facial — a series is recommended for the best visible results.",
  "Pigmentation Facial":
    "Address uneven tone and sun marks with a focused pigmentation facial for clearer, more uniform skin.",
  "Sensitive Skin Facial":
    "Soothe reactive skin with a gentle, fragrance-aware facial ritual designed for comfort and calm.",

  // ── Herbal facials ──
  "Herbal Facial":
    "Nourish your skin with plant-based herbal extracts for a calm, balanced, and naturally refreshed complexion.",
  "Organic Facial":
    "Treat your skin to certified-organic oils and masks with minimal additives for pure, gentle care.",
  "Fruit Facial":
    "Exfoliate naturally with enzyme-rich fruit actives for a fresh, glowing complexion and silky softness.",
  "Aloe Vera Facial":
    "Cool and hydrate irritated skin with a soothing aloe vera facial that calms redness and restores moisture.",
  "Chocolate Facial":
    "Indulge in an antioxidant-rich chocolate facial — a luxurious treat that softens skin and lifts your mood.",

  // ── Bridal facials ──
  "Bridal Glow Facial":
    "Prepare radiant wedding-day skin with a multi-step bridal glow facial designed to perfect your complexion before events.",
  "Pre-Bridal Facial Packages":
    "Follow a customised pre-bridal facial series planned around your wedding timeline for lasting, event-ready skin.",
  "Luxury Facial":
    "Experience top-tier masks and massage in a luxury facial for red-carpet skin that feels as good as it looks.",
  "Instant Glow Facial":
    "Get same-day luminosity with an instant glow facial perfect before photos, parties, or last-minute occasions.",

  // ── Premium facials ──
  "Dermaplaning Facial":
    "Achieve ultra-smooth skin with dermaplaning exfoliation — ideal preparation for flawless makeup application.",
  "Chemical Peel Facial":
    "Renew your complexion with a controlled chemical peel — our experts consult on the right strength for your skin.",
  "Microdermabrasion Facial":
    "Refine texture and clarity with mechanical microdermabrasion for smoother, more even-toned skin.",
  "LED Light Therapy Facial":
    "Support calm or clarity with LED light therapy — available as a focused add-on or a complete facial ritual.",

  // ── Body massage ──
  "Full Body Massage":
    "Release tension from head to toe with a flowing full body massage that eases muscles and improves circulation.",
  "Relaxation Massage":
    "Drift into deep calm with slow, gentle relaxation massage strokes designed for better sleep and total unwind.",
  "Swedish Massage":
    "Enjoy the classic Swedish massage with long glides and kneading for overall ease, comfort, and wellbeing.",
  "Deep Tissue Massage":
    "Relieve chronic stiffness and tight muscles with firm deep tissue pressure targeted where you need it most.",
  "Aromatherapy Massage":
    "Restore balance with an aromatherapy massage using essential oils blended to relax, uplift, or energise your mood.",
  "Hot Stone Massage":
    "Melt away tension as warm stones glide along your back, shoulders, and legs for deep, soothing relief.",

  // ── Body treatments ──
  "Body Polishing":
    "Reveal silky, even skin with a body polish that exfoliates dead cells and locks in luxurious moisture.",
  "Body Scrub":
    "Smooth rough areas and boost glow with a sugar or salt body scrub that leaves skin soft and refreshed.",
  "Body Wrap (Chocolate / Herbal / Mud)":
    "Nourish, detox, or firm your skin with a choice of chocolate, herbal, or mud body wrap tailored on the day.",
  "Skin Detox Treatment":
    "Refresh congested or dull body skin with a clarifying detox treatment for a cleaner, brighter appearance.",
  "Whitening Body Treatment":
    "Brighten elbows, knees, and overall body tone with a gentle whitening treatment for an even, radiant look.",

  // ── Premium spa ──
  "Moroccan Bath (Hammam)":
    "Experience deep cleansing and full-body relaxation in a traditional Moroccan hammam ritual inspired by steam and scrub traditions.",
  "Turkish Bath":
    "Enjoy the Turkish bath tradition of foam, scrub, and rinse for baby-soft skin and complete rejuvenation.",
  "Gold Body Spa":
    "Indulge in a luxury gold body spa with infused oils and masks for luminous, touchably smooth skin.",
  "Luxury Spa Therapy":
    "Unwind with an extended luxury spa combining massage, scrub, and deep hydration in one indulgent session.",
  "Milk Body Treatment":
    "Soften sensitive or dry skin with a calming milk body treatment for gentle nourishment and silky comfort.",

  // ── Relaxation therapy ──
  "Head, Neck & Shoulder Massage":
    "Ease desk strain and tension headaches with a focused head, neck, and shoulder massage for instant relief.",
  "Foot Reflexology":
    "Restore balance and ease through pressure-point foot reflexology that relaxes the whole body from the ground up.",
  "Back Massage":
    "Target upper, mid, or lower back tension with a focused back massage tailored to where you hold stress.",
  "Stress Relief Therapy":
    "Let go of daily stress with combined breath work, scalp, and shoulder release for total mind-body calm.",

  // ── Skin care body ──
  "Body Bleach":
    "Even out skin tone gently with a body bleach treatment for brighter arms, legs, or full-body radiance.",
  "Body Wax (Full / Half)":
    "Get smooth, hair-free skin with full or half body waxing using hygienic strip or hot wax — choose your areas at booking.",
  "Body Waxing":
    "Enjoy gentle full or partial body waxing with hygienic prep and soothing aftercare for silky, smooth skin.",
  "Tan Removal Treatment":
    "Fade uneven tan and sun-darkened patches with a targeted tan removal treatment for clearer, even-toned skin.",
  "Back Facial":
    "Treat hard-to-reach back skin with a dedicated back facial featuring cleanse, extraction, and targeted care.",

  // ── Bridal spa ──
  "Pre-Bridal Full Body Spa":
    "Prepare your body for wedding week with a full pre-bridal spa including polish, wrap, and massage on a personalised timeline.",
  "Bridal Glow Treatment":
    "Glow from head to toe with a radiance-focused bridal body ritual designed before your wedding events.",
  "Full Body Polish + Massage Package":
    "Pamper yourself with a combined body scrub, nourishing mask, and relaxing massage in one luxurious session.",

  // ── Manicure ──
  "Basic Manicure":
    "Shape, tidy, and polish your nails with a neat basic manicure for clean, cared-for hands.",
  "Classic Manicure":
    "Treat your hands to a classic manicure with soak, cuticle care, massage, and polish of your choice.",
  "Spa Manicure":
    "Indulge in a spa manicure with deep cleaning and a relaxing hand massage for soft, pampered hands.",
  "French Manicure":
    "Wear the timeless elegance of a French manicure with a soft pink base and crisp, clean white tips.",
  "Gel Manicure":
    "Enjoy chip-resistant gel colour with a glossy, long-wearing finish that stays flawless for weeks.",
  "Paraffin Manicure":
    "Deeply moisturise dry hands with a warm paraffin dip that leaves skin supple, smooth, and nourished.",
  "Luxury Manicure":
    "Experience a premium luxury manicure with masks, extended massage, and a flawless, salon-perfect finish.",

  // ── Pedicure ──
  "Basic Pedicure":
    "Refresh tired feet with a basic pedicure featuring soak, nail shaping, light heel care, and polish.",
  "Classic Pedicure":
    "Pamper your feet with a full classic pedicure — soak, scrub, cuticle work, massage, and polish.",
  "Spa Pedicure":
    "Revive weary feet with a spa pedicure including exfoliation, mask, and massage for total foot comfort.",
  "Deluxe Pedicure":
    "Give your soles extra love with a deluxe pedicure featuring callus care and an extended relaxing massage.",
  "French Pedicure":
    "Complete your look with an elegant French pedicure — clean, classic, and perfectly polished toes.",
  "Paraffin Pedicure":
    "Heal cracked, dry feet with a warm paraffin pedicure that deeply moisturises and restores softness.",
  "Medical Pedicure (for cracked heels etc.)":
    "Care for problem feet with a gentle medical-style pedicure for cracked heels — consult with us first.",

  // ── Nail art ──
  "Simple Nail Art":
    "Add charming detail with simple nail art — dots, lines, or minimal accents on natural nails or extensions.",
  "Bridal Nail Art":
    "Coordinate stunning nail art for your ring shots and wedding events with designs that match your bridal look.",
  "3D Nail Art":
    "Make a statement with raised 3D nail art featuring sculpted elements and eye-catching dimensional details.",
  "Stone / Rhinestone Nail Art":
    "Sparkle with crystals and rhinestones placed for dazzling dimension and bridal-worthy glamour.",
  "Glitter Nails":
    "Shine bright with full glitter, ombre glitter, or accent nails for parties, weddings, and festive occasions.",
  "Ombre Nails":
    "Wear a smooth colour melt across your nails with beautifully blended ombre nail art.",
  "Custom Design Nails":
    "Bring your inspiration to life with custom nail designs — we quote based on complexity after your consultation.",

  // ── Nail extensions ──
  "Acrylic Extensions":
    "Get strong, beautiful length with professionally applied acrylic extensions shaped to your preferred style.",
  "Gel Extensions":
    "Add natural-looking length with flexible gel builder extensions that feel light and look effortlessly elegant.",
  "Polygel Nails":
    "Enjoy the strength of acrylic with a lighter feel through polygel nails — durable, flexible, and beautifully shaped.",
  "Nail Tips Extension":
    "Achieve instant length with nail tips and overlay for a quick, polished extension look.",
  "French Extensions":
    "Wear classic or modern French tips on beautiful extensions for timeless, sophisticated nails.",

  // ── Nail polish ──
  "Regular Nail Paint":
    "Choose from a wide range of shades with a regular nail paint application for an instant colour refresh.",
  "Gel Polish":
    "Get two weeks of glossy shine with cured gel polish on hands or feet — chip-resistant and beautifully vibrant.",
  "Shellac Polish":
    "Enjoy a thin, durable shellac finish with a glossy wear that looks salon-fresh for days on end.",
  "Matte Finish Polish":
    "Add a velvet matte top coat over gel or regular polish for a modern, sophisticated nail finish.",
  "Chrome Nails":
    "Turn heads with mirror or pearl chrome nails for a futuristic, high-impact manicure.",

  // ── Nail care ──
  "Nail Repair":
    "Fix splits or breaks on natural or enhanced nails with careful repair for a seamless, strong finish.",
  "Cuticle Treatment":
    "Soften, push, and nourish cuticles for neat, healthy nail growth and a polished appearance.",
  "Nail Strengthening Treatment":
    "Fortify weak, peeling nails with a strengthening treatment that supports healthier, more resilient growth.",
  "Nail Removal (Gel / Acrylic)":
    "Remove gel or acrylic safely with a gentle soak-off or file-down — no rushing, no damage to natural nails.",
  "Hand & Foot Massage":
    "Relax with a soothing hand and foot massage — perfect as an add-on or a stand-alone pampering treat.",

  // ── Bridal nails ──
  "Bridal Manicure + Pedicure":
    "Prepare matching hands and feet for your wedding week with a coordinated bridal manicure and pedicure package.",
  "Full Nail Extension Package":
    "Get everything in one visit — extensions, shaping, colour, and art bundled for your complete bridal nail look.",

  // ── Hand mehndi ──
  "Simple Mehndi Design":
    "Adorn your hands with a light, elegant mehndi design — perfect for casual days or first-time henna clients.",
  "Arabic Mehndi":
    "Wear bold Arabic mehndi with flowing vines, negative space, and signature patterns that look striking and modern.",
  "Indian Mehndi":
    "Celebrate tradition with dense Indian mehndi featuring peacocks, paisleys, and rich full-palm coverage.",
  "Pakistani Mehndi":
    "Enjoy intricate Pakistani mehndi with elegant symmetry and detailed artistry on front and back of hands.",
  "Floral Mehndi":
    "Bloom with beautiful floral mehndi featuring roses, vines, and soft botanical patterns full of feminine charm.",
  "Mandala Mehndi":
    "Centre your look with mandala mehndi — circular focal art with balanced geometric layers of stunning detail.",
  "Finger Mehndi":
    "Make a minimal yet striking statement with finger mehndi and jewellery-inspired bracelet lines.",

  // ── Feet mehndi ──
  "Simple Feet Mehndi":
    "Decorate toes and feet tops with light, graceful mehndi patterning for a subtle festive touch.",
  "Bridal Feet Mehndi":
    "Complete your bridal set with rich feet mehndi on soles and sides designed to match your hand designs.",
  "Anklet Style Mehndi":
    "Wear jewellery-inspired anklet mehndi with delicate bands and charms circling your ankle beautifully.",
  "Full Feet Mehndi":
    "Cover toes to ankle with detailed full feet mehndi for a lavish, traditional bridal finish.",

  // ── Bridal mehndi ──
  "Full Bridal Mehndi (Hands + Feet)":
    "Celebrate your wedding with full hands and feet bridal mehndi — intricate, detailed designs tailored to your vision.",
  "Heavy Bridal Mehndi":
    "Go all out with maximum-density heavy bridal mehndi — elbows and legs optional, quoted after design preview.",
  "Dulhan Special Mehndi":
    "Make your mehndi unforgettable with our dulhan special package featuring hidden names, dates, or personal motifs.",
  "Customized Bridal Design":
    "Tell your story through mehndi — your symbols, references, and ideas woven into a one-of-a-kind bridal design.",

  // ── Occasion mehndi ──
  "Eid Mehndi":
    "Celebrate Eid with festive mehndi sets sized perfectly for family gatherings and beautiful holiday photos.",
  "Party Mehndi":
    "Stand out at birthdays and celebrations with trend-forward party mehndi patterns full of personality.",
  "Wedding Guest Mehndi":
    "Look event-ready with elegant wedding guest mehndi — beautiful detail applied efficiently for your schedule.",
  "Engagement Mehndi":
    "Coordinate your engagement look with hands-focused mehndi designed to shine in ring shots and photos.",

  // ── Modern mehndi ──
  "Glitter Mehndi":
    "Add sparkle to your henna with safe cosmetic glitter accents for a festive, eye-catching mehndi finish.",
  "White Mehndi":
    "Try a striking white mehndi look with body-safe paste for beautiful contrast and modern bridal style.",
  "Colored Mehndi":
    "Express your creativity with tinted mehndi pastes and gems for festival flair or editorial-inspired looks.",
  "Tattoo Style Mehndi":
    "Rock graphic, bold mehndi lines inspired by modern tattoo aesthetics for a contemporary edge.",
  "Minimal Mehndi":
    "Keep it chic with minimal mehndi — single-line and negative-space designs for everyday elegance.",

  // ── Premium mehndi ──
  "Portrait Mehndi (Face Design)":
    "Commission a symbolic portrait or motif in mehndi — placement and size discussed during your consultation.",
  "Theme Based Mehndi":
    "Bring your passions to life with theme-based mehndi featuring travel, cinema, or personal story elements.",
  "Designer Mehndi":
    "Work with a senior artist on a bespoke designer mehndi with optional preview sketch for your approval.",
  "Instant Mehndi Service (Quick Apply)":
    "Get beautiful mehndi on a tight timeline with quick-apply patterns using pre-mixed cones and efficient techniques.",
};

const header = `import type { ServiceCategorySlug } from "@/lib/cms-types";

/** Graceful, service-specific descriptions for every service card. */
export const UNIQUE_SERVICE_DESCRIPTIONS: Readonly<Record<string, string>> = `;

const footer = `;

export function getUniqueServiceDescription(
  name: string,
  _categorySlug: ServiceCategorySlug,
  _sectionTitle: string,
  fallback: string
): string {
  return UNIQUE_SERVICE_DESCRIPTIONS[name] ?? fallback;
}
`;

const body = header + JSON.stringify(DESCRIPTIONS, null, 2) + footer;
fs.writeFileSync(outPath, body, "utf8");
console.log(`Wrote ${Object.keys(DESCRIPTIONS).length} descriptions to ${outPath}`);
