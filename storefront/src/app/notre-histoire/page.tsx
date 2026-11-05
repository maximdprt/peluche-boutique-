import type { Metadata } from "next"
import Link from "next/link"
import { Photo } from "@/components/Photo"
import { ContentPage } from "@/components/ContentPage"
import { story } from "@/lib/content"

export const metadata: Metadata = { title: "Notre histoire", description: "Comment une canette oubliée sur un bureau est devenue une boutique de peluches survoltées." }

export default function StoryPage() {
  return (
    <ContentPage title="Notre histoire" intro="Histoire de démonstration, à remplacer par la tienne." width={false}>
      <div>
        {story.map((part) => (
          <section key={part.title} className="story">
            <div>
              <h2 className="title" style={{ fontSize: "clamp(26px, 3.4vw, 42px)" }}>{part.title}</h2>
              <p className="lead">{part.text}</p>
            </div>
            <span className="story-art" style={{ "--plush": "#ff5a1f" } as React.CSSProperties}><Photo name={part.photo} /></span>
          </section>
        ))}
      </div>
      <Link className="btn btn-accent" href="/boutique">Découvrir la boutique</Link>
    </ContentPage>
  )
}
