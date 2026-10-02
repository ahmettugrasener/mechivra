interface SimplePublicPageProps {
  readonly title: string;
  readonly description: string;
}

export function SimplePublicPage({
  title,
  description,
}: SimplePublicPageProps) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">
        {title}
      </h1>

      <p className="mt-4 max-w-2xl leading-7">
        {description}
      </p>
    </div>
  );
}