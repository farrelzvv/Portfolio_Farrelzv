"use client";

import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { useState, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { MdAdd, MdRemove } from "react-icons/md";

/**
 * Props for `Experience`.
 */
export type ExperienceProps = SliceComponentProps<Content.ExperienceSlice>;

/**
 * Component for "Experience" Slices.
 */
const Experience = ({ slice }: ExperienceProps): JSX.Element => {
  const component = useRef(null);
  // State untuk melacak item mana yang sedang terbuka
  const [currentItem, setCurrentItem] = useState<number | null>(null);

  const handleItemClick = (index: number) => {
    setCurrentItem(currentItem === index ? null : index);
  };

  // Refs untuk setiap item, untuk dianimasikan oleh GSAP
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      contentRefs.current.forEach((el, index) => {
        if (el) {
          gsap.to(el, {
            height: currentItem === index ? "auto" : 0,
            opacity: currentItem === index ? 1 : 0,
            duration: 0.4,
            ease: "power3.inOut",
          });
        }
      });
    }, component);
    return () => ctx.revert();
  }, [currentItem]);

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
    >
      <Heading as="h2" size="lg">
        {slice.primary.heading}
      </Heading>
      <div className="mt-8 flex flex-col gap-4 md:mt-16">
        {slice.items.map((item, index) => (
          <div key={index} className="border-b border-slate-700 pb-4">
            <div
              className="flex cursor-pointer items-center justify-between"
              onClick={() => handleItemClick(index)}
            >
              <div className="flex flex-col">
                <Heading as="h3" size="sm">
                  {item.title}
                </Heading>
                <div className="mt-1 flex w-fit items-center gap-1 text-2xl font-semibold tracking-tight text-slate-400">
                  <span>{item.time_period}</span>{" "}
                  <span className="text-3xl font-extralight">/</span>{" "}
                  <span>{item.institution}</span>
                </div>
              </div>
              <span className="text-3xl text-slate-400">
                {currentItem === index ? <MdRemove /> : <MdAdd />}
              </span>
            </div>

            <div
              ref={(el) => {
                contentRefs.current[index] = el;
              }}
              className="h-0 overflow-hidden opacity-0"
              style={{ height: 0 }} // Set initial height to 0
            >
              <div className="prose prose-lg prose-invert mt-4">
                <PrismicRichText field={item.description} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Bounded>
  );
};

export default Experience;
