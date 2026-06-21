"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CmsHomeTestimonial } from "@/lib/cms-types";

export function TestimonialSlider({ items }: { items: CmsHomeTestimonial[] }) {
  const reduce = useReducedMotion();
  const cards = items.slice(0, 4);

  if (cards.length === 0) return null;

  return (
    <div className="home-testimonials-grid">
      {cards.map((item, idx) => (
        <motion.article
          key={item.id}
          className="home-testimonial-card"
          initial={reduce ? false : { opacity: 0, y: 32, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-40px", amount: 0.15 }}
          transition={{
            duration: 0.65,
            delay: idx * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={
            reduce
              ? undefined
              : {
                  y: -8,
                  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                }
          }
        >
          <span className="home-testimonial-card__glow" aria-hidden />
          <span className="home-testimonial-card__quote" aria-hidden>
            &ldquo;
          </span>
          <p className="home-testimonial-card__text">{item.quote}</p>
          <div className="home-testimonial-card__footer">
            <p className="home-testimonial-card__name">{item.name}</p>
            <p className="home-testimonial-card__role">{item.role}</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
