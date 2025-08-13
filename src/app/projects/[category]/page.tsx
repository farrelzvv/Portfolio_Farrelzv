import { createClient } from "@/prismicio";
import * as prismic from "@prismicio/client";
import { notFound } from "next/navigation";
import Heading from "@/components/Heading";
import Bounded from "@/components/Bounded";
import ContentList from "@/slices/ContentIndex/ContentList";

type Params = { category: string };

const projectCategoryLabels: { [key: string]: string } = {
  "digital-marketing": "Digital Marketing",
  "software-development": "Software Development",
  "graphic-designer": "Graphic Designer",
  "project-program-management": "Project & Program Management",
};

export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  const categoryLabel = projectCategoryLabels[params.category];

  if (!categoryLabel) {
    notFound();
  }

  // Mengambil data proyek berdasarkan kategori
  const projects = await client.getAllByType("project", {
    filters: [prismic.filter.at("my.project.category", categoryLabel)],
    orderings: [{ field: "my.project.date", direction: "desc" }],
  });

  // Mengambil data settings untuk fallback image
  const settings = await client.getSingle("settings");

  return (
    <Bounded>
      <Heading size="xl" className="mb-8">
        {categoryLabel}
      </Heading>
      <div className="prose prose-xl prose-invert mb-10">
        Menampilkan proyek dalam kategori {categoryLabel}.
      </div>
      <ContentList
        items={projects}
        contentType="Projects"
        viewMoreText={"Lihat Proyek"}
        fallbackItemImage={settings.data.fallback_item_image} // <-- Penambahan prop yang wajib ada
      />
    </Bounded>
  );
}

export async function generateStaticParams() {
  return Object.keys(projectCategoryLabels).map((category) => {
    return { category };
  });
}